import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question, ReviewStatus } from '../entities/question.entity';
import { SourceDocument } from '../entities/source-document.entity';
import { ExtractedPage } from './gemini-extraction.service';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly confidenceThreshold: number;

  constructor(
    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
  ) {
    this.confidenceThreshold = Number(
      process.env.CONFIDENCE_THRESHOLD ?? 0.75,
    );
  }

  async persistExtractedPage(
    sourceDocument: SourceDocument,
    page: ExtractedPage,
    sourcePageImageUrl: string,
    diagramAssetUrls: Record<string, string>,
    modelUsed: string,
  ): Promise<Question[]> {
    const saved: Question[] = [];

    for (const q of page.questions) {
      const reviewStatus: ReviewStatus =
        q.confidence >= this.confidenceThreshold ? 'approved' : 'flagged';

      const existing = await this.questionRepo.findOne({
        where: {
          sourceDocument: { id: sourceDocument.id },
          pageNumber: page.pageNumber,
          questionNumber: q.number,
        },
        relations: ['sourceDocument'],
      });

      const payload: Partial<Question> = {
        sourceDocument,
        pageNumber: page.pageNumber,
        questionNumber: q.number,
        textRaw: q.text_raw,
        textLatex: q.text_latex,
        subject: page.pageSubjectGuess ?? sourceDocument.subjectHint ?? undefined,
        hasDiagram: q.has_diagram,
        diagramAssetUrl: diagramAssetUrls[q.number] ?? undefined,
        sourcePageImageUrl,
        confidence: q.confidence,
        reviewStatus,
        modelUsed,
      };

      const entity = existing
        ? this.questionRepo.merge(existing, payload)
        : this.questionRepo.create(payload);

      saved.push(await this.questionRepo.save(entity));
    }

    this.logger.log(
      `Persisted ${saved.length} questions for page ${page.pageNumber} ` +
        `(${saved.filter((s) => s.reviewStatus === 'flagged').length} flagged for review)`,
    );

    return saved;
  }
}
