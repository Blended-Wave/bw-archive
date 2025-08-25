import styles from '@/styles/ArtistBox.module.css';
import Link from 'next/link';

interface Artist {
    user_id: number;
    nickname: string;
    avatar_image_url: string;
    roles: number[];
    twitter_url: string;
    instar_url: string;
}

interface ArtistBoxProps {
    artist: Artist;
}

export default function ArtistBox({ artist }: ArtistBoxProps) {
  return (
    <div className={styles.artist_container}>
      <div className={styles.artist_box}>
        <div className={styles.arts}>
          {artist.roles.includes(1) && <img src="/artist_icon/illustrator_icon.svg" alt="Illustrator" />}
          {artist.roles.includes(2) && <img src="/artist_icon/composer_icon.svg" alt="Composer" />}
          {artist.roles.includes(3) && <img src="/artist_icon/ani_icon.svg" alt="Animator" />}
          {artist.roles.includes(4) && <img src="/artist_icon/writer_icon.svg" alt="Writer" />}
        </div>
        <Link className={styles.detail} href={`/artist/introduction/${artist.user_id}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
          >
            <path d="M18 -3.05176e-05V36" stroke="white" strokeWidth="3" />
            <path d="M-1.52588e-05 18H36" stroke="white" strokeWidth="3" />
          </svg>
          <p>VIEW DETAIL</p>
        </Link>
        {!artist.avatar_image_url || artist.avatar_image_url === 'default avatar' ? 
          <div className={styles.default_avatar_image}></div> :
          <img className={styles.avatar_image} src={artist.avatar_image_url} alt={artist.nickname} />}
      </div>
      <div className={styles.artistName}>{artist.nickname}</div>
    </div>
  );
}
