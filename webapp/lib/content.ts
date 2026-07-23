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
    .filter((name) => /^\d{2}[a-z0-9]+\.md$/.test(name))
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
