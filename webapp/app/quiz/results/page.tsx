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
