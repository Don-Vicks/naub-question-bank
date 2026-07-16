'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { Search, Trash2, ExternalLink, Loader2 } from 'lucide-react';
import { api, AdminPaperItem, PaginatedResponse } from '@/lib/api';
import Link from 'next/link';

const STATUS_CONFIG: Record<string, { label: string; dotClass: string; badgeClass: string }> = {
  uploaded: { label: 'Queued', dotClass: 'bg-muted/40', badgeClass: 'badge-muted' },
  splitting: { label: 'Splitting', dotClass: 'bg-marigold animate-pulse', badgeClass: 'badge-gold' },
  extracting: { label: 'Extracting', dotClass: 'bg-marigold animate-pulse', badgeClass: 'badge-gold' },
  extracted: { label: 'Ready', dotClass: 'bg-verified', badgeClass: 'badge-success' },
  failed: { label: 'Failed', dotClass: 'bg-army', badgeClass: 'badge-army' },
};

export default function AdminUploadsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');

  const { data, isLoading } = useQuery<PaginatedResponse<AdminPaperItem>>({
    queryKey: ['admin', 'papers', search, page],
    queryFn: () => api.adminPapers({ search: search || undefined, page, limit: 15 }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.adminDeletePaper(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'papers'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'overview'] });
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const papers = data?.items ?? [];

  return (
    <div className="page-desktop">
      <div className="mb-5">
        <h1 className="text-title text-ink">Uploads</h1>
        <p className="text-body text-muted mt-1">{data?.total ?? '\u2014'} uploaded question papers</p>
      </div>

      <form onSubmit={handleSearch} className="relative mb-5 max-w-lg">
        <Search size={16} strokeWidth={1.75} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted/50" />
        <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search papers..." className="input-field pl-11" />
      </form>

      <div className="overflow-hidden rounded-card-xl border border-line bg-white shadow-card">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-line-light bg-paper-warm">
              <th className="px-5 py-3 text-overline text-muted">Paper</th>
              <th className="hidden px-5 py-3 text-overline text-muted lg:table-cell">Subject</th>
              <th className="px-5 py-3 text-overline text-muted">Status</th>
              <th className="hidden px-5 py-3 text-overline text-muted lg:table-cell">Pages</th>
              <th className="px-5 py-3 text-overline text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="py-12 text-center"><div className="h-5 w-5 animate-spin rounded-full border-2 border-army border-t-transparent mx-auto" /></td></tr>
            ) : papers.length === 0 ? (
              <tr><td colSpan={5} className="py-12 text-center text-body text-muted">No papers found.</td></tr>
            ) : (
              papers.map((paper, i) => {
                const sc = STATUS_CONFIG[paper.status] ?? STATUS_CONFIG.uploaded;
                return (
                  <tr key={paper.id} className={clsx('transition-colors hover:bg-paper', i < papers.length - 1 && 'border-b border-line-light')}>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-ink">{paper.title}</p>
                      <p className="text-[11px] text-muted mt-0.5">
                        {new Date(paper.uploadedAt).toLocaleDateString()}
                        {paper.errorMessage && <span className="ml-2 text-army">· {paper.errorMessage}</span>}
                      </p>
                    </td>
                    <td className="hidden px-5 py-3.5 text-muted lg:table-cell">{paper.courseCode}</td>
                    <td className="px-5 py-3.5"><span className={clsx('inline-flex items-center gap-1.5', sc.badgeClass)}><span className={`h-1.5 w-1.5 rounded-full ${sc.dotClass}`} />{sc.label}</span></td>
                    <td className="hidden px-5 py-3.5 text-muted lg:table-cell">{paper.pageCount}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <Link href={`/paper/${paper.id}`} className="btn-icon !h-8 !w-8" title="View paper"><ExternalLink size={14} strokeWidth={1.75} /></Link>
                        <button onClick={() => { if (confirm(`Delete "${paper.title}"?`)) deleteMutation.mutate(paper.id); }} disabled={deleteMutation.isPending} className="btn-icon !h-8 !w-8 hover:!bg-army-50 hover:!text-army disabled:opacity-50" title="Delete paper"><Trash2 size={14} strokeWidth={1.75} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {data && data.totalPages > 1 && (
        <div className="mt-5 flex items-center justify-between">
          <p className="text-caption text-muted">Page {data.page} of {data.totalPages}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="btn-secondary !px-4 !py-2 text-[13px] disabled:opacity-40">Previous</button>
            <button onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))} disabled={page >= data.totalPages} className="btn-secondary !px-4 !py-2 text-[13px] disabled:opacity-40">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
