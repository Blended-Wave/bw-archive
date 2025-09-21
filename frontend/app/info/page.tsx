import styles from '@/styles/Info.module.css';

export default function Info() {
    return (
        <main>
            <div className={styles.info_container}>
                <h1> INFORMATION</h1>
                <img src="main_logo.svg" alt="logo" className={styles.logo_img} />
                <img src="background.svg" className={styles.background_img} />
                <p className={styles.p1}>
                    A wave of creativity from diverse artists.<br></br>
                    Blended Wave brings individual works together into one flow.
                </p>
                <p className={styles.p2}>
                Animators, illustrators, composers, and writers share their own works here.<br></br>
                This is a space for both personal creations and collaborative projects. <br></br>
                Blended Wave connects originality into a greater artistic journey.
                </p>
                <p className={styles.p3}>CONTACT</p>
                <div className={styles.contact_container}>
                    <a href="https://x.com">
                        <img src="twitter.svg" />
                    </a>
                    <a href="https://www.instagram.com/" >
                        <img src="instagram.svg" />
                    </a>
                    <a href="mailto:thisiscuzz@naver.com" rel="noopener">
                        <img src="mail.svg" />
                    </a>
                </div>
            </div>
        </main >
    );
}
