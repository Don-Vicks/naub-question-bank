'use client';

import { useQuery } from '@tanstack/react-query';
import { FileText, CircleHelp, AlertTriangle, Users, Activity } from 'lucide-react';
import clsx from 'clsx';
import { api, AdminOverview } from '@/lib/api';

function formatTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const ACTION_CONFIG: Record<string, { bg: string; text: string }> = {
  'Paper processed': { bg: 'bg-naub-green-light', text: 'text-naub-green' },
  'Paper uploaded': { bg: 'bg-naub-teal/10', text: 'text-naub-teal' },
  'Processing failed': { bg: 'bg-terracotta-50', text: 'text-terracotta' },
};

export default function AdminOverviewPage() {
  const { data, isLoading, error } = useQuery<AdminOverview>({
    queryKey: ['admin', 'overview'],
    queryFn: () => api.adminOverview(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-army border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-card-xl border border-army-100 bg-army-50 p-6 text-center text-sm text-army">
        Failed to load dashboard data
      </div>
    );
  }

  const { stats, recentActivity } = data!;

  const statCards = [
    { label: 'Total Papers', value: stats.totalPapers, sub: `+${stats.recentPapers} this week`, icon: FileText, gradient: 'from-army to-army-700' },
    { label: 'Total Questions', value: stats.totalQuestions, sub: `${stats.approvedQuestions} approved`, icon: CircleHelp, gradient: 'from-verified to-verified-600' },
    { label: 'Flagged', value: stats.flaggedQuestions, sub: `${stats.pendingQuestions} pending`, icon: AlertTriangle, gradient: 'from-terracotta to-terracotta-500' },
    { label: 'Users', value: stats.totalUsers, sub: `+${stats.recentUsers} this week`, icon: Users, gradient: 'from-ink to-ink-light' },
  ];

  return (
    <div className="page-desktop">
      <div className="mb-6">
        <h1 className="text-title text-ink">Dashboard</h1>
        <p className="text-body text-muted mt-1">Overview of your question bank</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 stagger">
        {statCards.map((s) => (
          <div key={s.label} className="card-elevated p-5">
            <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${s.gradient} shadow-card`}>
              <s.icon size={18} strokeWidth={1.75} className="text-white" />
            </div>
            <p className="text-display-lg text-ink">{s.value}</p>
            <p className="text-caption text-muted mt-1">{s.label}</p>
            <p className="text-[11px] text-muted/60 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <div className="section-header">
          <h2 className="section-title flex items-center gap-2">
            <Activity size={14} strokeWidth={2} />
            Recent Activity
          </h2>
        </div>
        <div className="rounded-card-xl border border-line bg-white shadow-card overflow-hidden">
          {recentActivity.length === 0 ? (
            <p className="py-12 text-center text-body text-muted">No activity yet</p>
          ) : (
            recentActivity.map((item, i) => {
              const actionConfig = ACTION_CONFIG[item.action] ?? { bg: 'bg-ink/5', text: 'text-ink' };
              return (
                <div
                  key={item.id}
                  className={clsx(
                    'flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-paper',
                    i < recentActivity.length - 1 && 'border-b border-line-light',
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={clsx('inline-flex items-center rounded-lg px-2.5 py-1 text-[11px] font-semibold', actionConfig.bg, actionConfig.text)}>
                      {item.action}
                    </span>
                    <span className="text-body text-ink truncate">{item.detail}</span>
                  </div>
                  <span className="flex-shrink-0 text-[11px] text-muted font-medium ml-3">
                    {formatTimeAgo(item.time)}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
