'use client';

import styles from '@/styles/Work.module.css';
import Link from 'next/link';
import WorkBox from '@/components/WorkBox';
import Pagination from '@/components/Pagination';
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from 'react';

export default function Work() {
    const searchParams = useSearchParams();
    const pageParam = searchParams.get("page");
    const currentPage = parseInt(pageParam) || 1;
    const itemCountPerPage = 12;

    const [totalItems, setTotalItems] = useState(26);
    const [works, setWorks] = useState([...Array(26)].map((_, index) => ({ id: index }))); // 각 work에 ID 부여 예시

    // 현재 페이지에 맞게 work를 필터링
    const indexOfLastItem = currentPage * itemCountPerPage;
    const indexOfFirstItem = indexOfLastItem - itemCountPerPage;
    const currentWorks = works.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className={styles.background}>
            <div className={styles.work_container}>
                <p>ARTWORKS</p>
                <div className={styles.sort}>
                    <p>정렬방식:</p>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="9"
                        height="7"
                        viewBox="0 0 9 7"
                        fill="none"
                    >
                        <path
                            d="M8.62499 1.20826L3.12499 6.70826L0.604156 4.18743L1.25041 3.54118L3.12499 5.41118L7.97874 0.562012L8.62499 1.20826Z"
                            fill="white"
                        />
                    </svg>
                    <Link href="/work" style={{ color: "#fff" }}>
                        최신순
                    </Link>
                    <p>|</p>
                    <Link href="/work/views">조회수순</Link>
                </div>
                <div className={styles.works}>
                    {currentWorks.map((work, i) => (
                        <WorkBox work={work} key={i} />
                    ))}
                </div>
                <Pagination
                    totalItems={totalItems}
                    currentPage={currentPage}
                    pageCount={5}
                    itemCountPerPage={itemCountPerPage} />
            </div>
        </div>
    );
}
