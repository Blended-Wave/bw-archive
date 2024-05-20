// components/ArtistModal.jsx
import React from 'react';
import styles from '@/styles/ArtistModal.module.css';
import ArtistSwiper from './ArtistSwiper';

const ArtistModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <span className={styles.close} onClick={onClose}>X</span>
        <ArtistSwiper>
          <img src="https://via.placeholder.com/300?text=Art+1" alt="Art 1" />
          <img src="https://via.placeholder.com/300?text=Art+2" alt="Art 2" />
          <img src="https://via.placeholder.com/300?text=Art+3" alt="Art 3" />
          <img src="https://via.placeholder.com/300?text=Art+4" alt="Art 4" />
          <img src="https://via.placeholder.com/300?text=Art+5" alt="Art 5" />
          <img src="https://via.placeholder.com/300?text=Art+6" alt="Art 6" />
        </ArtistSwiper>
      </div>
    </div>
  );
};

export default ArtistModal;
