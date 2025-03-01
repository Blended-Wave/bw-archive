'use client';

import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination } from 'swiper';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from '@/styles/ArtistSwiper.module.css';
import Link from 'next/link';

SwiperCore.use([Navigation, Pagination]);

export default function ArtistSwiper({ artists }) {
  const [swiper, setSwiper] = useState<Swiper | null>(null);

  useEffect(() => {
    setTimeout(() => {
      const prevBtn = document.querySelector('.swiper-button-prev') as HTMLDivElement;
      const nextBtn = document.querySelector('.swiper-button-next') as HTMLDivElement;

      if (prevBtn && nextBtn) {
        prevBtn.style.position = "absolute";
        prevBtn.style.top = "50%";
        prevBtn.style.transform = "translateY(-50%)";
        prevBtn.style.left = "0";
        prevBtn.style.width = "900px";
        prevBtn.style.height = "585px";
        prevBtn.style.margin = "0";
        prevBtn.style.opacity = "0";

        nextBtn.style.position = "absolute";
        nextBtn.style.top = "50%";
        nextBtn.style.transform = "translateY(-50%)";
        nextBtn.style.right = "0";
        nextBtn.style.width = "900px";
        nextBtn.style.height = "585px";
        nextBtn.style.margin = "0";
        nextBtn.style.opacity = "0";

        // ✅ 버튼 클릭 이벤트 추가 (슬라이드 이동)
        prevBtn.addEventListener("click", () => {
          if (swiper) swiper.slidePrev();
        });

        nextBtn.addEventListener("click", () => {
          if (swiper) swiper.slideNext();
        });
      }
    }, 100);

    return () => {
      // ✅ 이벤트 리스너 정리
      const prevBtn = document.querySelector('.swiper-button-prev') as HTMLDivElement;
      const nextBtn = document.querySelector('.swiper-button-next') as HTMLDivElement;
      if (prevBtn) prevBtn.removeEventListener("click", () => swiper?.slidePrev());
      if (nextBtn) nextBtn.removeEventListener("click", () => swiper?.slideNext());
    };
  }, [swiper]);

  const handleTransitionEnd = () => {
    // ✅ 모든 슬라이드의 이미지 필터 초기화
    document.querySelectorAll('.swiper-slide img').forEach((img) => {
      img.style.filter = "brightness(0.5)";
    });

    // ✅ 현재 활성화된 슬라이드의 이미지 밝게
    document.querySelectorAll('.swiper-slide-active img').forEach((img) => {
      img.style.filter = "brightness(1)";
    });

    // ✅ 모든 `.artistInfo` 투명하게 설정
    document.querySelectorAll(`.${styles.artistInfo}`).forEach((info) => {
      info.style.opacity = "0";  // 모든 정보 숨김
    });

    // ✅ 현재 활성화된 슬라이드의 `.artistInfo`만 보이도록 설정
    document.querySelectorAll('.swiper-slide-active').forEach((slide) => {
      const info = slide.querySelector(`.${styles.artistInfo}`) as HTMLDivElement;
      if (info) {
        info.style.opacity = "1";  // 활성화된 슬라이드 정보 보이기
      }
    });
  };

  return (
    <div className={styles.swiperWrapper}>
      <Swiper
        spaceBetween={35}
        slidesPerView={3}
        centeredSlides={true}
        loop={true}
        navigation={true}
        onSwiper={setSwiper}
        onTransitionEnd={handleTransitionEnd} // ✅ 기존 구조 유지
        className={styles.swiperContainer}
      >
        {artists.map((artist, index) => (
          <SwiperSlide key={index} className={styles.swiperSlide}>
            <div className={styles.artistCard}>
              <img src={artist.img} alt={artist.name} className={styles.artistImage} />
              {/* ✅ 활성화된 슬라이드에서만 보이도록 JavaScript로 스타일 제어 */}
              <div className={styles.artistInfo}>
                <h3>{artist.name}</h3>
                <p>{artist.role}</p>
                <Link href={artist.link}>More Info</Link> 
                {/* 받아오는 값은 응답 DTO랑 pages.tsx단에서 배열 만들 때 구조화 시켜서 문자열로 통일 */}
                {/* 링크아이콘은 개수만큼 조건문으로 렌더링(아이콘으로)  */}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
