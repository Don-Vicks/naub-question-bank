# Question Bank Extraction Pipeline

Converts scanned PNG/JPEG/PDF question papers into structured, LaTeX-aware
database records, using Gemini's Batch API (cheap, async) + BullMQ for
orchestration + a confidence-flag review queue so humans only touch the
~5-15% of questions the model wasn't sure about.

## Flow

```
Upload (PDF/PNG/JPEG)
      │
      ▼
[IngestionController] → saves SourceDocument row, enqueues "prepare-pages" job
      │
      ▼
[PdfToImageService]   → splits PDF into per-page PNGs (skipped for single images)
      │
      ▼
[ExtractionProcessor] → batches page images, submits to Gemini Batch API
      │                  (via GeminiExtractionService)
      ▼
Gemini returns structured JSON per page:
  { questions: [{ number, text_latex, has_diagram, diagram_bbox, confidence }] }
      │
      ▼
[DiagramCropService]  → crops diagram bounding boxes with sharp (no AI cost)
      │
      ▼
[StorageService]      → idempotent upsert into Postgres (Question entity)
      │
      ▼
confidence < threshold ?
      │                     │
     yes                    no
      │                     │
      ▼                     ▼
review_status='flagged'  review_status='approved'
      │
      ▼
[ReviewController]    → human reviewer UI hits this: approve/edit flagged questions
```

## Why this shape (recap of the cost reasoning)

- Gemini 2.0/2.5 Flash: ~$0.10 / 1M input tokens. A page image is roughly
  250–1,100 tokens. 1,000 pages ≈ 1.5M tokens ≈ **$0.15–$0.30** for the whole
  extraction pass. Batch API cuts that further (~50%) and removes the need to
  handle rate limits yourself.
- Free tier (currently ~1,500 requests/day) can likely clear your entire 1k
  backlog in a single day for $0 if you don't need batch turnaround speed.
- You never need a human to touch all 1,000 questions — only the ones the
  model flags as uncertain.

## Setup

```bash
npm install @google/generative-ai bullmq @nestjs/bullmq sharp pdf-poppler uuid
```

Environment variables (`.env`):

```
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.0-flash
REDIS_HOST=localhost
REDIS_PORT=6379
STORAGE_BUCKET_PATH=./uploads/diagrams   # swap for S3/R2 client in production
CONFIDENCE_THRESHOLD=0.75
```

Register `QuestionBankModule` in your `AppModule`.

## Why we don't trust filenames

Uploaded files often arrive as `IMG_2043.jpg` or `Scan_001.pdf` — useless for
organizing a question bank. Since every document already goes through a
vision LLM, we spend one extra cheap call per document (not per page) against
page 1 to pull `title`, `subject`, `exam_board`, and `year` straight from the
actual content (`DocumentMetadataService`). This is what populates search-
able fields on `SourceDocument`, not the original filename or folder
structure. The original filename is still kept (`originalFilename` on
`SourceDocument`) purely for audit/debugging, never for classification.

## Files

- `entities/source-document.entity.ts` — one row per uploaded file
- `entities/question.entity.ts` — one row per extracted question, with
  `review_status`, `confidence`, `text_latex`, `diagram_asset_url`
- `services/pdf-to-image.service.ts` — PDF → page PNGs
- `services/gemini-extraction.service.ts` — builds the batch request, submits,
  polls, parses JSON per page
- `services/diagram-crop.service.ts` — crops diagram regions with `sharp`
- `services/storage.service.ts` — idempotent DB upsert + asset upload
- `processors/extraction.processor.ts` — BullMQ worker tying the above together
- `controllers/ingestion.controller.ts` — upload endpoint
- `controllers/review.controller.ts` — list flagged questions, approve/edit
- `prompts/extraction-prompt.ts` — the exact prompt + JSON schema sent to Gemini

## Idempotency

Every question is keyed by `(sourceDocumentId, pageNumber, questionNumber)`
with a unique constraint, so re-running a failed batch chunk never creates
duplicates — it upserts instead.

## Next steps once this is running

1. Point the confidence threshold review queue at a small team of students
   for a QA pass (afternoon of work for ~100-150 flagged questions out of 1k).
2. Once questions are structured + approved, generating AI answers is a
   second, much simpler pass: same Gemini call, prompt = question text_latex
   + subject context, output = worked solution in LaTeX. Store in a separate
   `AiAnswer` entity/table so answers are versioned independently from the
   source question and can go through their own light review pass.
