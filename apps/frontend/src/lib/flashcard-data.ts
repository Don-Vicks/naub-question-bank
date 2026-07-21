import gst212Questions from '../../gst212_cbt_questions.json';

export interface FlashcardItem {
  courseCode: string;
  questionNumber: string;
  front: string;
  frontLatex?: string;
  back: string;
  backLatex?: string;
  explanation?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  hasDiagram?: boolean;
  diagramAssetUrl?: string | null;
  options?: string[];
}

export interface FlashcardDeck {
  id: string;
  courseCode: string;
  courseTitle: string;
  department: string;
  facultyId: string;
  level: string;
  description: string;
  cardCount: number;
  easyCount: number;
  mediumCount: number;
  hardCount: number;
  cards: FlashcardItem[];
}

const rawGst212 = gst212Questions as FlashcardItem[];

export const FLASHCARD_DECKS: FlashcardDeck[] = [
  {
    id: 'gst212',
    courseCode: 'GST 212',
    courseTitle: 'Philosophy and Logic',
    department: 'General Studies',
    facultyId: 'fcom',
    level: '200L',
    description: 'Comprehensive study cards and CBT practice questions covering etymology, branches of philosophy, logic, fallacies, and human existence.',
    cardCount: rawGst212.length,
    easyCount: rawGst212.filter((c) => c.difficulty === 'easy').length,
    mediumCount: rawGst212.filter((c) => c.difficulty === 'medium').length,
    hardCount: rawGst212.filter((c) => c.difficulty === 'hard').length,
    cards: rawGst212,
  },
];

export function getFlashcardDeckByCode(code: string): FlashcardDeck | undefined {
  const normalized = code.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  return FLASHCARD_DECKS.find(
    (deck) => deck.courseCode.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() === normalized
  );
}
