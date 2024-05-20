// components/ArtistSwiper.jsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import styles from '@/styles/ArtistSwiper.module.css';

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

export default function ArtistSwiper({ children }) {
  return (
    <Swiper
      spaceBetween={20}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      scrollbar={{ draggable: true }}
      className={styles.swiperContainer}
    >
      {children.map((child, index) => (
        <SwiperSlide key={index} className={styles.swiperSlide}>
          {child}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
