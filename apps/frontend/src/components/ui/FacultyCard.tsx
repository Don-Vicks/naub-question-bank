import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Faculty } from '@/lib/naub-data';
import { getDepartmentCountForFaculty } from '@/lib/naub-data';

export function FacultyCard({ faculty }: { faculty: Faculty }) {
  const deptCount = getDepartmentCountForFaculty(faculty.id);

  return (
    <Link
      href={`/browse/${faculty.id}`}
      className="card-interactive group relative overflow-hidden p-5"
    >
      {/* Animated left accent bar */}
      <div className="accent-bar" />

      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-army/5 via-transparent to-naub-gold/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Shine sweep on hover */}
      <div className="absolute -left-full top-0 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-[300%]" />

      <div className="relative">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-army/5 to-army/10 transition-all duration-300 group-hover:from-army group-hover:to-army/80 group-hover:shadow-glow-sm group-hover:scale-110">
          <span className="text-xs font-bold text-army transition-colors duration-300 group-hover:text-white">
            {faculty.abbreviation}
          </span>
        </div>

        <p className="mt-4 text-heading text-ink transition-colors duration-200 group-hover:text-ink">
          {faculty.name}
        </p>

        <div className="mt-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="h-1 w-1 rounded-full bg-naub-green transition-all duration-300 group-hover:w-1.5 group-hover:shadow-glow-green" />
            <p className="text-caption text-muted">
              {deptCount} {deptCount === 1 ? 'department' : 'departments'}
            </p>
          </div>
          <ArrowRight
            size={14}
            strokeWidth={2}
            className="text-muted/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-army"
          />
        </div>
      </div>
    </Link>
  );
}
