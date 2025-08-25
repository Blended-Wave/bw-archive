'use client';

import styles from '@/styles/Artist.module.css';
import Link from 'next/link';
import ArtistBox from '@/components/ArtistBox';
import ArtistBoxSkeleton from '@/components/ArtistBoxSkeleton';
import axios from 'axios';
import { useState, useEffect } from 'react';

// 아티스트 데이터 타입 정의
interface Artist {
    user_id: number;
    nickname: string;
    avatar_image_url: string;
    roles: number[];
    twitter_url: string;
    instar_url: string; // instagram_url 오타 수정
}

export default function Artist() {
    const [artists, setArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:4000/api/artist/all_artists');
                setArtists(response.data);
                setError(null);
            } catch (error) {
                setError('데이터를 불러오는 데 실패했습니다.');
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArtists();
    }, []);

    if (error) {
        return <div className={styles.background}><p className={styles.aritst_title}>{error}</p></div>;
    }

    return (
        <div className={styles.background}>
            <div className={styles.artist_container}>
                <p className={styles.aritst_title}>ARTISTS</p>
                <div className={styles.artists}>
                    {loading ? (
                        Array.from({ length: 6 }).map((_, index) => (
                            <ArtistBoxSkeleton key={index} />
                        ))
                    ) : (
                        artists.map((artist) => (
                            <ArtistBox key={artist.user_id} artist={artist} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
