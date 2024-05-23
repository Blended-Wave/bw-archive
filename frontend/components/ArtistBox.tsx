import styles from '@/styles/ArtistBox.module.css';
import Link from 'next/link';

export default function ArtistBox({ artist }) {
  return (
    <div className={styles.artist_container}>
      <div className={styles.artist_box}>
        <div className={styles.arts}>
          {artist.roles.includes(1) && <img src="/artist_icon/illustrator_icon.svg" />}
          {artist.roles.includes(2) && <img src="/artist_icon/composer_icon.svg" />}
          {artist.roles.includes(3) && <img src="/artist_icon/ani_icon.svg" />}
          {artist.roles.includes(4) && <img src="/artist_icon/writer_icon.svg" />}
        </div>
        <Link className={styles.detail} href="/artist/instroduction">
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
        {artist.avatar_image_url === 'default avatar' ? <img src="/admin_icon/alt_img.svg" style={{ width: 300, height: 300 }} /> : <img src={artist.avatar_image_url} />}
      </div>
      <div>{artist.nickname}</div>
    </div>
  );
}
