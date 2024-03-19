import styles from '@/styles/Artist.module.css';
import Link from 'next/link';
import ArtistBox from '@/components/ArtistBox';

export default function Artist() {
    return (
        <div className={styles.background}>
            <div className={styles.artist_container}>
                <p>ARTISTS</p>
                <div className={styles.artists}>
                    <ArtistBox />
                    <ArtistBox />
                    <ArtistBox />
                    <ArtistBox />
                    <ArtistBox />
                    <ArtistBox />
                </div>
            </div>
        </div>
    );
}
