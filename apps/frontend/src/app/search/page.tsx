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
        <div className="mb-5 animate-fade-in">
          <div className="relative">
            <SearchIcon
              size={18}
              strokeWidth={1.75}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted/50"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses, e.g. SWE218, Linear Algebra"
              className="input-field pl-11 pr-10"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-army transition-colors"
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
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-army-50 border border-army/10">
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
