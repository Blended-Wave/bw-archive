'use client';

import styles from '@/styles/Artist.module.css';
import Link from 'next/link';
import ArtistBox from '@/components/ArtistBox';
import axios from 'axios';
import { useState, useEffect } from 'react';

export default function Artist() {
    // ArtistBox의 데이터 구조에 맞는 더미 데이터 추가
    const dummyData = [
        {
            user_id: 1,
            nickname: 'DISCUZZ',
            avatar_image_url: 'default avatar', // 기본 아바타 이미지
            roles: [1], // Illustrator
            twitter_url: 'https://twitter.com/artist1',
            instar_url: 'https://instagram.com/artist1',
        },
        {
            user_id: 2,
            nickname: 'Artist Two',
            avatar_image_url: 'default avatar', // 기본 아바타 이미지
            roles: [2, 3], // Composer, Animator
            twitter_url: 'https://twitter.com/artist2',
            instar_url: 'https://instagram.com/artist2',
        },
        {
            user_id: 3,
            nickname: 'Artist Three',
            avatar_image_url: '/artist_images/artist3.jpg',
            roles: [4], // Writer
            twitter_url: 'https://twitter.com/artist3',
            instar_url: 'https://instagram.com/artist3',
        },
        {
            user_id: 4,
            nickname: 'Artist Four',
            avatar_image_url: 'default avatar', // 기본 아바타 이미지
            roles: [1, 2, 3, 4], // 모든 역할
            twitter_url: 'https://twitter.com/artist4',
            instar_url: 'https://instagram.com/artist4',
        },
    ];

    const [data, setData] = useState(dummyData);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/artist/all_artists');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                // API 요청 실패 시 기본 더미 데이터 유지
            }
        };

        fetchData();
    }, []);

    return (
        <div className={styles.background}>
            <div className={styles.artist_container}>
                <p className={styles.aritst_title}>ARTISTS</p>
                <div className={styles.artists}>
                    {data.map((artist, index) => (
                        <ArtistBox key={artist.user_id} artist={artist} />
                    ))}
                </div>
            </div>
        </div>
    );
}
