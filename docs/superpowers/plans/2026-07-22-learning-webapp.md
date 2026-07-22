# Robotcon Learning Webapp + Quiz Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local Next.js webapp that browses the 711 existing markdown lesson
files and serves a randomized 1000+ question multiple-choice quiz generated from
that content.

**Architecture:** A Next.js 14 (App Router, TypeScript) project in `webapp/` reads
the existing `NNtopic.md` / `NNtopic/<course>/README.md` / `NNtopic/<course>/<unit>.md`
files from the repo root via Node `fs` — no content is duplicated. The quiz bank is a
static `webapp/data/questions.json` produced once by an offline multi-agent content
pipeline (expand thin lessons → generate MCQs per unit → verify per course →
assemble), not generated at runtime. The quiz UI is entirely client-side: question
draw/shuffle logic lives in pure, unit-tested functions, and progress is stored in
`sessionStorage` (in-progress session) and `localStorage` (completed-session history).

**Tech Stack:** Next.js 14 (App Router) + TypeScript + React 18, `react-markdown` +
`remark-gfm` + `rehype-highlight` for content rendering, `mermaid` for diagrams,
Vitest for unit tests. No backend, no database, no deployment config.

**Spec:** `docs/superpowers/specs/2026-07-22-learning-webapp-design.md`

## Global Constraints

- Next.js is pinned to `^14.2.5` (App Router). Dynamic route `params` are plain
  objects in this version, not Promises — do not upgrade to Next 15's App Router
  without updating every `params` usage to the async API.
- TypeScript `strict: true`.
- Content files under `01foundations/`, `02basicros2/`, ... `17forhighschoolers/`
  and the 17 root `NNtopic.md` abstracts are the single source of truth. The webapp
  reads them via `fs` at request/build time; it never copies them into `webapp/`.
- No backend, no database, no auth, no deployment target — local dev only
  (`npm run dev` from inside `webapp/`).
- Quiz is always a random mix across the full question bank (no topic-scoped quiz
  mode) — 20 questions per session, instant feedback per question, no going back to
  change an answered question.
- In-progress quiz session state lives in `sessionStorage`; only completed-session
  summaries persist in `localStorage` (key `robotcon-quiz-history`).
- No automated UI/browser test suite — verified manually per Task 19's checklist.
  Pure logic (`lib/*.ts`, excluding React components and the content pipeline
  scripts) is unit-tested with Vitest.
- Confirmed content inventory (2026-07-22): 17 topics, 93 courses (each with a
  `README.md`), 600 unit files (428–1302 words, 26 under the 500-word threshold).

---

## Part 1 — Project scaffolding

### Task 1: Scaffold the Next.js + TypeScript + Vitest project

**Files:**
- Create: `webapp/package.json`
- Create: `webapp/tsconfig.json`
- Create: `webapp/next.config.mjs`
- Create: `webapp/next-env.d.ts`
- Create: `webapp/vitest.config.ts`
- Create: `webapp/app/layout.tsx`
- Create: `webapp/app/globals.css`
- Create: `webapp/app/page.tsx`
- Create: `webapp/.gitignore`

**Interfaces:**
- Produces: a runnable `npm run dev` (Next dev server on port 3000), `npm test`
  (Vitest), and `npm run build` (Next production build, used as a type-check gate
  by later tasks) inside `webapp/`.

- [ ] **Step 1: Create `webapp/package.json`**

```json
{
  "name": "robotcon-webapp",
  "private": true,
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest run"
  },
  "dependencies": {
    "next": "^14.2.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-markdown": "^9.0.1",
    "remark-gfm": "^4.0.0",
    "rehype-highlight": "^7.0.0",
    "highlight.js": "^11.10.0",
    "mermaid": "^11.4.0"
  },
  "devDependencies": {
    "typescript": "^5.5.4",
    "@types/node": "^20.14.0",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "vitest": "^2.1.0"
  }
}
```

- [ ] **Step 2: Create `webapp/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Create `webapp/next.config.mjs`**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {};
export default nextConfig;
```

- [ ] **Step 4: Create `webapp/next-env.d.ts`**

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />
```

- [ ] **Step 5: Create `webapp/vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['lib/**/*.test.ts'],
  },
});
```

- [ ] **Step 6: Create `webapp/app/globals.css`**

```css
body {
  font-family: system-ui, sans-serif;
  max-width: 860px;
  margin: 0 auto;
  padding: 1rem;
  line-height: 1.6;
}

.nav-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #ccc;
  padding-bottom: 0.5rem;
}

.mermaid-diagram {
  margin: 1.5rem 0;
  text-align: center;
}

