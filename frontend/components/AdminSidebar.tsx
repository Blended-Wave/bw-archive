'use client';

import styles from '../styles/AdminSidebar.module.css';
import Link from 'next/link';
import useUserStore from '@/store/userStore';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

interface AdminSidebarProps {
    selectedMenu: string;
    setSelectedMenu: (menu: string) => void;
}

export default function AdminSidebar({ selectedMenu, setSelectedMenu }: AdminSidebarProps) {
    const { logout } = useUserStore();
    const router = useRouter();
    
    const getStyle = (menuName: string) => {
        return selectedMenu === menuName ? {} : { opacity: 0.5 };
    };

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('로그아웃 API 실패:', error);
        } finally {
            logout();
            router.push('/');
        }
    };

    return (
        <div className={styles.sidebar}>
      <Link href="/" className={styles.adminpanel}>
                <img src="/admin_icon/setting_icon.svg" />
                <p>BW Admin Panel</p>
      </Link>
            <div className={styles.menu}>
                <ul>
          <li
            onClick={() => setSelectedMenu('members')}
            style={getStyle('members')}
                    >
                        <img src="/admin_icon/human_icon.svg" />
                        <p>멤버 관리</p>
                    </li>
          <li
            onClick={() => setSelectedMenu('works')}
            style={getStyle('works')}
                    >
                        <img src="/admin_icon/work_icon.svg" />
                        <p>작업물 관리</p>
                    </li>
                </ul>
            </div>
      <Link href="/" className={styles.homeButton}>
        메인 페이지로 돌아가기
      </Link>
      <button onClick={handleLogout} className={styles.logoutButton}>
        로그아웃
      </button>
        </div>
  );
}
