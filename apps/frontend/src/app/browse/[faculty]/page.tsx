'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useDepartments } from '@/lib/hooks/useQuestionBank';
import { getFacultyById } from '@/lib/naub-data';

export default function FacultyPage() {
  const { faculty } = useParams<{ faculty: string }>();
  const router = useRouter();
  const { data: departments, isLoading } = useDepartments(faculty);
  const facultyInfo = getFacultyById(faculty);

  return (
    <div className="page-desktop">
      <div className="page-header lg:rounded-card-xl lg:mx-0 lg:my-6">
        <button onClick={() => router.back()} aria-label="Back" className="lg:hidden btn-icon text-paper">
          <ArrowLeft size={20} strokeWidth={1.75} />
        </button>
        <div>
          <p className="page-header-sub">Faculty</p>
          <p className="page-header-title">{facultyInfo?.name ?? faculty}</p>
        </div>
      </div>

      <div className="content-area lg:px-8">
        <nav className="breadcrumb">
          <Link href="/" className="hover:text-naub-green">Home</Link>
          <span>/</span>
          <Link href="/browse" className="hover:text-naub-green">Browse</Link>
          <span>/</span>
          <span className="text-ink font-medium">{facultyInfo?.abbreviation ?? faculty}</span>
        </nav>

        <p className="section-title mb-3">Departments</p>

        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 lg:grid-cols-3 stagger">
          {isLoading &&
            [0, 1, 2].map((i) => (
              <div key={i} className="skeleton h-[72px] rounded-card-xl" />
            ))}

          {departments?.map((dept) => (
            <Link
              key={dept.id}
              href={`/browse/${faculty}/${dept.id}`}
              className="card-interactive group flex items-center justify-between p-4"
            >
              <p className="text-heading text-ink">{dept.name}</p>
              <ChevronRight
                size={18}
                strokeWidth={2}
                className="text-muted/30 transition-all duration-200 group-hover:translate-x-1 group-hover:text-naub-green"
              />
            </Link>
          ))}

          {departments?.length === 0 && (
            <p className="col-span-full mt-12 text-center text-sm text-muted">
              No departments found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
