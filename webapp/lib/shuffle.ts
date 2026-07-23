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
