'use client';

import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import SwiperCore from 'swiper';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from '@/styles/ArtistSwiper.module.css';
import Image from 'next/image';

SwiperCore.use([Navigation, Pagination]);

interface ArtistData {
  img: string;
  name: string;
  roles: string[];
  instagramUrl: string;
  twitterUrl: string;
  link: string;
  works_id: number;
  type?: string; // 'image' | 'video'
}

interface ArtistInfo { // Define the type for the page's main artist
    name: string;
    roles: string[];
    instagramUrl: string;
    twitterUrl: string;
}

interface ArtistSwiperProps {
  artists: ArtistData[];
  artistInfo: ArtistInfo;
  onWorkClick?: (works_id: number, index: number) => void;
}

export default function ArtistSwiper({ artists, artistInfo, onWorkClick }: ArtistSwiperProps) {
  const [swiper, setSwiper] = useState<SwiperCore | null>(null);
  const [isSliding, setIsSliding] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);
  
  const slidesCount = artists.length;
  const shouldLoop = slidesCount >= 3;
  const isSingleImage = slidesCount === 1;
  const isTwoImages = slidesCount === 2;

  // 루프 모드를 위해 충분한 슬라이드 생성 (재정렬 빈도 최소화)
  const getExtendedArtists = () => {
    if (!shouldLoop) return artists;
    
    // 원본의 3배로 확장하여 재정렬 빈도 최소화
    const multiplier = 3;
    let extended: typeof artists = [];
    for (let i = 0; i < multiplier; i++) {
      extended = [...extended, ...artists];
    }
    return extended;
  };

  const extendedArtists = getExtendedArtists();

  // 초기 로드 시 중앙 동영상 재생
  useEffect(() => {
    if (!isSliding) {
      const timer = setTimeout(() => {
        playActiveVideo(activeSlideIndex);
      }, 100); // 딜레이 최소화
      
      return () => clearTimeout(timer);
    }
  }, [activeSlideIndex, isSliding]);

  // 동영상 제어 함수들
  const pauseAllVideos = () => {
    const videos = document.querySelectorAll('.artist-swiper video');
    videos.forEach((video) => {
      (video as HTMLVideoElement).pause();
    });
  };

  const playActiveVideo = (slideIndex: number) => {
    // 모든 비디오를 먼저 일시정지
    const allVideos = document.querySelectorAll('.artist-swiper video');
    allVideos.forEach(video => (video as HTMLVideoElement).pause());
    
    // 활성 슬라이드의 비디오만 재생 (즉시 실행)
    const activeSlide = document.querySelector('.artist-swiper .swiper-slide-active');
    if (activeSlide) {
      const activeVideo = activeSlide.querySelector('video') as HTMLVideoElement;
      if (activeVideo) {
        // readyState 확인 없이 즉시 재생 시도
        activeVideo.play().catch(() => {
          // 재생 실패 시 한 번 더 시도
          setTimeout(() => {
            activeVideo.play().catch(() => {});
          }, 50);
        });
      }
    }
  };

  const handleSlideChange = (swiper: SwiperCore) => {
    const realIndex = swiper.realIndex;
    setActiveSlideIndex(realIndex);
    setUserInteracted(true); // 슬라이드 변경 시 사용자 상호작용으로 간주
    playActiveVideo(realIndex);
  };

  // 첫 클릭 시 사용자 상호작용 활성화
  const handleUserInteraction = () => {
    if (!userInteracted) {
      setUserInteracted(true);
      // 현재 활성 슬라이드의 동영상을 재생 시도
      playActiveVideo(activeSlideIndex);
    }
  };

  const handlePrevSlide = () => {
    if (isSliding || !swiper) return;
    setIsSliding(true);
    swiper.slidePrev();
    setTimeout(() => setIsSliding(false), 800);
  };

  const handleNextSlide = () => {
    if (isSliding || !swiper) return;
    setIsSliding(true);
    swiper.slideNext();
    setTimeout(() => setIsSliding(false), 800);
  };

    // 이미지가 하나만 있을 때는 Swiper 대신 단순 이미지 표시
    if (isSingleImage) {
      return (
        <div className={styles.swiperWrapper}>
          <div className={styles.singleImageContainer}>
            <div 
              className={styles.artistCard}
              onClick={() => onWorkClick?.(artists[0].works_id, 0)}
              style={{ cursor: 'pointer' }}
            >
              {artists[0].type === 'video' ? (
                <video 
                  src={artists[0].img} 
                  loop 
                  muted
                  playsInline
                  className={styles.singleImage}
                  autoPlay
                />
              ) : (
                <img 
                  src={artists[0].img} 
                  alt={artists[0].name} 
                  className={styles.singleImage} 
                />
              )}
              <div className={styles.artistInfo}>
                <h3>{artists[0].name}</h3>
                {artists[0].roles && (
                  <p>{artists[0].roles.join(' & ').toUpperCase()}</p>
                )}
                <div className={styles.socialIcons}>
                  {artists[0].instagramUrl && (
                    <a href={artists[0].instagramUrl} target="_blank" rel="noopener noreferrer" className={styles.iconLink}>
                      <Image src="/instagram.svg" alt="Instagram" layout="fill" />
                    </a>
                  )}
                  {artists[0].twitterUrl && (
                    <a href={artists[0].twitterUrl} target="_blank" rel="noopener noreferrer" className={styles.iconLink}>
                      <Image src="/twitter.svg" alt="Twitter" layout="fill" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
    <div className={styles.swiperWrapper} onClick={handleUserInteraction}>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={isTwoImages ? 100 : 35} // Increase spacing for 2 slides
        slidesPerView={isTwoImages ? 2 : 3} // Show 2 slides when there are only 2 images
        centeredSlides={true}
        loop={shouldLoop}
        loopAdditionalSlides={shouldLoop ? slidesCount : 0}
        initialSlide={0}
        speed={800}
        grabCursor={true}
        allowTouchMove={true}
        watchSlidesProgress={true}
        slidesPerGroup={1}
        normalizeSlideIndex={true}
        pagination={{ 
          clickable: true,
          bulletClass: styles.paginationBullet,
          bulletActiveClass: styles.active,
          el: `.${styles.pagination}`
        }}
        onSwiper={(swiperInstance) => {
          setSwiper(swiperInstance);
          setActiveSlideIndex(swiperInstance.realIndex);
          
          // Swiper 초기화 후 바로 중앙 동영상 재생 시도
          setTimeout(() => {
            playActiveVideo(swiperInstance.realIndex);
          }, 50);
        }}
        onSlideChange={handleSlideChange}
        className={`${isTwoImages ? styles.twoSlidesContainer : styles.swiperContainer} artist-swiper`}
      >
        {extendedArtists.map((artist, index) => {
          // 원본 배열에서의 실제 인덱스 계산
          const originalIndex = index % artists.length;
          
          return (
            <SwiperSlide key={index} className={styles.swiperSlide}>
              <div 
                className={styles.artistCard}
                onClick={() => onWorkClick?.(artist.works_id, originalIndex)}
                style={{ cursor: 'pointer' }}
              >
                {artist.type === 'video' ? (
                  <video 
                    src={artist.img} 
                    loop 
                    muted
                    playsInline
                    preload="auto"
                    className={styles.artistImage}
                  />
                ) : (
                  <img 
                    src={artist.img} 
                    alt={artist.name} 
                    className={styles.artistImage} 
                  />
                )}
              {/* 가운데 슬라이드에만 텍스트 표시 */}
              <div className={styles.artistInfo}>
                <h3>{artist.name}</h3>
                {artist.roles && (
                  <p>{artist.roles.join(' & ').toUpperCase()}</p>
                )}
                <div className={styles.socialIcons}>
                  {artist.instagramUrl && (
                    <a href={artist.instagramUrl} target="_blank" rel="noopener noreferrer" className={styles.iconLink}>
                      <Image src="/instagram.svg" alt="Instagram" layout="fill" />
                    </a>
                  )}
                  {artist.twitterUrl && (
                    <a href={artist.twitterUrl} target="_blank" rel="noopener noreferrer" className={styles.iconLink}>
                      <Image src="/twitter.svg" alt="Twitter" layout="fill" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
          );
        })}
      </Swiper>

      {/* 페이지네이션 - 이미지가 2개 이상일 때만 표시 */}
      {slidesCount > 1 && <div className={styles.pagination}></div>}
      
      {/* 좌우 클릭 네비게이션 영역 - 이미지가 2개 이상일 때만 표시 */}
      {slidesCount > 1 && (
        <div className={styles.navigationAreas}>
          <div className={styles.navLeft} onClick={handlePrevSlide}></div>
          <div className={styles.navRight} onClick={handleNextSlide}></div>
        </div>
      )}
    </div>
  );
}
