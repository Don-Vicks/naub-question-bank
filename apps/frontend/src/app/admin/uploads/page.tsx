'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { Search, Trash2, ExternalLink, Check, User, ChevronLeft, ChevronRight, FileText, Filter } from 'lucide-react';
import { api, AdminPaperItem, PaginatedResponse } from '@/lib/api';
import Link from 'next/link';

const STATUS_CONFIG: Record<string, { label: string; dotClass: string; badgeClass: string }> = {
  ready: { label: 'Ready', dotClass: 'bg-verified', badgeClass: 'badge-success' },
  extracted: { label: 'Ready', dotClass: 'bg-verified', badgeClass: 'badge-success' },
  pending_review: { label: 'Pending Review', dotClass: 'bg-marigold animate-pulse', badgeClass: 'badge-gold' },
  uploaded: { label: 'Uploaded', dotClass: 'bg-blue-500', badgeClass: 'badge-muted' },
  splitting: { label: 'Processing', dotClass: 'bg-marigold animate-pulse', badgeClass: 'badge-gold' },
  extracting: { label: 'Processing', dotClass: 'bg-marigold animate-pulse', badgeClass: 'badge-gold' },
  failed: { label: 'Failed', dotClass: 'bg-army', badgeClass: 'badge-army' },
};

