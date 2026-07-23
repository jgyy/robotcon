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
