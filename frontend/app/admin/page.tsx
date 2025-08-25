'use client';

import styles from '@/styles/admin.module.css';
import AdminSidebar from '@/components/AdminSidebar';
import MemberManagement from '@/components/MemberManagement';
import WorksManagement from '@/components/WorksManagement';

import { useState } from 'react';

export default function Admin() {
    const [selectedMenu, setSelectedMenu] = useState('membermanagement');
    return (
        <div className={styles.admin_container}>
            <AdminSidebar selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />
            <div
                style={{
                    marginLeft: '270px',
                    width: 'calc(100% - 270px)',
                    padding: '40px',
                    boxSizing: 'border-box',
                }}
            >
                {selectedMenu === 'members' && <MemberManagement />}
                {selectedMenu === 'works' && <WorksManagement />}
            </div>
        </div>
    )
}