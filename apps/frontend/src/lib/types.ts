export type ReviewStatus = 'approved' | 'flagged' | 'rejected';

// NAUB-style academic session, e.g. "2023/2024"
export type AcademicSession = string;

export type ExamType = 'End of Semester' | 'Mid Semester' | 'CA' | 'Practical';

export interface Course {
  id: string;
  code: string; // e.g. "SWE218"
  title: string; // e.g. "Introduction to Machine Learning"
  department: string; // e.g. "Software Engineering"
  level: string; // e.g. "200L"
  lecturer?: string;
  questionCount: number;
  progressPercent?: number; // populated once practice history exists
}

export interface QuestionSummary {
  id: string;
  courseId: string;
  number: string;
  textPreview: string;
  hasDiagram: boolean;
  confidence: number;
  reviewStatus: ReviewStatus;
  examType: ExamType;
  session: AcademicSession;
}

export interface QuestionDetail extends QuestionSummary {
  textLatex: string;
  diagramAssetUrl: string | null;
  sourcePageImageUrl: string;
  answerLatex: string;
  answerConfidence: number;
  answerReviewStatus: ReviewStatus;
}

export interface PracticeResult {
  questionId: string;
  outcome: 'got_it' | 'missed_it';
}
