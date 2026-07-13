'use client';

import { useParams, useRouter } from 'next/navigation';
import { IconArrowLeft } from '@tabler/icons-react';
import { useQuestionsByCourse } from '@/lib/hooks/useQuestionBank';
import { QuestionCard } from '@/components/ui/QuestionCard';

export default function CoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();
  const { data: questions, isLoading } = useQuestionsByCourse(courseId);

  return (
    <div>
      <header className="flex items-center gap-3 bg-ink px-4 py-4 md:rounded-card md:px-6 md:py-4">
        <button onClick={() => router.back()} aria-label="Back" className="md:hidden">
          <IconArrowLeft size={18} stroke={1.75} className="text-paper" />
        </button>
        <p className="text-[13px] font-medium uppercase text-paper">
          {courseId}
        </p>
      </header>

      {/* Single column on mobile (list is the whole screen), multi-column
          once there's room to spare on desktop - these cards are compact
          enough to tile rather than stretch full-width awkwardly. */}
      <div className="grid grid-cols-1 gap-2 p-4 md:grid-cols-2 md:gap-3 md:px-0 md:py-6 lg:grid-cols-3">
        {isLoading &&
          [0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-card border border-line bg-white"
            />
          ))}

        {questions?.map((q) => (
          <QuestionCard key={q.id} question={q} />
        ))}

        {questions?.length === 0 && (
          <p className="col-span-full mt-8 text-center text-sm text-muted">
            No questions here yet.
          </p>
        )}
      </div>
    </div>
  );
}
