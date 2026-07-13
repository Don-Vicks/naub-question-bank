import { useQuery } from '@tanstack/react-query';
import { api } from '../api';

export function useCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: api.getCourses,
    staleTime: 5 * 60 * 1000,
  });
}

export function useQuestionsByCourse(
  courseId: string,
  params?: { examType?: string; session?: string },
) {
  return useQuery({
    queryKey: ['questions', courseId, params],
    queryFn: () => api.getQuestionsByCourse(courseId, params),
    enabled: Boolean(courseId),
  });
}

export function useQuestion(id: string) {
  return useQuery({
    queryKey: ['question', id],
    queryFn: () => api.getQuestion(id),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
  });
}

export function useSearch(query: string) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => api.search(query),
    enabled: query.trim().length > 1,
  });
}
