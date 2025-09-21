"use client";

import { useState } from "react";
import LoginModal from "./LoginModal";
import styles from "@/styles/Footer.module.css";
import useUserStore from "@/store/userStore";

export default function Footer() {
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const { isLoggedIn } = useUserStore();

    return (
        <>
            <footer className={styles.footer_container}>
                <div className={styles.footer_box}>
                    <img src="main_logo.svg" alt="logo" />
                </div>
                <div className={styles.footer_center}>
                    <p>아티스트 문의 / For artist inquiries (thisiscuzz@naver.com)</p>
                    <p>사이트 개발자 문의 / For developer inquiries (sunwoo005@gmail.com)</p>
                </div>
                <div className={styles.footer_right}>
                    <p>Copyright ©2025 Blended Wave. All rights reserved.</p>
                    {!isLoggedIn && (
                        <p className={styles.footer_login}>
                            <button onClick={() => setLoginModalOpen(true)}>Member Login</button>
                        </p>
                    )}
                </div>
            </footer>

            {isLoginModalOpen && <LoginModal onClose={() => setLoginModalOpen(false)} />}
        </>
    );
}
