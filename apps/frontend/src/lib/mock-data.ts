import { Course, QuestionDetail, QuestionSummary } from './types';

// Courses drawn from the NAUB SWE curriculum context (matches the pipeline's
// own extracted subject/course metadata - see document-metadata-prompt.ts
// on the backend).
export const mockCourses: Course[] = [
  {
    id: 'swe218',
    code: 'SWE218',
    title: 'Introduction to Machine Learning',
    department: 'Software Engineering',
    level: '200L',
    lecturer: 'Dr. A. G. Jakwa',
    questionCount: 64,
    progressPercent: 35,
  },
  {
    id: 'cos201',
    code: 'COS201',
    title: 'Java Programming',
    department: 'Computer Science',
    level: '200L',
    questionCount: 88,
    progressPercent: 12,
  },
  {
    id: 'csc211',
    code: 'CSC211',
    title: 'Web Programming I',
    department: 'Computer Science',
    level: '200L',
    questionCount: 51,
  },
  {
    id: 'csc212',
    code: 'CSC212',
    title: 'Web Programming II',
    department: 'Computer Science',
    level: '200L',
    questionCount: 47,
  },
  {
    id: 'swe219',
    code: 'SWE219',
    title: 'Software Requirements Engineering',
    department: 'Software Engineering',
    level: '200L',
    questionCount: 39,
  },
  {
    id: 'sen201',
    code: 'SEN201',
    title: 'Systems Engineering Principles',
    department: 'Software Engineering',
    level: '200L',
    questionCount: 42,
  },
];

export const mockQuestions: QuestionSummary[] = [
  {
    id: 'q-1',
    courseId: 'swe218',
    number: '3',
    textPreview:
      'Explain the bias-variance tradeoff and how it affects model selection...',
    hasDiagram: false,
    confidence: 0.94,
    reviewStatus: 'approved',
    examType: 'End of Semester',
    session: '2023/2024',
  },
  {
    id: 'q-2',
    courseId: 'swe218',
    number: '4',
    textPreview:
      'The diagram below shows a confusion matrix for a binary classifier...',
    hasDiagram: true,
    confidence: 0.61,
    reviewStatus: 'flagged',
    examType: 'End of Semester',
    session: '2023/2024',
  },
];

export const mockQuestionDetail: Record<string, QuestionDetail> = {
  'q-1': {
    ...mockQuestions[0],
    textLatex:
      'Explain the bias-variance tradeoff. Given a model with high bias, describe the expected relationship between training error $E_{train}$ and test error $E_{test}$.',
    diagramAssetUrl: null,
    sourcePageImageUrl: '/mock/page-placeholder.png',
    answerLatex:
      'E_{test} \\approx E_{train} + \\text{Bias}^2 + \\text{Variance} \\\\ \\text{High bias} \\Rightarrow E_{train} \\approx E_{test}, \\text{both high (underfitting)}',
    answerConfidence: 0.94,
    answerReviewStatus: 'approved',
  },
  'q-2': {
    ...mockQuestions[1],
    textLatex:
      'The diagram below shows a confusion matrix for a binary classifier with $TP=40$, $FP=10$, $FN=5$, $TN=45$. Calculate precision and recall.',
    diagramAssetUrl: '/mock/confusion-matrix-placeholder.png',
    sourcePageImageUrl: '/mock/page-placeholder.png',
    answerLatex:
      'Precision = \\frac{TP}{TP+FP} = \\frac{40}{50} = 0.8 \\\\ Recall = \\frac{TP}{TP+FN} = \\frac{40}{45} \\approx 0.89',
    answerConfidence: 0.61,
    answerReviewStatus: 'flagged',
  },
};
