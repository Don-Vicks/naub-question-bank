import { Course, FlashcardDeck, QuestionDetail, QuestionPaper, QuestionSummary } from './types';

export const mockCourses: Course[] = [
  // FCOM — Software Engineering
  { id: 'swe218', code: 'SWE218', title: 'Introduction to Machine Learning', department: 'Software Engineering', departmentId: 'software-engineering', facultyId: 'fcom', level: '200L', questionPaperCount: 4 },
  { id: 'swe219', code: 'SWE219', title: 'Software Requirements Engineering', department: 'Software Engineering', departmentId: 'software-engineering', facultyId: 'fcom', level: '200L', questionPaperCount: 3 },
  { id: 'swe311', code: 'SWE311', title: 'Software Design and Architecture', department: 'Software Engineering', departmentId: 'software-engineering', facultyId: 'fcom', level: '300L', questionPaperCount: 5 },

  // FCOM — Computer Science
  { id: 'cos201', code: 'COS201', title: 'Java Programming', department: 'Computer Science', departmentId: 'computer-science', facultyId: 'fcom', level: '200L', questionPaperCount: 6 },
  { id: 'csc211', code: 'CSC211', title: 'Web Programming I', department: 'Computer Science', departmentId: 'computer-science', facultyId: 'fcom', level: '200L', questionPaperCount: 4 },

  // FCOM — Cyber Security
  { id: 'cys201', code: 'CYS201', title: 'Introduction to Cyber Security', department: 'Cyber Security', departmentId: 'cyber-security', facultyId: 'fcom', level: '200L', questionPaperCount: 3 },

  // FENG — Civil Engineering
  { id: 'cen301', code: 'CEN301', title: 'Structural Analysis I', department: 'Civil Engineering', departmentId: 'civil-engineering', facultyId: 'feng', level: '300L', questionPaperCount: 4 },
  { id: 'cen401', code: 'CEN401', title: 'Reinforced Concrete Design', department: 'Civil Engineering', departmentId: 'civil-engineering', facultyId: 'feng', level: '400L', questionPaperCount: 3 },

  // FENG — Mechanical Engineering
  { id: 'men301', code: 'MEN301', title: 'Thermodynamics I', department: 'Mechanical Engineering', departmentId: 'mechanical-engineering', facultyId: 'feng', level: '300L', questionPaperCount: 5 },

  // FNAS — Mathematics
  { id: 'mat201', code: 'MAT201', title: 'Linear Algebra I', department: 'Mathematics', departmentId: 'mathematics', facultyId: 'fnas', level: '200L', questionPaperCount: 7 },
  { id: 'mat301', code: 'MAT301', title: 'Real Analysis I', department: 'Mathematics', departmentId: 'mathematics', facultyId: 'fnas', level: '300L', questionPaperCount: 4 },

  // FNAS — Physics
  { id: 'phy201', code: 'PHY201', title: 'Mechanics and Waves', department: 'Physics', departmentId: 'physics', facultyId: 'fnas', level: '200L', questionPaperCount: 5 },

  // FAMSS — Accounting
  { id: 'acc201', code: 'ACC201', title: 'Financial Accounting I', department: 'Accounting', departmentId: 'accounting', facultyId: 'famss', level: '200L', questionPaperCount: 6 },

  // FAMSS — Political Science
  { id: 'pol201', code: 'POL201', title: 'Introduction to Political Science', department: 'Political Science', departmentId: 'political-science', facultyId: 'famss', level: '200L', questionPaperCount: 3 },

  // FEVS — Building
  { id: 'bld301', code: 'BLD301', title: 'Building Construction Technology', department: 'Building', departmentId: 'building', facultyId: 'fevs', level: '300L', questionPaperCount: 2 },
];

