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
