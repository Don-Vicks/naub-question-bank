'use client';

import { useState } from 'react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { useQuestionsByCourse, useQuestion } from '@/lib/hooks/useQuestionBank';

const COURSE_OPTIONS = ['swe218', 'cos201', 'csc211', 'csc212', 'swe219', 'sen201'];

export default function PracticePage() {
  const [courseId, setCourseId] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState<('got_it' | 'missed_it')[]>([]);

  const { data: questions } = useQuestionsByCourse(courseId ?? '');
  const currentId = questions?.[index]?.id ?? '';
  const { data: current } = useQuestion(currentId);

  if (!courseId) {
    return (
      <div className="p-4 md:px-0 md:py-6">
        <p className="mb-3 text-sm font-medium text-ink">
          What do you want to practice?
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
          {COURSE_OPTIONS.map((id) => (
            <button
              key={id}
              onClick={() => setCourseId(id)}
              className="rounded-card border border-line bg-white p-3 text-left text-[13px] uppercase text-ink md:hover:border-ink/20"
            >
              {id}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const finished = questions && index >= questions.length;

  if (finished) {
    const gotIt = results.filter((r) => r === 'got_it').length;
    return (
      <div className="flex flex-col items-center gap-2 p-8 text-center">
        <p className="text-lg font-medium text-ink">
          {gotIt}/{results.length}
        </p>
        <p className="text-sm text-muted">Nice work. Come back tomorrow.</p>
        <button
          onClick={() => {
            setCourseId(null);
            setIndex(0);
            setResults([]);
          }}
          className="mt-3 rounded-card border border-line bg-white px-4 py-2 text-[13px] text-ink"
        >
          Practice another course
        </button>
      </div>
    );
  }

  const record = (outcome: 'got_it' | 'missed_it') => {
    setResults((r) => [...r, outcome]);
    setRevealed(false);
    setIndex((i) => i + 1);
  };

  return (
    <div className="p-4 md:mx-auto md:max-w-2xl md:px-0 md:py-6">
      {!current ? (
        <div className="h-32 animate-pulse rounded-card bg-white" />
      ) : (
        <>
          <p className="mb-1 text-[11px] font-medium text-muted">
            Question {current.number} · {index + 1} of {questions?.length}
          </p>
          <div className="mb-4 font-voice text-[14px] leading-relaxed text-ink">
            <BlockMath math={current.textLatex} />
          </div>

          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              className="w-full rounded-card bg-ink py-3 text-[13px] font-medium text-paper md:w-auto md:px-6"
            >
              Reveal answer
            </button>
          ) : (
            <>
              <div className="mb-3 rounded-card border border-line bg-white p-3 font-voice text-[13px] text-ink">
                <BlockMath math={current.answerLatex} />
              </div>
              <div className="flex gap-2 md:justify-start">
                <button
                  onClick={() => record('missed_it')}
                  className="flex-1 rounded-card border border-line bg-white py-2.5 text-[13px] text-ink md:flex-none md:px-6"
                >
                  Missed it
                </button>
                <button
                  onClick={() => record('got_it')}
                  className="flex-1 rounded-card bg-verified py-2.5 text-[13px] font-medium text-white md:flex-none md:px-6"
                >
                  Got it
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
