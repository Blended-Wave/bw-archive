'use client';
import ArtistSwiper from '@/components/ArtistSwiper'
import styles from '@/styles/ArtistIntroduction.module.css';
import Link from 'next/link';
export default function ArtistIntroduction() {

    return (
        <div className={styles.container}>
            <div className={styles.title}>
                <p>ARTISTS INTRODUCTION</p>
            </div>
            <ArtistSwiper>
                <img src="/tmp_img/tmpImg.png" />
                <img src="/tmp_img/tmpImg.png" />
                <img src="/tmp_img/tmpImg.png" />
                <img src="/tmp_img/tmpImg.png" />
                <img src="/tmp_img/tmpImg.png" />
            </ArtistSwiper>
            <div className={styles.back}>
                <Link href="/artist">
                    BACK TO LIST
                </Link>
            </div>
        </div>
    );
}