export default function AdminUploadsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery<PaginatedResponse<AdminPaperItem>>({
    queryKey: ['admin', 'papers', search, statusFilter, page],
    queryFn: () =>
      api.adminPapers({
        search: search || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        page,
        limit: 15,
      }),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => api.approveDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'papers'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'overview'] });
      queryClient.invalidateQueries({ queryKey: ['papers'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.adminDeletePaper(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'papers'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'overview'] });
      queryClient.invalidateQueries({ queryKey: ['papers'] });
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  };

  const papers = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="page-desktop">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-title text-ink">Uploads & Management</h1>
          <p className="text-body text-muted mt-1">
            {data?.total ?? '—'} total question papers uploaded across the platform
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
          <Search size={16} strokeWidth={1.75} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted/50" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by course code, title, or filename..."
            className="input-field pl-11 py-2.5 text-xs"
          />
        </form>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <div className="flex items-center gap-1 text-muted text-xs font-semibold mr-1">
            <Filter size={14} />
            <span>Status:</span>
          </div>
          {[
            { id: 'all', label: 'All' },
            { id: 'ready', label: 'Ready' },
            { id: 'pending_review', label: 'Pending Review' },
            { id: 'failed', label: 'Failed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setStatusFilter(tab.id);
                setPage(1);
              }}
              className={clsx(
                'rounded-xl px-3 py-1.5 text-xs font-semibold transition-all',
                statusFilter === tab.id
                  ? 'bg-naub-green text-white shadow-glow-green'
                  : 'bg-paper-warm text-muted hover:bg-paper-warm/80 hover:text-ink'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-card-xl border border-line bg-white shadow-card">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-line-light bg-paper-warm">
              <th className="px-5 py-3.5 text-overline text-muted">Paper / Document</th>
              <th className="px-5 py-3.5 text-overline text-muted">Course Code</th>
              <th className="hidden md:table-cell px-5 py-3.5 text-overline text-muted">Uploader</th>
              <th className="px-5 py-3.5 text-overline text-muted">Status</th>
              <th className="px-5 py-3.5 text-overline text-muted text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-12 text-center">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-naub-green border-t-transparent mx-auto" />
                </td>
              </tr>
            ) : papers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-body text-muted">
                  <FileText className="mx-auto h-8 w-8 text-muted/40 mb-2" />
                  No question papers found.
                </td>
              </tr>
            ) : (
              papers.map((paper, i) => {
                const sc = STATUS_CONFIG[paper.status] ?? STATUS_CONFIG.ready;
                return (
                  <tr
                    key={paper.id}
                    className={clsx(
                      'transition-colors hover:bg-paper/60',
                      i < papers.length - 1 && 'border-b border-line-light'
                    )}
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-ink line-clamp-1">{paper.title}</p>
                      <p className="text-[11px] text-muted mt-0.5">
                        Uploaded on {new Date(paper.uploadedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        {paper.errorMessage && <span className="ml-2 text-army">· {paper.errorMessage}</span>}
                      </p>
                    </td>

                    <td className="px-5 py-4 font-mono font-medium text-ink">
                      <span className="rounded-lg bg-paper-warm px-2.5 py-1 text-xs border border-line-light">
                        {paper.courseCode || '—'}
                      </span>
                    </td>

                    <td className="hidden md:table-cell px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-naub-green/10 text-naub-green font-bold text-xs">
                          <User size={13} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-ink truncate max-w-[160px]">
                            {paper.uploaderName || paper.uploaderEmail || 'System / Anonymous'}
                          </p>
                          {paper.uploaderName && paper.uploaderEmail && (
                            <p className="text-[10px] text-muted truncate max-w-[160px]">
                              {paper.uploaderEmail}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className={clsx('inline-flex items-center gap-1.5 text-xs', sc.badgeClass)}>
                        <span className={`h-1.5 w-1.5 rounded-full ${sc.dotClass}`} />
                        {sc.label}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {(paper.status === 'pending_review' || paper.status === 'uploaded') && (
                          <button
                            onClick={() => approveMutation.mutate(paper.id)}
                            disabled={approveMutation.isPending}
                            className="btn-secondary !h-8 !px-2.5 text-xs text-naub-green hover:!bg-naub-green/10 flex items-center gap-1 font-semibold"
                            title="Approve paper"
                          >
                            <Check size={14} strokeWidth={2.5} />
                            Approve
                          </button>
                        )}
                        <Link
                          href={`/paper/${paper.id}`}
                          className="btn-icon !h-8 !w-8 hover:bg-paper-warm"
                          title="View paper details"
                        >
                          <ExternalLink size={14} strokeWidth={1.75} />
                        </Link>
                        <button
                          onClick={() => {
                            if (confirm(`Delete question paper "${paper.title}"?`)) {
                              deleteMutation.mutate(paper.id);
                            }
                          }}
                          disabled={deleteMutation.isPending}
                          className="btn-icon !h-8 !w-8 text-army/80 hover:!bg-army/10 hover:!text-army disabled:opacity-50"
                          title="Delete paper"
                        >
                          <Trash2 size={14} strokeWidth={1.75} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {data && totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-card-xl border border-line bg-white p-4">
          <p className="text-caption text-muted">
            Showing Page <span className="font-semibold text-ink">{data.page}</span> of{' '}
            <span className="font-semibold text-ink">{totalPages}</span> ({data.total} total items)
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="btn-secondary !px-3 !py-1.5 text-xs flex items-center gap-1 disabled:opacity-40"
            >
              <ChevronLeft size={14} />
              Previous
            </button>

            {/* Page number buttons */}
            <div className="flex items-center gap-1 px-1">
              {Array.from({ length: totalPages }, (_, idx) => idx + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .map((p, index, array) => {
                  const showEllipsis = index > 0 && p - array[index - 1] > 1;
                  return (
                    <div key={p} className="flex items-center gap-1">
                      {showEllipsis && <span className="text-muted text-xs px-1">…</span>}
                      <button
                        onClick={() => setPage(p)}
                        className={clsx(
                          'h-7 w-7 rounded-lg text-xs font-semibold transition-all',
                          p === page
                            ? 'bg-naub-green text-white shadow-glow-green'
                            : 'bg-paper-warm text-muted hover:bg-paper-warm/80 hover:text-ink'
                        )}
                      >
                        {p}
                      </button>
                    </div>
                  );
                })}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="btn-secondary !px-3 !py-1.5 text-xs flex items-center gap-1 disabled:opacity-40"
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