.unit-pager {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

pre {
  overflow-x: auto;
  padding: 0.75rem;
  border-radius: 6px;
}

.quiz-options {
  list-style: none;
  padding: 0;
}

.quiz-options button {
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.5rem;
}

.quiz-options button.correct {
  background: #d4f7d4;
}

.quiz-options button.wrong {
  background: #f7d4d4;
}
```

- [ ] **Step 7: Create `webapp/app/layout.tsx` (placeholder body, NavBar added in Task 6)**

```tsx
import type { ReactNode } from 'react';
import 'highlight.js/styles/github-dark.css';
import './globals.css';

export const metadata = {
  title: 'robotcon',
  description: 'Personal robotics learning roadmap and quiz',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 8: Create `webapp/app/page.tsx` (placeholder, replaced in Task 7)**

```tsx
export default function HomePage() {
  return <main>robotcon</main>;
}
```

- [ ] **Step 9: Create `webapp/.gitignore`**

```
node_modules/
.next/
```

- [ ] **Step 10: Install and verify the dev server boots**

```bash
cd webapp && npm install
```

Then run `npm run dev`, open `http://localhost:3000`, confirm the page shows
"robotcon", then stop the server (Ctrl-C).

- [ ] **Step 11: Commit**

```bash
cd webapp && git add package.json package-lock.json tsconfig.json next.config.mjs \
  next-env.d.ts vitest.config.ts app/layout.tsx app/globals.css app/page.tsx .gitignore
git commit -m "feat: scaffold Next.js webapp project"
```

---

## Part 2 — Content pipeline (produces the quiz question bank)

### Task 2: Build the content manifest (topics/courses/units + thin-file audit)

**Files:**
- Create: `webapp/scripts/build-manifest.mjs`
- Create: `webapp/data/manifest.json` (generated output)

**Interfaces:**
- Produces: `webapp/data/manifest.json` shaped as
  `{ generatedAt, topics: string[], courses: {topicId, courseId, unitIds: string[]}[],
  units: {topicId, courseId, unitId, path, words, thin}[], thinUnits: (same shape as units, thin===true only) }`.
  `path` is repo-root-relative (e.g. `01foundations/linux-for-robotics/01-introduction.md`).
  Consumed by Task 3 to build the pipeline Workflow's `args`.

- [ ] **Step 1: Create `webapp/scripts/build-manifest.mjs`**

```js
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_ROOT = path.join(__dirname, '..', '..');
const THIN_WORD_THRESHOLD = 500;

function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

const topics = fs
  .readdirSync(CONTENT_ROOT)
  .filter((name) => /^\d{2}[a-z]+\.md$/.test(name))
  .map((name) => name.replace(/\.md$/, ''))
  .sort();

const courses = [];
const units = [];

for (const topicId of topics) {
  const topicDir = path.join(CONTENT_ROOT, topicId);
  const courseDirs = fs
    .readdirSync(topicDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  for (const courseId of courseDirs) {
    const courseDir = path.join(topicDir, courseId);
    const unitFiles = fs
      .readdirSync(courseDir)
      .filter((name) => /^\d{2}-.*\.md$/.test(name))
      .sort();

    const unitIds = [];
    for (const fileName of unitFiles) {
      const unitId = fileName.replace(/\.md$/, '');
      const filePath = path.join(courseDir, fileName);
      const words = wordCount(fs.readFileSync(filePath, 'utf8'));
      units.push({
        topicId,
        courseId,
        unitId,
        path: path.relative(CONTENT_ROOT, filePath),
        words,
        thin: words < THIN_WORD_THRESHOLD,
      });
      unitIds.push(unitId);
    }
    courses.push({ topicId, courseId, unitIds });
  }
}

const manifest = {
  generatedAt: new Date().toISOString(),
  topics,
  courses,
  units,
  thinUnits: units.filter((u) => u.thin),
};

const outPath = path.join(__dirname, '..', 'data', 'manifest.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2));

console.log(
  `topics=${topics.length} courses=${courses.length} units=${units.length} thin=${manifest.thinUnits.length}`,
);
```

- [ ] **Step 2: Run it and verify the counts**

```bash
cd webapp && node scripts/build-manifest.mjs
```

Expected stdout: `topics=17 courses=93 units=600 thin=26`

If any number differs, the content tree changed since this plan was written —
re-derive the expected numbers with the same `find`/`wc -w` approach used in the
spec before continuing, rather than assuming the plan's numbers are still right.

- [ ] **Step 3: Commit**

```bash
cd webapp && git add scripts/build-manifest.mjs data/manifest.json
git commit -m "feat: add content manifest builder"
```

### Task 3: Run the content pipeline (expand thin units, generate + verify quiz questions)

**Files:**
- Modify: the `path` files listed in `manifest.json`'s `thinUnits` (26 lesson `.md`
  files, expanded in place)
- Create: `webapp/data/questions.json` (generated output)
- Create: `webapp/scripts/validate-questions.mjs`

**Interfaces:**
- Consumes: `webapp/data/manifest.json` from Task 2.
- Produces: `webapp/data/questions.json`, an array of
  `{ id: string, topicId: string, courseId: string, unitId: string, question: string,
  options: string[4], correctIndex: 0|1|2|3, explanation: string }`, validated to
  have at least 1000 entries. Consumed by `lib/questions.ts` in Task 12.

This task is a one-time data-generation run via the Workflow tool rather than
classic TDD — its "test" is the validation script in Step 4.

- [ ] **Step 1: Read `webapp/data/manifest.json` and build the Workflow call's `args`**

Read the manifest and construct:

```js
const args = {
  thinUnits: manifest.units
    .filter((u) => u.thin)
    .map(({ topicId, courseId, unitId, path }) => ({ topicId, courseId, unitId, path })),
  units: manifest.units.map(({ topicId, courseId, unitId, path }) => ({
    topicId,
    courseId,
    unitId,
    path,
  })),
  courses: manifest.courses,
};
```

- [ ] **Step 2: Invoke the Workflow tool with this script and the `args` from Step 1**

```js
export const meta = {
  name: 'robotcon-quiz-pipeline',
  description: 'Expand thin lesson units, generate quiz questions per unit, verify per course',
  phases: [
    { title: 'Expand', detail: 'extend lesson units under 500 words' },
    { title: 'Generate', detail: 'write 3 MCQs per unit file' },
    { title: 'Verify', detail: 'review generated questions per course' },
  ],
}

const { thinUnits, units, courses } = args

const EXPAND_PROMPT = (u) =>
  `Read the robotics lesson file at repo-relative path "${u.path}". ` +
  `It is unit "${u.unitId}" of the course "${u.courseId}" in topic "${u.topicId}", part of a personal robotics learning roadmap. ` +
  `The file is currently short (under 500 words) compared to sibling units in the same course (typically 600-1300 words). ` +
  `Read the other unit files in the same course directory first to match its depth, tone, and structure (headings, code fences, mermaid diagrams where relevant). ` +
  `Then rewrite the file's content to roughly 600-900 words: keep every fact and instruction that is already correct, and add genuinely useful depth (more explanation of the "why", a concrete example, a short code or command snippet, or a small mermaid diagram) rather than padding with filler. ` +
  `Do not invent APIs, commands, or claims you are not confident are accurate for this domain. ` +
  `Overwrite the file at "${u.path}" with the expanded markdown using the Write tool, keeping its existing first-level heading. ` +
  `Reply with the single word "done" once the file has been overwritten.`

phase('Expand')
await parallel(thinUnits.map((u) => () => agent(EXPAND_PROMPT(u), { phase: 'Expand', label: u.unitId })))

const QUESTIONS_SCHEMA = {
  type: 'object',
  properties: {
    questions: {
      type: 'array',
      minItems: 3,
      maxItems: 3,
      items: {
        type: 'object',
        properties: {
          question: { type: 'string' },
          options: { type: 'array', items: { type: 'string' }, minItems: 4, maxItems: 4 },
          correctIndex: { type: 'integer', minimum: 0, maximum: 3 },
          explanation: { type: 'string' },
        },
        required: ['question', 'options', 'correctIndex', 'explanation'],
      },
    },
  },
  required: ['questions'],
}

const GENERATE_PROMPT = (u) =>
  `Read the robotics lesson file at repo-relative path "${u.path}" (unit "${u.unitId}", course "${u.courseId}", topic "${u.topicId}"). ` +
  `Write exactly 3 multiple-choice questions that test understanding of THIS file's actual content (definitions, comparisons, cause/effect, "why" explanations, or concrete facts it states) — not generic robotics trivia unrelated to the text. ` +
  `Each question needs exactly 4 answer options with exactly one correct option, and a short explanation of why the correct option is right. ` +
  `Distractors must be plausible to someone who skimmed the unit, not obviously silly. Do not write questions answerable without having read this file.`

phase('Generate')
const generated = await pipeline(
  units,
  (u) =>
    agent(GENERATE_PROMPT(u), { phase: 'Generate', schema: QUESTIONS_SCHEMA, label: u.unitId }).then(
      (r) => (r ? { ...u, questions: r.questions } : null),
    ),
)

const VERIFY_SCHEMA = {
  type: 'object',
  properties: {
    questions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          unitId: { type: 'string' },
          question: { type: 'string' },
          options: { type: 'array', items: { type: 'string' }, minItems: 4, maxItems: 4 },
          correctIndex: { type: 'integer', minimum: 0, maximum: 3 },
          explanation: { type: 'string' },
        },
        required: ['unitId', 'question', 'options', 'correctIndex', 'explanation'],
      },
    },
  },
  required: ['questions'],
}

phase('Verify')
const verified = await pipeline(courses, (c) => {
  const courseQuestions = generated
    .filter(Boolean)
    .filter((g) => g.topicId === c.topicId && g.courseId === c.courseId)
    .flatMap((g) => g.questions.map((q) => ({ ...q, unitId: g.unitId })))
  if (courseQuestions.length === 0) return null
  const VERIFY_PROMPT =
    `Here are ${courseQuestions.length} multiple-choice questions generated from the units of the course "${c.courseId}" (topic "${c.topicId}"): ` +
    `${JSON.stringify(courseQuestions)}. For each question, read the cited unit file (path pattern: <topicId>/<courseId>/<unitId>.md) and check: (1) it is answerable from that unit's actual text, ` +
    `(2) exactly one option is unambiguously correct, (3) the other three are plausible but wrong, (4) it is not a near-duplicate of another question in this list. ` +
    `Fix minor wording/option issues in place where you can. Drop any question you cannot fix into a passing state. ` +
    `Return the surviving (and possibly fixed) questions, each still tagged with its original unitId.`
  return agent(VERIFY_PROMPT, { phase: 'Verify', schema: VERIFY_SCHEMA, label: `${c.topicId}/${c.courseId}` }).then(
    (r) => (r ? r.questions.map((q) => ({ ...q, topicId: c.topicId, courseId: c.courseId })) : []),
  )
})

