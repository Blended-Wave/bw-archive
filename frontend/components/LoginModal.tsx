"use client";

import React, { useRef, useEffect } from "react";
import styles from "@/styles/LoginModal.module.css";

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // ✅ 모달 바깥을 클릭하면 닫히도록 설정
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer} ref={modalRef}>
        <h2>LOGIN</h2>
        <p><strong>BLENDED WAVE 팀원 전용</strong> 로그인입니다.
        <br/>로그인 없이도 모든 작품 관람 가능합니다.
        </p>
        <form>
          <label htmlFor="id">Login ID</label>
          <input type="text" id="id" placeholder="아이디를 입력하세요" required />

          <label htmlFor="password">Password</label>
          <input type="password" id="password" placeholder="비밀번호를 입력하세요" required />

          <button type="submit" className={styles.loginButton}>Login</button>
        </form>

        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
