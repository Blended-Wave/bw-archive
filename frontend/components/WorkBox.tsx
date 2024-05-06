import Link from 'next/link';
import styles from '@/styles/WorkBox.module.css';

export default function WorkBox() {
    return (
        <div className={styles.work_container}>
            <img src="https://picsum.photos/331/331" />
            <Link className={styles.detail} href="/artist/1">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="36"
                        height="36"
                        viewBox="0 0 36 36"
                        fill="none"
                    >
                        <path d="M18 -3.05176e-05V36" stroke="white" stroke-width="3" />
                        <path d="M-1.52588e-05 18H36" stroke="white" stroke-width="3" />
                    </svg>
                </Link>
        </div>
    )
}

