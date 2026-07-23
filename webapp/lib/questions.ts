import questionsData from '../data/questions.json';

export interface Question {
  id: string;
  topicId: string;
  courseId: string;
  unitId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export function getAllQuestions(): Question[] {
  return questionsData as Question[];
}
