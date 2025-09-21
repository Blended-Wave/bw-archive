'use client';

import React, { useState } from 'react';
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
              <img 
                src={artists[0].img} 
                alt={artists[0].name} 
                className={styles.singleImage} 
              />
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
    <div className={styles.swiperWrapper}>
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
        onSwiper={setSwiper}
        className={isTwoImages ? styles.twoSlidesContainer : styles.swiperContainer}
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
                <img 
                  src={artist.img} 
                  alt={artist.name} 
                  className={styles.artistImage} 
                />
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
