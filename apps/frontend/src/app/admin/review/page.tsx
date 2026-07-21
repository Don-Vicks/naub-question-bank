'use client';

import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ShieldCheck, Check, X, Eye, FileText, Loader2, Clock, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';

interface PendingDoc {
  id: string;
  title: string;
  originalFilename: string;
  mimeType: string;
  fileUrl: string;
  courseCode: string;
  facultyId: string;
  departmentId: string;
  level: string;
  examType: string;
  session: string;
  status: string;
  uploaderId: string;
  uploadedAt: string;
}

export default function AdminReviewPage() {
  const queryClient = useQueryClient();
  const [docs, setDocs] = useState<PendingDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchPending = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getPendingDocuments();
      setDocs(data);
      setSelectedIds(new Set());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch pending review queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const toggleSelectAll = () => {
    if (selectedIds.size === docs.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(docs.map((d) => d.id)));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const invalidatePublicQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['papers'] });
    queryClient.invalidateQueries({ queryKey: ['courses'] });
    queryClient.invalidateQueries({ queryKey: ['faculties'] });
    queryClient.invalidateQueries({ queryKey: ['departments'] });
    queryClient.invalidateQueries({ queryKey: ['search'] });
    queryClient.invalidateQueries({ queryKey: ['admin'] });
  };

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      await api.approveDocument(id);
      setDocs((prev) => prev.filter((d) => d.id !== id));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      invalidatePublicQueries();
      showSuccess('Paper approved successfully!');
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to approve document');
    } finally {
      setProcessingId(null);
    }
  };

  const handleApproveSelected = async () => {
    if (selectedIds.size === 0) return;
    const idsArray = Array.from(selectedIds);
    setIsBulkProcessing(true);
    try {
      const res = await api.approveBatchDocuments(idsArray);
      setDocs((prev) => prev.filter((d) => !idsArray.includes(d.id)));
      setSelectedIds(new Set());
      invalidatePublicQueries();
      showSuccess(`Successfully approved ${res.approvedCount} question paper(s)!`);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to approve selected documents');
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const handleApproveAll = async () => {
    if (docs.length === 0) return;
    if (!confirm(`Are you sure you want to approve all ${docs.length} pending paper(s)?`)) return;
    setIsBulkProcessing(true);
    try {
      const res = await api.approveBatchDocuments();
      setDocs([]);
      setSelectedIds(new Set());
      invalidatePublicQueries();
      showSuccess(`Successfully approved all ${res.approvedCount} pending paper(s)!`);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to approve all documents');
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Are you sure you want to reject this question paper upload?')) return;
    setProcessingId(id);
    try {
      await api.rejectDocument(id);
      setDocs((prev) => prev.filter((d) => d.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to reject document');
    } finally {
      setProcessingId(null);
    }
  };

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  return (
    <div className="page-desktop space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-title text-ink">Moderation Queue</h1>
            <span className="rounded-full bg-naub-gold/15 px-2.5 py-0.5 text-xs font-bold text-army border border-naub-gold/30">
              {docs.length} pending
            </span>
          </div>
          <p className="text-body text-muted mt-1">
            Review and approve question paper uploads before they appear publicly on Padi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {docs.length > 0 && (
            <button
              onClick={handleApproveAll}
              disabled={isBulkProcessing || loading}
              className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5 bg-naub-green hover:bg-naub-green-dark disabled:opacity-50"
            >
              {isBulkProcessing ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              Approve All ({docs.length})
            </button>
          )}

          <button
            onClick={fetchPending}
            disabled={loading || isBulkProcessing}
            className="btn-secondary self-start sm:self-auto text-xs py-2 px-3 flex items-center gap-1.5"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : 'Refresh Queue'}
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="flex items-center gap-2 rounded-2xl border border-naub-green/30 bg-naub-green-light p-4 text-xs font-semibold text-naub-green animate-fade-in">
          <ShieldCheck size={16} />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-terracotta/20 bg-terracotta-50 p-4 text-xs text-terracotta">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Bulk action selection bar */}
      {docs.length > 0 && (
        <div className="flex items-center justify-between rounded-card-xl border border-line bg-paper-warm p-4 shadow-sm">
          <label className="flex items-center gap-2 text-xs font-semibold text-ink cursor-pointer select-none">
            <input
              type="checkbox"
              checked={selectedIds.size > 0 && selectedIds.size === docs.length}
              onChange={toggleSelectAll}
              className="h-4 w-4 rounded border-line text-naub-green focus:ring-naub-green"
            />
            <span>Select All ({selectedIds.size} of {docs.length} selected)</span>
          </label>

          {selectedIds.size > 0 && (
            <button
              onClick={handleApproveSelected}
              disabled={isBulkProcessing}
              className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1 bg-naub-green hover:bg-naub-green-dark disabled:opacity-50 animate-fade-in"
            >
              {isBulkProcessing ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              Approve Selected ({selectedIds.size})
            </button>
          )}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton h-24 rounded-card-xl" />
          ))}
        </div>
      ) : docs.length === 0 ? (
        <div className="rounded-card-xl border border-line bg-white py-16 text-center shadow-card">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-naub-green-light border border-naub-green/20 text-naub-green">
            <ShieldCheck size={32} strokeWidth={1.75} />
          </div>
          <p className="text-heading text-ink font-bold">Queue is Clean!</p>
          <p className="text-body text-muted mt-1 max-w-sm mx-auto">
            All user-uploaded question papers have been reviewed and moderated.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {docs.map((doc) => {
            const isProcessing = processingId === doc.id || isBulkProcessing;
            const isPdf = doc.mimeType === 'application/pdf';
            const isSelected = selectedIds.has(doc.id);

            return (
              <div
                key={doc.id}
                className={`card-elevated flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between rounded-card-xl border transition-all ${
                  isSelected ? 'border-naub-green/50 bg-naub-green-light/20 shadow-md' : 'border-line bg-white shadow-card hover:shadow-card-hover'
                }`}
              >
                {/* Checkbox & File info */}
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(doc.id)}
                    className="mt-1 h-4 w-4 flex-shrink-0 rounded border-line text-naub-green focus:ring-naub-green cursor-pointer"
                  />

                  <div className="flex h-12 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-terracotta/10 text-terracotta border border-terracotta/20">
                    <FileText size={20} strokeWidth={1.75} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base font-bold text-ink truncate">
                        {doc.courseCode || doc.title}
                      </span>
                      <span className="rounded-md bg-paper-warm px-2 py-0.5 text-[10px] font-semibold text-muted uppercase">
                        {isPdf ? 'PDF' : 'IMAGE'}
                      </span>
                      <span className="rounded-md bg-naub-gold/15 px-2 py-0.5 text-[10px] font-bold text-army">
                        Pending Review
                      </span>
                    </div>

                    <p className="text-xs text-muted mt-1 truncate">
                      {doc.originalFilename}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted">
                      {doc.examType && <span>{doc.examType}</span>}
                      {doc.session && <span>· {doc.session}</span>}
                      {doc.level && <span>· {doc.level}</span>}
                      {doc.facultyId && <span>· {doc.facultyId}</span>}
                      <span className="flex items-center gap-1 text-muted/60">
                        <Clock size={12} />
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 border-t border-line-light pt-3 sm:border-t-0 sm:pt-0 flex-shrink-0">
                  {doc.fileUrl && (
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary text-xs py-2 px-3 flex items-center gap-1"
                    >
                      <Eye size={14} />
                      Preview
                    </a>
                  )}

                  <button
                    onClick={() => handleReject(doc.id)}
                    disabled={isProcessing}
                    className="rounded-xl border border-terracotta/30 bg-terracotta-50 px-3 py-2 text-xs font-semibold text-terracotta hover:bg-terracotta hover:text-white transition-all disabled:opacity-50 flex items-center gap-1"
                  >
                    {processingId === doc.id ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
                    Reject
                  </button>

                  <button
                    onClick={() => handleApprove(doc.id)}
                    disabled={isProcessing}
                    className="btn-primary text-xs py-2 px-4 flex items-center gap-1 bg-naub-green hover:bg-naub-green-dark disabled:opacity-50"
                  >
                    {processingId === doc.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                    Approve
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
