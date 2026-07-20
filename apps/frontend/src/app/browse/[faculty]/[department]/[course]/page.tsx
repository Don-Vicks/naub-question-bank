'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Filter, X, FileText } from 'lucide-react';
import { usePapers, useCourse } from '@/lib/hooks/useQuestionBank';
import { PaperCard } from '@/components/ui/PaperCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { getFacultyById, getDepartmentById, EXAM_TYPES } from '@/lib/naub-data';

export default function CoursePapersPage() {
  const { faculty, department, course } = useParams<{
    faculty: string;
    department: string;
    course: string;
  }>();
  const router = useRouter();
  const [examFilter, setExamFilter] = useState<string>('all');
  const [sessionFilter, setSessionFilter] = useState<string>('all');

  const { data: courseInfo } = useCourse(course);
  const { data: papers, isLoading } = usePapers({ courseId: course });

  const facultyInfo = getFacultyById(faculty);
  const deptInfo = getDepartmentById(department);

  const filteredPapers = papers?.filter((p) => {
    if (examFilter !== 'all' && p.examType !== examFilter) return false;
    if (sessionFilter !== 'all' && p.session !== sessionFilter) return false;
    return true;
  });

  const sessions = [...new Set(papers?.map((p) => p.session) ?? [])].sort();
  const hasFilters = examFilter !== 'all' || sessionFilter !== 'all';

  return (
    <div className="page-desktop">
      <div className="page-header lg:rounded-card-xl lg:mx-0 lg:my-6">
        <button onClick={() => router.back()} aria-label="Back" className="btn-icon text-paper flex-shrink-0 transition-transform duration-200 hover:scale-110 active:scale-95">
          <ArrowLeft size={20} strokeWidth={1.75} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="page-header-sub">{courseInfo?.code ?? course}</p>
          <p className="page-header-title truncate">{courseInfo?.title ?? 'Loading...'}</p>
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
          <Link href={`/browse/${faculty}/${department}`} className="hover:text-naub-green">
            {deptInfo?.name}
          </Link>
          <span>/</span>
          <span className="text-ink font-medium">{courseInfo?.code ?? course}</span>
        </nav>

        {/* Filters */}
        <div className="mb-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-muted py-1">
            <Filter size={14} strokeWidth={1.75} />
            <span className="text-caption font-semibold uppercase tracking-wider">Filter</span>
          </div>
          <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <select
              value={examFilter}
              onChange={(e) => setExamFilter(e.target.value)}
              className="select-field sm:w-auto text-[13px] py-2.5 min-h-[44px]"
            >
              <option value="all">All exam types</option>
              {EXAM_TYPES.map((et) => (
                <option key={et} value={et}>{et}</option>
              ))}
            </select>

            {sessions.length > 0 && (
              <select
                value={sessionFilter}
                onChange={(e) => setSessionFilter(e.target.value)}
                className="select-field sm:w-auto text-[13px] py-2.5 min-h-[44px]"
              >
                <option value="all">All sessions</option>
                {sessions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            )}

            {hasFilters && (
              <button
                onClick={() => { setExamFilter('all'); setSessionFilter('all'); }}
                className="flex items-center justify-center gap-1 text-caption font-semibold text-army transition-colors hover:text-army-700 min-h-[40px] px-3 rounded-xl bg-army-50 border border-army-100"
              >
                <X size={14} strokeWidth={2} />
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Papers grid */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 stagger">
          {isLoading &&
            [0, 1, 2].map((i) => (
              <div key={i} className="skeleton h-[88px] rounded-card-xl" />
            ))}

          {filteredPapers?.map((paper) => (
            <PaperCard key={paper.id} paper={paper} />
          ))}

          {filteredPapers?.length === 0 && !isLoading && (
            <EmptyState
              icon={FileText}
              title="No papers available"
              description={hasFilters ? 'No question papers match your selected filters. Try resetting the filters.' : 'No question papers have been uploaded for this course yet.'}
              actionLabel={hasFilters ? 'Reset Filters' : 'Upload a Paper'}
              onAction={hasFilters ? () => { setExamFilter('all'); setSessionFilter('all'); } : undefined}
              actionHref={hasFilters ? undefined : '/upload'}
            />
          )}
        </div>
      </div>
    </div>
  );
}
