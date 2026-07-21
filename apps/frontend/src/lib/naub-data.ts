export interface Faculty {
  id: string
  name: string
  abbreviation: string
}

export interface Department {
  id: string
  name: string
  facultyId: string
}

export const FACULTIES: Faculty[] = [
  {
    id: 'famss',
    name: 'Faculty of Arts, Management and Social Sciences',
    abbreviation: 'FAMSS',
  },
  { id: 'fcom', name: 'Faculty of Computing', abbreviation: 'FCOM' },
  { id: 'feng', name: 'Faculty of Engineering', abbreviation: 'FENG' },
  {
    id: 'fevs',
    name: 'Faculty of Environmental Sciences',
    abbreviation: 'FEVS',
  },
  {
    id: 'fnas',
    name: 'Faculty of Natural and Applied Sciences',
    abbreviation: 'FNAS',
  },
]

export const DEPARTMENTS: Department[] = [
  // FAMSS
  { id: 'accounting', name: 'Accounting', facultyId: 'famss' },
  { id: 'economics', name: 'Economics', facultyId: 'famss' },
  { id: 'management', name: 'Management', facultyId: 'famss' },
  {
    id: 'transport-logistics',
    name: 'Transport and Logistics Management',
    facultyId: 'famss',
  },
  {
    id: 'criminology',
    name: 'Criminology and Security Studies',
    facultyId: 'famss',
  },
  { id: 'geography', name: 'Geography', facultyId: 'famss' },
  {
    id: 'international-relations',
    name: 'International Relations',
    facultyId: 'famss',
  },
  {
    id: 'peace-conflict',
    name: 'Peace Studies and Conflict Resolution',
    facultyId: 'famss',
  },
  { id: 'political-science', name: 'Political Science', facultyId: 'famss' },
  { id: 'psychology', name: 'Psychology', facultyId: 'famss' },
  { id: 'sociology', name: 'Sociology', facultyId: 'famss' },
  { id: 'arabic', name: 'Arabic', facultyId: 'famss' },
  { id: 'english', name: 'English', facultyId: 'famss' },
  { id: 'military-history', name: 'Military History', facultyId: 'famss' },

  // FCOM
  { id: 'computer-science', name: 'Computer Science', facultyId: 'fcom' },
  { id: 'cyber-security', name: 'Cyber Security', facultyId: 'fcom' },
  { id: 'information-system', name: 'Information System', facultyId: 'fcom' },
  {
    id: 'information-technology',
    name: 'Information Technology',
    facultyId: 'fcom',
  },
  {
    id: 'software-engineering',
    name: 'Software Engineering',
    facultyId: 'fcom',
  },

  // FENG
  { id: 'civil-engineering', name: 'Civil Engineering', facultyId: 'feng' },
  {
    id: 'electrical-electronic',
    name: 'Electrical and Electronic Engineering',
    facultyId: 'feng',
  },
  {
    id: 'mechanical-engineering',
    name: 'Mechanical Engineering',
    facultyId: 'feng',
  },

  // FEVS
  { id: 'building', name: 'Building', facultyId: 'fevs' },
  {
    id: 'environmental-management',
    name: 'Environmental Management',
    facultyId: 'fevs',
  },
  { id: 'estate-management', name: 'Estate Management', facultyId: 'fevs' },
  {
    id: 'survey-geoinformatics',
    name: 'Survey and Geo-Informatics',
    facultyId: 'fevs',
  },
  {
    id: 'urban-regional-planning',
    name: 'Urban and Regional Planning',
    facultyId: 'fevs',
  },

  // FNAS
  { id: 'biology', name: 'Biology', facultyId: 'fnas' },
  { id: 'chemistry', name: 'Chemistry', facultyId: 'fnas' },
  { id: 'mathematics', name: 'Mathematics', facultyId: 'fnas' },
  { id: 'physics', name: 'Physics', facultyId: 'fnas' },
]

export const LEVELS = ['100L', '200L', '300L', '400L', '500L'] as const

export type Level = (typeof LEVELS)[number]

export const EXAM_TYPES = [
  'CA',
  'Mid Semester',
  'End of Semester',
  'Practical',
] as const

export type ExamType = (typeof EXAM_TYPES)[number]

export const ACADEMIC_SESSIONS = [
  '2018/2019',
  '2019/2020',
  '2020/2021',
  '2021/2022',
  '2022/2023',
  '2023/2024',
  '2024/2025',
  '2025/2026',
  '2025B/2026',
] as const

export function getDepartmentsByFaculty(facultyId: string): Department[] {
  return DEPARTMENTS.filter((d) => d.facultyId === facultyId)
}

export function getFacultyById(id: string): Faculty | undefined {
  return FACULTIES.find((f) => f.id === id)
}

export function getDepartmentById(id: string): Department | undefined {
  return DEPARTMENTS.find((d) => d.id === id)
}

export function getDepartmentCountForFaculty(facultyId: string): number {
  return DEPARTMENTS.filter((d) => d.facultyId === facultyId).length
}
