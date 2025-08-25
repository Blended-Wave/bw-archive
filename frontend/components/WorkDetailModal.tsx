'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from '@/styles/WorkDetailModal.module.css';
import { createPortal } from 'react-dom';

interface Artist {
    id: number;
    nickname: string;
    avatar_url?: string;
}

interface WorkDetails {
    title: string;
    description: string;
    series: string;
    created_at: string;
    main_artist: Artist;
    credits: Artist[];
    file_url: string;
    type: string;
}

interface ModalProps {
    workDetails: WorkDetails | null;
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
    isPrevDisabled: boolean;
    isNextDisabled: boolean;
}

export default function WorkDetailModal({ 
    workDetails, 
    onClose, 
    onPrev, 
    onNext, 
    isPrevDisabled, 
    isNextDisabled 
}: ModalProps) {
    const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

    useEffect(() => {
        setModalRoot(document.getElementById('modal-root'));
    }, []);

    // Debug: Log the received workDetails
    useEffect(() => {
        if (workDetails) {
            console.log('WorkDetailModal received workDetails:', workDetails);
            console.log('File URL:', workDetails.file_url);
            console.log('Type:', workDetails.type);
            console.log('Main artist:', workDetails.main_artist);
            console.log('Title:', workDetails.title);
            console.log('Series:', workDetails.series);
            console.log('Description:', workDetails.description);
            
            // Validate file URL
            if (workDetails.file_url) {
                console.log('File URL is truthy');
                try {
                    const url = new URL(workDetails.file_url);
                    console.log('File URL is valid:', url.href);
                } catch (e) {
                    console.log('File URL is invalid:', e);
                }
            } else {
                console.log('File URL is falsy or empty');
            }
        }
    }, [workDetails]);

    // Function to calculate and set modal height
    const calculateModalHeight = useCallback(() => {
        if (!workDetails) return;
        
        // Use a more reliable selector to find the image
        const contentWrapper = document.querySelector(`.${styles.content_wrapper}`);
        const img = contentWrapper?.querySelector('img') as HTMLImageElement;
        const descriptionSection = contentWrapper?.querySelector(`.${styles.description_section}`);
        const imageSection = contentWrapper?.querySelector(`.${styles.image_section}`);
        
        if (img && img.naturalWidth && img.naturalHeight && descriptionSection && imageSection) {
            // Get the actual displayed image dimensions from getBoundingClientRect
            const imgRect = img.getBoundingClientRect();
            const actualImgHeight = imgRect.height;
            const actualImgWidth = imgRect.width;
            
            console.log('Image actual dimensions:', { width: actualImgWidth, height: actualImgHeight });
            console.log('Image natural dimensions:', { width: img.naturalWidth, height: img.naturalHeight });
            
            // Use the actual displayed height, but ensure minimum size
            const modalHeight = Math.max(actualImgHeight, 600);
            
            // Set description section height
            (descriptionSection as HTMLElement).style.height = `${modalHeight}px`;
            
            // Ensure image section also maintains the minimum height
            (imageSection as HTMLElement).style.minHeight = `${modalHeight}px`;
            
            console.log('Resize: Set modal height to:', modalHeight, 'px');
            console.log('Resize: Set image section min-height to:', modalHeight, 'px');
        }
    }, [workDetails]);

    // Add resize event listener
    useEffect(() => {
        if (workDetails) {
            window.addEventListener('resize', calculateModalHeight);
            
            // Cleanup
            return () => {
                window.removeEventListener('resize', calculateModalHeight);
            };
        }
    }, [workDetails, calculateModalHeight]);

    if (!workDetails) {
        return null;
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`;
    };

    const modalContent = (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal_container}>
                {/* Left Navigation Arrow */}
                <button 
                    className={`${styles.nav_arrow} ${styles.left_arrow}`} 
                    onClick={(e) => {
                        e.stopPropagation();
                        onPrev();
                    }}
                    disabled={isPrevDisabled}
                >
                    <img 
                        src="/left-arrow 2.svg" 
                        alt="Previous" 
                    />
                </button>

                {/* Main Content */}
                <div className={styles.content_wrapper}>
                    {/* Left Image Section */}
                    <div className={styles.image_section}>
                        {workDetails.type === 'video' ? (
                            <video 
                                src={workDetails.file_url} 
                                controls 
                                autoPlay 
                                loop 
                                muted
                                onError={(e) => {
                                    console.log('Video failed to load:', workDetails.file_url);
                                    console.log('Video error event:', e);
                                }}
                                onLoadStart={(e) => {
                                    console.log('Video loading started:', workDetails.file_url);
                                }}
                            />
                        ) : (
                            <img 
                                src={workDetails.file_url} 
                                alt={workDetails.title}
                                onError={(e) => {
                                    console.log('=== IMAGE LOAD ERROR ===');
                                    console.log('Image failed to load:', workDetails.file_url);
                                    console.log('Image error event:', e);
                                    console.log('Image element:', e.currentTarget);
                                    console.log('Image src:', e.currentTarget.src);
                                    console.log('Image naturalWidth:', e.currentTarget.naturalWidth);
                                    console.log('Image naturalHeight:', e.currentTarget.naturalHeight);
                                    
                                    e.currentTarget.style.display = 'none';
                                    const fallback = document.createElement('div');
                                    fallback.style.cssText = 'color: #666; font-size: 18px; text-align: center;';
                                    fallback.textContent = '이미지를 불러올 수 없습니다';
                                    e.currentTarget.parentNode?.appendChild(fallback);
                                }}
                                onLoad={(e) => {
                                    console.log('=== IMAGE LOAD SUCCESS ===');
                                    console.log('Image loaded successfully:', workDetails.file_url);
                                    console.log('Image element:', e.currentTarget);
                                    console.log('Image naturalWidth:', e.currentTarget.naturalWidth);
                                    console.log('Image naturalHeight:', e.currentTarget.naturalHeight);
                                    console.log('Image src:', e.currentTarget.src);
                                    
                                    // Wait a bit for the image to be fully rendered, then calculate height
                                    setTimeout(() => {
                                        calculateModalHeight();
                                    }, 100);
                                    
                                    // Ensure the modal content is properly centered
                                    const img = e.currentTarget;
                                    const contentWrapper = img.closest(`.${styles.content_wrapper}`);
                                    const modalContainer = contentWrapper?.closest(`.${styles.modal_container}`);
                                    if (modalContainer) {
                                        (modalContainer as HTMLElement).style.justifyContent = 'center';
                                        (modalContainer as HTMLElement).style.alignItems = 'center';
                                    }
                                }}
                                onLoadStart={(e) => {
                                    console.log('Image loading started:', workDetails.file_url);
                                }}
                            />
                        )}
                    </div>

                    {/* Right Description Section */}
                    <div className={styles.description_section}>
                        {/* Creator Info */}
                        <div className={styles.creator_info}>
                            <div className={styles.creator_icon}>
                                <img 
                                    src={workDetails.main_artist.avatar_url || '/admin_icon/alt_img.svg'} 
                                    alt={workDetails.main_artist.nickname} 
                                    className={styles.creator_avatar}
                                    onError={(e) => {
                                        console.log('Avatar failed to load:', workDetails.main_artist.avatar_url);
                                        e.currentTarget.src = '/admin_icon/alt_img.svg';
                                    }}
                                />
                            </div>
                            <span className={styles.creator_name}>{workDetails.main_artist.nickname}</span>
                        </div>

                        {/* Title and Series */}
                        <div className={styles.title_section}>
                            <h1 className={styles.title}>{workDetails.title}</h1>
                            <div className={styles.series_date_row}>
                                <span className={styles.series_name}>{workDetails.series}</span>
                                <span className={styles.date}>{formatDate(workDetails.created_at)}</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className={styles.description_block}>
                            <h3 className={styles.description_header}>DESCRIPTION</h3>
                            <p className={styles.description_text}>{workDetails.description || '설명이 없습니다.'}</p>
                        </div>

                        {/* Credits */}
                        <div className={styles.credits_block}>
                            <h3 className={styles.credits_header}>CREDITS</h3>
                            <div className={styles.credits_list}>
                                {workDetails.credits.map(artist => (
                                    <div key={artist.id} className={styles.credit_item}>
                                        <div className={styles.credit_icon}>
                                            <img 
                                                src={artist.avatar_url || '/admin_icon/alt_img.svg'} 
                                                alt={artist.nickname} 
                                                className={styles.credit_avatar}
                                                onError={(e) => {
                                                    e.currentTarget.src = '/admin_icon/alt_img.svg';
                                                }}
                                            />
                                        </div>
                                        <span className={styles.credit_name}>{artist.nickname}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Navigation Arrow */}
                <button 
                    className={`${styles.nav_arrow} ${styles.right_arrow}`} 
                    onClick={(e) => {
                        e.stopPropagation();
                        onNext();
                    }}
                    disabled={isNextDisabled}
                >
                    <img 
                        src="/right-arrow 2.svg" 
                        alt="Next" 
                    />
                </button>
            </div>
        </div>
    );
    
    if (!modalRoot) return null;
    return createPortal(modalContent, modalRoot);
} 