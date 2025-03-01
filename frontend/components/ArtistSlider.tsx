'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from '@/styles/ArtistSlider.module.css';

interface ArtistSliderProps {
  images: string[];
}

export default function ArtistSlider({ images }: ArtistSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const changeSlide = (direction: 'next' | 'prev') => {
    if (isAnimating) return;
    setIsAnimating(true);

    let newIndex =
      direction === 'next'
        ? (currentIndex + 1) % images.length
        : (currentIndex - 1 + images.length) % images.length;

    // 애니메이션이 끝나기 직전에 위치를 즉시 변경하여 부드럽게 보이게 함
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setIsAnimating(false);
    }, 450); // transition 시간보다 약간 짧게 설정
  };

  return (
    <div className={styles.sliderContainer}>
      <div className={`${styles.sliderTrack} ${isAnimating ? styles.animating : ''}`} ref={trackRef}>
        {images.map((image, index) => {
          let positionClass = styles.hiddenSlide;

          if (index === currentIndex) positionClass = styles.centerSlide;
          else if (index === (currentIndex - 1 + images.length) % images.length) positionClass = styles.leftSlide;
          else if (index === (currentIndex + 1) % images.length) positionClass = styles.rightSlide;

          return (
            <img
              key={index}
              src={image}
              className={`${styles.slide} ${positionClass} ${isAnimating ? styles.fadeEffect : ''}`}
              alt={`Slide ${index}`}
              onClick={() => setCurrentIndex(index)}
            />
          );
        })}
      </div>
      <button className={styles.prevButton} onClick={() => changeSlide('prev')}>←</button>
      <button className={styles.nextButton} onClick={() => changeSlide('next')}>→</button>
    </div>
  );
}
