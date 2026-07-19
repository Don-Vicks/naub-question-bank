import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs/promises';
import { SourceDocument } from '../entities/source-document.entity';
import { PdfToImageService } from '../services/pdf-to-image.service';
import { GeminiExtractionService } from '../services/gemini-extraction.service';
import { DiagramCropService } from '../services/diagram-crop.service';
import { StorageService } from '../services/storage.service';
import { DocumentMetadataService } from '../services/document-metadata.service';
import { R2Service } from '../../storage/r2.service';

export interface ExtractionJobData {
  sourceDocumentId: string;
}

const WORK_DIR = process.env.WORK_DIR ?? './tmp/question-bank';
const ASSET_DIR = process.env.STORAGE_BUCKET_PATH ?? './uploads/diagrams';

@Processor('question-extraction', {
  concurrency: 1,
})
export class ExtractionProcessor extends WorkerHost {
  private readonly logger = new Logger(ExtractionProcessor.name);

  constructor(
    @InjectRepository(SourceDocument)
    private readonly sourceDocRepo: Repository<SourceDocument>,
    private readonly pdfToImage: PdfToImageService,
    private readonly gemini: GeminiExtractionService,
    private readonly diagramCrop: DiagramCropService,
    private readonly storage: StorageService,
    private readonly documentMetadata: DocumentMetadataService,
    private readonly r2: R2Service,
  ) {
    super();
  }

  private async resolveLocalPath(doc: SourceDocument): Promise<string> {
    if (doc.storagePath) {
      try {
        await fs.access(doc.storagePath);
        return doc.storagePath;
      } catch {
        this.logger.debug(`Local file not found: ${doc.storagePath}`);
      }
    }

    const fileUrl = doc.fileUrl;
    if (!fileUrl) {
      throw new Error(`No storagePath or fileUrl available for document ${doc.id}`);
    }

    throw new Error(
      `R2 download not available — re-upload the file instead. ` +
      `Document ${doc.id} has no local copy and downloadFile was removed.`,
    );
  }

  async process(job: Job<ExtractionJobData>): Promise<void> {
    const doc = await this.sourceDocRepo.findOneOrFail({
      where: { id: job.data.sourceDocumentId },
    });

    try {
      doc.status = 'splitting';
      await this.sourceDocRepo.save(doc);

      const localPath = await this.resolveLocalPath(doc);
      const outputDir = path.join(WORK_DIR, doc.id);
      const pages =
        doc.mimeType === 'application/pdf'
          ? await this.pdfToImage.splitPdfToImages(localPath, outputDir)
          : [{ pageNumber: 1, filePath: localPath }];

      doc.pageCount = pages.length;
      doc.status = 'extracting';
      await this.sourceDocRepo.save(doc);

      if (pages.length > 0) {
        const meta = await this.documentMetadata.extractFromPage(
          pages[0].filePath,
        );
        doc.extractedTitle = meta.title ?? undefined;
        doc.extractedSubject = meta.subject ?? undefined;
        doc.examBoard = meta.examBoard ?? undefined;
        doc.examYear = meta.year ?? undefined;
        doc.metadataConfidence = meta.confidence;
        await this.sourceDocRepo.save(doc);
      }

      for (const page of pages) {
        await job.updateProgress(
          Math.round((page.pageNumber / pages.length) * 100),
        );

        const pageR2Url = await this.r2.uploadFromPath(
          page.filePath,
          'papers/' + doc.id + '/pages/page-' + page.pageNumber + '.png',
          'image/png',
        );

        const extracted = await this.gemini.extractPageSync(
          page.filePath,
          page.pageNumber,
          (doc.extractedSubject ?? doc.subjectHint) || undefined,
        );

        const diagramUrls: Record<string, string> = {};
        for (const q of extracted.questions) {
          if (q.has_diagram && q.diagram_bbox) {
            const cropPath = await this.diagramCrop.cropDiagram(
              page.filePath,
              q.diagram_bbox,
              path.join(ASSET_DIR, doc.id),
              `page${page.pageNumber}-q${q.number}`,
            );
            const diagramR2Url = await this.r2.uploadFromPath(
              cropPath,
              'papers/' + doc.id + '/diagrams/page' + page.pageNumber + '-q' + q.number + '.png',
              'image/png',
            );
            diagramUrls[q.number] = diagramR2Url;
          }
        }

        await this.storage.persistExtractedPage(
          doc,
          extracted,
          pageR2Url,
          diagramUrls,
          process.env.GEMINI_MODEL ?? 'gemini-2.0-flash',
        );
      }

      doc.status = 'extracted';
      await this.sourceDocRepo.save(doc);
    } catch (err) {
      this.logger.error(
        `Extraction failed for document ${doc.id}: ${err.message}`,
      );
      doc.status = 'failed';
      doc.errorMessage = err.message;
      await this.sourceDocRepo.save(doc);
      throw err;
    }
  }
}
