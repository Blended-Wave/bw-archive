import Link from "next/link";
import styles from "../../../styles/Work.module.css";
import { useRef, useState } from "react";

export default function Work() {
  const [modalOpen, setModalOpen] = useState(false);
  const modalBackground = useRef();

  return (
    <div className={styles.background}>
      <p className={styles.main}>ARTWORKS</p>
      <div className={styles.sort}>
        <p>정렬방식:</p>
        <Link href="/work">최신순</Link>
        <p>|</p>
        <img src="/check.svg"></img>
        <Link href="/work/views" style={{ color: "#fff" }}>
          조회수순
        </Link>
      </div>
      <div className={styles.artwork_container}>
        <div className={styles.artwork}>
          <div
            className={styles.artwork_image}
            onClick={() => setModalOpen(true)}
          >
            <img src="/plus_icon.svg" />
          </div>
        </div>
        <div className={styles.artwork}>
          <div
            className={styles.artwork_image}
            onClick={() => setModalOpen(true)}
          >
            <img src="/plus_icon.svg" />
          </div>
        </div>
        <div className={styles.artwork}>
          <div
            className={styles.artwork_image}
            onClick={() => setModalOpen(true)}
          >
            <img src="/plus_icon.svg" />
          </div>
        </div>
        <div className={styles.artwork}>
          <div
            className={styles.artwork_image}
            onClick={() => setModalOpen(true)}
          >
            <img src="/plus_icon.svg" />
          </div>
        </div>
        <div className={styles.artwork}>
          <div
            className={styles.artwork_image}
            onClick={() => setModalOpen(true)}
          >
            <img src="/plus_icon.svg" />
          </div>
        </div>
        <div className={styles.artwork}>
          <div
            className={styles.artwork_image}
            onClick={() => setModalOpen(true)}
          >
            <img src="/plus_icon.svg" />
          </div>
        </div>
        <div className={styles.artwork}>
          <div
            className={styles.artwork_image}
            onClick={() => setModalOpen(true)}
          >
            <img src="/plus_icon.svg" />
          </div>
        </div>
        <div className={styles.artwork}>
          <div
            className={styles.artwork_image}
            onClick={() => setModalOpen(true)}
          >
            <img src="/plus_icon.svg" />
          </div>
        </div>
        <div className={styles.artwork}>
          <div
            className={styles.artwork_image}
            onClick={() => setModalOpen(true)}
          >
            <img src="/plus_icon.svg" />
          </div>
        </div>
        <div className={styles.artwork}>
          <div
            className={styles.artwork_image}
            onClick={() => setModalOpen(true)}
          >
            <img src="/plus_icon.svg" />
          </div>
        </div>
        <div className={styles.artwork}>
          <div
            className={styles.artwork_image}
            onClick={() => setModalOpen(true)}
          >
            <img src="/plus_icon.svg" />
          </div>
        </div>
        <div className={styles.artwork}>
          <div
            className={styles.artwork_image}
            onClick={() => setModalOpen(true)}
          >
            <img src="/plus_icon.svg" />
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
      {modalOpen && (
        <div
          className={styles.modal_container}
          ref={modalBackground}
          onClick={(e) => {
            if (e.target === modalBackground.current) {
              setModalOpen(false);
            }
          }}
        >
          <img
            className={styles.swiper_button_prev}
            style={{ margin: "0 38px 0 0" }}
            src="/left_arrow2.svg"
          ></img>
          <div className={styles.modal_content}>
            <img className={styles.detail_img} src="/"></img>
            <div className={styles.detail_info}>
              <div className={styles.detail_artist}>
                <img src="/"></img>
                <p>MAIN ARTIST</p>
              </div>
              <div className={styles.detail_title}>
                <div className={styles.detail_arttitle}>
                  <p>ART TITLE</p>
                  <p>ART SERIES NAME</p>
                </div>
                <div className={styles.detail_artdate}>
                  <p>2023.05.27</p>
                </div>
              </div>
              <div className={styles.description}>
                <p>DESCRIPTION</p>
                <div className={styles.description_container}>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                    <br />
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                  </p>
                </div>
              </div>
              <div className={styles.credits}>
                <p>CREDITS</p>
                <div className={styles.credit}>
                  <img></img>
                  <p>DISUCZZ</p>
                </div>
                <div className={styles.credit}>
                  <img></img>
                  <p>TEEVE.TEEVE</p>
                </div>
                <div className={styles.credit}>
                  <img></img>
                  <p>ARMY_IN</p>
                </div>
              </div>
            </div>
          </div>
          <img
            className={styles.swiper_button_prev}
            style={{ margin: "0 0 0 36px" }}
            src="/right_arrow2.svg"
          ></img>
        </div>
      )}
    </div>
  );
}
