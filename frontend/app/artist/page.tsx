'use client';

import styles from '@/styles/Artist.module.css';
import Link from 'next/link';
import ArtistBox from '@/components/ArtistBox';
import axios from 'axios';
import { useState, useEffect } from 'react';

export default function Artist() {
    const [data, setData] = useState([]);

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
