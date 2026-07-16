'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Target, Trophy } from 'lucide-react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { useCourses, useQuestionsByPaper, useQuestion, usePapers } from '@/lib/hooks/useQuestionBank';

export default function PracticePage() {
  const router = useRouter();
  const [courseId, setCourseId] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState<('got_it' | 'missed_it')[]>([]);

  const { data: courses } = useCourses();
  const { data: papers } = usePapers({ courseId: courseId ?? '' });
  const firstPaperId = papers?.[0]?.id ?? '';
  const { data: questions } = useQuestionsByPaper(firstPaperId);
  const currentId = questions?.[index]?.id ?? '';
  const { data: current } = useQuestion(currentId);

  // Course selection
  if (!courseId) {
    return (
      <div className="page-desktop">
        <div className="page-header lg:rounded-card-xl lg:mx-0 lg:my-6">
          <button onClick={() => router.back()} aria-label="Back" className="md:hidden btn-icon text-paper">
            <ArrowLeft size={20} strokeWidth={1.75} />
          </button>
          <div>
            <p className="page-header-title">Practice</p>
            <p className="page-header-sub">Pick a course to practice</p>
          </div>
        </div>

        <div className="content-area">
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 stagger">
            {courses?.map((c) => (
              <button
                key={c.id}
                onClick={() => setCourseId(c.id)}
                className="card-interactive p-4 text-left"
              >
                <p className="text-heading text-ink">{c.code}</p>
                <p className="text-caption text-muted mt-0.5 truncate">{c.title}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Results screen
  const finished = questions && index >= questions.length;

  if (finished) {
    const gotIt = results.filter((r) => r === 'got_it').length;
    const percentage = results.length > 0 ? Math.round((gotIt / results.length) * 100) : 0;

    return (
      <div className="page-desktop">
        <div className="page-header lg:rounded-card-xl lg:mx-0 lg:my-6">
          <button onClick={() => router.back()} aria-label="Back" className="md:hidden btn-icon text-paper">
            <ArrowLeft size={20} strokeWidth={1.75} />
          </button>
          <div><p className="page-header-title">Results</p></div>
        </div>

        <div className="content-area">
          <div className="flex flex-col items-center gap-5 py-12 text-center animate-fade-in-up">
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-gold shadow-glow-gold">
                <Trophy size={40} strokeWidth={1.75} className="text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-paper shadow-elevated border border-line">
                <span className="text-xs font-bold text-ink">{percentage}%</span>
              </div>
            </div>
            <div>
              <p className="text-display-lg text-ink">{gotIt}/{results.length}</p>
              <p className="text-body text-muted mt-1">Nice work. Come back tomorrow.</p>
            </div>
            <button
              onClick={() => { setCourseId(null); setIndex(0); setResults([]); }}
              className="btn-primary"
            >
              Practice another course
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Practice view
  const record = (outcome: 'got_it' | 'missed_it') => {
    setResults((r) => [...r, outcome]);
    setRevealed(false);
    setIndex((i) => i + 1);
  };

  const progress = questions ? ((index) / questions.length) * 100 : 0;

  return (
    <div className="page-desktop">
      <div className="page-header lg:rounded-card-xl lg:mx-0 lg:my-6">
        <button onClick={() => router.back()} aria-label="Back" className="md:hidden btn-icon text-paper">
          <ArrowLeft size={20} strokeWidth={1.75} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="page-header-sub">
            {index + 1} of {questions?.length} · Question {current?.number}
          </p>
          <p className="page-header-title">Practice</p>
        </div>
      </div>

      <div className="content-area">
        <div className="mx-auto max-w-2xl">
          {/* Progress bar */}
          <div className="mb-5 h-1 w-full overflow-hidden rounded-full bg-ink/5">
            <div
              className="h-full rounded-full bg-gradient-naub-green transition-all duration-500 ease-premium"
              style={{ width: `${progress}%` }}
            />
          </div>

          {!current ? (
            <div className="skeleton h-48 rounded-card-xl" />
          ) : (
            <>
              <div className="rounded-card-xl border border-line bg-white p-5 shadow-card animate-fade-in">
                <img
                  src={current.sourcePageImageUrl}
                  alt={`Question ${current.number}`}
                  className="w-full object-contain"
                />
              </div>

              <div className="mt-5">
                {!revealed ? (
                  <button
                    onClick={() => setRevealed(true)}
                    className="btn-gold flex w-full items-center justify-center gap-2"
                  >
                    <Target size={16} strokeWidth={2} />
                    Reveal answer
                  </button>
                ) : (
                  <div className="animate-fade-in-up">
                    <div className="mb-4 rounded-card-xl border border-line bg-white p-4 font-voice text-[15px] text-ink shadow-card">
                      <BlockMath math={current.answerLatex} />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => record('missed_it')}
                        className="btn-secondary flex-1"
                      >
                        Missed it
                      </button>
                      <button
                        onClick={() => record('got_it')}
                        className="flex-1 rounded-2xl bg-naub-green py-3 text-sm font-semibold text-white transition-all duration-300 hover:shadow-elevated hover:translate-y-[-1px] active:scale-[0.98]"
                      >
                        Got it
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
