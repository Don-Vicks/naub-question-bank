# Design System — Padi

## Navigation structure

Bottom tab bar, 5 tabs (thumb-reachable, single-hand use on a phone — most
of this audience studies holding the phone in one hand):

1. **Home** — continue where you left off, subject grid
2. **Search** — keyword/topic search across the whole bank
3. **Practice** — blind quiz mode, separate from browsing so it stays a
   distinct mental mode ("I'm testing myself" vs "I'm looking something up")
4. **Bookmarks** — saved questions, offline-available subjects
5. **Profile** — settings, downloaded packs, review contributions (Phase 2+)

## Core screens

### Home
- Greeting + streak (once Phase 2 ships) kept small, top of screen
- "Continue" card — last subject/year viewed
- Subject grid (Physics, Chemistry, Further Maths, etc.) — each card shows
  exam board icon (WAEC/NECO/JAMB/course-specific) and a subtle progress
  ring once practice history exists

### Subject screen
- Exam board tabs (WAEC / NECO / JAMB / Course) if the subject has more
  than one
- Year list, most recent first
- Small "X questions, Y% reviewed" line — surfaces pipeline quality
  transparently rather than hiding it

### Question list
- Card per question: number, first line of question text (truncated),
  small diagram thumbnail if present, confidence badge
- Filter chip row: "Has diagram," "Multiple choice," "Flagged for review"
  (useful for the rare case a student wants to skip unverified content)

### Question detail
- Question text rendered with KaTeX inline math, original page image
  diagram shown at full width, pinch-to-zoom (many diagrams have fine
  detail — circuit values, graph axis labels)
- "Reveal Padi's answer" — collapsed by default, tap to expand. This
  matters: showing the answer immediately defeats practice value even in
  pure browse mode.
- Confidence/review badge inline with the answer, not just in the list
- Bookmark icon, "Report an issue" link (feeds the review queue)

### Practice mode
- One question at a time, full-screen, swipe or tap through a set
  (subject + year, or "weak topics" once Phase 2 ships)
- Big, deliberate "Reveal answer" action — not accidental-tap-sized
- After reveal: two-button "Got it" / "Missed it" — this is the only
  self-report data the app collects in Phase 1, feeds Phase 2 personalization

### Bookmarks
- List view, grouped by subject
- Per-subject "Download for offline" toggle with a visible size estimate
  (data cost transparency matters a lot for this audience)

### Search
- Single search bar, recent searches below when empty
- Results grouped by subject, not a flat list — helps orientation when a
  keyword spans multiple subjects (e.g. "momentum" appears in Physics and
  Further Maths)

## Components

- **SubjectCard** — icon, name, progress ring, exam board tag
- **QuestionCard** — number, truncated text, diagram thumbnail, confidence
  badge, bookmark toggle
- **ConfidenceBadge** — three states: Verified (green check), AI-only
  (neutral, no alarm — this is the default good state), Flagged (terracotta,
  "still being checked")
- **AnswerRevealSheet** — bottom sheet or inline expand, houses the worked
  answer + confidence badge + "report an issue" link
- **DiagramViewer** — pinch-zoom image component, lazy-loaded, shows a
  blurred low-res placeholder while the full image loads (data-conscious)
- **ProgressRing** — subject completion, used sparingly (Home + Subject
  screen only, not on every card — avoid gamification creep in Phase 1)
- **OfflineBanner** — persistent but unobtrusive strip, not a blocking modal:
  "Offline — showing downloaded subjects only"
- **StreakBadge** — Phase 2, small numeral + flame-adjacent icon (avoid the
  literal flame emoji cliché — use a simple filled circle counter instead,
  fits the paper-and-ink visual language better)

## States

- **Loading:** a thin horizontal line sweeping down the card, evoking a
  scanner/photocopier pass — ties the loading state thematically to what
  the backend is actually doing (scanning/extracting), rather than a
  generic spinner
- **Empty (no bookmarks):** "Nothing on your shelf yet — bookmark a
  question to start building it"
- **Empty (search, no results):** "Padi couldn't find that one — try a
  different topic or check the subject name"
- **Error (extraction/network):** plain, specific language, never a generic
  "Something went wrong" — e.g. "Couldn't load this page — check your
  connection and try again"
- **Offline:** downloaded content fully usable, everything else shows the
  OfflineBanner rather than blocking the whole app

## Accessibility & performance

- Font scaling respected throughout, tested specifically on the math-heavy
  question detail screen where a fixed-size KaTeX render could otherwise
  become illegible at larger system font sizes
- Dark mode as a first-class palette (see brand.md), not an inverted
  afterthought — genuinely useful for late-night study sessions and saves
  battery on the OLED screens common in this device range
- Images lazy-loaded and compressed; diagram thumbnails in list views are a
  separate, much smaller asset from the full-resolution zoomable version
- Target smooth performance on ~2GB RAM Android devices as the baseline,
  not the exception
