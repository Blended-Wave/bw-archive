'use client';

import { useState } from 'react';
import styles from '@/styles/ArtistBox.module.css';
import ArtistModal from '@/components/ArtistModal';

export default function ArtistBox() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.artist_container}>
      <div className={styles.artist_box}>
        <div className={styles.arts}>
          <img src="/artist_icon/illustrator_icon.svg" />
          <img src="/artist_icon/composer_icon.svg" />
          <img src="/artist_icon/ani_icon.svg" />
          <img src="/artist_icon/writer_icon.svg" />
        </div>
        <div className={styles.detail} onClick={openModal}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
          >
            <path d="M18 -3.05176e-05V36" stroke="white" strokeWidth="3" />
            <path d="M-1.52588e-05 18H36" stroke="white" strokeWidth="3" />
          </svg>
          <p>VIEW DETAIL</p>
        </div>
        <img src="/tmp_img/tmpImg.png" />
      </div>
      <div>artist</div>
      <ArtistModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}
