import Link from 'next/link';
import styles from '@/styles/ArtistBox.module.css';

export default function ArtistBox() {
    return (
        <div className={styles.artist_container}>
            <div className={styles.artist_box}>
                <div className={styles.arts}>
                    <img src="/artist_icon/illustrator_icon.svg" />
                    <img src="/artist_icon/composer_icon.svg" />
                    <img src="/artist_icon/ani_icon.svg" />
                    <img src="/artist_icon/writer_icon.svg" />
                </div>
                <Link className={styles.detail} href="/artist/1">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="36"
                        height="36"
                        viewBox="0 0 36 36"
                        fill="none"
                    >
                        <path d="M18 -3.05176e-05V36" stroke="white" stroke-width="3" />
                        <path d="M-1.52588e-05 18H36" stroke="white" stroke-width="3" />
                    </svg>
                    <p>VIEW DETAIL</p>
                </Link>
                <img src="https://picsum.photos/300/300" />
            </div>
            <div>artist</div>
        </div>
    )
}

