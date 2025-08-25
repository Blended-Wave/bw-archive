'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/Preview.module.css';

interface PreviewData {
    artTitle: string;
    seriesName: string;
    description: string;
    main_artist: string;
    credits: string;
    thumbnailPreview: string | null;
    datetime?: string;
    // Add other fields as necessary
}

export default function WorkPreviewPage() {
    const [previewData, setPreviewData] = useState<PreviewData | null>(null);

    useEffect(() => {
        const data = sessionStorage.getItem('workPreviewData');
        if (data) {
            try {
                setPreviewData(JSON.parse(data));
                // sessionStorage.removeItem('workPreviewData'); // Clean up after reading
            } catch (error) {
                console.error("Failed to parse preview data", error);
            }
        }
    }, []);

    if (!previewData) {
        return <div>미리보기 데이터를 불러오는 중...</div>;
    }

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`;
    };

    return (
        <div className={styles.preview_overlay} onClick={() => window.close()}>
            <div className={styles.preview_container}>
                {/* Left Navigation Arrow */}
                <button className={styles.nav_arrow_left}>
                    <img src="/left_arrow2.svg" alt="Previous" />
                </button>

                {/* Main Content */}
                <div className={styles.content_wrapper}>
                    {/* Left Image Section */}
                    <div className={styles.image_section}>
                        {previewData.thumbnailPreview ? (
                            <img src={previewData.thumbnailPreview} alt="Work Preview" />
                        ) : (
                            <div className={styles.image_placeholder}>
                                <span>work_test</span>
                            </div>
                        )}
                    </div>

                    {/* Right Description Section */}
                    <div className={styles.description_section}>
                        {/* Creator Info */}
                        <div className={styles.creator_info}>
                            <div className={styles.creator_icon}>
                                <div className={styles.person_icon}></div>
                            </div>
                            <span className={styles.creator_name}>test</span>
                        </div>

                        {/* Title and Series */}
                        <div className={styles.title_section}>
                            <h1 className={styles.title}>{previewData.artTitle}</h1>
                            <div className={styles.series_date_row}>
                                <span className={styles.series_name}>{previewData.seriesName}</span>
                                <span className={styles.date}>{formatDate(previewData.datetime)}</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className={styles.description_block}>
                            <h3 className={styles.description_header}>DESCRIPTION</h3>
                            <p className={styles.description_text}>{previewData.description || '임시 설명'}</p>
                        </div>

                        {/* Credits */}
                        <div className={styles.credits_block}>
                            <h3 className={styles.credits_header}>CREDITS</h3>
                            <div className={styles.credits_list}>
                                <div className={styles.credit_item}>
                                    <div className={styles.person_icon}></div>
                                    <span className={styles.credit_name}>test</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Navigation Arrow */}
                <button className={styles.nav_arrow_right}>
                    <img src="/right_arrow2.svg" alt="Next" />
                </button>
            </div>
        </div>
    );
} 