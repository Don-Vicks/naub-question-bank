'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search, Layers, BookOpen, ArrowRight, GraduationCap, CheckCircle2, Flame, Award } from 'lucide-react';
import { FLASHCARD_DECKS, FlashcardDeck } from '@/lib/flashcard-data';
import { FACULTIES } from '@/lib/naub-data';
import { EmptyState } from '@/components/ui/EmptyState';

const LEVELS = ['100L', '200L', '300L', '400L', '500L'] as const;

export default function FlashcardsPage() {
  const [query, setQuery] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const filteredDecks = FLASHCARD_DECKS.filter((deck) => {
    if (query) {
      const q = query.toLowerCase();
      const matchCode = deck.courseCode.toLowerCase().includes(q);
      const matchTitle = deck.courseTitle.toLowerCase().includes(q);
      if (!matchCode && !matchTitle) return false;
    }
    if (selectedFaculty && deck.facultyId !== selectedFaculty) return false;
    if (selectedLevel && deck.level !== selectedLevel) return false;
    return true;
  });

  return (
    <div className="page-desktop">
      {/* Header */}
      <div className="page-header lg:rounded-card-xl lg:mx-0 lg:my-6">
        <Layers size={22} strokeWidth={1.75} className="text-paper/70" />
        <div>
          <p className="page-header-title">Flashcard Study Decks</p>
          <p className="page-header-sub">Master your courses with interactive flip cards & CBT practice drills</p>
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
            placeholder="Search by course code or title (e.g. GST 212, Philosophy)..."
            className="input-field pl-11 w-full text-xs"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1.5 mb-6 whitespace-nowrap">
          <button
            type="button"
            onClick={() => setSelectedFaculty(null)}
            className={`px-3.5 py-2 min-h-[36px] flex-shrink-0 rounded-full text-xs font-semibold transition-all ${
              !selectedFaculty
                ? 'bg-naub-green text-white shadow-glow-green'
                : 'bg-paper-warm text-muted hover:bg-naub-green/10 hover:text-naub-green'
            }`}
          >
            All Decks
          </button>
          {FACULTIES.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setSelectedFaculty(selectedFaculty === f.id ? null : f.id)}
              className={`px-3.5 py-2 min-h-[36px] flex-shrink-0 rounded-full text-xs font-semibold transition-all ${
                selectedFaculty === f.id
                  ? 'bg-naub-green text-white shadow-glow-green'
                  : 'bg-paper-warm text-muted hover:bg-naub-green/10 hover:text-naub-green'
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
                  ? 'bg-naub-teal text-white shadow-glow-sm'
                  : 'bg-paper-warm text-muted hover:bg-naub-teal/10 hover:text-naub-teal'
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        {/* Decks Grid */}
        {filteredDecks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDecks.map((deck) => (
              <div
                key={deck.id}
                className="group relative overflow-hidden rounded-card-xl border border-line bg-white p-5 shadow-elevated transition-all duration-300 hover:-translate-y-1 hover:border-naub-green/40 hover:shadow-card-hover flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="rounded-xl bg-naub-green/10 px-3 py-1 text-xs font-bold text-naub-green">
                      {deck.courseCode}
                    </span>
                    <span className="rounded-lg bg-paper-warm px-2.5 py-0.5 text-[11px] font-semibold text-muted border border-line-light">
                      {deck.level}
                    </span>
                  </div>

                  <h3 className="text-heading text-ink font-semibold group-hover:text-naub-green transition-colors line-clamp-1">
                    {deck.courseTitle}
                  </h3>
                  <p className="text-caption text-muted mt-1.5 line-clamp-2 leading-relaxed">
                    {deck.description}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 rounded-md bg-paper-warm px-2.5 py-1 text-ink font-medium border border-line-light">
                      <Layers size={13} className="text-naub-green" />
                      {deck.cardCount} Cards
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[11px] font-semibold">
                      {deck.easyCount} Easy
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 text-amber-700 px-2 py-0.5 text-[11px] font-semibold">
                      {deck.mediumCount} Medium
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 text-rose-700 px-2 py-0.5 text-[11px] font-semibold">
                      {deck.hardCount} Hard
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-line-light flex items-center justify-between">
                  <span className="text-caption text-muted font-medium">{deck.department}</span>
                  <Link
                    href={`/flashcards/${deck.courseCode.replace(/\s+/g, '')}`}
                    className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 bg-naub-green hover:bg-naub-green-dark group-hover:scale-105 transition-all"
                  >
                    Study Deck
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Layers}
            title="No flashcard decks match your search"
            description="Try clearing your filters or searching for another course code."
            actionLabel="Reset Search"
            onAction={() => {
              setQuery('');
              setSelectedFaculty(null);
              setSelectedLevel(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
