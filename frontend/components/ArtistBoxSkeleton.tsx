import styles from '@/styles/ArtistBoxSkeleton.module.css';

export default function ArtistBoxSkeleton() {
  return (
    <div className={styles.artist_container}>
      <div className={styles.artist_box}></div>
      <div className={styles.artistName}></div>
    </div>
  );
} 