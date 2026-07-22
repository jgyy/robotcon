# Robotcon Learning Webapp + Quiz — Design

Date: 2026-07-22

## Purpose

`robotcon` is a personal, numbered roadmap of robotics courses written as markdown:
17 topics (`NNtopic.md` abstracts at the repo root), each with a `NNtopic/` directory
containing one subdirectory per course, and one markdown file per unit inside each
course directory. Today the only way to consume this is opening files in an editor.

This project turns that content into a locally-run webapp for browsing lessons, and
adds a randomized multiple-choice quiz (1000+ questions) generated from the lesson
content itself, to support active recall alongside reading.

## Current content inventory (measured 2026-07-22)

- 711 markdown files total
- 17 root topic abstracts (`NNtopic.md`) + 1 root `README.md`
- 98 course directories, each with a course `README.md` (overview + unit list)
- 600 unit files (the actual lesson content), word count 428–1302, median 649,
  average 667; only 26 files are under 500 words (none under 300)
- Units already contain GitHub-flavored markdown, fenced code blocks, and Mermaid
  diagrams in a consistent style

## Scope

One project, two connected feature areas: a content viewer and a quiz engine, both
served by the same local Next.js app. The quiz question bank is produced by an
offline, one-time content pipeline (not a runtime LLM call).

Out of scope (explicitly not building): authentication, a database/backend, hosting
beyond local dev, full-text search, topic-scoped quizzes (quiz is always a random mix
across the whole bank per user decision), and automated UI test suites.

## Architecture

- New Next.js (App Router, TypeScript) project in `webapp/` at the repo root.
- Content stays exactly where it is (`../NNtopic.md`, `../NNtopic/**/*.md` relative to
  `webapp/`) — the app reads files via Node `fs` at build/request time. Single source
  of truth; editing a lesson file later just needs a rebuild/refresh, no sync step.
- Run via `npm run dev` inside `webapp/`. No deployment target.
- No backend/database. The only generated artifact checked into the repo is
  `webapp/data/questions.json` (the quiz bank).

## Content pipeline (one-time, offline, run before the webapp is useful)

Run as a single Workflow invocation (~700 agent calls total, under the tool's
1000-calls-per-run cap). This is a real, one-time token spend — not something that
runs on every app load or every dev server start.

1. **Audit** (already done for the design): word-count every unit file; files under
   500 words are flagged as too thin to safely support 2-3 non-trivial, non-repetitive
   questions. Current count: 26 files.
2. **Expand** — one agent per flagged file. Extends that unit's actual `.md` file in
   place to roughly the course's normal depth (~600-900 words), matching the
   surrounding units' tone, structure, and technical accuracy. No fabricated APIs,
   commands, or facts — expansions must be grounded in real robotics/ROS knowledge
   consistent with the rest of the course.
3. **Generate** — one agent per unit file (600 total, run after step 2 so thin files
   are already expanded). Each agent reads its single unit file and emits exactly 3
   multiple-choice questions grounded in that file's content: 4 answer options, 1
   correct index, a short explanation (why the correct answer is correct), and tags
   `{topicId, courseId, unitId}`. Target raw pool: ~1800 questions.
4. **Verify** — one agent per course (98 total). Each reviews every question generated
   from that course's own units together (so it can catch cross-unit duplicates and
   near-duplicates within the course) and checks: answerable from the cited unit's
   text, exactly one unambiguously correct option, three plausible-but-wrong
   distractors, no duplicate/near-duplicate questions. Fixes minor issues in place;
   drops questions it can't fix.
5. **Assemble** — merge every course's surviving questions into
   `webapp/data/questions.json`. Validate mechanically (see Testing) and assert the
   final count is at least 1000. Log the final count and flag any topic whose
   surviving question count looks disproportionately low (e.g. most units lost to
   verification) so it can be spot-checked or re-run.

