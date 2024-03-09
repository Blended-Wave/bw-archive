import Link from "next/link";
import styles from "../styles/NavBar.module.css";

export default function NavBar() {
  return (
    <nav className={styles.nav}>
      <Link href="/">
        <img src="/main_logo.svg" />
      </Link>
      <div className={styles.menu}>
        <ul>
          <li>
            <Link href="/work">
              WORK
              <span>→</span>
            </Link>
          </li>
          <li>
            <Link href="/artist">
              ARTIST<span>→</span>
            </Link>
          </li>
          <li>
            <Link href="/info">
              INFO<span>→</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
