import { Course, QuestionPaper, UploadResult } from './types';
import { type Faculty, type Department } from './naub-data';

export type { UploadResult };

function isLocalLanHost(hostname: string): boolean {
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.local')) return true;
  return /^(192\.168|10|172\.(1[6-9]|2\d|3[01]))\.\d{1,3}\.\d{1,3}$/.test(hostname);
}

function getApiBaseUrl(): string {
  let envUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (typeof window !== 'undefined' && window.location?.hostname) {
    const hostname = window.location.hostname;
    // Upgrade http:// to https:// on secure pages if envUrl is non-localhost
    if (window.location.protocol === 'https:' && envUrl?.startsWith('http://') && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
      envUrl = envUrl.replace('http://', 'https://');
    }

    // If accessing on local Wi-Fi / LAN IP (e.g. 192.168.x.x) and envUrl is unset or pointing to localhost:
    if (isLocalLanHost(hostname) && hostname !== 'localhost' && hostname !== '127.0.0.1') {
      if (!envUrl || envUrl.includes('localhost') || envUrl.includes('127.0.0.1')) {
        const protocol = window.location.protocol;
        return `${protocol}//${hostname}:3000/api`;
      }
    }
  }

  const url = envUrl ?? 'http://localhost:3000/api';
  return url.replace(/\/+$/, '');
}

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
  const apiBase = getApiBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${apiBase}${cleanPath}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init?.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(url, { ...init, headers });
  } catch (e: any) {
    console.error('[api] fetch failed for', url, ':', e?.name, e?.message);
    throw new Error(
      `Could not connect to backend at ${url}. Check if the server is running and NEXT_PUBLIC_API_BASE_URL is configured. (${e?.message ?? 'Failed to fetch'})`,
    );
  }

  if (!res.ok) {
    let errorMessage = `API error ${res.status}`;
    try {
      const data = await res.json();
      if (data?.message) {
        errorMessage = Array.isArray(data.message) ? data.message.join(', ') : data.message;
      }
    } catch {
      const text = await res.text();
      if (text) errorMessage = text;
    }

    if (res.status === 401 && !cleanPath.startsWith('/auth/login') && !cleanPath.startsWith('/auth/register')) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('padi-auth');
        window.location.href = `/login?message=${encodeURIComponent('Your session has expired. Please sign in again.')}`;
      }
    }

    throw new Error(errorMessage);
  }

  return res.json();
}

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
  uploaderId?: string | null;
  uploaderName?: string | null;
  uploaderEmail?: string | null;
  fileUrl?: string | null;
  errorMessage?: string | null;
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

  getPaperDownloadUrl: (paperId: string): string => {
    const apiBase = getApiBaseUrl();
    return `${apiBase}/question-bank/papers/${paperId}/download`;
  },

  search: (query: string): Promise<QuestionPaper[]> =>
    request<QuestionPaper[]>(
      `/question-bank/search?q=${encodeURIComponent(query)}`,
    ),

  uploadPaper: async (formData: FormData): Promise<UploadResult> => {
    const token = getToken();
    const apiBase = getApiBaseUrl();
    const url = `${apiBase}/question-bank/documents/upload-batch`;

    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    let res: Response;
    try {
      res = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });
    } catch (e: any) {
      throw new Error(
        `Could not connect to server at ${apiBase}. Is the backend running? (${e?.message ?? 'unknown'})`,
      );
    }

    if (!res.ok) {
      const body = await res.text();
      throw new Error(body || `Upload failed: ${res.status}`);
    }
    return res.json();
  },

  getUploadStatus: (documentId: string) =>
    request(`/question-bank/documents/${documentId}/status`),

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

  forgotPassword: (email: string): Promise<{ message: string; sent: boolean }> =>
    request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  updateProfile: (data: { name?: string; facultyId?: string; departmentId?: string; level?: string }): Promise<{ id: string; email: string; name: string; role: string }> =>
    request('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

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

  // ── Review & Moderation endpoints ──

  getPendingDocuments: (): Promise<Array<{
    id: string;
    title: string;
    originalFilename: string;
    mimeType: string;
    fileUrl: string;
    courseCode: string;
    facultyId: string;
    departmentId: string;
    level: string;
    examType: string;
    session: string;
    status: string;
    uploaderId: string;
    uploadedAt: string;
  }>> => request('/question-bank/documents/pending'),

  approveDocument: (id: string): Promise<any> =>
    request(`/question-bank/documents/${id}/approve`, { method: 'POST' }),

  approveBatchDocuments: (ids?: string[]): Promise<{ approvedCount: number; ids: string[] }> =>
    request('/question-bank/documents/approve-batch', {
      method: 'POST',
      body: JSON.stringify({ ids }),
    }),

  rejectDocument: (id: string): Promise<any> =>
    request(`/question-bank/documents/${id}/reject`, { method: 'POST' }),

  getReviewQueue: (params?: { limit?: number; subject?: string }) => {
    const qs = new URLSearchParams();
    if (params?.limit) qs.set('limit', String(params.limit));
    if (params?.subject) qs.set('subject', params.subject);
    return request(`/question-bank/review/queue?${qs.toString()}`);
  },

  getReviewStats: () =>
    request<{ total: number; flagged: number; approved: number; rejected: number }>('/question-bank/review/stats'),

  submitReviewDecision: (id: string, body: { decision: 'approve' | 'reject' | 'edit'; correctedTextLatex?: string; notes?: string }) =>
    request(`/question-bank/review/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
};
