'use client'

import React, { useState } from 'react';
import styles from '@/styles/MemberAddModal.module.css';

interface NewMemberData {
    nickname: string;
    avatar_image_url?: string;
    role_ids: number[];
    twitter_url?: string;
    instar_url?: string;
    password?: string;
    login_id?: string;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (member: NewMemberData, avatarFile?: File) => void;
}

const MemberAddModal = ({ isOpen, onClose, onSave }: ModalProps) => {
    const [newMember, setNewMember] = useState<Omit<NewMemberData, 'avatar_image_url'>>({
        login_id: "",
        password: "",
        nickname: "",
        role_ids: [],
        twitter_url: "",
        instar_url: ""
    });
    const [avatarFile, setAvatarFile] = useState<File>();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewMember({ ...newMember, [name]: value });
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { id, checked } = event.target;
        const numericId = parseInt(id, 10);
        setNewMember((prev) => {
            const updatedRoles = checked
                ? [...prev.role_ids, numericId]
                : prev.role_ids.filter((role) => role !== numericId);
            return { ...prev, role_ids: updatedRoles };
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAvatarFile(e.target.files[0]);
        }
    };

    const handleSubmit = () => {
        // 필수 필드 검사
        if (!newMember.login_id || !newMember.password || !newMember.nickname) {
            alert('ID, 비밀번호, 닉네임은 필수 항목입니다.');
            return;
        }
        onSave(newMember, avatarFile);
        // 상태 초기화는 onSave 성공 후 부모 컴포넌트에서 처리하거나, 여기서 직접 해도 됨
        // 모달을 닫는 로직은 이미 onSave 내부에 구현되어 있음
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <h2 className={styles.title}>새 멤버 추가</h2>
                <input
                    name="login_id"
                    placeholder="login_id"
                    value={newMember.login_id}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="password"
                    value={newMember.password}
                    onChange={handleChange}
                />
                <label>아바타 이미지</label>
                <input
                    type="file"
                    name="avatar_image_url"
                    onChange={handleFileChange}
                    accept="image/*"
                />
                <input
                    name="nickname"
                    placeholder="Nickname"
                    value={newMember.nickname}
                    onChange={handleChange}
                />
                <div className={styles.checkbox_group}>
                    <label><input id="1" type="checkbox" name="profession" onChange={handleCheckboxChange} /> 일러스트레이터</label>
                    <label><input id="2" type="checkbox" name="profession" onChange={handleCheckboxChange} /> 작곡가</label>
                    <label><input id="3" type="checkbox" name="profession" onChange={handleCheckboxChange} /> 애니메이터</label>
                    <label><input id="4" type="checkbox" name="profession" onChange={handleCheckboxChange} /> 작가</label>
                </div>
                <input
                    name="twitter_url"
                    placeholder="Twitter URL"
                    value={newMember.twitter_url}
                    onChange={handleChange}
                />
                <input
                    name="instar_url"
                    placeholder="Instagram URL"
                    value={newMember.instar_url}
                    onChange={handleChange}
                />
                <div className={styles.buttons}>
                    <button onClick={onClose} className={styles.close_btn}>Close</button>
                    <button onClick={handleSubmit} className={styles.save_btn}>
                        <img src="/admin_icon/save_icon.svg" alt="Save Icon" className={styles.save_icon} />
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MemberAddModal;
