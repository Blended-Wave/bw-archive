import styles from '@/styles/Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer_container}>
            <img src="main_logo.svg" alt="logo" />
            <p>
                아티스트 문의 / For artist inquiries (blendedwave@gmail.com)/<br />
                사이트 개발자 문의 / For developer inquiries (12191747@inha.edu)
            </p>
            <p>Copyright ©2023 Blended Wave. All rights reserved. </p>
        </footer>
    )
}