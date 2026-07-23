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
  .filter((name) => /^\d{2}[a-z0-9]+\.md$/.test(name))
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
