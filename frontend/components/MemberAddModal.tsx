'use client'

import React, { useState } from 'react';
import axios from 'axios';
import styles from '@/styles/MemberAddModal.module.css';


const MemberAddModal = ({ isOpen, onClose }) => {
    const [newMember, setNewMember] = useState({
        login_id: '',
        password: '',
        avatar_image_url: '',
        nickname: '',
        roles: '',
        twitter_url: '',
        instar_url: '',
        status: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewMember({ ...newMember, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            await axios.post('/api/admin/users_add', {
                login_id: newMember.login_id,
                password: newMember.password,
                avatar_image_url: newMember.avatar_image_url,
                nickname: newMember.nickname,
                role: newMember.roles,
                twitter_url: newMember.twitter_url,
                instar_url: newMember.instar_url,
                status: newMember.status,
            });
        } catch (error) {
            console.error('Error adding new member:', error);
        }
        onClose();
    };

    if (!isOpen) return null;



    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <span className={styles.close} onClick={onClose}>&times;</span>
                <h2>새 멤버 추가</h2>
                <input
                    name="login_id"
                    placeholder="login_id"
                    value={newMember.login_id}
                    onChange={handleChange}
                />
                <input
                    name="password"
                    placeholder="password"
                    value={newMember.password}
                    onChange={handleChange}
                />
                <input
                    name="avatar_image_url"
                    placeholder="Avatar URL"
                    value={newMember.avatar_image_url}
                    onChange={handleChange}
                />
                <input
                    name="nickname"
                    placeholder="Nickname"
                    value={newMember.nickname}
                    onChange={handleChange}
                />
                <div className={styles.checkbox_group}>
                    <label><input type="checkbox" name="profession" value="illustrator" checked /> 일러스트레이터</label>
                    <label><input type="checkbox" name="profession" value="animator" /> 애니메이터</label>
                    <label><input type="checkbox" name="profession" value="composer" /> 작곡가</label>
                    <label><input type="checkbox" name="profession" value="writer" /> 작가</label>
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
                    <button className={styles.close_btn}>Close</button>
                    <button className={styles.save_btn}>Save</button>
                </div>
            </div>
        </div>
    );
};

export default MemberAddModal;
