'use client'

import React, { useState } from 'react';
import axios from 'axios';
import styles from '@/styles/MemberAddModal.module.css';


const MemberAddModal = ({ isOpen, onClose }) => {
    const [newMember, setNewMember] = useState({
        login_id: "",
        password: "",
        avatar_image_url: "",
        nickname: "",
        roles: [],
        twitter_url: "",
        instar_url: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewMember({ ...newMember, [name]: value });
    };

    const handleCheckboxChange = (event) => {
        const { id, checked } = event.target; // id와 checked를 추출
        const numericId = parseInt(id, 10); // id를 숫자로 변환
        setNewMember((prev) => {
            const updatedRoles = checked
                ? [...prev.roles, numericId]
                : prev.roles.filter((role) => role !== numericId);
            return { ...prev, roles: updatedRoles };
        });
    };


    const handleSubmit = async () => {
        try {
            await axios.post('http://localhost:4000/api/admin/user_add', {
                login_id: newMember.login_id,
                password: newMember.password,
                avatar_image_url: newMember.avatar_image_url,
                nickname: newMember.nickname,
                roles: newMember.roles,
                twitter_url: newMember.twitter_url,
                instar_url: newMember.instar_url,
            });
        } catch (error) {
            console.error('Error adding new member:', error);
        }
        
        console.log({
            login_id: newMember.login_id,
            password: newMember.password,
            avatar_image_url: newMember.avatar_image_url,
            nickname: newMember.nickname,
            role: newMember.roles,
            twitter_url: newMember.twitter_url,
            instar_url: newMember.instar_url
        });
        setNewMember({
            login_id: "",
            password: "",
            avatar_image_url: "",
            nickname: "",
            roles: [],
            twitter_url: "",
            instar_url: ""
        });

        onClose();
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
                    <label><input id="1" type="checkbox" name="profession" value="illustrator" onChange={handleCheckboxChange} /> 일러스트레이터</label>
                    <label><input id="2" type="checkbox" name="profession" value="animator" onChange={handleCheckboxChange} /> 애니메이터</label>
                    <label><input id="3" type="checkbox" name="profession" value="composer" onChange={handleCheckboxChange} /> 작곡가</label>
                    <label><input id="4" type="checkbox" name="profession" value="writer" onChange={handleCheckboxChange} /> 작가</label>
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
                    <button onClick={() => onClose()} className={styles.close_btn}>Close</button>
                    <button className={styles.save_btn}>
                        <img src="/admin_icon/save_icon.svg" alt="Save Icon" className={styles.save_icon} />
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MemberAddModal;
