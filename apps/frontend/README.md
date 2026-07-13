# Padi — Frontend

Next.js 14 (App Router) + TanStack Query frontend for the Padi question
bank, scoped to Nigerian Army University Biu (NAUB) past questions
organized by course, not secondary-school exam boards.

## What changed in this refactor

**Content model:** `Subject` → `Course` throughout. Courses now carry
`code` (e.g. "SWE218"), `title`, `department`, `level` (e.g. "200L"), and
optional `lecturer`, instead of exam-board/year. Questions carry `examType`
("End of Semester" / "Mid Semester" / "CA" / "Practical") and `session`
("2023/2024") instead of `examBoard`/`year`. See `lib/types.ts`.

**Desktop layout:** the app was mobile-only before - a bottom tab bar and a
hard `max-w-md` cap on every screen, which just left a narrow phone-width
column floating in a sea of whitespace on anything wider. Three changes fix
that:

1. **`Sidebar.tsx`** (new) replaces the bottom tab bar at the `md` breakpoint
   and up - same nav items (shared via `lib/nav-items.ts` so the two stay in
   sync), rendered as a proper left-hand nav instead of a stretched bottom
   bar. `BottomNav.tsx` gets `md:hidden`; `Sidebar.tsx` gets `hidden md:flex`
   - exactly one is ever visible at a given viewport width.
2. **`max-w-md` is now conditional**, not universal - `md:max-w-none` lets
   content use the space the sidebar layout gives it, rather than staying
   phone-width forever. `layout.tsx` wraps everything in a `max-w-6xl`
   overall shell so it doesn't run edge-to-edge ugly on a 1440px+ screen
   either.
3. **Grids use `repeat(auto-fill, minmax(...))`** for the course grid and
   responsive column counts (`sm:grid-cols-2 lg:grid-cols-3`, etc.) for
   question lists, instead of a fixed `grid-cols-2` - columns scale with
   available width rather than a hardcoded breakpoint list.

**Question detail page** specifically gets a `lg:grid-cols-[1fr_360px]`
two-pane layout - question + diagram in the wide left column, the answer
panel sticky in a fixed-width right rail. Below `lg` it's the original
single-column stacked flow (mobile phones and most tablets). Splitting it
this way was the highest-value single change for desktop, since the answer
reveal is the screen people spend the most time on.

## Structure

```
src/
  app/
    page.tsx                — Home (course grid)
    course/[courseId]/      — Course screen (question list)
    question/[questionId]/  — Question detail (two-pane on lg+)
    search/, practice/, bookmarks/, profile/
  components/
    layout/
      Sidebar.tsx            — desktop nav (md+)
      BottomNav.tsx           — mobile nav (below md)
      QueryProvider.tsx, OfflineBanner.tsx
    ui/
      CourseCard.tsx          — code badge, not an icon lookup (arbitrary
                                 course codes don't map to icons cleanly)
      QuestionCard.tsx, ConfidenceBadge.tsx, AnswerRevealSheet.tsx,
      DiagramViewer.tsx
  lib/
    api.ts                  — fetch wrapper, mock/real toggle
    mock-data.ts             — NAUB SWE-curriculum sample data
    types.ts                 — Course/QuestionSummary/QuestionDetail
    nav-items.ts             — shared nav config (Sidebar + BottomNav)
    hooks/
      useQuestionBank.ts      — useCourses, useQuestionsByCourse, etc.
      useBookmarkStore.ts      — Zustand + IndexedDB bookmark store
```

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Runs against mock data out of the box (`NEXT_PUBLIC_USE_MOCKS=true`).

## Backend gaps (unchanged from before, endpoints renamed)

```
GET /question-bank/courses
GET /question-bank/courses/:id/questions?examType=&session=
GET /question-bank/questions/:id
GET /question-bank/search?q=
```

These replace the subject-scoped versions from the earlier draft. On the
backend, `Question.subject` / `SourceDocument.extractedSubject` (from
`document-metadata-prompt.ts`) already extract a course-code-like value
from page 1 content (e.g. it would pick up "SWE218" fine as-is) - the read
endpoints are the only missing piece, not the extraction logic.

## What's intentionally stubbed for now

- **Practice mode course picker** is a hardcoded list of 6 course codes -
  should read from `useCourses()` once that hook's loading state is wired
  in here too.
- **Bookmarks page** fetches from one hardcoded course (`swe218`) as a
  placeholder - needs a `GET /questions?ids=` batch endpoint to fetch
  bookmarks across arbitrary courses properly.
- **Dark mode / streak / offline download UI** in Profile are static rows,
  no logic wired yet.
- **PWA service worker** isn't wired up - `manifest.json` exists but you
  still need `next-pwa` or a hand-rolled service worker for actual offline
  asset caching beyond the IndexedDB bookmark data.