export const mockFlashcardDecks: FlashcardDeck[] = [
  {
    courseCode: 'GST112',
    courseTitle: 'Introduction to Philosophy and Logic',
    department: 'General Studies',
    facultyId: 'famss',
    level: '100L',
    cardCount: 12,
    cards: [
      { id: 'gst112-1', type: 'flip', front: 'What is philosophy?', back: 'Philosophy is the study of fundamental questions about existence, knowledge, values, reason, mind, and language. The word comes from the Greek "philosophia" meaning "love of wisdom".', hint: 'Think about the Greek roots of the word' },
      { id: 'gst112-2', type: 'obj', question: 'Which branch of philosophy deals with the nature of knowledge?', options: ['Ethics', 'Epistemology', 'Metaphysics', 'Logic'], correctIndex: 1, explanation: 'Epistemology is the branch of philosophy concerned with the theory of knowledge — its nature, origin, and limits.' },
      { id: 'gst112-3', type: 'flip', front: 'What is the law of non-contradiction?', back: 'The law of non-contradiction states that contradictory statements cannot both be true at the same time and in the same sense. Formally: ¬(P ∧ ¬P).', hint: 'Something cannot be both true and false simultaneously' },
      { id: 'gst112-4', type: 'obj', question: 'Who wrote the famous work "Leviathan"?', options: ['John Locke', 'Jean-Jacques Rousseau', 'Thomas Hobbes', 'Immanuel Kant'], correctIndex: 2, explanation: 'Thomas Hobbes wrote "Leviathan" (1651), arguing for a strong central authority to prevent the chaos of a "state of nature".' },
      { id: 'gst112-5', type: 'flip', front: 'What is a syllogism?', back: 'A syllogism is a form of deductive reasoning consisting of a major premise, a minor premise, and a conclusion. Example: All men are mortal (major); Socrates is a man (minor); therefore Socrates is mortal (conclusion).', hint: 'Aristotle\'s three-line argument structure' },
      { id: 'gst112-6', type: 'obj', question: 'The fallacy of "begging the question" is also known as:', options: ['Red herring', 'Circular reasoning', 'False dilemma', 'Straw man'], correctIndex: 1, explanation: 'Begging the question (petitio principii) is circular reasoning — the conclusion is assumed in one of the premises.' },
      { id: 'gst112-7', type: 'flip', front: 'Who is considered the father of Western philosophy?', back: 'Socrates (470–399 BC) is widely considered the father of Western philosophy. He developed the Socratic method of questioning and left no writings — his ideas are known through Plato\'s dialogues.', hint: 'He was executed in Athens for "corrupting the youth"' },
      { id: 'gst112-8', type: 'obj', question: 'Which of the following is NOT a type of logical fallacy?', options: ['Ad hominem', 'Straw man', 'Deductive reasoning', 'Red herring'], correctIndex: 2, explanation: 'Deductive reasoning is a valid form of logical inference, not a fallacy. The others are all informal logical fallacies.' },
      { id: 'gst112-9', type: 'flip', front: 'What is the fallacy of ad hominem?', back: 'Ad hominem is a logical fallacy where someone attacks the person making an argument rather than the argument itself. It is considered informal because it diverts attention from the logical validity of the argument.', hint: 'Latin for "to the person"' },
      { id: 'gst112-10', type: 'obj', question: 'Utilitarianism is an ethical theory that emphasizes:', options: ['Duty and rules', 'The greatest good for the greatest number', 'Virtue and character', 'Individual rights above all'], correctIndex: 1, explanation: 'Utilitarianism, developed by Jeremy Bentham and John Stuart Mill, holds that the best action is the one that maximizes overall happiness or utility.' },
      { id: 'gst112-11', type: 'flip', front: 'What is the difference between validity and soundness in logic?', back: 'A deductive argument is valid if the conclusion follows logically from the premises (correct structure). It is sound if it is valid AND all premises are actually true.', hint: 'Validity = structure, Soundness = structure + truth' },
      { id: 'gst112-12', type: 'obj', question: 'René Descartes is famous for which philosophical statement?', options: ['"God is dead"', '"I think, therefore I am"', '"The unexamined life is not worth living"', '"Man is born free, but everywhere he is in chains"'], correctIndex: 1, explanation: '"Cogito, ergo sum" — "I think, therefore I am" — is Descartes\' foundational principle of certainty, established in his Meditations on First Philosophy.' },
    ],
  },
  {
    courseCode: 'GST212',
    courseTitle: 'Nigerian Peoples and Culture',
    department: 'General Studies',
    facultyId: 'famss',
    level: '200L',
    cardCount: 12,
    cards: [
      { id: 'gst212-1', type: 'flip', front: 'How many ethnic groups are recognized in Nigeria?', back: 'Nigeria has over 250 ethnic groups, with three major ones: Hausa-Fulani (North), Yoruba (Southwest), and Igbo (Southeast). The country has 36 states and the Federal Capital Territory (Abuja).', hint: 'The "Giant of Africa"' },
      { id: 'gst212-2', type: 'obj', question: 'Which is the largest ethnic group in Nigeria by population?', options: ['Yoruba', 'Igbo', 'Hausa-Fulani', 'Ijaw'], correctIndex: 2, explanation: 'The Hausa-Fulani are the largest ethnic group, predominantly found in Northern Nigeria and across the Sahel region of West Africa.' },
      { id: 'gst212-3', type: 'flip', front: 'What is the significance of the Durbar festival?', back: 'Durbar is a traditional horse-riding festival celebrated in Northern Nigeria, especially during Eid. It showcases the emirate\'s military heritage, with horsemen in traditional regalia paying homage to the Emir.', hint: 'Northern Nigeria, Islamic celebration' },
      { id: 'gst212-4', type: 'obj', question: 'The Benin Bronzes were created by which civilization?', options: ['Yoruba', 'Igbo', 'Edo (Benin Kingdom)', 'Hausa'], correctIndex: 2, explanation: 'The Benin Bronzes are a group of several thousand metal plaques and sculptures from the Kingdom of Benin (modern-day Edo State), dating back to the 13th century.' },
      { id: 'gst212-5', type: 'flip', front: 'What is the Igbo "Ozo" title system?', back: 'The Ozo title is the highest traditional title in Igbo society, conferred on men of proven integrity and wealth. Title holders gain social prestige, the right to participate in decision-making, and are considered custodians of tradition.', hint: 'Igbo equivalent of knighthood' },
      { id: 'gst212-6', type: 'obj', question: 'Who introduced the Indirect Rule system in Nigeria?', options: ['Sir Hugh Clifford', 'Lord Lugard', 'Sir Frederick Cartwright', 'Lord Harcourt'], correctIndex: 1, explanation: 'Lord Frederick Lugard implemented Indirect Rule in Nigeria during his tenure as Governor-General (1914–1919), governing through existing traditional institutions.' },
      { id: 'gst212-7', type: 'flip', front: 'What is "Aso Oke" and where does it come from?', back: 'Aso Oke is a handwoven cloth traditionally made by the Yoruba people. It comes in three main types: Sanyan (brown), Alaari (red), and Etu (dark blue). It is worn during ceremonies and celebrations.', hint: 'Yoruba traditional fabric' },
      { id: 'gst212-8', type: 'obj', question: 'Which Nigerian city is known as the "Home of Hospitality"?', options: ['Lagos', 'Kano', 'Port Harcourt', 'Enugu'], correctIndex: 3, explanation: 'Enugu, the capital of Enugu State, is nicknamed the "Coal City" and "Home of Hospitality". It was the first capital of Eastern Nigeria.' },
      { id: 'gst212-9', type: 'flip', front: 'What was the impact of the Atlantic slave trade on Nigerian societies?', back: 'The Atlantic slave trade (15th–19th century) depopulated communities, fueled inter-ethnic warfare, disrupted economies, and created social instability. It also facilitated the introduction of European goods and firearms.', hint: 'Millions were taken to the Americas' },
      { id: 'gst212-10', type: 'obj', question: 'The Yoruba god of iron and war is:', options: ['Shango', 'Ogun', 'Oshun', 'Eshu'], correctIndex: 1, explanation: 'Ogun is the Yoruba orisha (deity) of iron, war, labor, and metalworking. He is one of the most widely worshipped deities across Yoruba religion and its diaspora traditions.' },
      { id: 'gst212-11', type: 'flip', front: 'What was the Indirect Rule system in colonial Nigeria?', back: 'Indirect Rule was a British colonial policy where traditional rulers (Emirs, Obas, Obis) were used to govern local populations. Lord Lugard implemented it in Northern Nigeria through the Emirate system, while it faced resistance in the Southeast due to the absence of centralized authority.', hint: 'Lord Lugard\'s governing approach' },
      { id: 'gst212-12', type: 'obj', question: 'Nigeria gained independence on which date?', options: ['October 1, 1958', 'October 1, 1960', 'January 1, 1960', 'March 15, 1961'], correctIndex: 1, explanation: 'Nigeria gained independence from Britain on October 1, 1960, becoming a sovereign nation within the Commonwealth.' },
    ],
  },
  {
    courseCode: 'COS102',
    courseTitle: 'Introduction to Computer Science',
    department: 'Computer Science',
    facultyId: 'fcom',
    level: '100L',
    cardCount: 12,
    cards: [
      { id: 'cos102-1', type: 'flip', front: 'What is the difference between hardware and software?', back: 'Hardware refers to the physical components of a computer (CPU, RAM, disk, monitor). Software refers to the programs and instructions that tell the hardware what to do (OS, applications, drivers).', hint: 'Tangible vs. Intangible' },
      { id: 'cos102-2', type: 'obj', question: 'How many bits are in one byte?', options: ['4', '8', '16', '32'], correctIndex: 1, explanation: 'One byte equals 8 bits. A bit is the smallest unit of data (0 or 1), and a byte is the standard unit for measuring data size.' },
      { id: 'cos102-3', type: 'flip', front: 'What is the binary number system?', back: 'The binary system uses only two digits: 0 and 1. It is the fundamental language of computers. Each digit is a "bit", and 8 bits make a "byte". Example: 1010 in binary = 10 in decimal.', hint: 'Base-2, only 0s and 1s' },
      { id: 'cos102-4', type: 'obj', question: 'Which of the following is an example of application software?', options: ['BIOS', 'Device driver', 'Microsoft Word', 'Operating system'], correctIndex: 2, explanation: 'Microsoft Word is application software designed for end users. BIOS, device drivers, and operating systems are system software.' },
      { id: 'cos102-5', type: 'flip', front: 'Name the five generations of computers.', back: '1st Gen: Vacuum tubes (1940s–50s). 2nd Gen: Transistors (1950s–60s). 3rd Gen: Integrated circuits (1960s–70s). 4th Gen: Microprocessors (1970s–present). 5th Gen: AI and parallel processing (present–future).', hint: 'From vacuum tubes to AI' },
      { id: 'cos102-6', type: 'obj', question: 'What does RAM stand for?', options: ['Read Access Memory', 'Random Access Memory', 'Run Application Memory', 'Rapid Access Module'], correctIndex: 1, explanation: 'RAM stands for Random Access Memory. It is volatile memory that stores data currently being used by the CPU for fast access.' },
      { id: 'cos102-7', type: 'flip', front: 'What is an operating system?', back: 'An operating system (OS) is system software that manages computer hardware and software resources and provides common services for programs. Examples: Windows, macOS, Linux, Android. It handles memory management, process scheduling, and file systems.', hint: 'The bridge between user and hardware' },
      { id: 'cos102-8', type: 'obj', question: 'Which of the following is a programming language?', options: ['HTTP', 'HTML', 'Python', 'CSS'], correctIndex: 2, explanation: 'Python is a high-level programming language. HTTP is a protocol, HTML is a markup language, and CSS is a style sheet language.' },
      { id: 'cos102-9', type: 'flip', front: 'What does CPU stand for and what does it do?', back: 'CPU = Central Processing Unit. It is the "brain" of the computer that executes instructions from programs. It performs arithmetic (ALU), logic operations, and controls other components (Control Unit). Key metrics: clock speed (GHz), cores, cache.', hint: 'The brain of the computer' },
      { id: 'cos102-10', type: 'obj', question: 'The extension ".pdf" stands for:', options: ['Program Document Format', 'Portable Document Format', 'Printed Digital File', 'Private Data File'], correctIndex: 1, explanation: 'PDF stands for Portable Document Format, developed by Adobe in 1993. It preserves formatting across different platforms and devices.' },
      { id: 'cos102-11', type: 'flip', front: 'Explain the difference between RAM and ROM.', back: 'RAM (Random Access Memory) is volatile — it loses data when power is off. It stores currently running programs. ROM (Read-Only Memory) is non-volatile — it retains data without power. It stores firmware/boot instructions.', hint: 'One is temporary, the other permanent' },
      { id: 'cos102-12', type: 'obj', question: 'What is the full meaning of "URL"?', options: ['Universal Resource Locator', 'Uniform Resource Locator', 'Unified Reference Link', 'Universal Reference Locator'], correctIndex: 1, explanation: 'URL stands for Uniform Resource Locator. It is the address used to access resources on the Internet, such as web pages, images, or files.' },
    ],
  },
];

