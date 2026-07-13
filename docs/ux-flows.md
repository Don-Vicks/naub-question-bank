# UX Flows — Padi

## 1. First open (onboarding)

```
Splash (logo mark on navy)
  → "What are you preparing for?" (single-select: WAEC / NECO / JAMB / 
     University course)
  → If University: "Which school?" (searchable list, NAUB etc. pre-seeded)
  → "Pick your subjects" (multi-select, at least 1 required)
  → Home, pre-filtered to selected subjects
```

Kept to 3 taps. No account creation required to browse — accounts only
become necessary for bookmarks/offline sync, requested at the moment a user
first taps "Bookmark," not upfront. Forcing signup before any value is shown
is the single biggest churn risk for this audience.

## 2. Browse → answer → bookmark (the core loop)

```
Home
  → tap Subject card
  → Subject screen (pick exam board tab if applicable, pick year)
  → Question list (scroll/filter)
  → tap Question card
  → Question detail (read question, view diagram if present)
  → tap "Reveal Padi's answer"
  → AnswerRevealSheet expands (worked solution + confidence badge)
  → optional: tap bookmark icon
  → back-swipe returns to Question list, scroll position preserved
```

This is the flow that has to be frictionless above all others — everything
else in the app supports or extends it.

## 3. Practice mode

```
Practice tab
  → "What do you want to practice?" (Subject + Year, or "Weak topics" once
     Phase 2 history exists)
  → Full-screen question, no answer visible
  → user attempts mentally
  → tap "Reveal answer" (deliberately large, can't be mis-tapped mid-attempt)
  → answer shown with confidence badge
  → "Got it" / "Missed it"
  → auto-advance to next question in the set
  → end of set: simple summary ("14/20 — strongest: Optics, weakest: Waves")
```

Note the summary is descriptive, not scored/graded — this is self-study,
not an exam simulation, and shouldn't feel punitive.

## 4. Search

```
Search tab
  → type keyword ("projectile motion")
  → live results, grouped by subject
  → tap result
  → Question detail (same screen as core loop, arrived at a different way)
```

## 5. Offline / low-data flow

```
Bookmarks tab
  → tap subject group
  → toggle "Download for offline" (shows size estimate before confirming)
  → download progresses in background, banner shows progress
  → subject now fully usable with no connection:
     Home/Search continue to work for downloaded content only,
     OfflineBanner appears if user navigates to non-downloaded content
```

## 6. Reporting a wrong/unclear answer

```
Question detail
  → tap "Report an issue" (near the answer, not buried in a menu)
  → short form: "What's wrong?" (Wrong answer / Unclear transcription /
     Diagram missing or wrong / Other)
  → optional free-text note
  → submit
  → confirmation: "Thanks — a human will check this" 
  → (backend: creates/updates a review-queue entry tied to that Question,
     reusing the existing review_status flagging mechanism rather than a
     separate feedback table)
```

This is the connective tissue between the mobile app and the backend review
queue already built — user reports become flagged questions the same way a
low-confidence Gemini extraction does, so there's one review workflow, not
two.

## 7. Admin/teacher review (Phase 3, sketch only)

```
Teacher account → Review tab (not visible to student accounts)
  → Flagged question queue (same data as backend review_status='flagged')
  → view original page image + AI transcription side by side
  → approve / edit-and-approve / reject
```

This is functionally the same review UI concept as the backend's
`review.controller.ts` — Phase 3 work is mostly building a mobile-friendly
frontend on top of endpoints that already exist, not new backend logic.
