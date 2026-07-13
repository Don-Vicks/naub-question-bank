import Link from 'next/link';
import { Course } from '@/lib/types';

export function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      href={`/course/${course.id}`}
      className="rounded-card border border-line bg-white p-3 transition-colors active:bg-paper md:hover:border-ink/20"
    >
      <div className="flex h-8 w-11 items-center justify-center rounded-lg bg-ink">
        <span className="text-[11px] font-medium text-paper">
          {course.code.replace(/[0-9]/g, '')}
        </span>
      </div>
      <p className="mt-2.5 text-[13px] font-medium text-ink">{course.code}</p>
      <p className="mt-0.5 truncate text-[11px] text-muted">{course.title}</p>
      <p className="mt-1 text-[10.5px] text-muted">{course.level}</p>
      {typeof course.progressPercent === 'number' && (
        <div className="mt-2 h-1 w-full rounded-full bg-line">
          <div
            className="h-1 rounded-full bg-marigold"
            style={{ width: `${course.progressPercent}%` }}
          />
        </div>
      )}
    </Link>
  );
}
