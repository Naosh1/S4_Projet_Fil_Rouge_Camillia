import CharacterGrid from './CharacterGrid';
import { kanaData } from '../data/kana';
import styles from './StudyMode.module.css';

interface StudyModeProps {
    script: 'hiragana' | 'katakana';
}

const StudyMode = ({ script }: StudyModeProps) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <h2 className={styles.title}>
                    {script === 'hiragana' ? 'Hiragana — ひらがな' : 'Katakana — カタカナ'}
                </h2>
                <p className={styles.subtitle}>
                    {script === 'hiragana'
                        ? 'Utilisé pour les mots japonais natifs'
                        : 'Utilisé pour les mots étrangers et onomatopées'}
                </p>
            </div>
            <CharacterGrid characters={kanaData} script={script} />
        </div>
    );
};

export default StudyMode;