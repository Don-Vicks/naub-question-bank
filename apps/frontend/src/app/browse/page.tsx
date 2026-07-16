'use client';

import { useFaculties } from '@/lib/hooks/useQuestionBank';
import { FacultyCard } from '@/components/ui/FacultyCard';
import { Building2 } from 'lucide-react';

export default function BrowsePage() {
  const { data: faculties, isLoading } = useFaculties();

  return (
    <div className="page-desktop">
      <div className="page-header lg:rounded-card-xl lg:mx-0 lg:my-6">
        <Building2 size={20} strokeWidth={1.75} className="text-paper/60" />
        <div>
          <p className="page-header-title">Browse by Faculty</p>
          <p className="page-header-sub">Nigerian Army University Biu</p>
        </div>
      </div>

      <div className="content-area">
        {isLoading && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton h-36 rounded-card-xl" />
            ))}
          </div>
        )}

        {faculties && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 stagger">
            {faculties.map((faculty) => (
              <FacultyCard key={faculty.id} faculty={faculty} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
