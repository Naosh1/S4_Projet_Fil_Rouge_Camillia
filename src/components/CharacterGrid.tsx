import { Fragment, useMemo } from 'react';
import CharacterCard from './CharacterCard';
import { Kana, ROW_ORDER } from '../data/kana';
import styles from './CharacterGrid.module.css';

interface CharacterGridProps {
  characters: Kana[];
  script: 'hiragana' | 'katakana';
}

const DAKUTEN_START = ROW_ORDER.indexOf('ga');

const CharacterGrid = ({ characters, script }: CharacterGridProps) => {
  const rowMap = useMemo(() => {
    const map: Record<string, Kana[]> = {};
    characters.forEach((k) => {
      if (!map[k.row]) map[k.row] = [];
      map[k.row].push(k);
    });
    return map;
  }, [characters]);

  return (
    <div className={styles.wrapper}>
      {ROW_ORDER.map((row, idx) => {
        if (!rowMap[row]) return null;
        return (
          <Fragment key={row}>
            {idx === DAKUTEN_START && (
              <div className={styles.divider}>
                <div className={styles.dividerLine} />
                <span className={styles.dividerLabel}>Dakuten &amp; Handakuten</span>
                <div className={styles.dividerLine} />
              </div>
            )}
            <div className={styles.row}>
              {rowMap[row].map((k) => (
                <CharacterCard
                  key={k.hiragana}
                  character={script === 'hiragana' ? k.hiragana : k.katakana}
                  romanji={k.romanji}
                />
              ))}
            </div>
          </Fragment>
        );
      })}
    </div>
  );
};

export default CharacterGrid;
