import Link from 'next/link'

import styles from '../styles/Navbar.module.css'

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <a href="/">
                <img src="main_logo.svg" alt="logo" className={styles.logo} />
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
                </ul>
            </div>
        </nav>
    )
}