import styles from './CharacterCard.module.css';

interface CharacterCardProps {
    character: string;
    romanji: string;
}

const CharacterCard = ({ character, romanji }: CharacterCardProps) => {
    return (
        <div className={styles.card}>
            <span className={styles.character}>{character}</span>
            <span className={styles.romanji}>{romanji}</span>
        </div>
    );
};

export default CharacterCard;