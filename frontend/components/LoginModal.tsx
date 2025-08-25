"use client";

import React, { useRef, useEffect, useState } from "react";
import styles from "@/styles/LoginModal.module.css";
import api from "@/lib/axios"; // 수정된 부분
import useUserStore from "@/store/userStore";

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useUserStore();

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/login", { // 수정된 부분
        login_id: loginId,
        password: password,
      });

      if (response.data && response.data.user) {
        login(response.data.user);
        alert('로그인에 성공했습니다.');
        onClose();
      } else {
        setError("로그인에 실패했습니다. 응답 데이터를 확인하세요.");
      }
    } catch (err: any) { // any 타입으로 변경하여 유연하게 에러 처리
      if (err.isAxiosError && err.response) {
        if (err.response.status === 401) {
          setError("아이디 또는 비밀번호가 잘못되었습니다.");
        } else {
          setError("로그인 중 오류가 발생했습니다.");
        }
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
      console.error("Login error:", err);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer} ref={modalRef}>
        <h2>LOGIN</h2>
        <p><strong>BLENDED WAVE 팀원 전용</strong> 로그인입니다.
        <br/>로그인 없이도 모든 작품 관람 가능합니다.
        </p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="id">Login ID</label>
          <input 
            type="text" 
            id="id" 
            placeholder="아이디를 입력하세요" 
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            required 
          />

          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            placeholder="비밀번호를 입력하세요" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          
          {error && <p className={styles.errorMessage}>{error}</p>}

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
