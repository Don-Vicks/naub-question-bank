import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Unique,
  Index,
} from 'typeorm';
import { SourceDocument } from './source-document.entity';

export type ReviewStatus = 'approved' | 'flagged' | 'rejected';

// Idempotency key: (sourceDocumentId, pageNumber, questionNumber) must be
// unique so re-running a failed/partial batch never creates duplicates.
@Entity('questions')
@Unique('uq_question_source_page_number', [
  'sourceDocument',
  'pageNumber',
  'questionNumber',
])
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => SourceDocument, (doc) => doc.questions, {
    onDelete: 'CASCADE',
  })
  sourceDocument: SourceDocument;

  @Column()
  pageNumber: number;

  @Column()
  questionNumber: string; // string because papers use "3a", "iv", etc.

  // Raw text as extracted, no LaTeX normalization - useful for full-text search
  @Column({ type: 'text' })
  textRaw: string;

  // Same content but with math wrapped in $...$ / $$...$$ for KaTeX/MathJax
  @Column({ type: 'text' })
  textLatex: string;

  @Column({ nullable: true, type: 'varchar' })
  subject?: string | null;

  @Column({ default: false })
  hasDiagram: boolean;

  @Column({ nullable: true, type: 'varchar' })
  diagramAssetUrl?: string | null;

  @Column()
  sourcePageImageUrl: string; // always keep the original page as ground truth

  // Model's own confidence, 0-1. Drives review routing.
  @Column({ type: 'float', default: 1 })
  confidence: number;

  @Index()
  @Column({ type: 'varchar', default: 'flagged' })
  reviewStatus: ReviewStatus;

  @Column({ nullable: true, type: 'text' })
  reviewNotes?: string | null;

  @Column({ nullable: true, type: 'varchar' })
  modelUsed?: string | null; // e.g. "gemini-2.0-flash", useful once you A/B models

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
