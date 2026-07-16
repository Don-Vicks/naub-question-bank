'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, X, Eye, AlertTriangle } from 'lucide-react';
import { api, ReviewQuestion } from '@/lib/api';

export default function AdminReviewPage() {
  const queryClient = useQueryClient();
  const [previewId, setPreviewId] = useState<string | null>(null);

  const { data: questions, isLoading, error } = useQuery<ReviewQuestion[]>({
    queryKey: ['admin', 'review-queue'],
    queryFn: () => api.reviewQueue({ limit: 50 }),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => api.reviewDecision(id, { decision: 'approve' }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'review-queue'] }); queryClient.invalidateQueries({ queryKey: ['admin', 'overview'] }); },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => api.reviewDecision(id, { decision: 'reject' }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'review-queue'] }); queryClient.invalidateQueries({ queryKey: ['admin', 'overview'] }); },
  });

  if (isLoading) return <div className="flex items-center justify-center py-20"><div className="h-6 w-6 animate-spin rounded-full border-2 border-army border-t-transparent" /></div>;
  if (error) return <div className="rounded-card-xl border border-army-100 bg-army-50 p-6 text-center text-sm text-army">Failed to load review queue</div>;

  const items = questions ?? [];

  return (
    <div className="page-desktop">
      <div className="mb-5">
        <h1 className="text-title text-ink">Review Queue</h1>
        <p className="text-body text-muted mt-1">{items.length} flagged {items.length === 1 ? 'question' : 'questions'} need attention</p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-card-xl border border-line bg-white py-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-verified-50 border border-verified-100">
            <Check size={28} strokeWidth={2} className="text-verified" />
          </div>
          <p className="text-heading text-ink">All caught up!</p>
          <p className="text-body text-muted mt-1">No flagged questions to review.</p>
        </div>
      ) : (
        <div className="space-y-3 stagger">
          {items.map((q) => (
            <div key={q.id} className="rounded-card-xl border border-line bg-white p-5 shadow-card">
              <div className="mb-3 flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="badge-army">Q{q.questionNumber}</span>
                    <span className="text-caption text-muted font-medium truncate">
                      {q.sourceDocument.extractedSubject ?? q.sourceDocument.extractedTitle ?? q.sourceDocument.originalFilename}
                    </span>
                  </div>
                  <p className="mt-2.5 text-body leading-relaxed text-ink">{q.textRaw}</p>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg bg-army-50 px-2 py-1 flex-shrink-0">
                  <AlertTriangle size={12} className="text-army" />
                  <span className="text-[11px] font-semibold text-army">{Math.round(q.confidence * 100)}%</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => setPreviewId(previewId === q.id ? null : q.id)} className="btn-secondary !px-3 !py-2 !text-[12px] flex items-center gap-1.5">
                  <Eye size={14} strokeWidth={1.75} /> Source image
                </button>
                <button onClick={() => approveMutation.mutate(q.id)} disabled={approveMutation.isPending} className="flex items-center gap-1.5 rounded-xl bg-verified px-3.5 py-2 text-[12px] font-semibold text-white transition-all hover:shadow-elevated disabled:opacity-50">
                  <Check size={14} strokeWidth={2.5} /> Approve
                </button>
                <button onClick={() => rejectMutation.mutate(q.id)} disabled={rejectMutation.isPending} className="flex items-center gap-1.5 rounded-xl border border-army-200 px-3.5 py-2 text-[12px] font-semibold text-army transition-all hover:bg-army-50 disabled:opacity-50">
                  <X size={14} strokeWidth={2.5} /> Reject
                </button>
              </div>

              {previewId === q.id && (
                <div className="mt-4 rounded-xl border border-line bg-paper-warm p-3 animate-fade-in">
                  <p className="mb-2 text-overline text-muted">Source page image</p>
                  <div className="flex items-center justify-center rounded-xl bg-white">
                    {q.sourcePageImageUrl ? (
                      <img src={q.sourcePageImageUrl} alt={`Question ${q.questionNumber}`} className="max-h-64 rounded-xl object-contain" />
                    ) : (
                      <span className="py-8 text-caption text-muted">No image available</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
