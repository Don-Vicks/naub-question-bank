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

export function useQuestionsByPaper(paperId: string) {
  return useQuery({
    queryKey: ['questions', paperId],
    queryFn: () => api.getQuestionsByPaper(paperId),
    enabled: Boolean(paperId),
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

export function useAllQuestions() {
  return useQuery({
    queryKey: ['allQuestions'],
    queryFn: async () => {
      const courses = await api.getCourses();
      const allQuestions = [];
      for (const course of courses.slice(0, 10)) {
        try {
          const papers = await api.getPapers({ courseId: course.id });
          for (const paper of papers.slice(0, 3)) {
            try {
              const questions = await api.getQuestionsByPaper(paper.id);
              allQuestions.push(...questions);
            } catch { /* skip */ }
          }
        } catch { /* skip */ }
      }
      return allQuestions;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useSearch(query: string) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => api.search(query),
    enabled: query.trim().length > 1,
  });
}