If the final assembled count somehow lands under 1000 (verification proves stricter
than expected), the fallback is targeted: re-run generation for the courses with the
weakest yield asking for a 4th question per unit in that course only, then re-verify
just those — not a wholesale re-run.

## Content viewer

Routes (all server components reading markdown at request time in dev):

- `/` — Home: the 17 topics (from the root `README.md` roadmap table) and the
  existing learning-path Mermaid diagram, rendered.
- `/topics/[topic]` — renders that topic's root abstract (`NNtopic.md`): course
  catalog style overview, links to each course.
- `/topics/[topic]/[course]` — renders that course's `README.md`: overview + unit
  list.
- `/topics/[topic]/[course]/[unit]` — renders the unit's markdown: GFM (tables,
  strikethrough, etc.), syntax-highlighted fenced code blocks, Mermaid diagrams
  rendered client-side, plus previous/next unit links within the course.
- Persistent nav bar: Home / Browse / Quiz / History.

Markdown rendering: `gray-matter` (if any frontmatter is ever added) is not required
today since files have none; use `remark`/`rehype` pipeline with `remark-gfm` and a
syntax highlighter (`rehype-pretty-code` or `shiki`) for code fences, and a small
client component wrapping `mermaid.js` for ` ```mermaid ` blocks (render on mount,
keyed by content hash so re-navigation re-renders correctly).

## Quiz

- `/quiz` — "Start Quiz": draws 20 random questions from the full
  `questions.json` pool. Both the question order and each question's own
  answer-option order are shuffled per session (Fisher-Yates), so the correct
  answer isn't always in the same position and repeat sessions don't feel identical.
- `/quiz/session` — one question at a time. User picks an option; the app
  immediately reveals correct/incorrect plus the stored explanation, then a "Next"
  control advances. No going back to change an answered question.
- `/quiz/results` — final screen: score out of 20, and a review list of every missed
  question (question text, the option picked, the correct option, the explanation,
  and a link to the source unit page for that question's `unitId`).
- `/quiz/history` — reads past sessions from `localStorage`: a simple list (date,
  score) plus a per-topic accuracy breakdown computed by aggregating misses across
  all stored sessions, to surface which topics tend to get missed.

## Data & storage

- `webapp/data/questions.json`: static array of
  `{ id, topicId, courseId, unitId, question, options: string[4], correctIndex, explanation }`.
  Bundled at build time; no runtime generation, no external calls.
- `localStorage` key `robotcon-quiz-history`: array of
  `{ date, score, total, missedQuestionIds: string[] }`. Read/written only by the
  quiz pages; nothing server-side depends on it.

## Testing / verification

- Content pipeline: the Verify step (per-course agent) is the primary QA gate.
  Additionally, the Assemble step runs a mechanical validation pass over the merged
  JSON asserting: exactly 4 options per question, `correctIndex` in range, non-empty
  `explanation`, and valid `topicId`/`courseId`/`unitId` references that resolve to a
  real file — before writing `questions.json` and before declaring the count target
  met.
- Webapp: no automated UI test suite (personal local app, out of scope per Scope
  section). Manual verification instead: run the dev server, browse into a couple of
  topics/courses/units and confirm code blocks and at least one Mermaid diagram
  render correctly, run one full 20-question quiz session end to end including a
  wrong answer to confirm the explanation and results/review screen work, and
  confirm a completed session shows up on `/quiz/history` after a page reload.

## Open risks / assumptions

- Mermaid rendering client-side on every unit page load is cheap enough for a local
  personal app; if it ever feels slow, the fix (out of scope for now) would be to
  precompute SVGs at build time instead.
- Some unit files may cover material that resists clean 4-option MCQs (e.g. purely
  conceptual/discussion units). The per-unit generation agent is expected to still
  produce fact-based questions from definitions, comparisons, and "why" explanations
  present in the text; the Verify step is the backstop for anything that comes out
  too ambiguous.
