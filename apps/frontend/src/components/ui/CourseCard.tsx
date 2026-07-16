import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Course } from '@/lib/types';

export function CourseCard({ course }: { course: Course }) {
  const deptPrefix = course.code.replace(/[0-9]/g, '');

  return (
    <Link
      href={`/browse/${course.facultyId}/${course.departmentId}/${course.id}`}
      className="card-interactive group p-4"
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-ink to-ink-light text-[10px] font-bold text-paper">
              {deptPrefix}
            </div>
            <div className="min-w-0">
              <p className="text-heading text-ink truncate">{course.code}</p>
              <p className="text-caption text-muted truncate">{course.title}</p>
            </div>
          </div>
        </div>
        <ArrowRight
          size={14}
          strokeWidth={2}
          className="mt-1 flex-shrink-0 text-muted/30 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-ink"
        />
      </div>

      <div className="mt-3 flex items-center gap-3 pl-[46px]">
        <span className="text-overline text-muted">{course.level}</span>
        <div className="h-3 w-px bg-line" />
        <div className="flex items-center gap-1.5">
          <div className="h-1 w-1 rounded-full bg-marigold" />
          <p className="text-[11px] text-muted font-medium">
            {course.questionPaperCount} {course.questionPaperCount === 1 ? 'paper' : 'papers'}
          </p>
        </div>
      </div>
    </Link>
  );
}
