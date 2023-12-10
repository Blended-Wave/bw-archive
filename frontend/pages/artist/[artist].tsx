import Link from "next/link";
import styles from "../../styles/Artitst.Introduction.module.css";
import ArtistSwiper from "@/components/ArtistSwiper";

export default function introduction() {
  return (
    <div className={styles.background}>
      <p>ARTISTS INTRODUCTION</p>
      <ArtistSwiper></ArtistSwiper>
      <Link className={styles.button} href="/artist">
        BACK TO LIST
      </Link>
    </div>
  );
}
