'use client';
import styles from '@/styles/WorkBox.module.css';

import Link from 'next/link';
import WorkModal from '@/components/WorkModal';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'

export default function WorkBox() {
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        console.log('Modal is now', modalOpen ? 'open' : 'closed');
    }, [modalOpen]);
    // s3경로 환경변수로 수정하기
    return (
        <>
            <div onClick={() => { setModalOpen(true) }}
                className={styles.work_container} >
                <img src="https://blended-wave-s3.s3.ap-northeast-2.amazonaws.com/tempImg.png" />
                <div className={styles.detail}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="36"
                        height="36"
                        viewBox="0 0 36 36"
                        fill="none"
                    >
                        <path d="M18 -3.05176e-05V36" stroke="white" stroke-width="3" />
                        <path d="M-1.52588e-05 18H36" stroke="white" stroke-width="3" />
                    </svg>
                </div>
            </div>
            {modalOpen && createPortal(<WorkModal onClose={() => setModalOpen(false)} />, document.body)}
        </>
    )
}

