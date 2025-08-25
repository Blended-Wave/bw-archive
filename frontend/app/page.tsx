'use client'
import Script from 'next/script';
import styles from '@/styles/page.module.css';

export default function Home() {
    return (
        <>
            {/* 
              This is the official Next.js way to load third-party scripts.
              It's more robust than manual <script> injection in useEffect.
              We use the `onLoad` callback to safely initialize the library
              only after the script has fully loaded.
            */}
            <Script
                src="https://unpkg.com/youtube-background@1.1.8/jquery.youtube-background.min.js" // Use the correct, pre-compiled browser distribution file
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
                    data-vbg="https://www.youtube.com/watch?v=2vIeNWYCs3Q"
                    data-vbg-autoplay="true"
                    data-vbg-loop="true"
                    data-vbg-muted="true"
                    data-vbg-playsinline="true"
                    data-vbg-offset="200" 
                ></div>
            </div>
            <main className={styles.main_container}></main>
        </>
    );
}