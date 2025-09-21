'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/WorkDetailModal.module.css';
import { createPortal } from 'react-dom';

interface Artist {
    id?: number;
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
    workId: number;
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
    isPrevDisabled: boolean;
    isNextDisabled: boolean;
}

export default function WorkDetailModal({ 
    workId, 
    onClose, 
    onPrev, 
    onNext, 
    isPrevDisabled, 
    isNextDisabled 
}: ModalProps) {
    const router = useRouter();
    const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);
    const [workDetails, setWorkDetails] = useState<WorkDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [imageLoadError, setImageLoadError] = useState<boolean>(false);

    useEffect(() => {
        setModalRoot(document.getElementById('modal-root'));
        
        // WebKit 스크롤바 스타일을 DOM에 직접 추가
        const styleId = 'webkit-scrollbar-style';
        let styleElement = document.getElementById(styleId);
        
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            // 동적으로 실제 클래스명 사용
            const descriptionElements = document.querySelectorAll('p[class*="description_text"]');
            if (descriptionElements.length > 0) {
                const actualClassName = descriptionElements[0].className.split(' ').find(cls => cls.includes('description_text'));
                styleElement.innerHTML = `
                    .${actualClassName}::-webkit-scrollbar {
                        width: 8px !important;
                        -webkit-appearance: none !important;
                    }
                    .${actualClassName}::-webkit-scrollbar-track {
                        background: #929292 !important;
                        border-radius: 4px !important;
                        -webkit-appearance: none !important;
                    }
                    .${actualClassName}::-webkit-scrollbar-thumb {
                        background: #E9E9E9 !important;
                        border-radius: 4px !important;
                        -webkit-appearance: none !important;
                    }
                    .${actualClassName}::-webkit-scrollbar-thumb:hover {
                        background: #ffffff !important;
                    }
                `;
            }
            document.head.appendChild(styleElement);
        }
        
        return () => {
            // cleanup 시 style element 제거
            const element = document.getElementById(styleId);
            if (element) {
                element.remove();
            }
        };
    }, []);

    // Fetch work details when workId changes
    useEffect(() => {
        const fetchWorkDetails = async () => {
            if (!workId) return;
            
            try {
                setLoading(true);
                setImageLoadError(false);
                
                const response = await fetch(`http://localhost:4000/api/works/detail/${workId}`, {
                    credentials: 'include'
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch work details');
                }
                
                const data = await response.json();
                console.log('Fetched work details:', data.result);
                setWorkDetails(data.result);
            } catch (error) {
                console.error('Error fetching work details:', error);
                setWorkDetails(null);
            } finally {
                setLoading(false);
            }
        };

        fetchWorkDetails();
    }, [workId]);

    // 아티스트 클릭 핸들러
    const handleArtistClick = (artistId?: number) => {
        if (artistId) {
            router.push(`/artist/introduction/${artistId}`);
        }
    };

    // 스크롤바 상태 확인 제거됨 - CSS로 자동 처리

    // Function to calculate and set modal dimensions
    const calculateModalDimensions = useCallback(() => {
        if (!workDetails) return;
        
        const contentWrapper = document.querySelector(`.${styles.content_wrapper}`);
        const img = contentWrapper?.querySelector('img') as HTMLImageElement;
        const video = contentWrapper?.querySelector('video') as HTMLVideoElement;
        const media = img || video;
        const descriptionSection = contentWrapper?.querySelector(`.${styles.description_section}`);
        const imageSection = contentWrapper?.querySelector(`.${styles.image_section}`);
        const modalContainer = contentWrapper?.closest(`.${styles.modal_container}`) as HTMLElement;
        
        if (media && descriptionSection && imageSection && modalContainer) {
            const naturalWidth = img ? img.naturalWidth : video?.videoWidth || 0;
            const naturalHeight = img ? img.naturalHeight : video?.videoHeight || 0;
            
            if (naturalWidth && naturalHeight) {
                // 화면 크기 기반 최대 크기 계산
                const descriptionWidth = 400; // description section 고정 너비
                const gap = 40; // gap 크기
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                
                // 이미지 최대 크기 계산 - 원본 크기를 최대한 보여주기
                // 뷰포트에서 description과 여유 공간을 제외한 나머지를 이미지에 할당
                const maxPossibleWidth = viewportWidth - descriptionWidth - gap - 100; // 100px 여유 공간
                const maxPossibleHeight = viewportHeight * 0.8;
                
                console.log('=== DETAILED CALCULATION DEBUG ===');
                console.log('viewportWidth:', viewportWidth);
                console.log('descriptionWidth:', descriptionWidth);
                console.log('gap:', gap);
                console.log('Calculated maxPossibleWidth:', maxPossibleWidth);
                console.log('================================');
                
                // 비율 유지하면서 크기 계산
                const aspectRatio = naturalWidth / naturalHeight;
                
                // 원본 크기를 우선으로 하되, 화면을 벗어나지 않도록 조정
                let displayWidth = naturalWidth;
                let displayHeight = naturalHeight;
                
                // 원본이 너무 클 때만 비율 유지하며 축소
                // 1. 가로가 최대 가능 너비보다 크면 축소
                if (displayWidth > maxPossibleWidth) {
                    displayWidth = maxPossibleWidth;
                    displayHeight = displayWidth / aspectRatio;
                }
                
                // 2. 세로가 최대 가능 높이보다 크면 축소
                if (displayHeight > maxPossibleHeight) {
                    displayHeight = maxPossibleHeight;
                    displayWidth = displayHeight * aspectRatio;
                }
                
                // 3. 다시 한번 가로 체크 (세로 축소로 인해 가로가 커질 수 있음)
                if (displayWidth > maxPossibleWidth) {
                    displayWidth = maxPossibleWidth;
                    displayHeight = displayWidth / aspectRatio;
                }
                
                // 최소 높이 보장 (description 섹션과 동일)
                const minHeight = 650; // Increased from 600 to match CSS
                const finalHeight = Math.max(displayHeight, minHeight);
                
                console.log('=== MODAL DIMENSIONS CALCULATION ===');
                console.log('Natural size:', { width: naturalWidth, height: naturalHeight });
                console.log('Viewport size:', { width: viewportWidth, height: viewportHeight });
                console.log('Max possible size:', { width: maxPossibleWidth, height: maxPossibleHeight });
                console.log('Display size:', { width: displayWidth, height: displayHeight });
                console.log('Final height:', finalHeight);
                console.log('Aspect ratio:', aspectRatio);
                console.log('=====================================');
                
                // 이미지/비디오 크기 설정
                (media as HTMLElement).style.width = `${displayWidth}px`;
                (media as HTMLElement).style.height = `${displayHeight}px`;
                
                // 섹션들 높이 설정
                (descriptionSection as HTMLElement).style.height = `${finalHeight}px`;
                (imageSection as HTMLElement).style.height = `${finalHeight}px`;
                
                // 모달 컨테이너 크기 설정
                const totalWidth = displayWidth + descriptionWidth + gap;
                const maxModalWidth = viewportWidth * 0.95; // 95vw와 일치
                const finalModalWidth = Math.min(totalWidth, maxModalWidth);
                
                modalContainer.style.width = `${finalModalWidth}px`;
                modalContainer.style.maxWidth = '95vw'; // CSS와 일관성 유지
                
                // 만약 계산된 너비가 최대 너비를 초과하면 이미지 크기를 조정
                if (totalWidth > maxModalWidth) {
                    const availableImageWidth = maxModalWidth - descriptionWidth - gap;
                    if (availableImageWidth > 0) {
                        const adjustedImageWidth = Math.min(displayWidth, availableImageWidth);
                        const adjustedImageHeight = adjustedImageWidth / aspectRatio;
                        
                        console.log('=== MODAL WIDTH ADJUSTMENT ===');
                        console.log('Total calculated width:', totalWidth);
                        console.log('Max modal width (95vw):', maxModalWidth);
                        console.log('Adjusted image width:', adjustedImageWidth);
                        console.log('Adjusted image height:', adjustedImageHeight);
                        console.log('===============================');
                        
                        // 조정된 이미지 크기 적용
                        (media as HTMLElement).style.width = `${adjustedImageWidth}px`;
                        (media as HTMLElement).style.height = `${adjustedImageHeight}px`;
                        
                        // 섹션 높이도 다시 계산
                        const adjustedFinalHeight = Math.max(adjustedImageHeight, minHeight);
                        (descriptionSection as HTMLElement).style.height = `${adjustedFinalHeight}px`;
                        (imageSection as HTMLElement).style.height = `${adjustedFinalHeight}px`;
                    }
                }
            }
        }
    }, [workDetails]);

    // Add resize event listener
    useEffect(() => {
        if (workDetails) {
            window.addEventListener('resize', calculateModalDimensions);
            
            // Cleanup
            return () => {
                window.removeEventListener('resize', calculateModalDimensions);
            };
        }
    }, [workDetails, calculateModalDimensions]);

    if (loading) {
        return modalRoot ? createPortal(
            <div 
                style={{ 
                    position: 'fixed', 
                    top: 0, 
                    left: 0, 
                    width: '100%', 
                    height: '100%', 
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    zIndex: 1000,
                    color: 'white',
                    fontSize: '18px',
                    cursor: 'pointer'
                }}
                onClick={onClose}
            >
                작품 정보를 불러오는 중... 
            </div>,
            modalRoot
        ) : null;
    }
    
    if (!workDetails) {
        return modalRoot ? createPortal(
            <div 
                style={{ 
                    position: 'fixed', 
                    top: 0, 
                    left: 0, 
                    width: '100%', 
                    height: '100%', 
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    zIndex: 1000,
                    color: 'white',
                    fontSize: '18px',
                    cursor: 'pointer'
                }}
                onClick={onClose}
            >
                작품 정보를 불러올 수 없습니다.
            </div>,
            modalRoot
        ) : null;
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
                        {imageLoadError ? (
                            <div style={{ 
                                color: '#666', 
                                fontSize: '18px', 
                                textAlign: 'center',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                height: '400px'
                            }}>
                                이미지를 불러올 수 없습니다
                            </div>
                        ) : workDetails.type === 'video' ? (
                            <video 
                                src={workDetails.file_url} 
                                controls 
                                autoPlay 
                                loop 
                                muted
                                onError={(e) => {
                                    console.log('Video failed to load:', workDetails.file_url);
                                    console.log('Video error event:', e);
                                    setImageLoadError(true);
                                }}
                                onLoadStart={(e) => {
                                    console.log('Video loading started:', workDetails.file_url);
                                }}
                                onLoadedMetadata={(e) => {
                                    console.log('Video metadata loaded:', workDetails.file_url);
                                    const video = e.currentTarget;
                                    console.log('Video dimensions:', { width: video.videoWidth, height: video.videoHeight });
                                    
                                    // Wait a bit for the video to be fully rendered, then calculate dimensions
                                    setTimeout(() => {
                                        calculateModalDimensions();
                                    }, 100);
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
                                    
                                    setImageLoadError(true);
                                }}
                                onLoad={(e) => {
                                    console.log('=== IMAGE LOAD SUCCESS ===');
                                    console.log('Image loaded successfully:', workDetails.file_url);
                                    console.log('Image element:', e.currentTarget);
                                    console.log('Image naturalWidth:', e.currentTarget.naturalWidth);
                                    console.log('Image naturalHeight:', e.currentTarget.naturalHeight);
                                    console.log('Image src:', e.currentTarget.src);
                                    console.log('About to calculate modal dimensions...');
                                    
                                    // Wait a bit for the image to be fully rendered, then calculate dimensions
                                    setTimeout(() => {
                                        console.log('Calling calculateModalDimensions...');
                                        calculateModalDimensions();
                                    }, 100);
                                    
                                    // Ensure the modal content is properly centered and within viewport
                                    const img = e.currentTarget;
                                    const contentWrapper = img.closest(`.${styles.content_wrapper}`);
                                    const modalContainer = contentWrapper?.closest(`.${styles.modal_container}`);
                                    const overlay = modalContainer?.closest(`.${styles.overlay}`);
                                    
                                    if (modalContainer && overlay) {
                                        // 모달 중앙 정렬 보장
                                        (overlay as HTMLElement).style.justifyContent = 'center';
                                        (overlay as HTMLElement).style.alignItems = 'center';
                                        (modalContainer as HTMLElement).style.justifyContent = 'center';
                                        (modalContainer as HTMLElement).style.alignItems = 'flex-start';
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
                                    src={workDetails.main_artist?.avatar_url || '/admin_icon/alt_img.svg'} 
                                    alt={workDetails.main_artist?.nickname || '삭제된 아티스트'} 
                                    className={styles.creator_avatar}
                                    onError={(e) => {
                                        console.log('Avatar failed to load:', workDetails.main_artist?.avatar_url);
                                        e.currentTarget.src = '/admin_icon/alt_img.svg';
                                    }}
                                />
                            </div>
                            <div className={styles.creator_name_container}>
                                {workDetails.main_artist ? (
                                    <span 
                                        className={`${styles.creator_name} ${styles.clickable_artist}`}
                                        onClick={() => handleArtistClick(workDetails.main_artist?.id)}
                                    >
                                        {workDetails.main_artist.nickname}
                                    </span>
                                ) : (
                                    <span className={styles.creator_name}>
                                        삭제된 아티스트
                                    </span>
                                )}
                                {!workDetails.main_artist && (
                                    <span className={styles.deleted_artist_note}>
                                        이 작품의 메인 아티스트가 탈퇴했습니다
                                    </span>
                                )}
                            </div>
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
                            <p 
                                className={styles.description_text}
                            >
                                {workDetails.description || '설명이 없습니다.'}
                            </p>
                        </div>

                        {/* Credits */}
                        <div className={styles.credits_block}>
                            <h3 className={styles.credits_header}>CREDITS</h3>
                            <div className={styles.credits_list}>
                                {workDetails.credits.map((artist, index) => (
                                    <div key={`${artist.id}-${index}`} className={styles.credit_item}>
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
                                        <span 
                                            className={`${styles.credit_name} ${styles.clickable_artist}`}
                                            onClick={() => handleArtistClick(artist.id)}
                                        >
                                            {artist.nickname}
                                        </span>
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