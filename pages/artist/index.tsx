import Link from "next/link";
import styles from "../../styles/Artist.module.css";

export default function artist() {
  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <p>ARTISTS</p>
        <div className={styles.artist_container}>
          <div className={styles.artist}>
            <div className={styles.artist_image}>
              <img src="/illustrator_icon.svg" />
              <Link className={styles.detail} href="/artist/1">
                <img src="/plus_icon.svg" />
                <p>VIEW DETAIL</p>
              </Link>
            </div>
            <p className={styles.name}>artist</p>
          </div>
          <div className={styles.artist}>
            <div className={styles.artist_image}>
              <img src="/illustrator_icon.svg" />
              <Link className={styles.detail} href="/artist/2">
                <img src="/plus_icon.svg" />
                <p>VIEW DETAIL</p>
              </Link>
            </div>
            <p className={styles.name}>artist</p>
          </div>
          <div className={styles.artist}>
            <div className={styles.artist_image}>
              <img src="/illustrator_icon.svg" />
              <Link className={styles.detail} href="/artist/3">
                <img src="/plus_icon.svg" />
                <p>VIEW DETAIL</p>
              </Link>
            </div>
            <p className={styles.name}>artist</p>
          </div>
          <div className={styles.artist}>
            <div className={styles.artist_image}>
              <img src="/illustrator_icon.svg" />
              <Link className={styles.detail} href="/artist/4">
                <img src="/plus_icon.svg" />
                <p>VIEW DETAIL</p>
              </Link>
            </div>
            <p className={styles.name}>artist</p>
          </div>
          <div className={styles.artist}>
            <div className={styles.artist_image}>
              <img src="/illustrator_icon.svg" />
              <Link className={styles.detail} href="/artist/5">
                <img src="/plus_icon.svg" />
                <p>VIEW DETAIL</p>
              </Link>
            </div>
            <p className={styles.name}>artist</p>
          </div>
          <div className={styles.artist}>
            <div className={styles.artist_image}>
              <img src="/illustrator_icon.svg" />
              <Link className={styles.detail} href="/artist/6">
                <img src="/plus_icon.svg" />
                <p>VIEW DETAIL</p>
              </Link>
            </div>
            <p className={styles.name}>artist</p>
          </div>
        </div>
      </div>
    </div>
  );
}
