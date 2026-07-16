'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search, Layers, BookOpen, ArrowRight, GraduationCap } from 'lucide-react';
import { FACULTIES, getFacultyById } from '@/lib/naub-data';

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
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            type="button"
            onClick={() => setSelectedFaculty(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
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
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedFaculty === f.id
                  ? 'bg-army text-white shadow-glow-sm'
                  : 'bg-ink/5 text-muted hover:bg-army/10 hover:text-army'
              }`}
            >
              {f.abbreviation}
            </button>
          ))}
          <div className="w-px h-6 bg-line mx-1 self-center" />
          {LEVELS.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setSelectedLevel(selectedLevel === level ? null : level)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
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
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-army/5 flex items-center justify-center mx-auto mb-4">
            <Layers size={28} className="text-army/40" />
          </div>
          <p className="text-heading text-ink font-medium">No flashcard decks yet</p>
          <p className="text-caption text-muted mt-1">Flashcards will appear here once question papers are processed</p>
        </div>
      </div>
    </div>
  );
}
