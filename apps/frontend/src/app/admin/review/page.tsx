'use client';

import { Construction } from 'lucide-react';

export default function AdminReviewPage() {
  return (
    <div className="page-desktop">
      <div className="mb-5">
        <h1 className="text-title text-ink">Review Queue</h1>
        <p className="text-body text-muted mt-1">Review flagged questions from AI extraction</p>
      </div>

      <div className="rounded-card-xl border border-line bg-white py-16 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-terracotta-50 border border-terracotta/15">
          <Construction size={28} strokeWidth={1.5} className="text-terracotta/50" />
        </div>
        <p className="text-heading text-ink">Coming soon</p>
        <p className="text-body text-muted mt-1">
          Question review will be available once we add AI extraction. For now, papers are stored and browsed directly.
        </p>
      </div>
    </div>
  );
}
