"use client";

import { useState } from "react";
import LoginModal from "./LoginModal";
import styles from "@/styles/Footer.module.css";

export default function Footer() {
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);

    return (
        <>
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
                    {/* ✅ 클릭 시 로그인 모달 띄우기 */}
                    <p className={styles.footer_login}>
                        <button onClick={() => setLoginModalOpen(true)}>Member Login</button>
                    </p>
                </div>
            </footer>

            {/* ✅ 로그인 모달 */}
            {isLoginModalOpen && <LoginModal onClose={() => setLoginModalOpen(false)} />}
        </>
    );
}
