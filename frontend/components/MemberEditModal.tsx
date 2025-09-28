'use client'

import { useState, useEffect } from 'react';
import styles from '@/styles/MemberManagement.module.css';

interface MemberData {
  user_id?: number;
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
  initialData: MemberData | null;
}

export default function MemberEditModal({ isOpen, onClose, onSave, initialData }: ModalProps) {
  const [memberData, setMemberData] = useState<MemberData>({
    nickname: '',
    role_ids: [],
    twitter_url: '',
    instar_url: '',
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | undefined>(undefined);

  useEffect(() => {
    if (initialData) {
      setMemberData(initialData);
      setAvatarPreview(initialData.avatar_image_url || "/admin_icon/alt_img.svg"); // 기본 이미지 경로 추가
    } else {
      // initialData가 없으면 (비정상적인 경우) 초기화
      setMemberData({
        nickname: '',
        role_ids: [],
        twitter_url: '',
        instar_url: '',
      });
      setAvatarPreview("/admin_icon/alt_img.svg"); // 기본 이미지 경로 추가
    }
    setAvatarFile(undefined);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

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

    const isValidTwitter = (url: string) =>
      /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/[A-Za-z0-9_]+(\/)?$/.test(url.trim());
    const isValidInstagram = (url: string) =>
      /^(https?:\/\/)?(www\.)?instagram\.com\/[A-Za-z0-9_.]+(\/)?$/.test(url.trim());
    
    
    const tw = (memberData.twitter_url || '').trim() // 유효하지 않는 경우 에러 메시지 출력
    if (tw && !isValidTwitter(tw)) { alert('유효한 Twitter/X 프로필 URL을 입력해 주세요.'); return; }
    const ig = (memberData.instar_url || '').trim();
    if (ig && !isValidInstagram(ig)) { alert('유효한 Instagram 프로필 URL을 입력해 주세요.'); return; }

    if (!memberData.nickname) {
        alert('닉네임은 필수 항목입니다.');
        return;
    }
    
    onSave(memberData, avatarFile);
  };

  return (
    <div className={styles.modal_overlay}>
      <div className={styles.modal_content}>
        <h2>멤버 정보 수정</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.avatar_section}>
            <img src={avatarPreview || "/admin_icon/alt_img.svg"} alt="Avatar Preview" className={styles.avatar_preview} />
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
          </div>

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
            <label><input type="checkbox" checked={memberData.role_ids.includes(2)} onChange={() => handleCheckboxChange(2)} /> 애니메이터</label>
            <label><input type="checkbox" checked={memberData.role_ids.includes(3)} onChange={() => handleCheckboxChange(3)} /> 작곡</label>
            <label><input type="checkbox" checked={memberData.role_ids.includes(4)} onChange={() => handleCheckboxChange(4)} /> 작가</label>
          </div>

          <label>Twitter URL</label>
          <input type="text" name="twitter_url" value={memberData.twitter_url || ''} onChange={handleChange} />

          <label>Instagram URL</label>
          <input type="text" name="instar_url" value={memberData.instar_url || ''} onChange={handleChange} />

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
