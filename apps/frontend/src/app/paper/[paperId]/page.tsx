'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, ZoomIn, X, Download } from 'lucide-react';
import { usePaper } from '@/lib/hooks/useQuestionBank';
import { WatermarkOverlay } from '@/components/ui/WatermarkOverlay';

export default function PaperPage() {
  const { paperId } = useParams<{ paperId: string }>();
  const router = useRouter();
  const { data: paper, isLoading } = usePaper(paperId);
  const [currentPage, setCurrentPage] = useState(0);
  const [expanded, setExpanded] = useState(false);

  if (isLoading || !paper) {
    return (
      <div className="page-desktop">
        <div className="page-header lg:rounded-card-xl lg:mx-0 lg:my-6">
          <button onClick={() => router.back()} aria-label="Back" className="md:hidden btn-icon text-paper">
            <ArrowLeft size={20} strokeWidth={1.75} />
          </button>
          <div><p className="page-header-title">Loading...</p></div>
        </div>
        <div className="content-area"><div className="skeleton h-96 rounded-card-xl" /></div>
      </div>
    );
  }

  const isPdf = paper.mimeType === 'application/pdf';
  const pages = paper.pageImageUrls;
  const hasImagePages = pages.length > 0;

  return (
    <div className="page-desktop">
      <div className="page-header lg:rounded-card-xl lg:mx-0 lg:my-6">
        <button onClick={() => router.back()} aria-label="Back" className="md:hidden btn-icon text-paper">
          <ArrowLeft size={20} strokeWidth={1.75} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="page-header-title truncate">{paper.title}</p>
          <p className="page-header-sub">
            {[paper.examType, paper.session, paper.level].filter(Boolean).join(' · ')}
          </p>
        </div>
        {paper.fileUrl && (
          <a
            href={paper.fileUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="btn-icon text-paper flex-shrink-0 transition-all duration-200 hover:bg-white/10 hover:scale-110"
            aria-label="Download"
          >
            <Download size={18} strokeWidth={1.75} />
          </a>
        )}
      </div>

      <div className="content-area">
        <div className="mx-auto max-w-2xl">

          {/* ── PDF viewer ── */}
          {isPdf && paper.fileUrl && (
            <div className="relative overflow-hidden rounded-card-xl border border-line bg-white shadow-elevated animate-fade-in">
              <WatermarkOverlay text="naubpadi.com.ng" />
              <embed
                src={paper.fileUrl}
                type="application/pdf"
                className="w-full"
                style={{ height: '80vh', minHeight: 480 }}
                title={paper.title}
              />
            </div>
          )}

          {/* ── Image viewer ── */}
          {hasImagePages && (
            <>
              <div className="relative overflow-hidden rounded-card-xl border border-line bg-white shadow-elevated animate-fade-in">
                <WatermarkOverlay text="naubpadi.com.ng" />
                <button onClick={() => setExpanded(true)} className="block w-full">
                  <img
                    src={pages[currentPage]}
                    alt={`Page ${currentPage + 1} of ${paper.title}`}
                    className="w-full object-contain transition-transform duration-300 hover:scale-[1.01]"
                  />
                </button>
                <div className="absolute right-3 top-3 z-30">
                  <button
                    onClick={() => setExpanded(true)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink/70 text-paper backdrop-blur-sm transition-all duration-200 hover:bg-ink/90 hover:scale-110 active:scale-95"
                    aria-label="Zoom in"
                  >
                    <ZoomIn size={16} strokeWidth={1.75} />
                  </button>
                </div>
              </div>

              {pages.length > 1 && (
                <>
                  <div className="mt-4 flex items-center justify-between">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                      disabled={currentPage === 0}
                      className="btn-secondary flex items-center gap-1.5 disabled:opacity-30"
                    >
                      <ChevronLeft size={14} strokeWidth={2} />
                      Previous
                    </button>
                    <div className="flex items-center gap-2">
                      {pages.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i)}
                          className={`rounded-full transition-all duration-300 ${
                            i === currentPage
                              ? 'h-2 w-6 bg-naub-green shadow-glow-green'
                              : 'h-2 w-2 bg-ink/15 hover:bg-ink/25 hover:scale-125'
                          }`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(pages.length - 1, p + 1))}
                      disabled={currentPage === pages.length - 1}
                      className="btn-secondary flex items-center gap-1.5 disabled:opacity-30"
                    >
                      Next
                      <ChevronRight size={14} strokeWidth={2} />
                    </button>
                  </div>

                  <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {pages.map((url, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        className={`flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                          i === currentPage
                            ? 'border-naub-green shadow-glow-green scale-105'
                            : 'border-line opacity-50 hover:opacity-100 hover:border-ink/20 hover:scale-105'
                        }`}
                      >
                        <img src={url} alt={`Page ${i + 1}`} className="h-16 w-12 object-cover" />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {/* ── Nothing to show ── */}
          {!isPdf && !hasImagePages && (
            <div className="rounded-card-xl border border-line bg-white p-12 text-center">
              <p className="text-body text-muted">
                {paper.status === 'failed'
                  ? 'This paper could not be processed. Please try uploading again.'
                  : 'No content available for this paper yet.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Expanded fullscreen image ── */}
      {expanded && hasImagePages && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setExpanded(false)}
        >
          <button
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-paper transition-all duration-200 hover:bg-white/20 hover:scale-110 active:scale-95"
            aria-label="Close"
            onClick={() => setExpanded(false)}
          >
            <X size={20} strokeWidth={2} />
          </button>

          <img
            src={pages[currentPage]}
            alt={`Page ${currentPage + 1} (expanded)`}
            className="max-h-[85vh] max-w-full object-contain rounded-lg animate-scale-in"
          />

          {pages.length > 1 && (
            <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-6">
              <button
                onClick={(e) => { e.stopPropagation(); setCurrentPage((p) => Math.max(0, p - 1)); }}
                disabled={currentPage === 0}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-paper backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:scale-110 active:scale-95 disabled:opacity-30"
              >
                <ChevronLeft size={20} strokeWidth={2} />
              </button>
              <p className="text-sm font-semibold text-paper tabular-nums">
                {currentPage + 1} / {pages.length}
              </p>
              <button
                onClick={(e) => { e.stopPropagation(); setCurrentPage((p) => Math.min(pages.length - 1, p + 1)); }}
                disabled={currentPage === pages.length - 1}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-paper backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:scale-110 active:scale-95 disabled:opacity-30"
              >
                <ChevronRight size={20} strokeWidth={2} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
