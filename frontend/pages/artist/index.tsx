import Link from "next/link";
import styles from "../../styles/Artist.module.css";
import ArtistBox from "@/components/ArtistBox";

export default function artist() {
  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <p>ARTISTS</p>
        <div className={styles.artist_container}>
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
