import { Routes, Route, NavLink } from 'react-router-dom'
import StudyMode from './components/StudyMode'
import QuizMode from './components/QuizMode'
import styles from './App.module.css'
import { useState } from 'react'

type Script = 'hiragana' | 'katakana'

const App = () => {
    const [script, setScript] = useState<Script>('hiragana')

    return (
        <div className={styles.app}>
            <header className={styles.header}>
                <NavLink to="/study" className={styles.brand}>
                    <img src="/logo.png" alt="R4A10 Logo" className={styles.brandLogo} />
                </NavLink>

                <nav className={styles.modeNav}>
                    <NavLink
                        to="/study"
                        className={({ isActive }) =>
                            `${styles.modeBtn} ${isActive ? styles.modeBtnActive : ''}`
                        }
                    >
                        <span className={styles.modeIcon}>📖</span>
                        <span>Étude</span>
                    </NavLink>
                    <NavLink
                        to="/quiz"
                        className={({ isActive }) =>
                            `${styles.modeBtn} ${isActive ? styles.modeBtnActive : ''}`
                        }
                    >
                        <span className={styles.modeIcon}>⚡</span>
                        <span>Quiz</span>
                    </NavLink>
                    <NavLink
                        to="/quiz-inverse"
                        className={({ isActive }) =>
                            `${styles.modeBtn} ${isActive ? styles.modeBtnActive : ''}`
                        }
                    >
                        <span className={styles.modeIcon}>🔄</span>
                        <span>Inverse</span>
                    </NavLink>
                </nav>

                <div className={styles.scriptButtons}>
                    {(['hiragana', 'katakana'] as Script[]).map((s) => (
                        <button
                            key={s}
                            onClick={() => setScript(s)}
                            className={`${styles.scriptBtn} ${script === s ? styles.scriptBtnActive : ''}`}
                        >
                            <span className={styles.scriptEx}>{s === 'hiragana' ? 'あ' : 'ア'}</span>
                            <span>{s.charAt(0).toUpperCase() + s.slice(1)}</span>
                        </button>
                    ))}
                </div>
            </header>

            <main className={styles.main}>
                <Routes>
                    <Route path="/" element={<StudyMode script={script} />} />
                    <Route path="/study" element={<StudyMode script={script} />} />
                    <Route path="/quiz" element={<QuizMode key={script} script={script} mode="normal" />} />
                    <Route path="/quiz-inverse" element={<QuizMode key={`inverse-${script}`} script={script} mode="inverse" />} />
                </Routes>
            </main>

            <footer className={styles.footer}>
                <span>頑張って</span>
                <span className={styles.footerMuted}>— IUT Paris 8 · R4A10</span>
            </footer>
        </div>
    )
}

export default App