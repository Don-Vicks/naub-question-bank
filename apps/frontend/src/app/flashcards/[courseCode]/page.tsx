'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  RotateCcw,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { mockFlashcardDecks } from '@/lib/mock-data';
import { getFacultyById } from '@/lib/naub-data';
import { FlashcardCard } from '@/components/ui/FlashcardCard';

export default function FlashcardDeckPage() {
  const params = useParams();
  const courseCode = (params.courseCode as string).toUpperCase();
  const deck = mockFlashcardDecks.find((d) => d.courseCode === courseCode);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  if (!deck) {
    return (
      <div className="page-desktop">
        <div className="content-area text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-army/5 flex items-center justify-center mx-auto mb-4">
            <Layers size={28} className="text-army/40" />
          </div>
          <p className="text-heading text-ink font-medium">Deck not found</p>
          <p className="text-caption text-muted mt-1 mb-4">
            No flashcards available for &ldquo;{courseCode}&rdquo;
          </p>
          <Link href="/flashcards" className="btn-primary inline-flex">
            Browse all decks
          </Link>
        </div>
      </div>
    );
  }

  const cards = deck.cards;
  const card = cards[currentIndex];
  const faculty = getFacultyById(deck.facultyId);

  function goNext() {
    if (currentIndex < cards.length - 1) {
      setDirection('next');
      setCurrentIndex((i) => i + 1);
    }
  }

  function goPrev() {
    if (currentIndex > 0) {
      setDirection('prev');
      setCurrentIndex((i) => i - 1);
    }
  }

  function shuffleCards() {
    const randomIndex = Math.floor(Math.random() * cards.length);
    setDirection('next');
    setCurrentIndex(randomIndex);
  }

  function resetDeck() {
    setDirection('next');
    setCurrentIndex(0);
  }

  return (
    <div className="page-desktop-narrow">
      <div className="content-area">
        {/* Back link */}
        <Link
          href="/flashcards"
          className="inline-flex items-center gap-1.5 text-caption text-muted hover:text-army transition-colors mb-6"
        >
          <ArrowLeft size={14} />
          All decks
        </Link>

        {/* Deck header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="badge-army">{deck.courseCode}</span>
            <span className="badge badge-muted">
              {deck.level}
            </span>
          </div>
          <h1 className="text-display font-bold text-ink mb-2" style={{ fontFamily: "'Lora', Georgia, serif" }}>
            {deck.courseTitle}
          </h1>
          <div className="flex items-center justify-center gap-3 text-caption text-muted">
            <span className="flex items-center gap-1">
              <GraduationCap size={14} />
              {faculty?.abbreviation || deck.department}
            </span>
            <span className="flex items-center gap-1">
              <Layers size={14} />
              {cards.length} cards
            </span>
          </div>
        </div>

        {/* Card */}
        <FlashcardCard card={card} index={currentIndex} total={cards.length} />

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            type="button"
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="btn-ghost px-3 py-2 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Previous card"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type="button"
            onClick={shuffleCards}
            className="btn-ghost px-3 py-2"
            aria-label="Shuffle"
          >
            <Shuffle size={18} />
          </button>

          <button
            type="button"
            onClick={resetDeck}
            className="btn-ghost px-3 py-2"
            aria-label="Reset to first card"
          >
            <RotateCcw size={18} />
          </button>

          <button
            type="button"
            onClick={goNext}
            disabled={currentIndex === cards.length - 1}
            className="btn-ghost px-3 py-2 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next card"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-1.5 mt-6">
          {cards.map((_, i) => (
            <button
              key={cards[i].id}
              type="button"
              onClick={() => {
                setDirection(i > currentIndex ? 'next' : 'prev');
                setCurrentIndex(i);
              }}
              className={`h-2 rounded-full transition-all ${
                i === currentIndex
                  ? 'bg-army w-6'
                  : 'bg-ink/15 hover:bg-ink/30 w-2'
              }`}
              aria-label={`Go to card ${i + 1}`}
            />
          ))}
        </div>

        {/* Keyboard hint */}
        <p className="text-center text-caption text-muted mt-6">
          Use arrow keys or swipe to navigate
        </p>
      </div>
    </div>
  );
}
