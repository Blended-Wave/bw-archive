'use client';
import styles from '@/styles/WorkBox.module.css';

interface Work {
    id: number;
    title: string;
    thumbnail_url: string;
    file_url?: string; // work_file URL 추가
}

interface WorkBoxProps {
    work: Work;
    onClick: () => void; // onClick 핸들러 prop 추가
}

export default function WorkBox({ work, onClick }: WorkBoxProps) {
    // 디버그 로그 추가
    console.log('WorkBox received work:', {
        id: work.id,
        title: work.title,
        thumbnail_url: work.thumbnail_url,
        file_url: work.file_url
    });

    // 이미지 fallback 순서: thumbnail_url → file_url → 회색 박스
    const getImageSrc = () => {
        console.log('Getting image src:', {
            hasThumbnail: !!work.thumbnail_url,
            hasFileUrl: !!work.file_url
        });
        
        if (work.thumbnail_url) {
            console.log('Using thumbnail_url:', work.thumbnail_url);
            return work.thumbnail_url;
        }
        if (work.file_url) {
            console.log('Using file_url:', work.file_url);
            return work.file_url;
        }
        console.log('No image found, showing placeholder');
        return null; // 회색 박스를 위해 null 반환
    };

    const imageSrc = getImageSrc();

    return (
        <div onClick={onClick} className={styles.work_container}>
            {imageSrc ? (
                <img src={imageSrc} alt={work.title} />
            ) : (
                <div className={styles.placeholderBox}></div>
            )}
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

