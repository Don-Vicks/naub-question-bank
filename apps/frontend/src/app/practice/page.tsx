'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Wrench } from 'lucide-react';

export default function PracticePage() {
  const router = useRouter();

  return (
    <div className="page-desktop">
      <div className="page-header lg:rounded-card-xl lg:mx-0 lg:my-6">
        <button onClick={() => router.back()} aria-label="Back" className="md:hidden btn-icon text-paper">
          <ArrowLeft size={20} strokeWidth={1.75} />
        </button>
        <div>
          <p className="page-header-title">Practice</p>
          <p className="page-header-sub">Test yourself with past questions</p>
        </div>
      </div>

      <div className="content-area">
        <div className="flex flex-col items-center gap-4 py-16 text-center animate-fade-in-up">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-naub-green-light border border-naub-green/15">
            <Wrench size={28} strokeWidth={1.5} className="text-naub-green/50" />
          </div>
          <div>
            <p className="text-heading text-ink">Coming soon</p>
            <p className="text-body text-muted mt-1.5 max-w-xs">
              Practice mode will let you test yourself with extracted questions from past papers. This feature is coming soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
