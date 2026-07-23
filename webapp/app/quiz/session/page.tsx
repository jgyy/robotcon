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
