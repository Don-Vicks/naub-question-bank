import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as pdf from 'pdf-poppler';

export interface PageImage {
  pageNumber: number;
  filePath: string;
}

@Injectable()
export class PdfToImageService {
  private readonly logger = new Logger(PdfToImageService.name);

  async splitPdfToImages(
    pdfPath: string,
    outputDir: string,
  ): Promise<PageImage[]> {
    await fs.mkdir(outputDir, { recursive: true });

    const baseName = path.parse(pdfPath).name;

    const opts = {
      format: 'png' as const,
      out_dir: outputDir,
      out_prefix: baseName,
      page: null,
      scale: 2048,
    };

    await pdf.convert(pdfPath, opts);

    const files = (await fs.readdir(outputDir))
      .filter((f) => f.startsWith(baseName) && f.endsWith('.png'))
      .sort((a, b) => this.extractPageNum(a) - this.extractPageNum(b));

    if (files.length === 0) {
      this.logger.warn(`No pages produced for ${pdfPath}`);
    }

    return files.map((f) => ({
      pageNumber: this.extractPageNum(f),
      filePath: path.join(outputDir, f),
    }));
  }

  private extractPageNum(filename: string): number {
    const match = filename.match(/-(\d+)\.png$/);
    return match ? parseInt(match[1], 10) : 0;
  }
}
