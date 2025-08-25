'use client';

import Link from 'next/link'
import styles from '../styles/Navbar.module.css'
import useUserStore from '@/store/userStore';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const { isLoggedIn, logout } = useUserStore();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        // 필요하다면 로그아웃 API 호출 추가
        // await axios.post('/api/auth/logout');
        router.push('/'); // 로그아웃 후 홈으로 이동
    };

    return (
        <nav className={styles.navbar}>
            <a href="/">
                <img src="/main_logo.svg" alt="logo" className={styles.logo} />
            </a>
            <div className={styles.menu}>
                <ul>
                    <li>
                        <Link href="/work">
                            WORK
                        </Link>
                    </li>
                    <li>
                        <Link href="/artist">
                            ARTIST
                        </Link>
                    </li>
                    <li>
                        <Link href="/info">
                            INFO
                        </Link>
                    </li>
                    {isLoggedIn && (
                        <>
                            <li>
                                <Link href="/admin">
                                    ADMIN
                                </Link>
                            </li>
                            <li>
                                <button onClick={handleLogout} className={styles.logoutButton}>
                                    LOGOUT
                                </button>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    )
}