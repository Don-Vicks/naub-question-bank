'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Construction } from 'lucide-react';

export default function QuestionPage() {
  const { questionId } = useParams<{ questionId: string }>();
  const router = useRouter();

  return (
    <div className="page-desktop">
      <div className="page-header lg:rounded-card-xl lg:mx-0 lg:my-6">
        <button onClick={() => router.back()} aria-label="Back" className="md:hidden btn-icon text-paper">
          <ArrowLeft size={20} strokeWidth={1.75} />
        </button>
        <div>
          <p className="page-header-title">Question</p>
        </div>
      </div>

      <div className="content-area">
        <div className="flex flex-col items-center gap-4 py-16 text-center animate-fade-in-up">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-terracotta-50 border border-terracotta/15">
            <Construction size={28} strokeWidth={1.5} className="text-terracotta/50" />
          </div>
          <div>
            <p className="text-heading text-ink">Coming soon</p>
            <p className="text-body text-muted mt-1.5 max-w-xs">
              Individual question views will be available once we add question extraction. For now, browse and view full papers directly.
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="btn-primary mt-2"
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}
