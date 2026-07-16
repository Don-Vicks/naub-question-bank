'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Filter, X } from 'lucide-react';
import { usePapers, useCourse } from '@/lib/hooks/useQuestionBank';
import { PaperCard } from '@/components/ui/PaperCard';
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
        <button onClick={() => router.back()} aria-label="Back" className="lg:hidden btn-icon text-paper">
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
        <div className="mb-5 flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-muted">
            <Filter size={14} strokeWidth={1.75} />
            <span className="text-caption font-medium">Filter</span>
          </div>
          <select
            value={examFilter}
            onChange={(e) => setExamFilter(e.target.value)}
            className="select-field w-auto text-[13px] py-2.5"
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
              className="select-field w-auto text-[13px] py-2.5"
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
              className="flex items-center gap-1 text-caption font-medium text-naub-green transition-colors hover:text-naub-teal"
            >
              <X size={12} strokeWidth={2} />
              Clear
            </button>
          )}
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
            <div className="col-span-full mt-12 flex flex-col items-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-naub-green-light border border-naub-green/10">
                <Filter size={20} strokeWidth={1.75} className="text-naub-green/50" />
              </div>
              <div>
                <p className="text-heading text-ink">No papers found</p>
                <p className="text-caption text-muted mt-1">
                  {hasFilters ? 'Try adjusting your filters' : 'No papers available for this course yet'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
