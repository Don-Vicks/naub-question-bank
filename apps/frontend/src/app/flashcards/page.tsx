'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search, Layers, BookOpen, ArrowRight, GraduationCap } from 'lucide-react';
import { FACULTIES, getFacultyById } from '@/lib/naub-data';
import { EmptyState } from '@/components/ui/EmptyState';

const LEVELS = ['100L', '200L', '300L', '400L', '500L'] as const;

export default function FlashcardsPage() {
  const [query, setQuery] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  return (
    <div className="page-desktop">
      {/* Header */}
      <div className="page-header lg:rounded-card-xl lg:mx-0 lg:my-6">
        <Layers size={20} strokeWidth={1.75} className="text-paper/60" />
        <div>
          <p className="page-header-title">Flashcards</p>
          <p className="page-header-sub">Flip, learn, and master your courses</p>
        </div>
      </div>

      <div className="content-area">
        {/* Search */}
        <div className="relative mb-5 animate-fade-in">
          <Search size={18} strokeWidth={1.75} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted/50" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by course code or title..."
            className="input-field pl-11 w-full"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1.5 mb-6 whitespace-nowrap">
          <button
            type="button"
            onClick={() => setSelectedFaculty(null)}
            className={`px-3.5 py-2 min-h-[36px] flex-shrink-0 rounded-full text-xs font-semibold transition-all ${
              !selectedFaculty
                ? 'bg-army text-white shadow-glow-sm'
                : 'bg-ink/5 text-muted hover:bg-army/10 hover:text-army'
            }`}
          >
            All Faculties
          </button>
          {FACULTIES.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setSelectedFaculty(f.id)}
              className={`px-3.5 py-2 min-h-[36px] flex-shrink-0 rounded-full text-xs font-semibold transition-all ${
                selectedFaculty === f.id
                  ? 'bg-army text-white shadow-glow-sm'
                  : 'bg-ink/5 text-muted hover:bg-army/10 hover:text-army'
              }`}
            >
              {f.abbreviation}
            </button>
          ))}
          <div className="w-px h-5 bg-line mx-1 flex-shrink-0" />
          {LEVELS.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setSelectedLevel(selectedLevel === level ? null : level)}
              className={`px-3.5 py-2 min-h-[36px] flex-shrink-0 rounded-full text-xs font-semibold transition-all ${
                selectedLevel === level
                  ? 'bg-naub-teal text-white'
                  : 'bg-ink/5 text-muted hover:bg-naub-teal/10 hover:text-naub-teal'
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        {/* Empty state */}
        <EmptyState
          icon={Layers}
          title="No flashcard decks yet"
          description="Interactive flashcard study decks will appear here automatically when question papers are processed."
          actionLabel="Browse Available Papers"
          actionHref="/browse"
          secondaryActionLabel="Upload a Question Paper"
          secondaryActionHref="/upload"
        />
      </div>
    </div>
  );
}
