# Brand — Padi

## The name

**Padi** — Nigerian pidgin for "friend." Full lockup when you need it:
**"Padi — your past-questions padi."**

Why this over a generic "QuestionBank" / "ExamPrep" name: every other app in
this space sounds like a school administrator named it. Padi sounds like the
senior student who already has the past questions sorted, already knows
which topics repeat every year, and is willing to walk you through it —
which is exactly what the AI-answer feature actually does. The name carries
the product's whole personality in one word, in the user's own register.

Alternates considered, kept here in case Padi tests badly with real users:
- **Krammit** — leans into "cramming," more exam-season urgency, less warmth
- **ThinkCap** — more generic, works internationally, loses the local voice
- **PastQ** — very literal, good as a secondary/short internal name

## Positioning

Not "an AI quiz app." Not "a past questions PDF dump." Padi is the middle
ground: every past question you'd normally find scattered across group
chats and photocopied packs, actually organized, with the working shown —
like a padi who's already done the question sat next to you.

**One-liner:** Every past question. Answered. Explained.

**Who it's for:** WAEC/NECO/JAMB candidates and university students (NAUB-
style course exams) who currently study from screenshots, PDF forwards, and
whatever a senior shared in the class group chat.

**What it's explicitly not:** a polished, corporate "learning management
system." Padi should feel like it was built by someone who sat the same
exams recently, not by a textbook publisher.

## Personality

- **Plainspoken, not corporate.** Copy reads like a capable coursemate, not
  marketing copy. "Nice, you cleared Further Maths 2019" not "Congratulations
  on your achievement!"
- **Confident but never condescending.** It has the answer, but it doesn't
  gatekeep the working — every AI answer shows its steps, always.
- **Locally fluent, not performative.** Light pidgin/Nigerian English in UI
  copy where it's natural (button labels, empty states, encouragement
  micro-copy) — never forced into full pidgin, never used where precision
  matters (subject names, instructions, math itself stay standard).
- **Honest about uncertainty.** If an AI answer's confidence is low, the app
  says so plainly rather than hiding it. Trust is the entire product; a
  wrong answer presented confidently is worse than no answer.

### Voice examples

| Context | Generic ed-tech voice | Padi voice |
|---|---|---|
| Empty bookmarks | "You have no saved items" | "Nothing saved yet — bookmark a question to build your shelf" |
| Low-confidence answer | "This answer may be inaccurate" | "Padi's not 100% sure on this one — flagged for a human check" |
| Streak nudge | "Keep your streak alive!" | "3 days running. Don't break it for WhatsApp." |
| Offline mode | "No internet connection" | "Off the grid? Your downloaded subjects still work." |

## Visual identity

**Reference point:** an exam answer sheet, not a corporate dashboard —
lightly textured off-white surfaces, a navy "ink" tone for text and
structure, and one warm, energetic accent for anything actionable. The goal
is "feels like paper, behaves like software."

### Color palette

| Role | Color | Hex | Use |
|---|---|---|---|
| Ink (primary text/structure) | Deep navy | `#1B2340` | Headings, icons, nav bar |
| Paper (background) | Warm off-white | `#FAF6EE` | Screen backgrounds — never pure white, reads as paper not plastic |
| Accent (primary action) | Marigold | `#F2A93B` | CTAs, active states, streak badges |
| Accent secondary | Terracotta | `#D9603B` | Alerts, low-confidence flags, urgency |
| Success / verified | Deep green | `#2F6F4E` | "Reviewed & approved" badge |
| Surface | Card white | `#FFFFFF` | Cards on top of paper background |
| Muted | Warm grey | `#8A8578` | Secondary text, timestamps |
| Dark mode ink | Near-black navy | `#12162B` | Dark mode background |

Marigold and terracotta are deliberately warmer than typical ed-tech blues —
this should feel closer to Nigerian textile color energy (think Ankara
palettes) than a Silicon Valley SaaS dashboard.

### Typography

- **UI / body:** Manrope or Inter — rounded-enough to feel friendly,
  functional enough for dense subject lists.
- **Question/answer content:** rendered via KaTeX using its default Latin
  Modern math font for equations, paired with a slightly serif-leaning body
  font (e.g. Lora) for the surrounding question text — this is the one place
  in the app that's allowed to feel like an actual exam paper rather than an
  app.
- **Numerals for question numbers/scores:** tabular figures, slightly bold —
  these act as visual anchors when scanning a long list of questions.

### Logo concept

A speech-bubble tail merged with a checkmark — reads simultaneously as
"conversation" (asking your padi) and "correct answer" (the checkmark).
Rendered as a single navy mark on paper-colored background for the primary
lockup; inverted (marigold mark on navy) for splash screens and dark mode.

Avoid: mortarboard/graduation cap iconography (overused in every ed-tech
logo), generic open-book icons, anything that reads as "school
administration software."

### Iconography style

Rounded-corner line icons, 2px stroke, no fill except for active/selected
states — consistent with the "friendly notebook sketch" feel rather than
sharp corporate iconography. Diagrams and figures within questions keep
their original photographed/scanned appearance rather than being redrawn —
authenticity over polish there, since a redrawn circuit diagram risks
introducing the exact transcription errors the whole pipeline is built to
avoid.