export const mockPapers: QuestionPaper[] = [
  {
    id: 'p-1',
    title: 'SWE218 End of Semester Exam',
    courseCode: 'SWE218',
    courseId: 'swe218',
    facultyId: 'fcom',
    departmentId: 'software-engineering',
    level: '200L',
    examType: 'End of Semester',
    session: '2023/2024',
    pageCount: 4,
    status: 'extracted',
    thumbnailUrl: '/mock/page-placeholder.png',
    pageImageUrls: [
      '/mock/page-placeholder.png',
      '/mock/page-placeholder.png',
      '/mock/page-placeholder.png',
      '/mock/page-placeholder.png',
    ],
    uploadedAt: '2024-06-15T10:30:00Z',
  },
  {
    id: 'p-2',
    title: 'SWE218 Mid Semester Test',
    courseCode: 'SWE218',
    courseId: 'swe218',
    facultyId: 'fcom',
    departmentId: 'software-engineering',
    level: '200L',
    examType: 'Mid Semester',
    session: '2023/2024',
    pageCount: 2,
    status: 'extracted',
    thumbnailUrl: '/mock/page-placeholder.png',
    pageImageUrls: ['/mock/page-placeholder.png', '/mock/page-placeholder.png'],
    uploadedAt: '2024-03-20T14:00:00Z',
  },
  {
    id: 'p-3',
    title: 'COS201 End of Semester Exam',
    courseCode: 'COS201',
    courseId: 'cos201',
    facultyId: 'fcom',
    departmentId: 'computer-science',
    level: '200L',
    examType: 'End of Semester',
    session: '2023/2024',
    pageCount: 6,
    status: 'extracted',
    thumbnailUrl: '/mock/page-placeholder.png',
    pageImageUrls: Array(6).fill('/mock/page-placeholder.png'),
    uploadedAt: '2024-06-18T09:00:00Z',
  },
  {
    id: 'p-4',
    title: 'MAT201 End of Semester Exam',
    courseCode: 'MAT201',
    courseId: 'mat201',
    facultyId: 'fnas',
    departmentId: 'mathematics',
    level: '200L',
    examType: 'End of Semester',
    session: '2022/2023',
    pageCount: 3,
    status: 'extracted',
    thumbnailUrl: '/mock/page-placeholder.png',
    pageImageUrls: Array(3).fill('/mock/page-placeholder.png'),
    uploadedAt: '2023-07-10T11:00:00Z',
  },
  {
    id: 'p-5',
    title: 'CSC211 CA Test',
    courseCode: 'CSC211',
    courseId: 'csc211',
    facultyId: 'fcom',
    departmentId: 'computer-science',
    level: '200L',
    examType: 'CA',
    session: '2024/2025',
    pageCount: 2,
    status: 'extracting',
    thumbnailUrl: null,
    pageImageUrls: [],
    uploadedAt: '2025-02-01T08:30:00Z',
  },
];

