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
                <div className={styles.brand}>
                    <img src="/logo.png" alt="R4A10 Logo" className={styles.brandLogo} />
                </div>
                <nav className={styles.modeNav}>
                    <NavLink
                        to="/study"
                        className={({ isActive }) =>
                            `${styles.modeBtn} ${isActive ? styles.modeBtnActive : ''}`
                        }
                    >
                        📖 Étude
                    </NavLink>
                    <NavLink
                        to="/quiz"
                        className={({ isActive }) =>
                            `${styles.modeBtn} ${isActive ? styles.modeBtnActive : ''}`
                        }
                    >
                        ⚡ Quiz
                    </NavLink>
                </nav>
            </header>

            <div className={styles.scriptBar}>
                <div className={styles.scriptButtons}>
                    {(['hiragana', 'katakana'] as Script[]).map((s) => (
                        <button
                            key={s}
                            onClick={() => setScript(s)}
                            className={`${styles.scriptBtn} ${script === s ? styles.scriptBtnActive : ''}`}
                        >
                            <span className={styles.scriptEx}>{s === 'hiragana' ? 'あ' : 'ア'}</span>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <main className={styles.main}>
                <Routes>
                    <Route path="/" element={<StudyMode script={script} />} />
                    <Route path="/study" element={<StudyMode script={script} />} />
                    <Route path="/quiz" element={<QuizMode key={script} script={script} />} />
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