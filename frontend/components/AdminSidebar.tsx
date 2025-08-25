'use client';

import styles from '../styles/AdminSidebar.module.css';
import Link from 'next/link';

export default function AdminSidebar({ selectedMenu, setSelectedMenu }) {
    const getStyle = (menuName) => {
        return selectedMenu === menuName ? {} : { opacity: 0.5 };
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
        </div>
  );
}
