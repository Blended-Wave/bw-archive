'use client'

import { useState } from 'react';
import styles from '@/styles/MemberManagement.module.css';

interface MemberData {
  login_id: string;
  password?: string;
  nickname: string;
  avatar_image_url?: string;
  role_ids: number[];
  twitter_url?: string;
  instar_url?: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (memberData: MemberData, avatarFile?: File) => void;
}

export default function MemberAddModal({ isOpen, onClose, onSave }: ModalProps) {
  const [memberData, setMemberData] = useState<MemberData>({
    login_id: '',
    password: '',
    nickname: '',
    role_ids: [],
    twitter_url: '',
    instar_url: '',
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | undefined>(undefined);

  if (!isOpen) return null;

  // 모달이 닫힐 때 상태를 초기화하는 로직은 MemberManagement에서 처리
  // 또는 onClose에 상태 초기화 함수를 추가 전달할 수 있음

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMemberData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (roleId: number) => {
    setMemberData(prev => {
      const newRoleIds = prev.role_ids.includes(roleId)
        ? prev.role_ids.filter(id => id !== roleId)
        : [...prev.role_ids, roleId];
      return { ...prev, role_ids: newRoleIds };
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isValidTwitter = (url: string) => // SNS 링크가 유효한지 확인
      /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/[A-Za-z0-9_]+(\/)?$/.test(url.trim());
    const isValidInstagram = (url: string) =>
      /^(https?:\/\/)?(www\.)?instagram\.com\/[A-Za-z0-9_.]+(\/)?$/.test(url.trim());
    
    const tw = (memberData.twitter_url || '').trim() // 유효하지 않는 경우 에러 메시지 출력
    if (tw && !isValidTwitter(tw)) { alert('유효한 Twitter/X 프로필 URL을 입력해 주세요.'); return; }
    
    const ig = (memberData.instar_url || '').trim();
    if (ig && !isValidInstagram(ig)) { alert('유효한 Instagram 프로필 URL을 입력해 주세요.'); return; }
    
    if (!memberData.login_id || !memberData.password || !memberData.nickname) { // 필수 필드 채워져 있는지 확인
        alert('로그인 ID, 비밀번호, 닉네임은 필수 항목입니다.');
        return;
    }
    
    onSave(memberData, avatarFile);
  };

  return (
    <div className={styles.modal_overlay}>
      <div className={styles.modal_content}>
        <h2>새 멤버 추가</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.avatar_section}>
            <img src={avatarPreview || "/admin_icon/alt_img.svg"} alt="Avatar Preview" className={styles.avatar_preview} />
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
          </div>
          
          <div className={styles.input_group}>
            <label htmlFor="login_id">
              로그인 ID
              <span className={styles.guidance_text}>*중복 불가</span>
            </label>
            <input type="text" id="login_id" name="login_id" value={memberData.login_id} onChange={handleChange} required />
          </div>

          <label>비밀번호</label>
          <input type="password" name="password" value={memberData.password} onChange={handleChange} required />

          <div className={styles.input_group}>
            <label htmlFor="nickname">
              닉네임
              <span className={styles.guidance_text}>*중복 불가</span>
            </label>
            <input type="text" id="nickname" name="nickname" value={memberData.nickname} onChange={handleChange} required />
          </div>
          
          <label>역할</label>
          <div className={styles.checkbox_group}>
            <label><input type="checkbox" checked={memberData.role_ids.includes(1)} onChange={() => handleCheckboxChange(1)} /> 일러스트레이터</label>
            <label><input type="checkbox" checked={memberData.role_ids.includes(2)} onChange={() => handleCheckboxChange(2)} /> 작곡가</label>
            <label><input type="checkbox" checked={memberData.role_ids.includes(3)} onChange={() => handleCheckboxChange(3)} /> 애니메이터</label>
            <label><input type="checkbox" checked={memberData.role_ids.includes(4)} onChange={() => handleCheckboxChange(4)} /> 작가</label>
          </div>

          <label>Twitter URL</label>
          <input type="text" name="twitter_url" value={memberData.twitter_url} onChange={handleChange} />

          <label>Instagram URL</label>
          <input type="text" name="instar_url" value={memberData.instar_url} onChange={handleChange} />

          <div className={styles.modal_actions}>
            <button type="button" onClick={onClose}>
              <img src="/admin_icon/close_icon.svg" alt="Close" />
              Close
            </button>
            <button type="submit">
              <img src="/admin_icon/save_icon.svg" alt="Save" />
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
