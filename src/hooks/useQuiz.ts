import { useState, useCallback, useMemo } from 'react'
import { Kana } from '../data/kana'

export type Feedback = 'correct' | 'wrong' | null
export type QuizMode = 'normal' | 'inverse'

export interface QuizState {
  currentKana: Kana
  userAnswer: string
  setUserAnswer: (v: string) => void
  score: { correct: number; total: number }
  feedback: Feedback
  revealed: boolean
  submitAnswer: (answer: string) => void
  nextQuestion: () => void
  resetQuiz: () => void
  selectedRows: string[]
  toggleRow: (row: string) => void
  allRows: string[]
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

const ALL_ROWS = ['a','ka','sa','ta','na','ha','ma','ya','ra','wa','n','ga','za','da','ba','pa']

function useQuiz(data: Kana[], mode: QuizMode = 'normal'): QuizState {
  const [selectedRows, setSelectedRows] = useState<string[]>(ALL_ROWS)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [revealed, setRevealed] = useState(false)

  const filteredData = useMemo(
      () => data.filter((k) => selectedRows.includes(k.row)),
      [data, selectedRows]
  )

  const shuffled = useMemo(() => shuffle(filteredData), [filteredData])

  const currentKana = shuffled[currentIndex % Math.max(shuffled.length, 1)]

  const submitAnswer = useCallback(
      (answer: string) => {
        if (!answer.trim() || !currentKana) return
        const isCorrect =
            answer.toLowerCase().trim() === currentKana.romanji.toLowerCase()
        setScore((s) => ({
          correct: s.correct + (isCorrect ? 1 : 0),
          total: s.total + 1,
        }))
        setFeedback(isCorrect ? 'correct' : 'wrong')
        setRevealed(true)
      },
      [currentKana]
  )

  const nextQuestion = useCallback(() => {
    setCurrentIndex((i) => i + 1)
    setUserAnswer('')
    setFeedback(null)
    setRevealed(false)
  }, [])

  const resetQuiz = useCallback(() => {
    setCurrentIndex(0)
    setUserAnswer('')
    setScore({ correct: 0, total: 0 })
    setFeedback(null)
    setRevealed(false)
  }, [])

  const toggleRow = useCallback((row: string) => {
    setSelectedRows((prev) =>
        prev.includes(row)
            ? prev.length > 1 ? prev.filter((r) => r !== row) : prev
            : [...prev, row]
    )
    resetQuiz()
  }, [resetQuiz])

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
    selectedRows,
    toggleRow,
    allRows: ALL_ROWS,
  }
}

export default useQuiz