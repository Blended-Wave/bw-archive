'use client';

import styles from '@/styles/admin.module.css';
import AdminSidebar from '@/components/AdminSidebar';
import MemberManagement from '@/components/MemberManagement';

import { useState } from 'react';

export default function Admin() {
    const [selectedMenu, setSelectedMenu] = useState('membermanagement');

    return (
        <div className={styles.admin_container}>
            <AdminSidebar handleSelectedMenu={setSelectedMenu}/>
            {selectedMenu === 'membermanagement' && <MemberManagement />}
        </div>
    )
}