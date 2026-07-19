import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs/promises';

export interface ExtractedQuestion {
  number: string;
  text_raw: string;
  text_latex: string;
  options: string[] | null;
  has_diagram: boolean;
  diagram_bbox: { x: number; y: number; width: number; height: number } | null;
  confidence: number;
}

export interface ExtractedPage {
  pageNumber: number;
  pageSubjectGuess: string | null;
  questions: ExtractedQuestion[];
}

@Injectable()
export class GeminiExtractionService {
  private readonly logger = new Logger(GeminiExtractionService.name);
  private readonly client: GoogleGenerativeAI;
  private readonly modelName: string;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set');
    }
    this.client = new GoogleGenerativeAI(apiKey);
    this.modelName = process.env.GEMINI_MODEL ?? 'gemini-2.0-flash';
  }

  async extractPageSync(
    imagePath: string,
    pageNumber: number,
    subjectHint?: string,
  ): Promise<ExtractedPage> {
    const model = this.client.getGenerativeModel({
      model: this.modelName,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.1,
      },
    });

    const imageBytes = await fs.readFile(imagePath);
    const mimeType = imagePath.endsWith('.png') ? 'image/png' : 'image/jpeg';

    const result = await model.generateContent([
      { inlineData: { data: imageBytes.toString('base64'), mimeType } },
      { text: `Extract all questions from page ${pageNumber}${subjectHint ? ` (subject: ${subjectHint})` : ''}. Return JSON with { page_subject_guess, questions: [{ number, text_raw, text_latex, options, has_diagram, diagram_bbox, confidence }] }` },
    ]);

    const raw = result.response.text();
    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      this.logger.error(
        `Failed to parse Gemini JSON for page ${pageNumber}: ${raw.slice(0, 300)}`,
      );
      throw new Error(`Malformed model output on page ${pageNumber}`);
    }

    return {
      pageNumber,
      pageSubjectGuess: parsed.page_subject_guess ?? null,
      questions: (parsed.questions ?? []).map((q: any) => ({
        number: String(q.number),
        text_raw: q.text_raw ?? '',
        text_latex: q.text_latex ?? q.text_raw ?? '',
        options: q.options ?? null,
        has_diagram: Boolean(q.has_diagram),
        diagram_bbox: q.diagram_bbox ?? null,
        confidence:
          typeof q.confidence === 'number'
            ? Math.max(0, Math.min(1, q.confidence))
            : 0.5,
      })),
    };
  }

  async extractPagesBatch(
    _pages: { imagePath: string; pageNumber: number }[],
  ): Promise<ExtractedPage[]> {
    throw new Error(
      'Batch mode not yet wired - use extractPageSync() via the BullMQ queue.',
    );
  }
}
