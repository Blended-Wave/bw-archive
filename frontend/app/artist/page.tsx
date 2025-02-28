'use client';

import styles from '@/styles/Artist.module.css';
import Link from 'next/link';
import ArtistBox from '@/components/ArtistBox';
import axios from 'axios';
import { useState, useEffect } from 'react';

export default function Artist() {
    const [data, setData] = useState([]);
    // axios url 경로 하드코딩 -> 환경변수로 수정하기
    // 중복되는 api 요청이 두번 이상 발생할 경우 서비스 폴더 만들어서 요청 로직 분리하기
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/artist/all_artists');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);


    return (
        <div className={styles.background}>
            <div className={styles.artist_container}>
                <p>ARTISTS</p>
                <div className={styles.artists}>
                    {data.map((artist, index) => (
                        <ArtistBox key={index} artist={artist} />
                    ))}
                </div>
            </div>
        </div>
    );
}
