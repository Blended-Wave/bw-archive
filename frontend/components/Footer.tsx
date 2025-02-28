import styles from '@/styles/Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer_container}>
            <div className={styles.footer_box}>
                <img src="main_logo.svg" alt="logo" />
            </div>
            <div className={styles.footer_center}>
                <p>아티스트 문의 / For artist inquiries (blendedwave@gmail.com)</p>
                <p>사이트 개발자 문의 / For developer inquiries (12191735@inha.edu)</p>
            </div>
            <div className={styles.footer_right}>
                <p>Copyright ©2025 Blended Wave. All rights reserved.</p>
                <p  className={styles.footer_login}><a href="/admin">Member Login</a></p> {/* 로그인 버튼을 푸터로 이동 */}
            </div>
        </footer>
    )
}