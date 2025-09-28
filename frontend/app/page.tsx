'use client'
import { useEffect } from 'react';
import styles from '@/styles/page.module.css';

export default function Home() {
    // 페이지 제목 설정
    useEffect(() => {
        document.title = 'Blended Wave';
    }, []);
    return (
        <>
            {/* 동영상 파일을 직접 백그라운드로 사용 */}
            <div className={styles.video_container}>
                <video
                    className={styles.background_video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                >
                    <source src="/background-video.mp4" type="video/mp4" />
                    {/* 브라우저 호환성을 위한 추가 포맷 */}
                    <source src="/background-video.webm" type="video/webm" />
                    Your browser does not support the video tag.
                </video>
            </div>
            <main className={styles.main_container}></main>
        </>
    );
}