const allQuestions = verified
  .filter(Boolean)
  .flat()
  .map((q, i) => ({
    id: `${q.topicId}__${q.courseId}__${q.unitId}__${i}`,
    topicId: q.topicId,
    courseId: q.courseId,
    unitId: q.unitId,
    question: q.question,
    options: q.options,
    correctIndex: q.correctIndex,
    explanation: q.explanation,
  }))

log(`assembled ${allQuestions.length} questions from ${units.length} units across ${courses.length} courses`)

return { questions: allQuestions, count: allQuestions.length }
```

No `isolation: 'worktree'` is needed for the Expand phase even though it runs in
`parallel`: every thin-unit agent writes to a different file, so there is no
conflict to isolate against.

- [ ] **Step 3: Write the Workflow's returned `questions` array to `webapp/data/questions.json`**

Pretty-print with 2-space indentation, matching the shape from Step 2's `return`.

- [ ] **Step 4: Create `webapp/scripts/validate-questions.mjs`**

```js
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_ROOT = path.join(__dirname, '..', '..');
const questionsPath = path.join(__dirname, '..', 'data', 'questions.json');

const questions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

if (!Array.isArray(questions)) {
  throw new Error('questions.json must be a JSON array');
}

const ids = new Set();
const errors = [];

for (const [index, q] of questions.entries()) {
  const where = `questions[${index}] (id=${q.id})`;
  if (typeof q.id !== 'string' || q.id.length === 0) errors.push(`${where}: missing id`);
  if (ids.has(q.id)) errors.push(`${where}: duplicate id`);
  ids.add(q.id);
  if (typeof q.question !== 'string' || q.question.trim().length === 0) {
    errors.push(`${where}: missing question text`);
  }
  if (!Array.isArray(q.options) || q.options.length !== 4) {
    errors.push(`${where}: options must be an array of exactly 4 strings`);
  } else if (q.options.some((o) => typeof o !== 'string' || o.trim().length === 0)) {
    errors.push(`${where}: options must all be non-empty strings`);
  }
  if (!Number.isInteger(q.correctIndex) || q.correctIndex < 0 || q.correctIndex > 3) {
    errors.push(`${where}: correctIndex must be an integer 0-3`);
  }
  if (typeof q.explanation !== 'string' || q.explanation.trim().length === 0) {
    errors.push(`${where}: missing explanation`);
  }
  const unitPath = path.join(CONTENT_ROOT, q.topicId, q.courseId, `${q.unitId}.md`);
  if (!fs.existsSync(unitPath)) {
    errors.push(`${where}: referenced unit file does not exist: ${unitPath}`);
  }
}

if (errors.length > 0) {
  console.error(`${errors.length} validation error(s):`);
  for (const e of errors.slice(0, 50)) console.error(` - ${e}`);
  process.exit(1);
}

if (questions.length < 1000) {
  console.error(`Only ${questions.length} questions, below the 1000 target.`);
  process.exit(1);
}

console.log(`OK: ${questions.length} valid questions.`);
```

- [ ] **Step 5: Run the validator**

```bash
cd webapp && node scripts/validate-questions.mjs
```

Expected: `OK: N valid questions.` with `N >= 1000`.

**Fallback if it fails:** if validation errors point at malformed entries, fix
`questions.json` directly for those entries and re-run. If the total count is
under 1000, use the per-course counts logged during Step 2's Verify phase to find
the courses with the lowest yield, re-run Steps 2–5 scoped to only those courses'
`units` (ask for 4 questions per unit instead of 3 in `GENERATE_PROMPT` for this
targeted re-run), and merge the extra survivors into `questions.json` before
re-validating — not a full re-run of all 600 units.

- [ ] **Step 6: Review and commit**

Run `git status` from the repo root. Confirm it shows exactly: the `webapp/data/`
additions, `webapp/scripts/validate-questions.mjs`, and modified files under the
thin-unit paths listed in `manifest.json`'s `thinUnits` — nothing else. Then:

```bash
git add webapp/data/questions.json webapp/scripts/validate-questions.mjs
git add <each modified thin-unit path from manifest.json's thinUnits>
git commit -m "feat: generate and verify the quiz question bank"
```

---

## Part 3 — Content viewer

### Task 4: Content-loading library (`lib/content.ts`)

**Files:**
- Create: `webapp/lib/content.ts`
- Test: `webapp/lib/content.test.ts`

**Interfaces:**
- Produces: `getTopics(): TopicSummary[]`, `getTopicMarkdown(topicSlug): string`,
  `getCourses(topicSlug): CourseSummary[]`, `getCourseMarkdown(topicSlug, courseSlug): string`,
  `getUnits(topicSlug, courseSlug): UnitSummary[]`,
  `getUnitMarkdown(topicSlug, courseSlug, unitSlug): string`,
  `getAdjacentUnits(topicSlug, courseSlug, unitSlug): { prev: UnitSummary | null; next: UnitSummary | null }`
  where `TopicSummary = CourseSummary = UnitSummary = { slug: string; title: string }`.
  Consumed by Tasks 7–11's pages.

- [ ] **Step 1: Write the failing tests in `webapp/lib/content.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import {
  getAdjacentUnits,
  getCourses,
  getTopics,
  getUnitMarkdown,
  getUnits,
} from './content';

