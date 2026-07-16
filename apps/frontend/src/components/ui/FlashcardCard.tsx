'use client';

import { useState } from 'react';
import { RotateCcw, Lightbulb, Check, X, CircleDot } from 'lucide-react';
import type { Flashcard } from '@/lib/types';

interface FlashcardCardProps {
  card: Flashcard;
  index: number;
  total: number;
}

function FlipCard({ card }: { card: Extract<Flashcard, { type: 'flip' }> }) {
  const [flipped, setFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setFlipped(!flipped)}
        className="w-full relative cursor-pointer group"
      >
        <div
          className={`relative w-full min-h-[320px] md:min-h-[380px] rounded-2xl transition-all duration-500 [perspective:1000px] ${
            flipped ? '[transform:rotateY(180deg)]' : ''
          }`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front */}
          <div className="absolute inset-0 rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] p-8 flex flex-col items-center justify-center text-center [backface-visibility:hidden]">
            <span className="text-xs font-mono uppercase tracking-widest text-naub-green mb-4">
              Question
            </span>
            <p className="text-xl md:text-2xl font-voice text-cream-50 leading-relaxed">
              {card.front}
            </p>
            <span className="mt-6 text-xs text-cream-500 flex items-center gap-1.5">
              <RotateCcw size={12} />
              Tap to reveal answer
            </span>
          </div>

          {/* Back */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-army/10 to-army/5 border border-army/20 p-8 flex flex-col items-center justify-center text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <span className="text-xs font-mono uppercase tracking-widest text-army mb-4">
              Answer
            </span>
            <p className="text-lg md:text-xl font-voice text-cream-50 leading-relaxed">
              {card.back}
            </p>
            <span className="mt-6 text-xs text-cream-500 flex items-center gap-1.5">
              <RotateCcw size={12} />
              Tap to see question
            </span>
          </div>
        </div>
      </button>

      {card.hint && (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="text-xs text-cream-400 hover:text-naub-green transition-colors flex items-center gap-1.5 mx-auto"
          >
            <Lightbulb size={14} />
            {showHint ? 'Hide hint' : 'Need a hint?'}
          </button>
          {showHint && (
            <p className="mt-2 text-sm text-naub-green/80 italic">{card.hint}</p>
          )}
        </div>
      )}
    </>
  );
}

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

function ObjCard({ card }: { card: Extract<Flashcard, { type: 'obj' }> }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const isCorrect = selected === card.correctIndex;

  function handleSelect(idx: number) {
    if (revealed) return;
    setSelected(idx);
    setRevealed(true);
  }

  function handleReset() {
    setSelected(null);
    setRevealed(false);
  }

  return (
    <div className="w-full">
      {/* Question */}
      <div className="rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] p-8 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-mono uppercase tracking-widest text-naub-green">
            Objective
          </span>
          <CircleDot size={12} className="text-naub-green" />
        </div>
        <p className="text-lg md:text-xl font-voice text-cream-50 leading-relaxed">
          {card.question}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {card.options.map((option, idx) => {
          const isThisCorrect = idx === card.correctIndex;
          const isThisSelected = idx === selected;

          let optionStyle = 'bg-white/[0.04] border-white/[0.1] hover:border-army/40 hover:bg-army/5';
          if (revealed && isThisCorrect) {
            optionStyle = 'bg-naub-green/10 border-naub-green/40';
          } else if (revealed && isThisSelected && !isThisCorrect) {
            optionStyle = 'bg-red-500/10 border-red-500/40';
          }

          return (
            <button
              key={card.id + '-opt-' + idx}
              type="button"
              onClick={() => handleSelect(idx)}
              disabled={revealed}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left disabled:cursor-default ${optionStyle}`}
            >
              <span
                className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-mono font-bold transition-all ${
                  revealed && isThisCorrect
                    ? 'bg-naub-green text-white'
                    : revealed && isThisSelected && !isThisCorrect
                      ? 'bg-red-500 text-white'
                      : 'bg-white/10 text-cream-400'
                }`}
              >
                {revealed && isThisCorrect ? (
                  <Check size={14} />
                ) : revealed && isThisSelected && !isThisCorrect ? (
                  <X size={14} />
                ) : (
                  LETTERS[idx]
                )}
              </span>
              <span className="text-sm md:text-base text-cream-200">{option}</span>
            </button>
          );
        })}
      </div>

      {/* Result feedback */}
      {revealed && (
        <div className="mt-6 space-y-3">
          <div
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${
              isCorrect
                ? 'bg-naub-green/10 text-naub-green border border-naub-green/20'
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}
          >
            {isCorrect ? <Check size={16} /> : <X size={16} />}
            {isCorrect ? 'Correct!' : 'Not quite. The correct answer is highlighted above.'}
          </div>

          {card.explanation && (
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
              <p className="text-xs font-mono text-cream-500 mb-1 uppercase tracking-wide">
                Explanation
              </p>
              <p className="text-sm text-cream-200 leading-relaxed">{card.explanation}</p>
            </div>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="btn-ghost text-xs flex items-center gap-1.5 mx-auto"
          >
            <RotateCcw size={12} />
            Try again
          </button>
        </div>
      )}
    </div>
  );
}

export function FlashcardCard({ card, index, total }: FlashcardCardProps) {
  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-cream-400">
          Card {index + 1} of {total}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-cream-500 bg-white/5 px-2 py-0.5 rounded">
            {card.type === 'obj' ? 'OBJ' : 'Flip'}
          </span>
          <span className="text-xs font-mono text-cream-500 bg-white/5 px-2 py-1 rounded-full">
            {Math.round(((index + 1) / total) * 100)}%
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-white/10 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-army rounded-full transition-all duration-500 ease-out"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>

      {/* Card content */}
      {card.type === 'flip' ? <FlipCard card={card} /> : <ObjCard card={card} />}
    </div>
  );
}
