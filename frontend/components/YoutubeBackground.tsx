'use client'
import Script from 'next/script';
import styles from '@/styles/YoutubeBackground.module.css';

interface YoutubeBackgroundProps {
    videoId: string;
    autoplay?: boolean;
    loop?: boolean;
    muted?: boolean;
    playsinline?: boolean;
    offset?: number;
}

export default function YoutubeBackground({
    videoId,
    autoplay = true,
    loop = true,
    muted = true,
    playsinline = true,
    offset = 200
}: YoutubeBackgroundProps) {
    return (
        <>
            {/* YouTube 백그라운드 라이브러리 스크립트 */}
            <Script
                src="https://unpkg.com/youtube-background@1.1.8/jquery.youtube-background.min.js"
                strategy="lazyOnload"
                onLoad={() => {
                    if ((window as any).VideoBackgrounds) {
                        new (window as any).VideoBackgrounds('[data-vbg]');
                    }
                }}
            />
            <div className={styles.screen_container}>
                <div
                    className={styles.video_background}
                    data-vbg={`https://www.youtube.com/watch?v=${videoId}`}
                    data-vbg-autoplay={autoplay.toString()}
                    data-vbg-loop={loop.toString()}
                    data-vbg-muted={muted.toString()}
                    data-vbg-playsinline={playsinline.toString()}
                    data-vbg-offset={offset.toString()}
                ></div>
            </div>
        </>
    );
}
