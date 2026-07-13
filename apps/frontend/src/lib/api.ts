import { Course, QuestionDetail, QuestionSummary } from './types';
import { mockCourses, mockQuestionDetail, mockQuestions } from './mock-data';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';
const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

function delay<T>(value: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

/**
 * NOTE ON BACKEND GAPS:
 * The NestJS pipeline (question-bank-pipeline) only exposes ingestion and
 * review endpoints so far. This frontend needs the following read endpoints,
 * scoped to NAUB courses rather than secondary-school subjects:
 *
 *   GET /question-bank/courses
 *   GET /question-bank/courses/:id/questions?examType=&session=
 *   GET /question-bank/questions/:id
 *   GET /question-bank/search?q=
 *
 * These map onto the existing Question/SourceDocument entities - `course`
 * replaces the old generic `subject` field, keyed off the course code the
 * DocumentMetadataService already extracts (e.g. "SWE218") rather than the
 * exam-board/year fields that made sense for WAEC-style content but not for
 * university course exams. Until these exist, mock-data.ts stands in.
 */

export const api = {
  getCourses: (): Promise<Course[]> =>
    USE_MOCKS ? delay(mockCourses) : request<Course[]>('/question-bank/courses'),

  getQuestionsByCourse: (
    courseId: string,
    params?: { examType?: string; session?: string },
  ): Promise<QuestionSummary[]> => {
    if (USE_MOCKS) {
      return delay(mockQuestions.filter((q) => q.courseId === courseId));
    }
    const qs = new URLSearchParams();
    if (params?.examType) qs.set('examType', params.examType);
    if (params?.session) qs.set('session', params.session);
    return request<QuestionSummary[]>(
      `/question-bank/courses/${courseId}/questions?${qs.toString()}`,
    );
  },

  getQuestion: (id: string): Promise<QuestionDetail> =>
    USE_MOCKS
      ? delay(mockQuestionDetail[id])
      : request<QuestionDetail>(`/question-bank/questions/${id}`),

  search: (query: string): Promise<QuestionSummary[]> => {
    if (USE_MOCKS) {
      const q = query.toLowerCase();
      return delay(
        mockQuestions.filter((item) =>
          item.textPreview.toLowerCase().includes(q),
        ),
      );
    }
    return request<QuestionSummary[]>(
      `/question-bank/search?q=${encodeURIComponent(query)}`,
    );
  },

  reportIssue: (
    questionId: string,
    payload: { reason: string; note?: string },
  ): Promise<void> =>
    USE_MOCKS
      ? delay(undefined)
      : request(`/question-bank/questions/${questionId}/report`, {
          method: 'POST',
          body: JSON.stringify(payload),
        }),
};
