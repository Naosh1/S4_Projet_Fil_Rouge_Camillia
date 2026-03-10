import { useEffect, useRef, FormEvent } from 'react';
import useQuiz from '../hooks/useQuiz';
import useLocalStorage from '../hooks/useLocalStorage';
import { kanaData } from '../data/kana';
import styles from './QuizMode.module.css';

interface QuizModeProps {
    script: 'hiragana' | 'katakana';
}

const QuizMode = ({ script }: QuizModeProps) => {
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
    } = useQuiz(kanaData);

    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        inputRef.current?.focus();
    }, [currentKana]);

    const [bestScore, setBestScore] = useLocalStorage<number>('kana-best-score', 0);
    useEffect(() => {
        if (score.correct > bestScore) {
            setBestScore(score.correct);
        }
    }, [score.correct, bestScore, setBestScore]);

    const pct = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
    const displayChar = script === 'hiragana' ? currentKana.hiragana : currentKana.katakana;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (revealed) {
            nextQuestion();
        } else {
            submitAnswer(userAnswer);
        }
    };

    return (
        <div className={styles.wrapper}>
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

            <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${pct}%` }} />
            </div>

            <div className={`${styles.charDisplay} ${
                feedback === 'correct' ? styles.charCorrect
                    : feedback === 'wrong' ? styles.charWrong
                        : ''
            }`}>
                <span className={styles.charText}>{displayChar}</span>
            </div>

            {feedback && (
                <div className={`${styles.feedback} ${
                    feedback === 'correct' ? styles.feedbackCorrect : styles.feedbackWrong
                }`}>
                    {feedback === 'correct' ? '✓ Correct !' : `✗ C'était "${currentKana.romanji}"`}
                </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    ref={inputRef}
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder={revealed ? 'Appuyez Entrée pour continuer...' : 'Rōmaji...'}
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
    );
};

export default QuizMode;