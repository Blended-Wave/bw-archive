'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import styles from '@/styles/ArtistIntroduction.module.css';
import Link from 'next/link';
import ArtistSwiper from '@/components/ArtistSwiper';
import WorkDetailModal from '@/components/WorkDetailModal';
import { useParams } from 'next/navigation';

interface SwiperArtistData {
    img: string;
    name: string;
    roles: string[];
    instagramUrl: string;
    twitterUrl: string;
    link: string;
    works_id: number; // 작품 ID 추가
    type?: string; // 작품 타입 추가
}

interface SwiperArtistInfo {
    name: string;
    roles: string[];
    instagramUrl: string;
    twitterUrl: string;
}

export default function ArtistIntroduction() {
    const params = useParams();
    const userId = params.userId as string;

    const [works, setWorks] = useState<SwiperArtistData[]>([]);
    const [artistInfo, setArtistInfo] = useState<SwiperArtistInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedWorkId, setSelectedWorkId] = useState<number | null>(null);
    const [selectedWorkIndex, setSelectedWorkIndex] = useState<number | null>(null);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            setWorks([]);
            return;
        }

        const fetchArtistWorks = async () => {
            setLoading(true);
            try {
                // 공개 API: /works/artist/:userId
                const response = await api.get(`/works/artist/${userId}`);
                const { imgList, artistInfo: info } = response.data.result || {};

                const swiperData: SwiperArtistData[] = Array.isArray(imgList)
                    ? imgList.map((work: any) => ({
                          img: work.file_url || work.thumbnail_url || '/admin_icon/alt_img.svg',
                          name: info?.name || '',
                          roles: info?.roles || [],
                          instagramUrl: info?.instarUrl || '',
                          twitterUrl: info?.twitterUrl || '',
                          link: `/artist`,
                          works_id: work.works_id, // 작품 ID 추가
                          type: work.type || 'image', // 작품 타입 추가
                      }))
                    : [];

                setWorks(swiperData);
                setArtistInfo(
                    info
                        ? {
                              name: info.name,
                              roles: info.roles,
                              instagramUrl: info.instarUrl,
                              twitterUrl: info.twitterUrl,
                          }
                        : null,
                );
            } catch (err) {
                console.error('아티스트의 작업물을 불러오는 데 실패했습니다.', err);
                setWorks([]);
                setArtistInfo(null);
            } finally {
                setLoading(false);
            }
        };

        fetchArtistWorks();
    }, [userId]);

    const handleWorkClick = (works_id: number, index: number) => {
        setSelectedWorkId(works_id);
        setSelectedWorkIndex(index);
    };

    const handleCloseModal = () => {
        setSelectedWorkId(null);
        setSelectedWorkIndex(null);
    };

    const handlePrevWork = () => {
        if (selectedWorkIndex !== null && selectedWorkIndex > 0) {
            const newIndex = selectedWorkIndex - 1;
            setSelectedWorkIndex(newIndex);
            setSelectedWorkId(works[newIndex].works_id);
        }
    };

    const handleNextWork = () => {
        if (selectedWorkIndex !== null && selectedWorkIndex < works.length - 1) {
            const newIndex = selectedWorkIndex + 1;
            setSelectedWorkIndex(newIndex);
            setSelectedWorkId(works[newIndex].works_id);
        }
    };

    return (
        <main
            style={{
                minHeight: 'calc(100vh - 60px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <div className={styles.container}>
                <div className={styles.title}>
                    <p>ARTIST INTRODUCTION</p>
                </div>

                <div className={styles.swiper_container}>
                    {loading && <p>Loading...</p>}

                    {!loading && works.length > 0 && artistInfo && (
                        <ArtistSwiper 
                            artists={works} 
                            artistInfo={artistInfo} 
                            onWorkClick={handleWorkClick} 
                        />
                    )}
                </div>

                <div className={styles.back}>
                    <Link href="/artist">BACK TO LIST</Link>
                </div>
            </div>

            {/* WorkDetailModal */}
            {selectedWorkId !== null && selectedWorkIndex !== null && (
                <WorkDetailModal
                    workId={selectedWorkId}
                    onClose={handleCloseModal}
                    onPrev={handlePrevWork}
                    onNext={handleNextWork}
                    isPrevDisabled={selectedWorkIndex === 0}
                    isNextDisabled={selectedWorkIndex === works.length - 1}
                />
            )}
        </main>
    );
}
