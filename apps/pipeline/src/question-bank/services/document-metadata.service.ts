import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs/promises';

export interface DocumentMetadata {
  title: string | null;
  subject: string | null;
  examBoard: string | null;
  year: number | null;
  confidence: number;
}

@Injectable()
export class DocumentMetadataService {
  private readonly logger = new Logger(DocumentMetadataService.name);
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

  async extractFromPage(imagePath: string): Promise<DocumentMetadata> {
    const fallback: DocumentMetadata = {
      title: null,
      subject: null,
      examBoard: null,
      year: null,
      confidence: 0,
    };

    try {
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
        { text: 'Extract document metadata. Return JSON with { title, subject, exam_board, year, confidence }' },
      ]);

      const parsed = JSON.parse(result.response.text());

      return {
        title: parsed.title ?? null,
        subject: parsed.subject ?? null,
        examBoard: parsed.exam_board ?? null,
        year: parsed.year ?? null,
        confidence:
          typeof parsed.confidence === 'number' ? parsed.confidence : 0.5,
      };
    } catch (err) {
      this.logger.warn(
        `Metadata extraction failed for ${imagePath}, continuing without it: ${err.message}`,
      );
      return fallback;
    }
  }
}
