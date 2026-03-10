import { useState } from 'react';
import StudyMode from './components/StudyMode';
import QuizMode from './components/QuizMode';
import styles from './App.module.css';

type Mode   = 'study' | 'quiz';
type Script = 'hiragana' | 'katakana';

function App() {
  const [mode, setMode]     = useState<Mode>('study');
  const [script, setScript] = useState<Script>('hiragana');

  return (
    <div className={styles.app}>
      {/* ── Header ── */}
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.brandKanji}>仮名</span>
          <span className={styles.brandSub}>Apprentissage du Japonais</span>
        </div>

        <nav className={styles.modeNav}>
          {(['study', 'quiz'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`${styles.modeBtn} ${mode === m ? styles.modeBtnActive : ''}`}
            >
              {m === 'study' ? '📖 Étude' : '⚡ Quiz'}
            </button>
          ))}
        </nav>
      </header>

      {/* ── Script selector ── */}
      <div className={styles.scriptBar}>
        <span className={styles.scriptLabel}>Script</span>
        <div className={styles.scriptButtons}>
          {(['hiragana', 'katakana'] as Script[]).map((s) => (
            <button
              key={s}
              onClick={() => setScript(s)}
              className={`${styles.scriptBtn} ${script === s ? styles.scriptBtnActive : ''}`}
            >
              <span className={styles.scriptEx}>
                {s === 'hiragana' ? 'あ' : 'ア'}
              </span>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main content ── */}
      <main className={styles.main}>
        {mode === 'study' ? (
          <StudyMode script={script} />
        ) : (
          /* key={script} resets quiz state when switching script */
          <QuizMode key={script} script={script} />
        )}
      </main>

      <footer className={styles.footer}>
        <span>頑張って</span>
        <span className={styles.footerMuted}>— IUT Paris 8 · R4A10</span>
      </footer>
    </div>
  );
}

export default App;