describe('content', () => {
  it('lists all 17 topics sorted by slug', () => {
    const topics = getTopics();
    expect(topics.length).toBe(17);
    expect(topics[0].slug).toBe('01foundations');
    expect(topics[0].title.length).toBeGreaterThan(0);
  });

  it('lists courses for a known topic', () => {
    const courses = getCourses('01foundations');
    expect(courses.map((c) => c.slug)).toContain('linux-for-robotics');
  });

  it('lists units for a known course in order', () => {
    const units = getUnits('01foundations', 'linux-for-robotics');
    expect(units.map((u) => u.slug)).toEqual([
      '01-introduction',
      '02-linux-essentials',
      '03-advanced-utilities-i',
      '04-advanced-utilities-ii',
    ]);
  });

  it('reads unit markdown content', () => {
    const md = getUnitMarkdown('01foundations', 'linux-for-robotics', '01-introduction');
    expect(md).toContain('Linux for Robotics');
  });

  it('computes adjacent units at the boundaries', () => {
    const { prev, next } = getAdjacentUnits(
      '01foundations',
      'linux-for-robotics',
      '01-introduction',
    );
    expect(prev).toBeNull();
    expect(next?.slug).toBe('02-linux-essentials');
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

```bash
cd webapp && npm test -- content.test.ts
```

Expected: FAIL — `content.ts` does not exist yet.

- [ ] **Step 3: Write `webapp/lib/content.ts`**

```ts
import fs from 'node:fs';
import path from 'node:path';

const CONTENT_ROOT = path.join(process.cwd(), '..');

export interface TopicSummary {
  slug: string;
  title: string;
}

export type CourseSummary = TopicSummary;
export type UnitSummary = TopicSummary;

function firstHeading(filePath: string): string {
  const raw = fs.readFileSync(filePath, 'utf8');
  const line = raw.split('\n').find((l) => l.startsWith('# '));
  if (!line) {
    throw new Error(`No top-level heading found in ${filePath}`);
  }
  return line.slice(2).trim();
}

export function getTopics(): TopicSummary[] {
  return fs
    .readdirSync(CONTENT_ROOT)
    .filter((name) => /^\d{2}[a-z]+\.md$/.test(name))
    .map((name) => {
      const slug = name.replace(/\.md$/, '');
      return { slug, title: firstHeading(path.join(CONTENT_ROOT, name)) };
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

export function getTopicMarkdown(topicSlug: string): string {
  return fs.readFileSync(path.join(CONTENT_ROOT, `${topicSlug}.md`), 'utf8');
}

export function getCourses(topicSlug: string): CourseSummary[] {
  const topicDir = path.join(CONTENT_ROOT, topicSlug);
  return fs
    .readdirSync(topicDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({
      slug: entry.name,
      title: firstHeading(path.join(topicDir, entry.name, 'README.md')),
    }))
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

export function getCourseMarkdown(topicSlug: string, courseSlug: string): string {
  return fs.readFileSync(path.join(CONTENT_ROOT, topicSlug, courseSlug, 'README.md'), 'utf8');
}

export function getUnits(topicSlug: string, courseSlug: string): UnitSummary[] {
  const courseDir = path.join(CONTENT_ROOT, topicSlug, courseSlug);
  return fs
    .readdirSync(courseDir)
    .filter((name) => /^\d{2}-.*\.md$/.test(name))
    .map((name) => {
      const slug = name.replace(/\.md$/, '');
      return { slug, title: firstHeading(path.join(courseDir, name)) };
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

export function getUnitMarkdown(
  topicSlug: string,
  courseSlug: string,
  unitSlug: string,
): string {
  return fs.readFileSync(
    path.join(CONTENT_ROOT, topicSlug, courseSlug, `${unitSlug}.md`),
    'utf8',
  );
}

export function getAdjacentUnits(
  topicSlug: string,
  courseSlug: string,
  unitSlug: string,
): { prev: UnitSummary | null; next: UnitSummary | null } {
  const units = getUnits(topicSlug, courseSlug);
  const index = units.findIndex((u) => u.slug === unitSlug);
  return {
    prev: index > 0 ? units[index - 1] : null,
    next: index >= 0 && index < units.length - 1 ? units[index + 1] : null,
  };
}
```

- [ ] **Step 4: Run the tests to verify they pass**

```bash
cd webapp && npm test -- content.test.ts
```

Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
cd webapp && git add lib/content.ts lib/content.test.ts
git commit -m "feat: add filesystem-backed content loader"
```

### Task 5: Markdown rendering (`lib/markdown.tsx` + `components/MermaidDiagram.tsx`)

**Files:**
- Create: `webapp/lib/markdown.tsx`
- Create: `webapp/components/MermaidDiagram.tsx`
- Test: `webapp/lib/markdown.test.ts`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `Markdown({ source: string })` React component, and the pure helper
  `extractLanguage(className?: string): string | null`. Consumed by Tasks 7–10.

- [ ] **Step 1: Write the failing test in `webapp/lib/markdown.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { extractLanguage } from './markdown';

describe('extractLanguage', () => {
  it('extracts the language from a rehype-highlight className', () => {
    expect(extractLanguage('language-mermaid')).toBe('mermaid');
    expect(extractLanguage('language-bash')).toBe('bash');
  });

  it('returns null when there is no language class', () => {
    expect(extractLanguage(undefined)).toBeNull();
    expect(extractLanguage('some-other-class')).toBeNull();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
cd webapp && npm test -- markdown.test.ts
```

Expected: FAIL — `markdown.tsx` does not exist yet.

- [ ] **Step 3: Create `webapp/components/MermaidDiagram.tsx`**

```tsx
'use client';

import { useEffect, useId, useRef } from 'react';

export function MermaidDiagram({ source }: { source: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, '-');

  useEffect(() => {
    let cancelled = false;
    import('mermaid').then(({ default: mermaid }) => {
      mermaid.initialize({ startOnLoad: false, theme: 'neutral' });
      mermaid.render(`mermaid-${id}`, source).then(({ svg }) => {
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
        }
      });
    });
    return () => {
      cancelled = true;
    };
  }, [id, source]);

  return <div ref={ref} className="mermaid-diagram" />;
}
```

- [ ] **Step 4: Write `webapp/lib/markdown.tsx`**

```tsx
import type { ComponentPropsWithoutRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { MermaidDiagram } from '../components/MermaidDiagram';

export function extractLanguage(className?: string): string | null {
  if (!className) return null;
  const match = /language-(\w+)/.exec(className);
  return match ? match[1] : null;
}

function CodeBlock({ className, children }: ComponentPropsWithoutRef<'code'>) {
  if (!className) {
    return <code>{children}</code>;
  }
  const language = extractLanguage(className);
  if (language === 'mermaid') {
    const source = String(children).replace(/\n$/, '');
    return <MermaidDiagram source={source} />;
  }
  return (
    <pre>
      <code className={className}>{children}</code>
    </pre>
  );
}

export function Markdown({ source }: { source: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]} components={{ code: CodeBlock }}>
      {source}
    </ReactMarkdown>
  );
}
```

`rehype-highlight` only highlights languages it recognizes (via highlight.js); it
leaves `language-mermaid` code nodes' text content untouched, which is why
`String(children)` in `CodeBlock` still yields the raw Mermaid source.

- [ ] **Step 5: Run the test to verify it passes**

```bash
cd webapp && npm test -- markdown.test.ts
```

Expected: PASS (2 tests).

- [ ] **Step 6: Verify the project still type-checks and builds**

```bash
cd webapp && npm run build
```

Expected: build succeeds (it will render the placeholder home page from Task 1).

- [ ] **Step 7: Commit**

```bash
cd webapp && git add lib/markdown.tsx lib/markdown.test.ts components/MermaidDiagram.tsx
git commit -m "feat: add markdown rendering with mermaid and code highlighting"
```

### Task 6: Navigation bar and root layout

**Files:**
- Create: `webapp/components/NavBar.tsx`
- Modify: `webapp/app/layout.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: `<NavBar />`, rendered on every page via the root layout.

- [ ] **Step 1: Create `webapp/components/NavBar.tsx`**

```tsx
import Link from 'next/link';

export function NavBar() {
  return (
    <nav className="nav-bar">
      <Link href="/">Home</Link>
      <Link href="/topics">Browse</Link>
      <Link href="/quiz">Quiz</Link>
      <Link href="/quiz/history">History</Link>
    </nav>
  );
}
```

- [ ] **Step 2: Modify `webapp/app/layout.tsx` to render it**

```tsx
import type { ReactNode } from 'react';
import { NavBar } from '../components/NavBar';
import 'highlight.js/styles/github-dark.css';
import './globals.css';

export const metadata = {
  title: 'robotcon',
  description: 'Personal robotics learning roadmap and quiz',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Verify the build**

```bash
cd webapp && npm run build
```

Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
cd webapp && git add components/NavBar.tsx app/layout.tsx
git commit -m "feat: add persistent navigation bar"
```

### Task 7: Home page

**Files:**
- Create: `webapp/components/TopicList.tsx`
- Modify: `webapp/app/page.tsx`

**Interfaces:**
- Consumes: `getTopics()` from Task 4, `Markdown` from Task 5.
- Produces: `<TopicList />`, reused by Task 8.

- [ ] **Step 1: Create `webapp/components/TopicList.tsx`**

```tsx
import Link from 'next/link';
import { getTopics } from '../lib/content';

export function TopicList() {
  const topics = getTopics();
  return (
    <ul className="topic-list">
      {topics.map((topic) => (
        <li key={topic.slug}>
          <Link href={`/topics/${topic.slug}`}>{topic.title}</Link>
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 2: Rewrite `webapp/app/page.tsx`**

```tsx
import fs from 'node:fs';
import path from 'node:path';
import { Markdown } from '../lib/markdown';
import { TopicList } from '../components/TopicList';

function getRootReadme(): string {
  return fs.readFileSync(path.join(process.cwd(), '..', 'README.md'), 'utf8');
}

export default function HomePage() {
  const readme = getRootReadme();
  return (
    <main>
      <Markdown source={readme} />
      <h2>Topics</h2>
      <TopicList />
    </main>
  );
}
```

- [ ] **Step 3: Verify manually**

```bash
cd webapp && npm run dev
```

Open `http://localhost:3000`, confirm the repo's `README.md` renders (including the
learning-path Mermaid diagram) followed by a clickable list of 17 topics. Stop the
server.

- [ ] **Step 4: Commit**

```bash
cd webapp && git add components/TopicList.tsx app/page.tsx
git commit -m "feat: render home page from root README with topic list"
```

### Task 8: Topics index page

**Files:**
- Create: `webapp/app/topics/page.tsx`

**Interfaces:**
- Consumes: `TopicList` from Task 7.

- [ ] **Step 1: Create `webapp/app/topics/page.tsx`**

```tsx
import { TopicList } from '../../components/TopicList';

export default function TopicsPage() {
  return (
    <main>
      <h1>Browse Topics</h1>
      <TopicList />
    </main>
  );
}
```

- [ ] **Step 2: Verify manually**

Run `npm run dev`, visit `http://localhost:3000/topics`, confirm all 17 topics are
listed and clickable. Stop the server.

- [ ] **Step 3: Commit**

```bash
cd webapp && git add app/topics/page.tsx
git commit -m "feat: add topics index page"
```

### Task 9: Topic page

**Files:**
- Create: `webapp/app/topics/[topic]/page.tsx`

**Interfaces:**
- Consumes: `getTopics`, `getTopicMarkdown`, `getCourses` from Task 4; `Markdown`
  from Task 5.

- [ ] **Step 1: Create `webapp/app/topics/[topic]/page.tsx`**

```tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCourses, getTopicMarkdown, getTopics } from '../../../lib/content';
import { Markdown } from '../../../lib/markdown';

export default function TopicPage({ params }: { params: { topic: string } }) {
  const topics = getTopics();
  const topic = topics.find((t) => t.slug === params.topic);
  if (!topic) notFound();

  const markdown = getTopicMarkdown(params.topic);
  const courses = getCourses(params.topic);

  return (
    <main>
      <Markdown source={markdown} />
      <h2>Courses</h2>
      <ul>
        {courses.map((course) => (
          <li key={course.slug}>
            <Link href={`/topics/${params.topic}/${course.slug}`}>{course.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
```

- [ ] **Step 2: Verify manually**

Run `npm run dev`, visit `http://localhost:3000/topics/01foundations`, confirm the
abstract renders and lists its 4 courses. Also visit a nonexistent topic slug (e.g.
`/topics/99nope`) and confirm Next's not-found page appears. Stop the server.

- [ ] **Step 3: Commit**

```bash
cd webapp && git add "app/topics/[topic]/page.tsx"
git commit -m "feat: add topic page"
```

### Task 10: Course page

**Files:**
- Create: `webapp/app/topics/[topic]/[course]/page.tsx`

**Interfaces:**
- Consumes: `getCourses`, `getCourseMarkdown`, `getUnits` from Task 4; `Markdown`
  from Task 5.

- [ ] **Step 1: Create `webapp/app/topics/[topic]/[course]/page.tsx`**

```tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCourseMarkdown, getCourses, getUnits } from '../../../../lib/content';
import { Markdown } from '../../../../lib/markdown';

export default function CoursePage({
  params,
}: {
  params: { topic: string; course: string };
}) {
  const courses = getCourses(params.topic);
  const course = courses.find((c) => c.slug === params.course);
  if (!course) notFound();

  const markdown = getCourseMarkdown(params.topic, params.course);
  const units = getUnits(params.topic, params.course);

  return (
    <main>
      <Markdown source={markdown} />
      <h2>Units</h2>
      <ol>
        {units.map((unit) => (
          <li key={unit.slug}>
            <Link href={`/topics/${params.topic}/${params.course}/${unit.slug}`}>{unit.title}</Link>
          </li>
        ))}
      </ol>
    </main>
  );
}
```

- [ ] **Step 2: Verify manually**

Visit `http://localhost:3000/topics/01foundations/linux-for-robotics`, confirm the
course README renders and lists its 4 units in order.

- [ ] **Step 3: Commit**

```bash
cd webapp && git add "app/topics/[topic]/[course]/page.tsx"
git commit -m "feat: add course page"
```

### Task 11: Unit page

**Files:**
- Create: `webapp/app/topics/[topic]/[course]/[unit]/page.tsx`

**Interfaces:**
- Consumes: `getUnits`, `getUnitMarkdown`, `getAdjacentUnits` from Task 4;
  `Markdown` from Task 5.

- [ ] **Step 1: Create `webapp/app/topics/[topic]/[course]/[unit]/page.tsx`**

```tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAdjacentUnits, getUnitMarkdown, getUnits } from '../../../../../lib/content';
import { Markdown } from '../../../../../lib/markdown';

export default function UnitPage({
  params,
}: {
  params: { topic: string; course: string; unit: string };
}) {
  const units = getUnits(params.topic, params.course);
  const unit = units.find((u) => u.slug === params.unit);
  if (!unit) notFound();

  const markdown = getUnitMarkdown(params.topic, params.course, params.unit);
  const { prev, next } = getAdjacentUnits(params.topic, params.course, params.unit);

  return (
    <main>
      <Markdown source={markdown} />
      <nav className="unit-pager">
        {prev ? (
          <Link href={`/topics/${params.topic}/${params.course}/${prev.slug}`}>← {prev.title}</Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/topics/${params.topic}/${params.course}/${next.slug}`}>{next.title} →</Link>
        ) : (
          <span />
        )}
      </nav>
    </main>
  );
}
```

- [ ] **Step 2: Verify manually**

Visit `http://localhost:3000/topics/01foundations/linux-for-robotics/01-introduction`.
Confirm: the mermaid diagram in that unit renders as an actual diagram (not raw
text), the bash code fence is syntax-highlighted, only a "next" link appears (no
"prev", since it's the first unit), and clicking through to unit 2 then shows both
prev and next links.

- [ ] **Step 3: Commit**

```bash
cd webapp && git add "app/topics/[topic]/[course]/[unit]/page.tsx"
git commit -m "feat: add unit page with mermaid rendering and prev/next nav"
```

---

## Part 4 — Quiz

### Task 12: Question loader (`lib/questions.ts`)

**Files:**
- Create: `webapp/lib/questions.ts`

**Interfaces:**
- Consumes: `webapp/data/questions.json` from Task 3.
- Produces: `Question` type, `getAllQuestions(): Question[]`. Consumed by
  Tasks 13–18.

- [ ] **Step 1: Create `webapp/lib/questions.ts`**

```ts
import questionsData from '../data/questions.json';

export interface Question {
  id: string;
  topicId: string;
  courseId: string;
  unitId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export function getAllQuestions(): Question[] {
  return questionsData as Question[];
}
```

- [ ] **Step 2: Verify it compiles and loads real data**

```bash
cd webapp && npx tsc --noEmit
node -e "const q = require('./data/questions.json'); console.log(q.length)"
```

Expected: no type errors, and the second command prints a number ≥ 1000.

- [ ] **Step 3: Commit**

```bash
cd webapp && git add lib/questions.ts
git commit -m "feat: add quiz question loader"
```

### Task 13: Shuffle / draw logic (`lib/shuffle.ts`)

**Files:**
- Create: `webapp/lib/shuffle.ts`
- Test: `webapp/lib/shuffle.test.ts`

**Interfaces:**
- Consumes: `Question` type from Task 12.
- Produces: `QuizOption`, `QuizQuestion` types, `shuffle<T>(items, rng?)`,
  `toQuizQuestion(question, rng?)`, `drawQuizQuestions(pool, count, rng?)`.
  Consumed by Task 14 (`/quiz` start page).

- [ ] **Step 1: Write the failing tests in `webapp/lib/shuffle.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { drawQuizQuestions, shuffle, toQuizQuestion } from './shuffle';
import type { Question } from './questions';

function sequenceRng(values: number[]): () => number {
  let i = 0;
  return () => values[i++ % values.length];
}

const sampleQuestions: Question[] = Array.from({ length: 5 }, (_, i) => ({
  id: `q${i}`,
  topicId: '01foundations',
  courseId: 'linux-for-robotics',
  unitId: '01-introduction',
  question: `Question ${i}?`,
  options: ['A', 'B', 'C', 'D'],
  correctIndex: i % 4,
  explanation: `Explanation ${i}`,
}));

describe('shuffle', () => {
  it('returns a permutation of the same items', () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffle(input, sequenceRng([0.9, 0.1, 0.5, 0.2, 0]));
    expect(result.slice().sort()).toEqual(input.slice().sort());
  });

  it('is deterministic for a given rng sequence', () => {
    const rngValues = [0.9, 0.1, 0.5, 0.2, 0];
    const a = shuffle([1, 2, 3, 4, 5], sequenceRng(rngValues));
    const b = shuffle([1, 2, 3, 4, 5], sequenceRng(rngValues));
    expect(a).toEqual(b);
  });
});

describe('toQuizQuestion', () => {
  it('marks exactly one option as correct and keeps all 4 options', () => {
    const quizQuestion = toQuizQuestion(sampleQuestions[0], sequenceRng([0.1, 0.9, 0.3, 0]));
    expect(quizQuestion.options).toHaveLength(4);
    expect(quizQuestion.options.filter((o) => o.isCorrect)).toHaveLength(1);
  });
});

describe('drawQuizQuestions', () => {
  it('draws the requested count of unique questions', () => {
    const drawn = drawQuizQuestions(sampleQuestions, 3, sequenceRng([0.9, 0.1, 0.5, 0.2, 0]));
    expect(drawn).toHaveLength(3);
    expect(new Set(drawn.map((q) => q.id)).size).toBe(3);
  });

  it('caps at the pool size if count exceeds it', () => {
    const drawn = drawQuizQuestions(sampleQuestions, 10, sequenceRng([0.9, 0.1, 0.5, 0.2, 0]));
    expect(drawn).toHaveLength(5);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

```bash
cd webapp && npm test -- shuffle.test.ts
```

Expected: FAIL — `shuffle.ts` does not exist yet.

- [ ] **Step 3: Write `webapp/lib/shuffle.ts`**

```ts
import type { Question } from './questions';

export interface QuizOption {
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  topicId: string;
  courseId: string;
  unitId: string;
  question: string;
  explanation: string;
  options: QuizOption[];
}

export function shuffle<T>(items: T[], rng: () => number = Math.random): T[] {
  const result = items.slice();
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function toQuizQuestion(q: Question, rng: () => number = Math.random): QuizQuestion {
  const options = shuffle(
    q.options.map((text, index) => ({ text, isCorrect: index === q.correctIndex })),
    rng,
  );
  return {
    id: q.id,
    topicId: q.topicId,
    courseId: q.courseId,
    unitId: q.unitId,
    question: q.question,
    explanation: q.explanation,
    options,
  };
}

export function drawQuizQuestions(
  pool: Question[],
  count: number,
  rng: () => number = Math.random,
): QuizQuestion[] {
  const chosen = shuffle(pool, rng).slice(0, count);
  return chosen.map((q) => toQuizQuestion(q, rng));
}
```

- [ ] **Step 4: Run the tests to verify they pass**

```bash
cd webapp && npm test -- shuffle.test.ts
```

Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
cd webapp && git add lib/shuffle.ts lib/shuffle.test.ts
git commit -m "feat: add quiz question draw and shuffle logic"
```

### Task 14: Quiz history storage (`lib/history.ts`)

**Files:**
- Create: `webapp/lib/history.ts`
- Test: `webapp/lib/history.test.ts`

**Interfaces:**
- Produces: `QuizHistoryEntry` type (`{ date, score, total, questionIds: string[],
  missedQuestionIds: string[] }`), a `Storage` interface (`getItem`/`setItem`,
  matching the browser `Storage` shape), `loadHistory(storage)`,
  `saveHistoryEntry(storage, entry)`, `computeTopicAccuracy(history, questionTopicById)`.
  Consumed by Tasks 15 and 17.
- Note: this adds a `questionIds` field beyond the spec's literal
  `{date, score, total, missedQuestionIds}` wording, because per-topic accuracy
  needs the full set of questions attempted per topic as a denominator, not just
  the misses.

- [ ] **Step 1: Write the failing tests in `webapp/lib/history.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import {
  computeTopicAccuracy,
  loadHistory,
  saveHistoryEntry,
  type QuizHistoryEntry,
} from './history';

class FakeStorage {
  private store = new Map<string, string>();
  getItem(key: string) {
    return this.store.has(key) ? this.store.get(key)! : null;
  }
  setItem(key: string, value: string) {
    this.store.set(key, value);
  }
}

describe('history', () => {
  it('returns an empty array when nothing is stored', () => {
    expect(loadHistory(new FakeStorage())).toEqual([]);
  });

  it('persists an entry and reads it back', () => {
    const storage = new FakeStorage();
    const entry: QuizHistoryEntry = {
      date: '2026-07-22T00:00:00.000Z',
      score: 18,
      total: 20,
      questionIds: ['a', 'b'],
      missedQuestionIds: ['b'],
    };
    saveHistoryEntry(storage, entry);
    expect(loadHistory(storage)).toEqual([entry]);
  });

  it('appends to existing history rather than overwriting', () => {
    const storage = new FakeStorage();
    saveHistoryEntry(storage, {
      date: '2026-07-20T00:00:00.000Z',
      score: 10,
      total: 20,
      questionIds: ['a'],
      missedQuestionIds: [],
    });
    saveHistoryEntry(storage, {
      date: '2026-07-21T00:00:00.000Z',
      score: 15,
      total: 20,
      questionIds: ['b'],
      missedQuestionIds: ['b'],
    });
    expect(loadHistory(storage)).toHaveLength(2);
  });

  it('computes per-topic accuracy across sessions', () => {
    const questionTopicById = new Map([
      ['a', '01foundations'],
      ['b', '01foundations'],
      ['c', '05roboticstheory'],
    ]);
    const history: QuizHistoryEntry[] = [
      { date: 'd1', score: 2, total: 3, questionIds: ['a', 'b', 'c'], missedQuestionIds: ['b'] },
    ];
    const result = computeTopicAccuracy(history, questionTopicById);
    expect(result['01foundations']).toEqual({ correct: 1, total: 2 });
    expect(result['05roboticstheory']).toEqual({ correct: 1, total: 1 });
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

```bash
cd webapp && npm test -- history.test.ts
```

Expected: FAIL — `history.ts` does not exist yet.

- [ ] **Step 3: Write `webapp/lib/history.ts`**

```ts
export interface QuizHistoryEntry {
  date: string;
  score: number;
  total: number;
  questionIds: string[];
  missedQuestionIds: string[];
}

export interface Storage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

const HISTORY_KEY = 'robotcon-quiz-history';

export function loadHistory(storage: Storage): QuizHistoryEntry[] {
  const raw = storage.getItem(HISTORY_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveHistoryEntry(storage: Storage, entry: QuizHistoryEntry): void {
  const history = loadHistory(storage);
  history.push(entry);
  storage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function computeTopicAccuracy(
  history: QuizHistoryEntry[],
  questionTopicById: Map<string, string>,
): Record<string, { correct: number; total: number }> {
  const totals: Record<string, { correct: number; total: number }> = {};
  for (const entry of history) {
    const missed = new Set(entry.missedQuestionIds);
    for (const id of entry.questionIds) {
      const topicId = questionTopicById.get(id);
      if (!topicId) continue;
      if (!totals[topicId]) totals[topicId] = { correct: 0, total: 0 };
      totals[topicId].total += 1;
      if (!missed.has(id)) totals[topicId].correct += 1;
    }
  }
  return totals;
}
```

- [ ] **Step 4: Run the tests to verify they pass**

```bash
cd webapp && npm test -- history.test.ts
```

Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
cd webapp && git add lib/history.ts lib/history.test.ts
git commit -m "feat: add quiz history storage and topic accuracy calculation"
```

### Task 15: In-progress session storage (`lib/quiz-session.ts`)

**Files:**
- Create: `webapp/lib/quiz-session.ts`

**Interfaces:**
- Consumes: `QuizQuestion` type from Task 13.
- Produces: `InProgressSession` type, `startSession(questions)`, `loadSession()`,
  `recordAnswer(session, wasCorrect)`, `clearSession()`. Consumed by Tasks 16–17.
- This module calls `sessionStorage` directly and must only ever be invoked from
  within already-client-rendered code (event handlers/effects in Tasks 16–17's
  pages), never during server rendering.

- [ ] **Step 1: Create `webapp/lib/quiz-session.ts`**

```ts
import type { QuizQuestion } from './shuffle';

export interface InProgressSession {
  questions: QuizQuestion[];
  currentIndex: number;
  score: number;
  missedQuestionIds: string[];
}

const SESSION_KEY = 'robotcon-quiz-session';

export function startSession(questions: QuizQuestion[]): InProgressSession {
  const session: InProgressSession = {
    questions,
    currentIndex: 0,
    score: 0,
    missedQuestionIds: [],
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function loadSession(): InProgressSession | null {
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  return JSON.parse(raw) as InProgressSession;
}

export function recordAnswer(session: InProgressSession, wasCorrect: boolean): InProgressSession {
  const current = session.questions[session.currentIndex];
  const updated: InProgressSession = {
    ...session,
    currentIndex: session.currentIndex + 1,
    score: session.score + (wasCorrect ? 1 : 0),
    missedQuestionIds: wasCorrect
      ? session.missedQuestionIds
      : [...session.missedQuestionIds, current.id],
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(updated));
  return updated;
}

export function clearSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}
```

- [ ] **Step 2: Verify it compiles**

```bash
cd webapp && npx tsc --noEmit
```

Expected: no type errors.

- [ ] **Step 3: Commit**

```bash
cd webapp && git add lib/quiz-session.ts
git commit -m "feat: add in-progress quiz session storage"
```

### Task 16: Quiz start page

**Files:**
- Create: `webapp/app/quiz/page.tsx`

**Interfaces:**
- Consumes: `getAllQuestions` (Task 12), `drawQuizQuestions` (Task 13),
  `startSession` (Task 15).

- [ ] **Step 1: Create `webapp/app/quiz/page.tsx`**

```tsx
'use client';

import { useRouter } from 'next/navigation';
import { getAllQuestions } from '../../lib/questions';
import { drawQuizQuestions } from '../../lib/shuffle';
import { startSession } from '../../lib/quiz-session';

const QUESTIONS_PER_SESSION = 20;

export default function QuizStartPage() {
  const router = useRouter();

  function handleStart() {
    const pool = getAllQuestions();
    const questions = drawQuizQuestions(pool, QUESTIONS_PER_SESSION);
    startSession(questions);
    router.push('/quiz/session');
  }

  return (
    <main>
      <h1>Quiz</h1>
      <p>
        {QUESTIONS_PER_SESSION} random questions drawn from the full question bank,
        in random order with shuffled answer options.
      </p>
      <button onClick={handleStart}>Start Quiz</button>
    </main>
  );
}
```

- [ ] **Step 2: Verify manually**

Run `npm run dev`, visit `http://localhost:3000/quiz`, click "Start Quiz", confirm
it navigates to `/quiz/session` (Task 17 builds that page next — until then this
will 404, which is expected at this point in the plan).

- [ ] **Step 3: Commit**

```bash
cd webapp && git add app/quiz/page.tsx
git commit -m "feat: add quiz start page"
```

### Task 17: Quiz session page

**Files:**
- Create: `webapp/app/quiz/session/page.tsx`

**Interfaces:**
- Consumes: `loadSession`, `recordAnswer`, `clearSession`, `InProgressSession` from
  Task 15; `saveHistoryEntry` from Task 14.
- Produces: writes `sessionStorage` key `robotcon-quiz-last-result` (shape
  `QuizHistoryEntry & { questions: QuizQuestion[] }`), read by Task 18.

- [ ] **Step 1: Create `webapp/app/quiz/session/page.tsx`**

```tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  clearSession,
  loadSession,
  recordAnswer,
  type InProgressSession,
} from '../../../lib/quiz-session';
import { saveHistoryEntry } from '../../../lib/history';

const RESULT_KEY = 'robotcon-quiz-last-result';

export default function QuizSessionPage() {
  const router = useRouter();
  const [session, setSession] = useState<InProgressSession | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const existing = loadSession();
    if (!existing) {
      router.replace('/quiz');
      return;
    }
    setSession(existing);
  }, [router]);

  if (!session) return null;

  const question = session.questions[session.currentIndex];

  function handleSelect(index: number) {
    if (revealed) return;
    setSelectedIndex(index);
    setRevealed(true);
  }

  function handleNext() {
    if (!session || selectedIndex === null) return;
    const wasCorrect = question.options[selectedIndex].isCorrect;
    const updated = recordAnswer(session, wasCorrect);

    if (updated.currentIndex >= updated.questions.length) {
      const questionIds = updated.questions.map((q) => q.id);
      const entry = {
        date: new Date().toISOString(),
        score: updated.score,
        total: updated.questions.length,
        questionIds,
        missedQuestionIds: updated.missedQuestionIds,
      };
      saveHistoryEntry(window.localStorage, entry);
      sessionStorage.setItem(
        RESULT_KEY,
        JSON.stringify({ ...entry, questions: updated.questions }),
      );
      clearSession();
      router.push('/quiz/results');
      return;
    }

    setSession(updated);
    setSelectedIndex(null);
    setRevealed(false);
  }

  return (
    <main>
      <p>
        Question {session.currentIndex + 1} of {session.questions.length}
      </p>
      <h2>{question.question}</h2>
      <ul className="quiz-options">
        {question.options.map((option, index) => {
          const isSelected = selectedIndex === index;
          const showCorrect = revealed && option.isCorrect;
          const showWrong = revealed && isSelected && !option.isCorrect;
          return (
            <li key={index}>
              <button
                onClick={() => handleSelect(index)}
                disabled={revealed}
                className={showCorrect ? 'correct' : showWrong ? 'wrong' : ''}
              >
                {option.text}
              </button>
            </li>
          );
        })}
      </ul>
      {revealed && (
        <div className="explanation">
          <p>{question.explanation}</p>
          <button onClick={handleNext}>Next</button>
        </div>
      )}
    </main>
  );
}
```

- [ ] **Step 2: Verify manually**

Run `npm run dev`, go to `/quiz`, start a session. Confirm: picking an option
immediately shows correct/incorrect coloring and the explanation, "Next" advances
to question 2 of 20, and after answering all 20, it navigates to `/quiz/results`
(Task 18 builds that page next — until then this will 404, which is expected).

- [ ] **Step 3: Commit**

```bash
cd webapp && git add app/quiz/session/page.tsx
git commit -m "feat: add quiz session flow with instant feedback"
```

### Task 18: Quiz results and history pages

**Files:**
- Create: `webapp/app/quiz/results/page.tsx`
- Create: `webapp/app/quiz/history/page.tsx`

**Interfaces:**
- Consumes: `sessionStorage` key `robotcon-quiz-last-result` (from Task 17),
  `loadHistory`/`computeTopicAccuracy` (Task 14), `getAllQuestions` (Task 12),
  `QuizQuestion` type (Task 13).

- [ ] **Step 1: Create `webapp/app/quiz/results/page.tsx`**

```tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { QuizQuestion } from '../../../lib/shuffle';

const RESULT_KEY = 'robotcon-quiz-last-result';

interface LastResult {
  date: string;
  score: number;
  total: number;
  missedQuestionIds: string[];
  questions: QuizQuestion[];
}

export default function QuizResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<LastResult | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(RESULT_KEY);
    if (!raw) {
      router.replace('/quiz');
      return;
    }
    setResult(JSON.parse(raw) as LastResult);
  }, [router]);

  if (!result) return null;

  const missed = result.questions.filter((q) => result.missedQuestionIds.includes(q.id));

  return (
    <main>
      <h1>
        Score: {result.score} / {result.total}
      </h1>
      {missed.length === 0 ? (
        <p>Perfect score.</p>
      ) : (
        <>
          <h2>Review missed questions</h2>
          <ul>
            {missed.map((q) => (
              <li key={q.id}>
                <p>{q.question}</p>
                <p>Correct answer: {q.options.find((o) => o.isCorrect)?.text}</p>
                <p>{q.explanation}</p>
                <Link href={`/topics/${q.topicId}/${q.courseId}/${q.unitId}`}>Review this unit</Link>
              </li>
            ))}
          </ul>
        </>
      )}
      <Link href="/quiz">Take another quiz</Link>
    </main>
  );
}
```

- [ ] **Step 2: Create `webapp/app/quiz/history/page.tsx`**

```tsx
'use client';

import { useEffect, useState } from 'react';
import { computeTopicAccuracy, loadHistory, type QuizHistoryEntry } from '../../../lib/history';
import { getAllQuestions } from '../../../lib/questions';

export default function QuizHistoryPage() {
  const [history, setHistory] = useState<QuizHistoryEntry[] | null>(null);

  useEffect(() => {
    setHistory(loadHistory(window.localStorage));
  }, []);

  if (!history) return null;

  const questionTopicById = new Map(getAllQuestions().map((q) => [q.id, q.topicId]));
  const accuracy = computeTopicAccuracy(history, questionTopicById);

  return (
    <main>
      <h1>Quiz History</h1>
      {history.length === 0 ? (
        <p>No quiz sessions yet.</p>
      ) : (
        <>
          <ul>
            {history
              .slice()
              .reverse()
              .map((entry, index) => (
                <li key={index}>
                  {new Date(entry.date).toLocaleString()}: {entry.score} / {entry.total}
                </li>
              ))}
          </ul>
          <h2>Accuracy by topic</h2>
          <ul>
            {Object.entries(accuracy).map(([topicId, { correct, total }]) => (
              <li key={topicId}>
                {topicId}: {correct} / {total} ({Math.round((correct / total) * 100)}%)
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
```

- [ ] **Step 3: Verify manually**

Run `npm run dev`, complete a full quiz session (Task 17's flow), confirm
`/quiz/results` shows the score and, for any missed question, a working "Review
this unit" link that lands on the correct unit page. Then visit `/quiz/history`
and confirm the just-completed session appears with its score and a non-empty
per-topic accuracy breakdown. Reload `/quiz/history` and confirm the entry is
still there (proving `localStorage` persistence survives a reload).

- [ ] **Step 4: Commit**

```bash
cd webapp && git add app/quiz/results/page.tsx app/quiz/history/page.tsx
git commit -m "feat: add quiz results and history pages"
```

---

## Part 5 — Final verification

### Task 19: End-to-end manual verification pass

**Files:** none (verification only).

- [ ] **Step 1: Full test suite and build**

```bash
cd webapp && npm test && npm run build
```

Expected: all Vitest tests pass, `next build` succeeds with no type errors.

- [ ] **Step 2: Content browsing checklist**

Run `npm run dev` and, in a browser:
- Visit `/`, confirm the roadmap Mermaid diagram renders and all 17 topics are
  listed.
- Drill into at least 2 different topics → course → unit, across topics that use
  different content (e.g. `01foundations` and `10artificialintelligence`).
- Confirm at least one unit with a Mermaid diagram renders it as a diagram, and at
  least one unit with a fenced code block shows syntax highlighting.
- Confirm prev/next links work at a unit in the middle of a course, and correctly
  hide one side at the first/last unit of a course.

- [ ] **Step 3: Quiz checklist**

- Start a quiz from `/quiz`, answer all 20 questions (deliberately get at least one
  wrong), confirm instant feedback and explanations appear correctly each time.
- On `/quiz/results`, confirm the score matches what you tracked while answering,
  and the missed-question review list and "Review this unit" links are correct.
- Start a second quiz session and confirm the question order and each question's
  option order differ from the first session (randomization working).
- Visit `/quiz/history`, confirm both sessions are listed with correct scores and
  the per-topic accuracy numbers look right given which topics your missed
  questions came from.

- [ ] **Step 4: Record the final question count**

```bash
cd webapp && node scripts/validate-questions.mjs
```

Confirm the final `OK: N valid questions.` count, and report it as the delivered
quiz bank size.
