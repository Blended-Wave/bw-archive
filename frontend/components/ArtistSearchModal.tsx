'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/ArtistSearchModal.module.css';
import api from '@/lib/axios';

interface Artist {
    user_id: number;
    nickname: string;
}

interface ArtistSearchModalProps {
    onClose: () => void;
    onSelect: (selected: { main: string; credits: string[] }) => void;
}

export default function ArtistSearchModal({ onClose, onSelect }: ArtistSearchModalProps) {
    const [artists, setArtists] = useState<Artist[]>([]);
    const [mainArtistId, setMainArtistId] = useState<number | null>(null);
    const [creditArtistIds, setCreditArtistIds] = useState<number[]>([]);

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const response = await api.get('/admin/users'); 
                setArtists(response.data);
            } catch (error) {
                console.error("Failed to fetch artists", error);
            }
        };
        fetchArtists();
    }, []);

    const handleSelectMain = (id: number) => {
        setMainArtistId(id);
        if (creditArtistIds.includes(id)) {
            setCreditArtistIds(prev => prev.filter(item => item !== id));
        }
    };

    const handleToggleCredit = (id: number) => {
        if (mainArtistId === id) return;
        setCreditArtistIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleSubmit = () => {
        if (!mainArtistId) {
            alert("메인 아티스트를 선택해주세요.");
            return;
        }
        
        const mainArtistNickname = artists.find(a => a.user_id === mainArtistId)?.nickname || '';
        const creditArtistNicknames = creditArtistIds
            .map(id => artists.find(a => a.user_id === id)?.nickname)
            .filter((name): name is string => !!name);

        onSelect({ main: mainArtistNickname, credits: creditArtistNicknames });
        onClose();
    };

    return (
        <div className={styles.modal_overlay} onClick={onClose}>
            <div className={styles.modal_container} onClick={(e) => e.stopPropagation()}>
                <button 
                    onClick={onClose} 
                    className={styles.close_button_icon}
                >
                    <img src="/admin_icon/close_icon.svg" alt="close" />
                </button>
                <div className={styles.modal_header}>
                    <h2>아티스트 선택</h2>
                </div>
                <div className={styles.artist_list}>
                    {artists.map(artist => (
                        <div key={artist.user_id} className={styles.artist_item}>
                            <span>{artist.nickname}</span>
                            <div>
                                <button 
                                    onClick={() => handleSelectMain(artist.user_id)}
                                    className={mainArtistId === artist.user_id ? styles.active : ''}
                                >
                                    Main
                                </button>
                                <button 
                                    onClick={() => handleToggleCredit(artist.user_id)}
                                    className={creditArtistIds.includes(artist.user_id) ? styles.active : ''}
                                    disabled={mainArtistId === artist.user_id}
                                >
                                    Credit
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className={styles.button_group}>
                    <button onClick={handleSubmit}>
                        <img src="/admin_icon/submit_icon.svg" alt="submit" /> Submit
                    </button>
                </div>
            </div>
        </div>
    );
} 