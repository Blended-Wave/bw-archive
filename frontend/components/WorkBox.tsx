'use client';
import styles from '@/styles/WorkBox.module.css';

interface Work {
    id: number;
    title: string;
    thumbnail_url: string;
}

interface WorkBoxProps {
    work: Work;
    onClick: () => void; // onClick 핸들러 prop 추가
}

export default function WorkBox({ work, onClick }: WorkBoxProps) {
    return (
        <div onClick={onClick} className={styles.work_container}>
            <img src={work.thumbnail_url || '/admin_icon/alt_img.svg'} alt={work.title} />
            <div className={styles.detail}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="44"
                    height="44"
                    viewBox="0 0 44 44"
                    fill="none"
                >
                    <path
                        d="M22 13.75V30.25"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M13.75 22H30.25"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
        </div>
    );
}

