import styles from "../styles/Footer.module.css";

export default function Footer() {
  const thisyear: number = new Date().getFullYear();
  const artist: string = "blendedwave@gmail.com";
  const developer: string = "12191735@inha.edu";

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <img src="/main_logo.svg" />
        </div>
        <div className={styles.info}>
          <p>
            아티스트 문의 / For artist inquiries ({artist})/
            <br />
            사이트 개발자 문의 / For developer inquiries ({developer})
          </p>
        </div>
        <div className={styles.copyright}>
          <p>Copyrigh &copy;{thisyear} Blended Wave. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
