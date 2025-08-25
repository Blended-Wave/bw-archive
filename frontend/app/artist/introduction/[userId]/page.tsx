'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '@/styles/ArtistIntroduction.module.css';
import Link from 'next/link';
import ArtistSwiper from '@/components/ArtistSwiper';
import { useParams } from 'next/navigation';

interface InstWork {
    image_url: string;
    // 백엔드 DTO에는 없지만, 실제 응답에 포함될 수 있는 잠재적 필드를 위해 인덱스 시그니처 추가
    [key: string]: any;
}

interface ArtistInfo {
    nickname: string;
    role_names: string[];
    instagram: string;
    twitter: string;
}

// ArtistSwiper에 맞는 데이터 구조
interface SwiperArtistData {
    img: string;
    name: string;
    roles: string[];
    instagramUrl: string;
    twitterUrl: string;
    link: string;
}

// 더미 데이터 정의
const dummyWorks: SwiperArtistData[] = [
    { img: '/tmp_img/tmpImg.png', name: 'DISCUZZ', roles: ['Illustrator', 'Animator'], instagramUrl: 'https://instagram.com', twitterUrl: 'https://twitter.com', link: '#' },
    { img: '/tmp_img/tmpImg2.png', name: 'Artist 2', roles: ['Illustrator', 'Animator'], instagramUrl: 'https://instagram.com', twitterUrl: '', link: '#' },
    { img: '/tmp_img/tmpImg3.png', name: 'Artist 3', roles: ['Illustrator'], instagramUrl: '', twitterUrl: 'https://twitter.com', link: '#' },
    { img: '/tmp_img/tmpImg4.png', name: 'Artist 4', roles: ['Animator'], instagramUrl: 'https://instagram.com', twitterUrl: 'https://twitter.com', link: '#' },
    { img: '/tmp_img/tmpImg5.png', name: 'Artist 5', roles: ['Composer'], instagramUrl: '', twitterUrl: '', link: '#' },
];


export default function ArtistIntroduction() {
    const params = useParams();
    const userId = params.userId as string;

    const [works, setWorks] = useState<SwiperArtistData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            setWorks(dummyWorks);
            return;
        };

        const fetchArtistWorks = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:4000/api/works/art_inst_works/${userId}`);
                const { imgList, artistInfo }: { imgList: InstWork[], artistInfo: ArtistInfo } = response.data;

                if (imgList && imgList.length > 0) {
                    const swiperData = imgList.map((work: InstWork) => ({
                        img: work.image_url,
                        name: artistInfo.nickname,
                        roles: artistInfo.role_names, 
                        instagramUrl: artistInfo.instagram,
                        twitterUrl: artistInfo.twitter,
                        link: `/artist` 
                    }));
                    setWorks(swiperData);
                } else {
                    // 데이터가 없을 경우 더미 데이터 사용
                    setWorks(dummyWorks);
                }
            } catch (err) {
                console.error('아티스트의 작업물을 불러오는 데 실패했습니다.', err);
                // 에러 발생 시에도 더미 데이터 렌더링
                setWorks(dummyWorks);
            } finally {
                setLoading(false);
            }
        };

        fetchArtistWorks();
    }, [userId]);

    return (
        <main style={{ minHeight: 'calc(100vh - 60px)' }}> {/* 60px는 헤더 높이 */}
        <div className={styles.container}>
            <div className={styles.title}>
                    {/* 제목을 고정된 값으로 변경 */}
                    <p>ARTIST INTRODUCTION</p>
            </div>
            
                {loading && <p>Loading...</p>}
                
                {!loading && works.length > 0 && (
                    <ArtistSwiper artists={works} />
                )}

            <div className={styles.back}>
                <Link href="/artist">
                    BACK TO LIST
                </Link>
            </div>
        </div>
        </main>
    );
}
