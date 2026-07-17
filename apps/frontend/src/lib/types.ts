export type AcademicSession = string;

export type PaperStatus = 'uploaded' | 'ready' | 'failed';

export type ExamType = 'CA' | 'Mid Semester' | 'End of Semester' | 'Practical';

export type Level = '100L' | '200L' | '300L' | '400L' | '500L';

export interface Course {
  id: string;
  code: string;
  title: string;
  department: string;
  departmentId: string;
  facultyId: string;
  level: Level;
  questionPaperCount: number;
}

export interface UploadResult {
  queued: number;
  failed: number;
  documents: { filename: string; documentId: string; fileUrl: string | null }[];
  failedFilenames: string[];
  errors?: { filename: string; reason: string }[];
}

export interface QuestionPaper {
  id: string;
  title: string;
  courseCode: string;
  courseId: string;
  facultyId: string;
  departmentId: string;
  level: Level;
  examType: ExamType;
  session: AcademicSession;
  pageCount: number;
  status: PaperStatus;
  mimeType: string;
  fileUrl: string | null;
  thumbnailUrl: string | null;
  pageImageUrls: string[];
  uploadedAt: string;
}
