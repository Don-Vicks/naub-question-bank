export type ReviewStatus = 'approved' | 'flagged' | 'rejected';

export type AcademicSession = string;

export type PaperStatus = 'uploaded' | 'splitting' | 'extracting' | 'extracted' | 'failed';

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
  thumbnailUrl: string | null;
  pageImageUrls: string[];
  uploadedAt: string;
}

export interface QuestionSummary {
  id: string;
  paperId: string;
  courseId: string;
  number: string;
  textPreview: string;
  hasDiagram: boolean;
  confidence: number;
  reviewStatus: ReviewStatus;
  sourcePageImageUrl: string;
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

export type FlashcardType = 'flip' | 'obj';

export interface FlashcardBase {
  id: string;
  type: FlashcardType;
}

export interface FlipFlashcard extends FlashcardBase {
  type: 'flip';
  front: string;
  back: string;
  hint?: string;
}

export interface ObjFlashcard extends FlashcardBase {
  type: 'obj';
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export type Flashcard = FlipFlashcard | ObjFlashcard;

export interface FlashcardDeck {
  courseCode: string;
  courseTitle: string;
  department: string;
  facultyId: string;
  level: Level;
  cardCount: number;
  cards: Flashcard[];
}