export const mockQuestions: QuestionSummary[] = [
  {
    id: 'q-1',
    paperId: 'p-1',
    courseId: 'swe218',
    number: '3',
    textPreview: 'Explain the bias-variance tradeoff and how it affects model selection...',
    hasDiagram: false,
    confidence: 0.94,
    reviewStatus: 'approved',
    sourcePageImageUrl: '/mock/page-placeholder.png',
  },
  {
    id: 'q-2',
    paperId: 'p-1',
    courseId: 'swe218',
    number: '4',
    textPreview: 'The diagram below shows a confusion matrix for a binary classifier...',
    hasDiagram: true,
    confidence: 0.61,
    reviewStatus: 'flagged',
    sourcePageImageUrl: '/mock/page-placeholder.png',
  },
];

export const mockQuestionDetail: Record<string, QuestionDetail> = {
  'q-1': {
    ...mockQuestions[0],
    textLatex:
      'Explain the bias-variance tradeoff. Given a model with high bias, describe the expected relationship between training error $E_{train}$ and test error $E_{test}$.',
    diagramAssetUrl: null,
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
    answerLatex:
      'Precision = \\frac{TP}{TP+FP} = \\frac{40}{50} = 0.8 \\\\ Recall = \\frac{TP}{TP+FN} = \\frac{40}{45} \\approx 0.89',
    answerConfidence: 0.61,
    answerReviewStatus: 'flagged',
  },
};
