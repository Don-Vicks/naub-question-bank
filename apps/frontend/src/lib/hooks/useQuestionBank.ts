import { useQuery } from '@tanstack/react-query';
import { api } from '../api';

export function useFaculties() {
  return useQuery({
    queryKey: ['faculties'],
    queryFn: api.getFaculties,
    staleTime: Infinity,
  });
}

export function useDepartments(facultyId: string) {
  return useQuery({
    queryKey: ['departments', facultyId],
    queryFn: () => api.getDepartments(facultyId),
    enabled: Boolean(facultyId),
    staleTime: Infinity,
  });
}

export function useCourses(params?: {
  facultyId?: string;
  departmentId?: string;
  level?: string;
}) {
  return useQuery({
    queryKey: ['courses', params],
    queryFn: () => api.getCourses(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCourse(courseId: string) {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: () => api.getCourse(courseId),
    enabled: Boolean(courseId),
  });
}

export function usePapers(params: {
  courseId?: string;
  facultyId?: string;
  departmentId?: string;
  level?: string;
}) {
  return useQuery({
    queryKey: ['papers', params],
    queryFn: () => api.getPapers(params),
    enabled: Boolean(params.courseId || params.facultyId || params.departmentId),
  });
}

export function usePaper(paperId: string) {
  return useQuery({
    queryKey: ['paper', paperId],
    queryFn: () => api.getPaper(paperId),
    enabled: Boolean(paperId),
  });
}

export function useSearch(query: string) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => api.search(query),
    enabled: query.trim().length > 1,
  });
}
