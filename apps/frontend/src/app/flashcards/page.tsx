'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search, Layers, BookOpen, ArrowRight, GraduationCap } from 'lucide-react';
import { mockFlashcardDecks } from '@/lib/mock-data';
import { FACULTIES, getFacultyById } from '@/lib/naub-data';

const LEVELS = ['100L', '200L', '300L', '400L', '500L'] as const;

export default function FlashcardsPage() {
  const [query, setQuery] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const filtered = mockFlashcardDecks.filter((deck) => {
    const matchesQuery =
      !query ||
      deck.courseCode.toLowerCase().includes(query.toLowerCase()) ||
      deck.courseTitle.toLowerCase().includes(query.toLowerCase());
    const matchesFaculty = !selectedFaculty || deck.facultyId === selectedFaculty;
    const matchesLevel = !selectedLevel || deck.level === selectedLevel;
    return matchesQuery && matchesFaculty && matchesLevel;
  });

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

        {/* Stats */}
        <div className="flex items-center gap-2 mb-5">
          <BookOpen size={15} className="text-muted" />
          <span className="text-caption text-muted">
            {filtered.length} deck{filtered.length !== 1 ? 's' : ''} available
          </span>
        </div>

        {/* Deck grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-army/5 flex items-center justify-center mx-auto mb-4">
              <Layers size={28} className="text-army/40" />
            </div>
            <p className="text-heading text-ink font-medium">No flashcard decks found</p>
            <p className="text-caption text-muted mt-1">Try adjusting your filters or search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
            {filtered.map((deck) => {
              const faculty = getFacultyById(deck.facultyId);
              return (
                <Link
                  key={deck.courseCode}
                  href={`/flashcards/${deck.courseCode}`}
                  className="card-interactive group"
                >
                  <div className="p-5">
                    {/* Top row */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="badge-army">{deck.courseCode}</span>
                        <span className="badge badge-muted text-[10px]">
                          {deck.level}
                        </span>
                      </div>
                      <ArrowRight
                        size={16}
                        className="text-muted/30 group-hover:text-army group-hover:translate-x-1 transition-all"
                      />
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-ink mb-1 group-hover:text-army transition-colors" style={{ fontFamily: "'Lora', Georgia, serif" }}>
                      {deck.courseTitle}
                    </h3>

                    {/* Meta */}
                    <div className="flex items-center gap-3 text-caption text-muted mt-3">
                      <span className="flex items-center gap-1">
                        <GraduationCap size={12} />
                        {faculty?.abbreviation || deck.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <Layers size={12} />
                        {deck.cardCount} cards
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
