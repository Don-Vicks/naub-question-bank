'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';
import { useCourses } from '@/lib/hooks/useQuestionBank';
import { getFacultyById, getDepartmentById } from '@/lib/naub-data';

export default function DepartmentPage() {
  const { faculty, department } = useParams<{
    faculty: string;
    department: string;
  }>();
  const router = useRouter();
  const { data: courses, isLoading } = useCourses({
    facultyId: faculty,
    departmentId: department,
  });
  const facultyInfo = getFacultyById(faculty);
  const deptInfo = getDepartmentById(department);

  return (
    <div className="page-desktop">
      <div className="page-header lg:rounded-card-xl lg:mx-0 lg:my-6">
        <button onClick={() => router.back()} aria-label="Back" className="lg:hidden btn-icon text-paper">
          <ArrowLeft size={20} strokeWidth={1.75} />
        </button>
        <div>
          <p className="page-header-sub">{facultyInfo?.abbreviation}</p>
          <p className="page-header-title">{deptInfo?.name ?? department}</p>
        </div>
      </div>

      <div className="content-area lg:px-8">
        <nav className="breadcrumb">
          <Link href="/" className="hover:text-naub-green">Home</Link>
          <span>/</span>
          <Link href="/browse" className="hover:text-naub-green">Browse</Link>
          <span>/</span>
          <Link href={`/browse/${faculty}`} className="hover:text-naub-green">
            {facultyInfo?.abbreviation}
          </Link>
          <span>/</span>
          <span className="text-ink font-medium">{deptInfo?.name ?? department}</span>
        </nav>

        <p className="section-title mb-3">Courses</p>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 stagger">
          {isLoading &&
            [0, 1, 2].map((i) => (
              <div key={i} className="skeleton h-[88px] rounded-card-xl" />
            ))}

          {!isLoading && courses?.map((course) => (
            <Link
              key={course.id}
              href={`/browse/${faculty}/${department}/${course.code}`}
              className="card-interactive group p-4"
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-heading text-ink truncate">{course.code}</p>
                  <p className="text-caption text-muted mt-0.5 truncate">
                    {course.title}
                  </p>
                </div>
                <span className="flex-shrink-0 text-overline text-muted ml-2">
                  {course.level}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-1.5">
                <div className="h-1 w-1 rounded-full bg-naub-green" />
                <p className="text-[11px] text-muted font-medium">
                  {course.questionPaperCount}{' '}
                  {course.questionPaperCount === 1 ? 'paper' : 'papers'}
                </p>
              </div>
            </Link>
          ))}

          {!isLoading && courses?.length === 0 && (
            <p className="col-span-full mt-12 text-center text-sm text-muted">
              No courses found for this department.
            </p>
          )}

          {!isLoading && !courses && (
            <div className="col-span-full flex flex-col items-center gap-3 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-paper-warm">
                <FileText size={24} strokeWidth={1.75} className="text-muted/40" />
              </div>
              <div>
                <p className="text-heading text-ink font-medium">No courses yet</p>
                <p className="text-caption text-muted mt-1">
                  Courses will appear here once question papers are uploaded for this department.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
