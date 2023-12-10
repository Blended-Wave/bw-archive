import styles from "../styles/WorkModal.module.css";

export default function WorkModal({ modalBackground }) {
  return (
    <div className={styles.modal_container} ref={modalBackground}>
      <img
        className={styles.swiper_button_prev}
        style={{ margin: "0 38px 0 0" }}
        src="/left_arrow2.svg"
      ></img>
      <div className={styles.modal_content}>
        <img
          className={styles.detail_img}
          src="https://picsum.photos/1243/780"
        ></img>
        <div className={styles.detail_info}>
          <div className={styles.detail_artist}>
            <img src="https://picsum.photos/1243/780"></img>
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
          <div>
            <p className={styles.description}>DESCRIPTION</p>
            <div className={styles.description_container}>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
                <br />
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
                <br />
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
          </div>
          <div>
            <p className={styles.credits}>CREDITS</p>
            <div className={styles.credit}>
              <img src="https://picsum.photos/1243/780"></img>
              <p>DISUCZZ</p>
            </div>
            <div className={styles.credit}>
              <img src="https://picsum.photos/1243/780"></img>
              <p>TEEVE.TEEVE</p>
            </div>
            <div className={styles.credit}>
              <img src="https://picsum.photos/1243/780"></img>
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
  );
}
