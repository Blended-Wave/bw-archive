'use client';

import React from 'react';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination } from 'swiper';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import styles from '@/styles/ArtistSwiper.module.css';

SwiperCore.use([Navigation, Pagination]);

export default function ArtistSwiper({ children }) {
  const [swiper, setSwiper] = useState<Swiper>();

  const handlePrev = () => {
    swiper?.slidePrev()
  }
  const handleNext = () => {
    swiper?.slideNext()
  }
  return (
    <>
      <div className={styles.swiper_container}>
        <Swiper
          spaceBetween={40}
          slidesPerView={2}
          pagination={{ clickable: true }}
          className={styles.swiperContainer}
          centeredSlides={true}
          onSwiper={(e) => { setSwiper(e) }}
          loop={true}
        >
          {children.map((child, index) => (
            <SwiperSlide key={index} className={styles.swiperSlide}>
              {child}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div>
        <button className={styles.prev} onClick={handlePrev} />
        <button className={styles.next} onClick={handleNext} />
      </div>
    </>
  );
}
