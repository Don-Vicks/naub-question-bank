'use client';

import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { FileText, Check, X, Clock, BarChart3 } from 'lucide-react';
import { api, AdminStats } from '@/lib/api';

export default function AdminStatsPage() {
  const { data: stats, isLoading, error } = useQuery<AdminStats>({
    queryKey: ['admin', 'stats'],
    queryFn: () => api.adminStats(),
  });

  if (isLoading) return <div className="flex items-center justify-center py-20"><div className="h-6 w-6 animate-spin rounded-full border-2 border-army border-t-transparent" /></div>;
  if (error) return <div className="rounded-card-xl border border-army-100 bg-army-50 p-6 text-center text-sm text-army">Failed to load statistics</div>;

  const s = stats!;

  const summaryCards = [
    { label: 'Total Papers', value: s.totalPapers, icon: FileText, gradient: 'from-army to-army-700' },
    { label: 'Total Questions', value: s.totalQuestions, icon: Check, gradient: 'from-verified to-verified-600' },
    { label: 'Extraction Rate', value: `${s.extractionRate}%`, icon: Clock, gradient: 'from-marigold to-marigold-500' },
    { label: 'Flagged', value: s.statusBreakdown.find((x) => x.label === 'Flagged')?.count ?? 0, icon: X, gradient: 'from-terracotta to-terracotta-500' },
  ];

  const totalQuestions = s.totalQuestions || 1;

  return (
    <div className="page-desktop">
      <div className="mb-6">
        <h1 className="text-title text-ink">Statistics</h1>
        <p className="text-body text-muted mt-1">Question bank metrics and breakdown</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 stagger">
        {summaryCards.map((c) => (
          <div key={c.label} className="card-elevated p-5">
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${c.gradient} shadow-card`}>
              <c.icon size={18} strokeWidth={1.75} className="text-white" />
            </div>
            <p className="text-display-lg text-ink">{c.value}</p>
            <p className="text-caption text-muted mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      {s.questionsBySubject.length > 0 && (
        <div className="mt-8">
          <div className="section-header"><h2 className="section-title flex items-center gap-2"><BarChart3 size={14} strokeWidth={2} /> Questions by Subject</h2></div>
          <div className="rounded-card-xl border border-line bg-white p-5 shadow-card">
            {s.questionsBySubject.slice(0, 10).map((subject, i) => (
              <div key={subject.subject} className={clsx('py-3', i < Math.min(s.questionsBySubject.length, 10) - 1 && 'border-b border-line-light')}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-body font-medium text-ink truncate">{subject.subject}</span>
                  <span className="text-caption text-muted">{subject.count} questions</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink/5">
                  <div className="h-full rounded-full bg-gradient-to-r from-army to-army-400 transition-all duration-500" style={{ width: `${(subject.count / totalQuestions) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <div className="section-header"><h2 className="section-title">Questions by Status</h2></div>
        <div className="rounded-card-xl border border-line bg-white p-5 shadow-card">
          <div className="mb-5 flex h-3 overflow-hidden rounded-full">
            {s.statusBreakdown.map((st) => (
              <div key={st.label} className={clsx('h-full transition-all duration-500', st.color === 'verified' && 'bg-verified', st.color === 'terracotta' && 'bg-terracotta', st.color === 'ink' && 'bg-ink/30', st.color === 'marigold' && 'bg-army')} style={{ width: `${(st.count / totalQuestions) * 100}%` }} />
            ))}
          </div>
          <div className="flex flex-wrap gap-5">
            {s.statusBreakdown.map((st) => (
              <div key={st.label} className="flex items-center gap-2.5">
                <div className={clsx('h-3 w-3 rounded-full', st.color === 'verified' && 'bg-verified', st.color === 'terracotta' && 'bg-terracotta', st.color === 'ink' && 'bg-ink/30', st.color === 'marigold' && 'bg-army')} />
                <span className="text-body text-muted">
                  {st.label}: <span className={clsx('font-semibold', st.color === 'verified' && 'text-verified', st.color === 'terracotta' && 'text-terracotta', st.color === 'ink' && 'text-ink', st.color === 'marigold' && 'text-army')}>{st.count}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {s.papersByStatus.length > 0 && (
        <div className="mt-8">
          <div className="section-header"><h2 className="section-title">Papers by Status</h2></div>
          <div className="rounded-card-xl border border-line bg-white p-5 shadow-card">
            {s.papersByStatus.map((ps, i) => (
              <div key={ps.status} className={clsx('flex items-center justify-between py-3', i < s.papersByStatus.length - 1 && 'border-b border-line-light')}>
                <span className="text-body font-medium text-ink capitalize">{ps.status}</span>
                <span className="text-body text-muted">{ps.count} papers</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
