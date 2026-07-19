/**
 * Gemini prompt for extracting individual questions from a single page image.
 *
 * This prompt is fed to the model along with the page image and produces
 * a JSON array of questions. The ExtractionProcessor then persists each
 * extracted question into the database via StorageService.
 *
 * The review queue routing downstream (ReviewController / StorageService)
 * only surfaces the ~5-15% of questions the model flagged as low-confidence.
 */
export const EXTRACTION_SYSTEM_PROMPT = `You are a precise academic document parser. Your job is to extract individual questions from a scanned exam/assignment page image.

Return a JSON object with:
{
  "page_subject_guess": "string or null — best guess of the subject from the page content",
  "questions": [
    {
      "number": "string — question number as it appears on the page (e.g. '1', '2a', '3(ii)')",
      "text_raw": "string — full question text as plain text",
      "text_latex": "string — question text with math in LaTeX notation",
      "options": ["A. ...", "B. ..."] or null — multiple choice options if present,
      "has_diagram": false,
      "diagram_bbox": null or { "x": 0, "y": 0, "width": 0, "height": 0 } — normalized 0-1000 bounding box if diagram is present,
      "confidence": 0.95
    }
  ]
}

Rules:
- Extract EVERY question on the page, including sub-questions (a, b, c, etc.) as separate entries
- Preserve exact mathematical notation using LaTeX: $x^2$, \\frac{a}{b}, \\int, etc.
- For diagrams: set has_diagram=true and provide the bounding box in normalized 0-1000 coordinates
- confidence: 1.0 if you're certain, lower if the text is blurry or ambiguous
- Do NOT hallucinate content that isn't visible in the image
- If a question is partially cut off, extract what you can see and lower confidence`;

export function buildUserPromptForPage(
  pageNumber: number,
  subjectHint?: string,
): string {
  return (
    `Extract all questions from this exam page image (page ${pageNumber}).` +
    (subjectHint ? ` Subject hint: ${subjectHint}.` : '') +
    ` Return valid JSON matching the schema.`
  );
}
