'use client';

import styles from '../styles/AdminSidebar.module.css';
import { useState, useEffect, use } from 'react';

export default function AdminSidebar({ handleSelectedMenu }) {
    const [selectedMenu, setSelectedMenu] = useState
        ('membermanagement');

    useEffect(() => {
        handleSelectedMenu(selectedMenu);
    }, [selectedMenu]);

    const getStyle = (menuName) => {
        return selectedMenu === menuName ? {} : { opacity: 0.5 };
    };


    return (
        <div className={styles.sidebar}>
            <div className={styles.adminpanel}>
                <img src="/admin_icon/setting_icon.svg" />
                <p>BW Admin Panel</p>
            </div>
            <div className={styles.menu}>
                <ul>
                    <li onClick={() => setSelectedMenu("membermanagement")}
                        style={getStyle("membermanagement")}
                    >
                        <img src="/admin_icon/human_icon.svg" />
                        <p>멤버 관리</p>
                    </li>
                    <li onClick={() => setSelectedMenu("worksmanagement")}
                        style={getStyle("worksmanagement")}
                    >
                        <img src="/admin_icon/work_icon.svg" />
                        <p>작업물 관리</p>
                    </li>
                </ul>
            </div>
        </div>
    )
}
