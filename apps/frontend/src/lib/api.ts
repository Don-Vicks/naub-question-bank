import { Course, QuestionDetail, QuestionPaper, QuestionSummary } from './types';
import { FACULTIES, DEPARTMENTS, getDepartmentsByFaculty, type Faculty, type Department } from './naub-data';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000/api';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('padi-auth');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state?.token ?? null;
  } catch {
    return null;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init?.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('padi-auth');
      window.location.href = '/login';
    }
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

// ── Admin types ──

export interface AdminOverview {
  stats: {
    totalPapers: number;
    totalQuestions: number;
    flaggedQuestions: number;
    approvedQuestions: number;
    rejectedQuestions: number;
    pendingQuestions: number;
    totalUsers: number;
    recentPapers: number;
    recentUsers: number;
  };
  recentActivity: {
    id: string;
    action: string;
    detail: string;
    time: string;
  }[];
}

export interface AdminPaperItem {
  id: string;
  title: string;
  courseCode: string;
  status: string;
  pageCount: number;
  uploadedAt: string;
  uploaderId: string | null;
  errorMessage: string | null;
}

export interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  joinedAt: string;
  papersUploaded: number;
}

export interface AdminStats {
  totalPapers: number;
  totalQuestions: number;
  totalUsers: number;
  extractionRate: number;
  statusBreakdown: { label: string; count: number; color: string }[];
  papersByStatus: { status: string; count: number }[];
  questionsBySubject: { subject: string; count: number }[];
}

export interface ReviewQuestion {
  id: string;
  questionNumber: string;
  textRaw: string;
  textLatex: string;
  confidence: number;
  sourcePageImageUrl: string;
  hasDiagram: boolean;
  reviewStatus: string;
  subject: string | null;
  sourceDocument: {
    id: string;
    originalFilename: string;
    extractedTitle: string | null;
    extractedSubject: string | null;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ── API methods ──

export const api = {
  getFaculties: (): Promise<Faculty[]> =>
    request<Faculty[]>('/question-bank/faculties'),

  getDepartments: (facultyId: string): Promise<Department[]> =>
    request<Department[]>(`/question-bank/faculties/${facultyId}/departments`),

  getCourses: (params?: { facultyId?: string; departmentId?: string; level?: string }) => {
    const qs = new URLSearchParams();
    if (params?.facultyId) qs.set('facultyId', params.facultyId);
    if (params?.departmentId) qs.set('departmentId', params.departmentId);
    if (params?.level) qs.set('level', params.level);
    return request<Course[]>(`/question-bank/courses?${qs.toString()}`);
  },

  getCourse: (courseId: string): Promise<Course | undefined> =>
    request<Course>(`/question-bank/courses/${courseId}`),

  getPapers: (params: { courseId?: string; facultyId?: string; departmentId?: string; level?: string }) => {
    const qs = new URLSearchParams();
    if (params.courseId) qs.set('courseId', params.courseId);
    if (params.facultyId) qs.set('facultyId', params.facultyId);
    if (params.departmentId) qs.set('departmentId', params.departmentId);
    if (params.level) qs.set('level', params.level);
    return request<QuestionPaper[]>(`/question-bank/papers?${qs.toString()}`);
  },

  getPaper: (paperId: string): Promise<QuestionPaper | undefined> =>
    request<QuestionPaper>(`/question-bank/papers/${paperId}`),

  getQuestionsByPaper: (paperId: string): Promise<QuestionSummary[]> =>
    request<QuestionSummary[]>(`/question-bank/papers/${paperId}/questions`),

  getQuestion: (id: string): Promise<QuestionDetail | undefined> =>
    request<QuestionDetail>(`/question-bank/questions/${id}`),

  search: (query: string): Promise<QuestionPaper[]> =>
    request<QuestionPaper[]>(
      `/question-bank/search?q=${encodeURIComponent(query)}`,
    ),

  uploadPaper: async (formData: FormData): Promise<{ documentId: string; status: string }> => {
    const token = getToken();
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/question-bank/documents/upload-batch`, {
      method: 'POST',
      headers,
      body: formData,
    });
    if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
    return res.json();
  },

  getUploadStatus: (documentId: string) =>
    request(`/question-bank/documents/${documentId}/status`),

  reportIssue: (
    questionId: string,
    payload: { reason: string; note?: string },
  ): Promise<void> =>
    request(`/question-bank/questions/${questionId}/report`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: (email: string, password: string): Promise<{ access_token: string; user: { id: string; email: string; name: string; role: string } }> =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string): Promise<{ access_token: string; user: { id: string; email: string; name: string; role: string } }> =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  getMe: (): Promise<{ id: string; email: string; name: string; role: string }> =>
    request('/auth/me'),

  // ── Admin endpoints ──

  adminOverview: (): Promise<AdminOverview> =>
    request('/admin/overview'),

  adminPapers: (params?: { search?: string; status?: string; page?: number; limit?: number }): Promise<PaginatedResponse<AdminPaperItem>> => {
    const qs = new URLSearchParams();
    if (params?.search) qs.set('search', params.search);
    if (params?.status) qs.set('status', params.status);
    if (params?.page) qs.set('page', String(params.page));
    if (params?.limit) qs.set('limit', String(params.limit));
    return request(`/admin/papers?${qs.toString()}`);
  },

  adminDeletePaper: (id: string): Promise<{ deleted: boolean }> =>
    request(`/admin/papers/${id}`, { method: 'DELETE' }),

  adminUsers: (params?: { search?: string; page?: number; limit?: number }): Promise<PaginatedResponse<AdminUserItem>> => {
    const qs = new URLSearchParams();
    if (params?.search) qs.set('search', params.search);
    if (params?.page) qs.set('page', String(params.page));
    if (params?.limit) qs.set('limit', String(params.limit));
    return request(`/admin/users?${qs.toString()}`);
  },

  adminPromoteUser: (id: string): Promise<AdminUserItem> =>
    request(`/admin/users/${id}/promote`, { method: 'PATCH' }),

  adminDemoteUser: (id: string): Promise<AdminUserItem> =>
    request(`/admin/users/${id}/demote`, { method: 'PATCH' }),

  adminStats: (): Promise<AdminStats> =>
    request('/admin/stats'),

  reviewQueue: (params?: { limit?: number; subject?: string }): Promise<ReviewQuestion[]> => {
    const qs = new URLSearchParams();
    if (params?.limit) qs.set('limit', String(params.limit));
    if (params?.subject) qs.set('subject', params.subject);
    return request(`/question-bank/review/queue?${qs.toString()}`);
  },

  reviewStats: (): Promise<{ total: number; flagged: number; approved: number; rejected: number }> =>
    request('/question-bank/review/stats'),

  reviewDecision: (id: string, decision: { decision: 'approve' | 'reject' | 'edit'; notes?: string; correctedTextLatex?: string }): Promise<unknown> =>
    request(`/question-bank/review/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(decision),
    }),
};
