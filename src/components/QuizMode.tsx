import { useEffect, useRef, FormEvent, useCallback } from 'react'
import useQuiz from '../hooks/useQuiz'
import useLocalStorage from '../hooks/useLocalStorage'
import { kanaData } from '../data/kana'
import styles from './QuizMode.module.css'

interface QuizModeProps {
    script: 'hiragana' | 'katakana'
    mode: 'normal' | 'inverse'
}

const QuizMode = ({ script, mode }: QuizModeProps) => {
    const {
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
        allRows,
    } = useQuiz(kanaData, mode)

    // useRef auto-focus
    const inputRef = useRef<HTMLInputElement>(null)
    useEffect(() => {
        inputRef.current?.focus()
    }, [currentKana])

    // useLocalStorage meilleur score
    const [bestScore, setBestScore] = useLocalStorage<number>('kana-best-score', 0)
    useEffect(() => {
        if (score.correct > bestScore) {
            setBestScore(score.correct)
        }
    }, [score.correct, bestScore, setBestScore])

    const pct = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0

    // Mode normal : affiche le caractère, on tape le rōmaji
    // Mode inverse : affiche le rōmaji, on tape le caractère
    const displayChar = mode === 'normal'
        ? (script === 'hiragana' ? currentKana.hiragana : currentKana.katakana)
        : currentKana.romanji

    const correctAnswer = mode === 'normal'
        ? currentKana.romanji
        : (script === 'hiragana' ? currentKana.hiragana : currentKana.katakana)

    const placeholder = mode === 'normal' ? 'Rōmaji...' : (script === 'hiragana' ? 'Hiragana...' : 'Katakana...')

    // useCallback sur handleSubmit
    const handleSubmit = useCallback((e: FormEvent) => {
        e.preventDefault()
        if (revealed) {
            nextQuestion()
        } else {
            submitAnswer(userAnswer)
        }
    }, [revealed, nextQuestion, submitAnswer, userAnswer])

    return (
        <div className={styles.wrapper}>

            {/* Sélection des lignes */}
            <div className={styles.rowSelector}>
                <span className={styles.rowSelectorLabel}>Lignes :</span>
                <div className={styles.rowButtons}>
                    {allRows.map((row) => (
                        <button
                            key={row}
                            onClick={() => toggleRow(row)}
                            className={`${styles.rowBtn} ${selectedRows.includes(row) ? styles.rowBtnActive : ''}`}
                        >
                            {row}
                        </button>
                    ))}
                </div>
            </div>

            {/* Mode badge */}
            <div className={styles.modeBadge}>
                {mode === 'normal' ? '📖 Caractère → Rōmaji' : '🔄 Rōmaji → Caractère'}
            </div>

            {/* Score */}
            <div className={styles.scoreRow}>
                <div className={styles.scoreGroup}>
                    <div className={styles.scoreItem}>
                        <span className={`${styles.scoreValue} ${styles.correct}`}>{score.correct}</span>
                        <span className={styles.scoreLabel}>Corrects</span>
                    </div>
                    <div className={styles.scoreItem}>
                        <span className={styles.scoreValue}>{score.total}</span>
                        <span className={styles.scoreLabel}>Total</span>
                    </div>
                    <div className={styles.scoreItem}>
                        <span className={`${styles.scoreValue} ${styles.pct}`}>{pct}%</span>
                        <span className={styles.scoreLabel}>Réussite</span>
                    </div>
                </div>
                <div className={styles.best}>
                    <span className={styles.bestLabel}>🏆 Record</span>
                    <span className={styles.bestValue}>{bestScore}</span>
                </div>
            </div>

            {/* Progress bar */}
            <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${pct}%` }} />
            </div>

            {/* Character display */}
            <div className={`${styles.charDisplay} ${
                feedback === 'correct' ? styles.charCorrect
                    : feedback === 'wrong' ? styles.charWrong : ''
            }`}>
        <span className={mode === 'inverse' ? styles.charTextRomaji : styles.charText}>
          {displayChar}
        </span>
            </div>

            {/* Feedback */}
            {feedback && (
                <div className={`${styles.feedback} ${
                    feedback === 'correct' ? styles.feedbackCorrect : styles.feedbackWrong
                }`}>
                    {feedback === 'correct' ? '✓ Correct !' : `✗ C'était "${correctAnswer}"`}
                </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    ref={inputRef}
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder={revealed ? 'Entrée pour continuer...' : placeholder}
                    disabled={revealed}
                    className={styles.input}
                />
                <button type="submit" className={styles.submitBtn}>
                    {revealed ? '→ Suivant' : 'Valider'}
                </button>
            </form>

            <button onClick={resetQuiz} className={styles.resetBtn}>
                ↺ Recommencer
            </button>
        </div>
    )
}

export default QuizMode