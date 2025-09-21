'use client';

import styles from '@/styles/admin.module.css';
import AdminSidebar from '@/components/AdminSidebar';
import MemberManagement from '@/components/MemberManagement';
import WorksManagement from '@/components/WorksManagement';
import useUserStore from '@/store/userStore';
import api from '@/lib/axios';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Admin() {
    const [selectedMenu, setSelectedMenu] = useState('members');
    const { isLoggedIn, login, logout } = useUserStore();
    const router = useRouter();

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await api.get('/auth/status');
                if (response.data.isAuthenticated && response.data.user) {
                    login(response.data.user);
                } else {
                    // 인증되지 않은 경우 메인 페이지로 리다이렉트
                    console.log('관리자 권한이 없습니다. 메인 페이지로 이동합니다.');
                    router.push('/');
                }
            } catch (error) {
                console.error('인증 상태 확인 실패:', error);
                // 오류 발생 시에도 메인 페이지로 리다이렉트
                router.push('/');
            }
        };

        checkAuthStatus();
    }, [login, router]);

    // 세션 상태를 주기적으로 확인 (30초마다)
    useEffect(() => {
        const checkSessionStatus = async () => {
            try {
                const response = await api.get('/auth/status');
                if (!response.data.isAuthenticated) {
                    console.log('세션이 만료되었습니다. 메인 페이지로 이동합니다.');
                    logout();
                    router.push('/');
                }
            } catch (error: any) {
                console.error('세션 확인 실패:', error);
                // 서버 오류가 아닌 인증 오류인 경우에만 리다이렉트
                if (error.response?.status === 401 || error.response?.status === 403) {
                    logout();
                    router.push('/');
                }
            }
        };

        // 최초 확인
        checkSessionStatus();
        
        // 30초마다 세션 상태 확인
        const interval = setInterval(checkSessionStatus, 30000);
        
        return () => clearInterval(interval);
    }, [logout, router]);

    // 로그인하지 않은 경우 로딩 표시
    if (!isLoggedIn) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                fontSize: '18px'
            }}>
                관리자 권한을 확인하는 중...
            </div>
        );
    }

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