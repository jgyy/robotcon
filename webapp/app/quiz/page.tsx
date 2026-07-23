'use client';

import { useRouter } from 'next/navigation';
import { getAllQuestions } from '../../lib/questions';
import { drawQuizQuestions } from '../../lib/shuffle';
import { startSession } from '../../lib/quiz-session';

const QUESTIONS_PER_SESSION = 20;

export default function QuizStartPage() {
  const router = useRouter();

  function handleStart() {
    const pool = getAllQuestions();
    const questions = drawQuizQuestions(pool, QUESTIONS_PER_SESSION);
    startSession(questions);
    router.push('/quiz/session');
  }

  return (
    <main>
      <h1>Quiz</h1>
      <p>
        {QUESTIONS_PER_SESSION} random questions drawn from the full question bank,
        in random order with shuffled answer options.
      </p>
      <button onClick={handleStart}>Start Quiz</button>
    </main>
  );
}
