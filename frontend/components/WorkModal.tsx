'use client';

import styles from '@/styles/WorkModal.module.css';

export default function WorkModal({ onClose }) {

    return (
        <>
            <div className={styles.modal_container}>
                <div className={styles.left_box}>
                    <h1>left</h1>
                </div>
                <div className={styles.right_box}>
                    <div className={styles.main_artist}>
                        <img src="https://picsum.photos/60/60" />
                        <h1>MAIN ARTIST</h1>
                    </div>
                    <div className={styles.art_title}>
                        <h2>ART TITLE</h2>
                    </div>
                    <div className={styles.art_series_name}>
                        <p>ART SERIES NAME</p>
                        <p>2023.05.27</p>
                    </div>
                    <div className={styles.description}>
                        <h3>DESCRIPTION</h3>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                    </div>
                    <div className={styles.credits}>
                        <h4>CREDITS</h4>
                        <p><img src="https://picsum.photos/21/21" /> DISUCZZ</p>
                        <p><img src="https://picsum.photos/21/21" /> TEEVE.TEEVE</p>
                        <p><img src="https://picsum.photos/21/21" /> ARMY_IN</p>
                    </div>
                </div>
            </div>
            <div className={styles.background}
                onClick={() => onClose()}>
            </div>
        </>
    )
}