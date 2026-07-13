'use client';

import { IconFlame, IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';
import { useCourses } from '@/lib/hooks/useQuestionBank';
import { CourseCard } from '@/components/ui/CourseCard';

export default function HomePage() {
  const { data: courses, isLoading } = useCourses();

  return (
    <div>
      <header className="flex items-center justify-between bg-ink px-4 pb-4 pt-6 md:rounded-card md:px-6 md:py-5">
        <div>
          <p className="text-xs text-paper/70">Good evening</p>
          <p className="mt-0.5 text-base font-medium text-paper">Victor</p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-marigold px-2.5 py-1 text-xs font-medium text-marigold-text">
          <IconFlame size={14} stroke={1.75} />3
        </div>
      </header>

      <div className="px-4 py-4 md:px-0 md:py-6">
        {/* Continue card - swap the hardcoded href/course once "last
            viewed" tracking exists */}
        <Link
          href="/course/swe218"
          className="flex items-center gap-3 rounded-card border border-line bg-white p-3 md:max-w-md"
        >
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-marigold text-[12px] font-medium text-marigold-text">
            SWE
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium text-ink">Continue: SWE218</p>
            <p className="mt-0.5 text-[11.5px] text-muted">
              End of Semester 2023/2024 — Q3 of 20
            </p>
          </div>
          <IconChevronRight size={16} stroke={1.75} className="text-muted" />
        </Link>

        <p className="mb-2 mt-4 text-xs font-medium text-muted md:mt-6">
          Your courses
        </p>

        {isLoading && (
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-[repeat(auto-fill,minmax(160px,1fr))]">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-[100px] animate-pulse rounded-card border border-line bg-white"
              />
            ))}
          </div>
        )}

        {courses && (
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-[repeat(auto-fill,minmax(160px,1fr))]">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
