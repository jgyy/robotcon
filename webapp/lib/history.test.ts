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
