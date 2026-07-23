import type { QuizQuestion } from './shuffle';

export interface InProgressSession {
  questions: QuizQuestion[];
  currentIndex: number;
  score: number;
  missedQuestionIds: string[];
}

const SESSION_KEY = 'robotcon-quiz-session';

export function startSession(questions: QuizQuestion[]): InProgressSession {
  const session: InProgressSession = {
    questions,
    currentIndex: 0,
    score: 0,
    missedQuestionIds: [],
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function loadSession(): InProgressSession | null {
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  return JSON.parse(raw) as InProgressSession;
}

export function recordAnswer(session: InProgressSession, wasCorrect: boolean): InProgressSession {
  const current = session.questions[session.currentIndex];
  const updated: InProgressSession = {
    ...session,
    currentIndex: session.currentIndex + 1,
    score: session.score + (wasCorrect ? 1 : 0),
    missedQuestionIds: wasCorrect
      ? session.missedQuestionIds
      : [...session.missedQuestionIds, current.id],
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(updated));
  return updated;
}

export function clearSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}
