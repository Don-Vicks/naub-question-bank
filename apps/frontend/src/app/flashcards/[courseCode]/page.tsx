'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import clsx from 'clsx';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Shuffle,
  CheckCircle2,
  XCircle,
  Layers,
  Check,
  Eye,
  HelpCircle,
} from 'lucide-react';
import { getFlashcardDeckByCode, FlashcardItem } from '@/lib/flashcard-data';

function isAnswerMatch(option: string, backAnswer: string): boolean {
  if (!option || !backAnswer) return false;
  const cleanOpt = option.replace(/^[A-D0-9][\.\)]\s*/i, '').trim().toLowerCase();
  const cleanAns = backAnswer.replace(/^[A-D0-9][\.\)]\s*/i, '').trim().toLowerCase();
  return (
    cleanOpt === cleanAns ||
    option.trim().toLowerCase() === backAnswer.trim().toLowerCase()
  );
}

export default function FlashcardDeckPage() {
  const params = useParams();
  const rawCode = (params.courseCode as string) || '';
  const deck = getFlashcardDeckByCode(rawCode);

  const [cards, setCards] = useState<FlashcardItem[]>(deck?.cards ?? []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mode, setMode] = useState<'flashcard' | 'cbt'>('flashcard');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [masteredSet, setMasteredSet] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (deck?.cards) {
      setCards(deck.cards);
    }
  }, [deck]);

  const currentCard = cards[currentIndex];

  const handleNext = useCallback(() => {
    setIsFlipped(false);
    setSelectedOption(null);
    setCurrentIndex((prev) => (prev < cards.length - 1 ? prev + 1 : 0));
  }, [cards.length]);

  const handlePrev = useCallback(() => {
    setIsFlipped(false);
    setSelectedOption(null);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : cards.length - 1));
  }, [cards.length]);

  const handleShuffle = () => {
    setIsFlipped(false);
    setSelectedOption(null);
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
  };

  const toggleMastered = (idx: number) => {
    setMasteredSet((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        setIsFlipped((f) => !f);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  if (!deck || cards.length === 0) {
    return (
      <div className="page-desktop-narrow py-20 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-naub-green/10 text-naub-green">
          <Layers size={32} />
        </div>
        <h2 className="text-title text-ink">Deck Not Found</h2>
        <p className="text-body text-muted mt-1 mb-6">
          No flashcard study deck found for course code &ldquo;{rawCode}&rdquo;.
        </p>
        <Link href="/flashcards" className="btn-primary inline-flex">
          Browse All Decks
        </Link>
      </div>
    );
  }

  const isMastered = masteredSet.has(currentIndex);

  return (
    <div className="page-desktop max-w-4xl mx-auto">
      {/* Header Bar */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/flashcards"
            className="inline-flex items-center gap-1.5 text-caption font-semibold text-muted hover:text-naub-green transition-colors mb-2"
          >
            <ArrowLeft size={14} />
            All Decks
          </Link>
          <div className="flex items-center gap-2">
            <span className="rounded-xl bg-naub-green/10 px-3 py-1 text-xs font-bold text-naub-green">
              {deck.courseCode}
            </span>
            <h1 className="text-title text-ink">{deck.courseTitle}</h1>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center rounded-xl bg-paper-warm p-1 border border-line-light">
          <button
            onClick={() => {
              setMode('flashcard');
              setIsFlipped(false);
              setSelectedOption(null);
            }}
            className={clsx(
              'px-4 py-1.5 text-xs font-semibold rounded-lg transition-all',
              mode === 'flashcard'
                ? 'bg-naub-green text-white shadow-glow-green'
                : 'text-muted hover:text-ink'
            )}
          >
            Flip Flashcards
          </button>
          <button
            onClick={() => {
              setMode('cbt');
              setIsFlipped(false);
              setSelectedOption(null);
            }}
            className={clsx(
              'px-4 py-1.5 text-xs font-semibold rounded-lg transition-all',
              mode === 'cbt'
                ? 'bg-naub-green text-white shadow-glow-green'
                : 'text-muted hover:text-ink'
            )}
          >
            CBT Drill Mode
          </button>
        </div>
      </div>

      {/* Progress & Stats Bar */}
      <div className="mb-6 rounded-card-xl border border-line bg-white p-4 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span className="text-caption font-bold text-ink">
            Question {currentIndex + 1} of {cards.length}
          </span>
          <div className="flex items-center gap-3 text-xs text-muted font-medium">
            <span className="text-emerald-600 font-semibold">
              {masteredSet.size} Mastered
            </span>
            <span>·</span>
            <span>Use ← / → Arrow Keys & Spacebar</span>
          </div>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-paper-warm">
          <div
            className="h-full bg-naub-green transition-all duration-300 shadow-glow-green"
            style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Study Card Area */}
      <div className="mx-auto max-w-3xl">
        {mode === 'flashcard' ? (
          /* ── Flashcard Mode ── */
          <div className="relative min-h-[380px]">
            {!isFlipped ? (
              /* FRONT FACE (QUESTION) */
              <div
                onClick={() => setIsFlipped(true)}
                className="flex min-h-[380px] cursor-pointer flex-col justify-between rounded-card-xl border border-line bg-white p-8 shadow-elevated transition-all duration-300 hover:shadow-card-hover select-none"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="rounded-lg bg-paper-warm px-2.5 py-1 text-xs font-mono text-muted border border-line-light">
                      Q{currentCard.questionNumber || currentIndex + 1}
                    </span>
                    {currentCard.difficulty && (
                      <span
                        className={clsx(
                          'rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider',
                          currentCard.difficulty === 'easy' && 'bg-emerald-50 text-emerald-700',
                          currentCard.difficulty === 'medium' && 'bg-amber-50 text-amber-700',
                          currentCard.difficulty === 'hard' && 'bg-rose-50 text-rose-700'
                        )}
                      >
                        {currentCard.difficulty}
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl font-medium text-ink leading-relaxed mb-6">
                    {currentCard.front}
                  </h2>

                  {/* Options List Preview (without answers revealed) */}
                  {currentCard.options && currentCard.options.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {currentCard.options.map((opt, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 rounded-xl border border-line-light bg-paper-warm/50 p-3 text-xs text-ink font-medium"
                        >
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] font-bold text-muted border border-line-light">
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span>{opt}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-line-light flex items-center justify-between text-caption text-muted">
                  <span className="flex items-center gap-1.5 font-medium text-naub-green">
                    <RotateCw size={14} /> Click card or press Spacebar to reveal answer
                  </span>
                  <span className="btn-secondary !h-8 !px-3 text-xs flex items-center gap-1">
                    <Eye size={13} />
                    Reveal Answer
                  </span>
                </div>
              </div>
            ) : (
              /* BACK FACE (ANSWER & EXPLANATION) */
              <div
                onClick={() => setIsFlipped(false)}
                className="flex min-h-[380px] cursor-pointer flex-col justify-between rounded-card-xl border border-emerald-200 bg-gradient-to-br from-white via-white to-emerald-50/40 p-8 shadow-elevated transition-all duration-300 hover:shadow-card-hover select-none"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                      <Check size={14} strokeWidth={2.5} /> Correct Answer
                    </span>
                    <span className="text-xs font-semibold text-muted">
                      Q{currentCard.questionNumber || currentIndex + 1}
                    </span>
                  </div>

                  {/* Correct Answer Display */}
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/90 p-5 text-lg font-bold text-emerald-950 shadow-sm mb-5">
                    {currentCard.back}
                  </div>

                  {/* Explanation Section */}
                  {currentCard.explanation && (
                    <div className="rounded-xl border border-line-light bg-white p-5 shadow-sm">
                      <p className="text-xs font-bold uppercase tracking-wider text-naub-green mb-1.5">
                        Explanation & Key Takeaway
                      </p>
                      <p className="text-xs text-ink leading-relaxed font-medium">
                        {currentCard.explanation}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-line-light flex items-center justify-between text-caption text-muted">
                  <span className="flex items-center gap-1 font-medium">
                    <RotateCw size={13} /> Click to flip back to question
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMastered(currentIndex);
                    }}
                    className={clsx(
                      'rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all flex items-center gap-1.5',
                      isMastered
                        ? 'bg-emerald-600 text-white shadow-glow-sm'
                        : 'bg-paper-warm text-ink hover:bg-emerald-100 hover:text-emerald-800'
                    )}
                  >
                    <CheckCircle2 size={14} />
                    {isMastered ? 'Mastered' : 'Mark as Known'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ── CBT Practice Drill Mode ── */
          <div className="rounded-card-xl border border-line bg-white p-8 shadow-elevated">
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="rounded-lg bg-paper-warm px-2.5 py-1 text-xs font-mono text-muted border border-line-light">
                CBT Question {currentIndex + 1}
              </span>
              <span className="text-xs font-semibold text-naub-green">
                Select an Option Below
              </span>
            </div>

            <h2 className="text-lg font-semibold text-ink leading-relaxed mb-6">
              {currentCard.front}
            </h2>

            {/* CBT Options List */}
            <div className="space-y-3 mb-6">
              {currentCard.options?.map((opt, i) => {
                const isCorrect = isAnswerMatch(opt, currentCard.back);
                const isSelected = selectedOption === opt;
                const hasSelected = selectedOption !== null;

                return (
                  <button
                    key={i}
                    disabled={hasSelected}
                    onClick={() => setSelectedOption(opt)}
                    className={clsx(
                      'w-full text-left flex items-center justify-between rounded-xl border p-4 text-xs font-medium transition-all',
                      !hasSelected
                        ? 'border-line-light bg-paper-warm/40 hover:border-naub-green/50 hover:bg-paper-warm hover:scale-[1.005]'
                        : isCorrect
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold shadow-sm'
                        : isSelected
                        ? 'border-rose-400 bg-rose-50 text-rose-950 font-semibold'
                        : 'border-line-light bg-paper-warm/20 opacity-50'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={clsx(
                          'flex h-6 w-6 items-center justify-center rounded-full font-bold text-xs border flex-shrink-0',
                          !hasSelected
                            ? 'bg-white text-muted border-line-light'
                            : isCorrect
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-glow-sm'
                            : isSelected
                            ? 'bg-rose-600 text-white border-rose-600'
                            : 'bg-white text-muted border-line-light'
                        )}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span>{opt}</span>
                    </div>

                    {hasSelected && isCorrect && (
                      <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
                    )}
                    {hasSelected && isSelected && !isCorrect && (
                      <XCircle size={18} className="text-rose-600 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Answer Feedback / Explanation (Only shown AFTER option is clicked) */}
            {selectedOption !== null && (
              <div
                className={clsx(
                  'rounded-xl border p-5 animate-fade-in',
                  isAnswerMatch(selectedOption, currentCard.back)
                    ? 'border-emerald-200 bg-emerald-50/90 text-emerald-950'
                    : 'border-rose-200 bg-rose-50/90 text-rose-950'
                )}
              >
                <div className="flex items-center gap-2 font-bold text-sm mb-2">
                  {isAnswerMatch(selectedOption, currentCard.back) ? (
                    <>
                      <CheckCircle2 size={18} className="text-emerald-600" />
                      Correct Answer!
                    </>
                  ) : (
                    <>
                      <XCircle size={18} className="text-rose-600" />
                      Incorrect. Correct Answer: &ldquo;{currentCard.back}&rdquo;
                    </>
                  )}
                </div>
                {currentCard.explanation && (
                  <p className="text-xs leading-relaxed font-medium mt-1">
                    {currentCard.explanation}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Deck Navigation Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-card-xl border border-line bg-white p-4 shadow-card">
          <button
            onClick={handlePrev}
            className="btn-secondary !px-4 !py-2 text-xs flex items-center gap-1.5"
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShuffle}
              className="btn-secondary !px-3 !py-2 text-xs flex items-center gap-1.5"
              title="Shuffle Deck"
            >
              <Shuffle size={14} />
              Shuffle Deck
            </button>

            <button
              onClick={() => toggleMastered(currentIndex)}
              className={clsx(
                'btn-secondary !px-3 !py-2 text-xs flex items-center gap-1.5 transition-all',
                isMastered && 'bg-emerald-600 text-white hover:bg-emerald-700'
              )}
            >
              <CheckCircle2 size={14} />
              {isMastered ? 'Mastered' : 'Mark Known'}
            </button>
          </div>

          <button
            onClick={handleNext}
            className="btn-primary !px-5 !py-2 text-xs flex items-center gap-1.5 bg-naub-green hover:bg-naub-green-dark"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
