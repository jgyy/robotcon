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
