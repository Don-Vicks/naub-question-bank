import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Question } from './question.entity';

export type DocumentStatus =
  | 'uploaded'
  | 'pending_review'
  | 'ready'       // file is stored in R2 and immediately viewable
  | 'splitting'   // legacy – kept for old rows
  | 'extracting'  // legacy – kept for old rows
  | 'extracted'   // legacy – kept for old rows
  | 'failed';

@Entity('source_documents')
export class SourceDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  originalFilename: string;

  @Column()
  mimeType: string; // application/pdf | image/png | image/jpeg | image/webp

  /**
   * For legacy rows this is a local disk path.
   * For new rows, use `fileUrl` (the R2 public URL) instead.
   */
  @Column({ nullable: true, type: 'varchar' })
  storagePath?: string | null;

  /** R2 public URL of the uploaded file — the canonical display URL. */
  @Column({ nullable: true, type: 'text' })
  fileUrl?: string | null;

  @Column({ default: 1 })
  pageCount: number;

  @Column({ type: 'varchar', default: 'uploaded' })
  status: DocumentStatus;

  // ── Metadata supplied by the uploader via the upload form ──

  @Index()
  @Column({ nullable: true, type: 'varchar' })
  facultyId?: string | null;

  @Index()
  @Column({ nullable: true, type: 'varchar' })
  departmentId?: string | null;

  @Index()
  @Column({ nullable: true, type: 'varchar' })
  courseCode?: string | null;

  @Column({ nullable: true, type: 'varchar' })
  level?: string | null; // '100L' | '200L' | etc.

  @Column({ nullable: true, type: 'varchar' })
  examType?: string | null; // 'CA' | 'Mid Semester' | 'End of Semester' | 'Practical'

  @Column({ nullable: true, type: 'varchar' })
  session?: string | null; // e.g. '2023/2024'

  /** Legacy field kept for backward compat — courseCode supersedes this. */
  @Column({ nullable: true, type: 'varchar' })
  subjectHint?: string | null;

  @Column({ nullable: true, type: 'varchar' })
  uploaderId?: string | null;

  // ── AI-extracted fields (legacy, unused in simplified flow) ──

  @Column({ nullable: true, type: 'varchar' })
  extractedTitle?: string | null;

  @Column({ nullable: true, type: 'varchar' })
  extractedSubject?: string | null;

  @Column({ nullable: true, type: 'varchar' })
  examBoard?: string | null;

  @Column({ nullable: true, type: 'int' })
  examYear?: number | null;

  @Column({ type: 'float', nullable: true })
  metadataConfidence?: number | null;

  @Column({ nullable: true, type: 'text' })
  errorMessage?: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Question, (q) => q.sourceDocument)
  questions: Question[];
}
