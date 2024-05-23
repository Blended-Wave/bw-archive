import styles from '@/styles/Info.module.css';

export default function Info() {
    return (
        <main>
            <div className={styles.info_container}>
                <h1> INFORMATION</h1>
                <img src="main_logo.svg" alt="logo" className={styles.logo_img} />
                <img src="background.svg" className={styles.background_img} />
                <p className={styles.p1}>
                    The authentic label that presents a new paradigm based on its originalityan brings beloved music upon diverse style and taste.
                </p>
                <p className={styles.p2}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <p className={styles.p3}>CONTACT</p>
                <div className={styles.contact_container}>
                    <a href="https://x.com">
                        <img src="twitter.svg" />
                    </a>
                    <a href="https://www.instagram.com/" >
                        <img src="instagram.svg" />
                    </a>
                    <a href="mailto:메일주소" rel="noopener">
                        <img src="mail.svg" />
                    </a>
                </div>
            </div>
        </main >
    );
}
