import Link from 'next/link'

import styles from '../styles/Navbar.module.css'

export default function Navbar() {
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
                    {/* 로그인 로직은 추후 수정할 수도(디자인), 로직은 로그인 페이지로 넘어간 뒤, 로그인 정보 있을 땐 admin 페이지로 수정 */}
                    <li>
                        {/* <Link href="/admin">
                            LOGIN
                        </Link> */}
                    </li>
                </ul>
            </div>
        </nav>
    )
}
//