import styles from "../styles/Info.module.css";

export default function info() {
  return (
    <div className={styles.background}>
      <div className={styles.information}>INFORMATION</div>
      <div className={styles.logo}>
        <img src="/main_logo_white.svg"></img>
      </div>
      <div className={styles.info1}>
        The authentic label that presents a new paradigm based on its
        <br />
        originalityan brings beloved music upon diverse style and taste.
      </div>
      <div className={styles.info2}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut <br />
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
        exercitation ullamco <br />
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
        in reprehenderit in <br />
        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
        sint occaecat cupidatat non <br />
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </div>
      <div className={styles.contact}>CONTACT</div>
      <div className={styles.icon}>
        <img src="/twitter.svg"></img>
        <img src="/instagram.svg"></img>
        <img src="/mail.svg"></img>
      </div>
    </div>
  );
}
