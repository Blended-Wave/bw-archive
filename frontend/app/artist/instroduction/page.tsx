'use client';
import ArtistSwiper from '@/components/ArtistSwiper';
import styles from '@/styles/ArtistIntroduction.module.css';
import Link from 'next/link';

export default function ArtistIntroduction() {
    // ✅ 이미지 + 메타정보 포함
    const artists = [
        { img: '/tmp_img/tmpImg.png', name: 'DISCUZZ', role: 'Illustrator & Animatior', link: '/artist/1' },
        { img: '/tmp_img/tmpImg2.png', name: 'Artist 2', role: 'Illustrator & Animatior', link: '/artist/2' },
        { img: '/tmp_img/tmpImg3.png', name: 'Artist 3', role: 'Illustrator & Animatior', link: '/artist/3' },
        { img: '/tmp_img/tmpImg4.png', name: 'Artist 4', role: 'Illustrator & Animatior', link: '/artist/4' },
        { img: '/tmp_img/tmpImg5.png', name: 'Artist 5', role: 'Illustrator & Animatior', link: '/artist/5' },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.title}>
                <p>ARTISTS INTRODUCTION</p>
            </div>
            
            {/* ✅ ArtistSwiper에 artists 데이터 전달 */}
            <ArtistSwiper artists={artists} />

            <div className={styles.back}>
                <Link href="/artist">
                    BACK TO LIST
                </Link>
            </div>
        </div>
    );
}
