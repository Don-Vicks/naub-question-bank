'use client';

import { useState } from 'react';
import { IconSearch } from '@tabler/icons-react';
import { useSearch } from '@/lib/hooks/useQuestionBank';
import { QuestionCard } from '@/components/ui/QuestionCard';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const { data: results, isFetching } = useSearch(query);

  return (
    <div className="p-4 md:mx-auto md:max-w-2xl md:px-0 md:py-6">
      <div className="flex items-center gap-2 rounded-card border border-line bg-white px-3 py-2.5">
        <IconSearch size={16} stroke={1.75} className="text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search topics, e.g. projectile motion"
          className="w-full bg-transparent text-[13px] text-ink outline-none placeholder:text-muted"
        />
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        {isFetching && (
          <p className="col-span-full text-center text-xs text-muted">Searching…</p>
        )}

        {!isFetching && query.trim().length > 1 && results?.length === 0 && (
          <p className="col-span-full mt-8 text-center text-sm text-muted">
            Padi couldn&apos;t find that one — try a different topic.
          </p>
        )}

        {results?.map((q) => (
          <QuestionCard key={q.id} question={q} />
        ))}
      </div>
    </div>
  );
}
