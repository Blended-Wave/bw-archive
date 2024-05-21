// components/MemberAddModal.jsx
import React, { useState } from 'react';
import axios from 'axios';
import styles from '@/styles/MemberAddModal.module.css';

const MemberAddModal = ({ isOpen, onClose, onAddMember }) => {
    const [newMember, setNewMember] = useState({
        user_id: '',
        password: '',
        avatar_image_url: '',
        nickname: '',
        role: '',
        twitter_url: '',
        instar_url: '',
        works: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewMember({ ...newMember, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            await axios.post('/api/admin/users_add', {
                user_id: newMember.user_id,
                password: newMember.password,
                avatar_image_url: newMember.avatar_image_url,
                nickname: newMember.nickname,
                role: newMember.role.split(','),
                twitter_url: newMember.twitter_url,
                instar_url: newMember.instar_url,
                works: newMember.works,
            });
        } catch (error) {
            console.error('Error adding new member:', error);
        }
        console.log('New member added:', newMember);
        onAddMember(newMember);
        setNewMember({
            user_id: '',
            password: '',
            avatar_image_url: '',
            nickname: '',
            role: '',
            twitter_url: '',
            instar_url: '',
            works: '',
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <span className={styles.close} onClick={onClose}>&times;</span>
                <h2>새 멤버 추가</h2>
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
                <input
                    name="role"
                    placeholder="Role (comma separated)"
                    value={newMember.role}
                    onChange={handleChange}
                />
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
                <input
                    name="works"
                    placeholder="Works"
                    value={newMember.works}
                    onChange={handleChange}
                />
                <button onClick={handleSubmit}>추가</button>
            </div>
        </div>
    );
};

export default MemberAddModal;
