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
      <div className="page-header">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-army to-army-800 flex items-center justify-center shadow-glow">
            <Layers size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-cream-50">Flashcards</h1>
            <p className="text-sm text-cream-400">Flip, learn, and master your courses</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-cream-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by course code or title..."
          className="input-field pl-12 w-full"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          type="button"
          onClick={() => setSelectedFaculty(null)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            !selectedFaculty
              ? 'bg-army text-white'
              : 'bg-white/5 text-cream-400 hover:bg-white/10'
          }`}
        >
          All Faculties
        </button>
        {FACULTIES.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setSelectedFaculty(f.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedFaculty === f.id
                ? 'bg-army text-white'
                : 'bg-white/5 text-cream-400 hover:bg-white/10'
            }`}
          >
            {f.abbreviation}
          </button>
        ))}
        <div className="w-px h-6 bg-white/10 mx-1 self-center" />
        {LEVELS.map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => setSelectedLevel(level)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedLevel === level
                ? 'bg-army text-white'
                : 'bg-white/5 text-cream-400 hover:bg-white/10'
            }`}
          >
            {level}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-2 mb-6">
        <BookOpen size={16} className="text-army" />
        <span className="text-sm text-cream-400">
          {filtered.length} deck{filtered.length !== 1 ? 's' : ''} available
        </span>
      </div>

      {/* Deck grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Layers size={28} className="text-cream-500" />
          </div>
          <p className="text-cream-400 font-medium">No flashcard decks found</p>
          <p className="text-cream-500 text-sm mt-1">Try adjusting your filters or search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                      <span className="text-[10px] font-mono text-cream-500 bg-white/5 px-1.5 py-0.5 rounded">
                        {deck.level}
                      </span>
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-cream-500 group-hover:text-army group-hover:translate-x-1 transition-all"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-semibold text-cream-50 mb-1 group-hover:text-army transition-colors">
                    {deck.courseTitle}
                  </h3>

                  {/* Meta */}
                  <div className="flex items-center gap-3 text-xs text-cream-500 mt-3">
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
  );
}
