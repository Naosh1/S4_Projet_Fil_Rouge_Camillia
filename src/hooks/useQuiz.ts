import { useState, useCallback, useMemo } from 'react';
import { Kana } from '../data/kana';

export type Feedback = 'correct' | 'wrong' | null;

export interface QuizState {
  currentKana: Kana;
  userAnswer: string;
  setUserAnswer: (v: string) => void;
  score: { correct: number; total: number };
  feedback: Feedback;
  revealed: boolean;
  submitAnswer: (answer: string) => void;
  nextQuestion: () => void;
  resetQuiz: () => void;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function useQuiz(data: Kana[]): QuizState {
  const shuffled = useMemo(() => shuffle(data), [data]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [revealed, setRevealed] = useState(false);

  const currentKana = shuffled[currentIndex % shuffled.length];

  const submitAnswer = useCallback(
    (answer: string) => {
      if (!answer.trim()) return;
      const isCorrect =
        answer.toLowerCase().trim() === currentKana.romanji.toLowerCase();
      setScore((s) => ({
        correct: s.correct + (isCorrect ? 1 : 0),
        total: s.total + 1,
      }));
      setFeedback(isCorrect ? 'correct' : 'wrong');
      setRevealed(true);
    },
    [currentKana],
  );

  const nextQuestion = useCallback(() => {
    setCurrentIndex((i) => i + 1);
    setUserAnswer('');
    setFeedback(null);
    setRevealed(false);
  }, []);

  const resetQuiz = useCallback(() => {
    setCurrentIndex(0);
    setUserAnswer('');
    setScore({ correct: 0, total: 0 });
    setFeedback(null);
    setRevealed(false);
  }, []);

  return {
    currentKana,
    userAnswer,
    setUserAnswer,
    score,
    feedback,
    revealed,
    submitAnswer,
    nextQuestion,
    resetQuiz,
  };
}

export default useQuiz;
