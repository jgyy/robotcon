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
