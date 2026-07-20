'use client';

import { useState } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { useSearch } from '@/lib/hooks/useQuestionBank';
import { PaperCard } from '@/components/ui/PaperCard';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const { data: results, isFetching } = useSearch(query);

  return (
    <div className="page-desktop">
      <div className="page-header lg:rounded-card-xl lg:mx-0 lg:my-6">
        <SearchIcon size={20} strokeWidth={1.75} className="text-paper/60" />
        <div>
          <p className="page-header-title">Search</p>
          <p className="page-header-sub">Find courses and papers</p>
        </div>
      </div>

      <div className="content-area">
        {/* Search input container */}
        <div className="relative mb-5 overflow-hidden rounded-2xl animate-fade-in">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-army/5 via-naub-gold/5 to-naub-teal/5 blur-2xl opacity-60" />

          <div className="relative group">
            <SearchIcon
              size={18}
              strokeWidth={1.75}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted/50 transition-colors duration-200 group-focus-within:text-army"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses, e.g. SWE218, Linear Algebra"
              className="input-field pl-11 pr-10 min-h-[44px]"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-muted hover:text-army transition-colors duration-200 hover:scale-110 active:scale-95 min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <X size={16} strokeWidth={2} />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 stagger">
          {isFetching && (
            <div className="col-span-full flex items-center justify-center py-8">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-army border-t-transparent" />
            </div>
          )}

          {!isFetching && query.trim().length > 1 && results?.length === 0 && (
            <div className="col-span-full flex flex-col items-center gap-3 py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-army-50 border border-army/10 transition-transform duration-300 hover:scale-110">
                <SearchIcon size={20} strokeWidth={1.75} className="text-army" />
              </div>
              <div>
                <p className="text-heading text-ink">No results found</p>
                <p className="text-caption text-muted mt-1">
                  Try a different course or topic
                </p>
              </div>
            </div>
          )}

          {results?.map((paper) => (
            <PaperCard key={paper.id} paper={paper} />
          ))}
        </div>
      </div>
    </div>
  );
}
