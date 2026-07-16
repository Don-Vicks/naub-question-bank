'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Layers,
} from 'lucide-react';
import { getFacultyById } from '@/lib/naub-data';

export default function FlashcardDeckPage() {
  const params = useParams();
  const courseCode = (params.courseCode as string).toUpperCase();

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

        {/* Empty state */}
        <div className="text-center py-20">
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
    </div>
  );
}
