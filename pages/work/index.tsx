import Link from "next/link";
import styles from "../../styles/Work.module.css";

export default function Work() {
  return (
    <div className={styles.background}>
      <p className={styles.main}>ARTWORKS</p>
      <div className={styles.sort}>
        <p>정렬방식:</p>
        <img src="/check.svg"></img>
        <Link href="/work" style={{ color: "#fff" }}>
          최신순
        </Link>
        <p>|</p>
        <Link href="/work/views">조회수순</Link>
      </div>
      <div className={styles.artwork_container}>
        <div className={styles.artwork}>
          <div className={styles.artwork_image}>
            <Link className={styles.detail} href="/">
              <img src="/plus_icon.svg" />
            </Link>
          </div>
        </div>
        <div className={styles.artwork}>
          <div className={styles.artwork_image}>
            <Link className={styles.detail} href="/">
              <img src="/plus_icon.svg" />
            </Link>
          </div>
        </div>
        <div className={styles.artwork}>
          <div className={styles.artwork_image}>
            <Link className={styles.detail} href="/">
              <img src="/plus_icon.svg" />
            </Link>
          </div>
        </div>
        <div className={styles.artwork}>
          <div className={styles.artwork_image}>
            <Link className={styles.detail} href="/">
              <img src="/plus_icon.svg" />
            </Link>
          </div>
        </div>
        <div className={styles.artwork}>
          <div className={styles.artwork_image}>
            <Link className={styles.detail} href="/">
              <img src="/plus_icon.svg" />
            </Link>
          </div>
        </div>
        <div className={styles.artwork}>
          <div className={styles.artwork_image}>
            <Link className={styles.detail} href="/">
              <img src="/plus_icon.svg" />
            </Link>
          </div>
        </div>
        <div className={styles.artwork}>
          <div className={styles.artwork_image}>
            <Link className={styles.detail} href="/">
              <img src="/plus_icon.svg" />
            </Link>
          </div>
        </div>
        <div className={styles.artwork}>
          <div className={styles.artwork_image}>
            <Link className={styles.detail} href="/">
              <img src="/plus_icon.svg" />
            </Link>
          </div>
        </div>
        <div className={styles.artwork}>
          <div className={styles.artwork_image}>
            <Link className={styles.detail} href="/">
              <img src="/plus_icon.svg" />
            </Link>
          </div>
        </div>
        <div className={styles.artwork}>
          <div className={styles.artwork_image}>
            <Link className={styles.detail} href="/">
              <img src="/plus_icon.svg" />
            </Link>
          </div>
        </div>
        <div className={styles.artwork}>
          <div className={styles.artwork_image}>
            <Link className={styles.detail} href="/">
              <img src="/plus_icon.svg" />
            </Link>
          </div>
        </div>
        <div className={styles.artwork}>
          <div className={styles.artwork_image}>
            <Link className={styles.detail} href="/">
              <img src="/plus_icon.svg" />
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.pagination}>
        <img src="/left_arrow.svg" />
        <p>1</p>
        <p>2</p>
        <p>3</p>
        <p>4</p>
        <p>5</p>
        <img src="/right_arrow.svg" />
      </div>
    </div>
  );
}
