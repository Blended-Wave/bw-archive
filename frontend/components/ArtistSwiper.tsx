'use client';

import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import SwiperCore from 'swiper';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from '@/styles/ArtistSwiper.module.css';
import Link from 'next/link';
import Image from 'next/image';

SwiperCore.use([Navigation, Pagination]);

interface ArtistData {
  img: string;
  name: string;
  roles: string[];
  instagramUrl: string;
  twitterUrl: string;
  link: string;
}

interface ArtistSwiperProps {
  artists: ArtistData[];
}

export default function ArtistSwiper({ artists }: ArtistSwiperProps) {
  const [swiper, setSwiper] = useState<SwiperCore | null>(null);

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

        prevBtn.addEventListener("click", () => {
          if (swiper) swiper.slidePrev();
        });

        nextBtn.addEventListener("click", () => {
          if (swiper) swiper.slideNext();
        });
      }
    }, 100);

    return () => {
      const prevBtn = document.querySelector('.swiper-button-prev') as HTMLDivElement;
      const nextBtn = document.querySelector('.swiper-button-next') as HTMLDivElement;
      if (prevBtn && swiper) prevBtn.removeEventListener("click", () => swiper.slidePrev());
      if (nextBtn && swiper) nextBtn.removeEventListener("click", () => swiper.slideNext());
    };
  }, [swiper]);

  const handleTransitionEnd = () => {
    document.querySelectorAll<HTMLImageElement>('.swiper-slide img').forEach((img) => {
      img.style.filter = "brightness(0.5)";
    });

    document.querySelectorAll<HTMLImageElement>('.swiper-slide-active img').forEach((img) => {
      img.style.filter = "brightness(1)";
    });

    document.querySelectorAll<HTMLDivElement>(`.${styles.artistInfo}`).forEach((info) => {
      info.style.opacity = "0";
    });

    document.querySelectorAll<HTMLElement>('.swiper-slide-active').forEach((slide) => {
      const info = slide.querySelector(`.${styles.artistInfo}`) as HTMLDivElement;
      if (info) {
        info.style.opacity = "1";
      }
    });
  };

  return (
    <div className={styles.swiperWrapper}>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={35}
        slidesPerView={3}
        centeredSlides={true}
        loop={true}
        navigation={true}
        onSwiper={setSwiper}
        onTransitionEnd={handleTransitionEnd}
        className={styles.swiperContainer}
      >
        {artists.map((artist, index) => (
          <SwiperSlide key={index} className={styles.swiperSlide}>
            <div className={styles.artistCard}>
              <img src={artist.img} alt={artist.name} className={styles.artistImage} />
              <div className={styles.artistInfo}>
                <h3>{artist.name}</h3>
                {artist.roles && <p>{artist.roles.join(' & ').toUpperCase()}</p>}
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
        ))}
      </Swiper>
    </div>
  );
}
