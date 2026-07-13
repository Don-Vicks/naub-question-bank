# Product Plan — Padi

## Vision

Every past exam question a Nigerian student needs — WAEC, NECO, JAMB,
university course exams — in one place, transcribed cleanly (including math
and diagrams), with an AI-generated worked answer for each. Currently this
material is scattered across WhatsApp forwards, photocopied packs, and
screenshots of screenshots. Padi is the single, trustworthy home for it.

## Who it's for

- **Primary:** SS2/SS3 students preparing for WAEC/NECO/JAMB — high urgency,
  low data budget, studying on shared or entry-level Android phones.
- **Secondary:** University students (starting with NAUB-style course exams)
  who want past questions organized by course/lecturer rather than by
  whatever's in last year's group chat.
- **Adjacent (later):** Teachers/lecturers who want a clean reference bank
  for setting their own tests, and could contribute review/corrections.

## Design constraints that shape everything

- **Data cost matters.** Many users are on limited data plans. Bookmarked/
  downloaded subjects must work fully offline; images should be
  aggressively compressed without losing question legibility.
- **Device range is wide.** Needs to run acceptably on a 2GB RAM Android
  device, not just a flagship — this rules out heavy animation-everywhere
  UI and pushes toward a lean React Native or Flutter build with lazy
  image loading.
- **Trust is the product.** A wrong AI answer presented confidently is
  worse than no app at all. Every screen that shows an AI answer must make
  its confidence/review status visible, not buried in a settings page.

## MVP scope (Phase 1 — "it actually works")

Ships with the backend pipeline already built (extraction + review queue):

- Browse subjects → exam type (WAEC/NECO/JAMB/course) → year → question list
- Search by keyword/topic across the whole bank
- Question detail: rendered text + math (KaTeX) + original diagram image,
  "Reveal Padi's answer" (worked solution, LaTeX-rendered)
- Confidence/review badge on every answer (Verified / AI-only / Flagged)
- Bookmarking, with bookmarked subjects available offline
- Basic practice mode: view question, attempt mentally, reveal answer,
  mark "got it" / "missed it" (feeds Phase 2 personalization, does nothing
  fancy yet in Phase 1)

Explicitly **out** of Phase 1: gamification/streaks, social features,
teacher dashboard, monetization, recommendations. Ship the core loop first,
prove people actually use it before building around it.

## Phase 2 — "it gets smarter about you"

- Weak-topic detection from practice-mode history ("You miss Mechanics
  questions more than Waves — here's more of those")
- Streaks + light gamification (daily practice streak, subject completion
  rings) — kept understated, this is a study tool first
- Community correction/upvote on AI answers, surfaced back into the review
  queue you already built rather than a separate moderation system
- Share-to-WhatsApp for individual questions (huge distribution channel in
  this market — a "share this question" button is close to free marketing)

## Phase 3 — "it scales beyond one student"

- Teacher/lecturer accounts: review queue access, ability to contribute
  question sets directly (ties into the existing bulk-ingest pipeline)
- Institution/school licensing — bulk accounts for a school's whole SS3 set
- Offline pack downloads sized for low storage devices (per-subject, not
  all-or-nothing)
- Voice-narrated explanations for accessibility and eyes-off-screen study

## What we will not build unless proven necessary

- A full LMS (courses, assignments, grading) — scope creep away from "past
  questions, answered"
- Live tutoring / chat with humans — different product, different trust
  model, don't blend it in
- Ads — undermines the trust positioning the whole brand rests on;
  monetize via institution licensing and premium offline packs instead,
  if/when monetization is needed at all

## Success signals (in priority order)

1. **Return usage during exam season** — do students come back the week
   before WAEC, not just once out of curiosity
2. **% of AI answers that reach "approved" without edits** — the actual
   quality proxy for the whole pipeline, tracked from the review queue
   already built
3. **Questions viewed per session** — are people browsing meaningfully or
   bouncing after one question
4. **Bookmark → offline-download conversion** — signals genuine "I'm
   relying on this for real study," not casual browsing
5. Everything else (DAU/WAU, retention curves) matters but is secondary to
   the above until Phase 1 proves the core loop works
