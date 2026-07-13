// Shared types and utilities for NAUB Question Bank

export interface Question {
  id: string;
  pageNumber: number;
  questionNumber: string;
  textRaw: string;
  textLatex: string;
  subject?: string;
  hasDiagram: boolean;
  diagramAssetUrl?: string;
  sourcePageImageUrl: string;
  confidence: number;
  reviewStatus: 'flagged' | 'approved' | 'rejected';
  reviewNotes?: string;
  modelUsed?: string;
  createdAt: Date;
  updatedAt: Date;
  sourceDocumentId?: string;
}

export interface SourceDocument {
  id: string;
  originalFilename: string;
  mimeType: string;
  storagePath: string;
  pageCount: number;
  status: 'uploaded' | 'splitting' | 'extracting' | 'extracted' | 'failed';
  subjectHint?: string;
  extractedTitle?: string;
  extractedSubject?: string;
  examBoard?: string;
  examYear?: number;
  metadataConfidence?: number;
  errorMessage?: string;
  createdAt: Date;
}

export type DocumentStatus = SourceDocument['status'];
