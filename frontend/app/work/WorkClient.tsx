'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import WorkBox from '@/components/WorkBox';
import styles from '@/styles/Work.module.css';
import axios from 'axios';
import WorkDetailModal from '@/components/WorkDetailModal';

// WorkDetail 인터페이스를 백엔드 응답 구조에 맞게 정의
interface WorkDetail {
    works_id: number; // 백엔드에서 works_id로 반환
    id: number; // WorkBox 호환성을 위해 필수
    title: string;
    thumbnail_url: string;
    series: string | null;
    main_artist: any;
    description?: string;
    created_at?: string;
    credits?: any[];
    type?: string;
    status?: string;
    private_option?: boolean;
    pinned_option?: boolean;
    views?: number;
    file_url?: string; // 작업 파일 URL
}

export default function WorkClient() {
    const searchParams = useSearchParams();
    const [works, setWorks] = useState<WorkDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemCountPerPage = 12; // 3줄 × 4개 = 12개
    const [selectedWorkIndex, setSelectedWorkIndex] = useState<number | null>(null);

    // 페이지 제목 설정
    useEffect(() => {
        document.title = 'Blended Wave - Artworks';
    }, []);

    useEffect(() => {
        const fetchWorks = async () => {
            try {
                setLoading(true);
                const sortOrder = searchParams.get('sort') || 'recent';
                // sort 파라미터에 따라 올바른 엔드포인트 선택
                let endpoint = '';
                const baseURL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:4000/api';
                switch (sortOrder) {
                    case 'views':
                        endpoint = `${baseURL}/works/sorted_by_view`;
                        break;
                    case 'pinned':
                        endpoint = `${baseURL}/works/pinned`;
                        break;
                    case 'recent':
                    default:
                        endpoint = `${baseURL}/works/recent`;
                        break;
                }
                
                const response = await axios.get(endpoint, {
                    withCredentials: true,
                });
                
                // 백엔드 response 구조에 맞게 데이터 추출
                const fetchedWorks = response.data?.result || [];
                
                // WorkBox 호환성을 위해 id 필드 추가
                const transformedWorks = fetchedWorks.map((work: any, index: number) => ({
                    ...work,
                    id: work.works_id, // works_id를 id로 매핑
                }));
                
                setWorks(transformedWorks);
                setError(null);
            } catch (err) {
                setError('데이터를 불러오는 데 실패했습니다.');
                console.error('Error fetching works:', err);
                if (err && typeof err === 'object' && 'response' in err) {
                    console.error('Error response:', (err as any).response);
                    console.error('Error status:', (err as any).response?.status);
                    console.error('Error data:', (err as any).response?.data);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchWorks();
    }, [searchParams]);

    const handleWorkClick = (workIndex: number) => {
        setSelectedWorkIndex(workIndex);
    };

    const handleCloseModal = () => {
        setSelectedWorkIndex(null);
    };

    const handlePrevWork = () => {
        if (selectedWorkIndex !== null && selectedWorkIndex > 0) {
            setSelectedWorkIndex(selectedWorkIndex - 1);
        }
    };

    const handleNextWork = () => {
        if (selectedWorkIndex !== null && selectedWorkIndex < works.length - 1) {
            setSelectedWorkIndex(selectedWorkIndex + 1);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    const indexOfLastItem = currentPage * itemCountPerPage;
    const indexOfFirstItem = indexOfLastItem - itemCountPerPage;
    const currentWorks = works.slice(indexOfFirstItem, indexOfLastItem);

    if (loading) {
        return <div className={styles.background}><p className={styles.message}>로딩 중...</p></div>;
    }

    if (error) {
        return <div className={styles.background}><p className={styles.message}>{error}</p></div>;
    }

    return (
        <main className={styles.background}>
            <div className={styles.work_container}>
                <h1>ARTWORKS</h1>
                <div className={styles.sort}>
                    <p>정렬방식:</p>
                     <a href="?sort=recent" style={{ color: searchParams.get('sort') !== 'views' ? '#fff' : '#ACACAC' }}>
                         {searchParams.get('sort') !== 'views' && (
                             <svg xmlns="http://www.w3.org/2000/svg" width="9" height="7" viewBox="0 0 9 7" fill="none">
                                 <path d="M8.62499 1.20826L3.12499 6.70826L0.604156 4.18743L1.25041 3.54118L3.12499 5.41118L7.97874 0.562012L8.62499 1.20826Z" fill="white"/>
                    </svg>
                         )}
                        최신순
                     </a>
                    <p>|</p>
                     <a href="?sort=views" style={{ color: searchParams.get('sort') === 'views' ? '#fff' : '#ACACAC' }}>
                         {searchParams.get('sort') === 'views' && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="9" height="7" viewBox="0 0 9 7" fill="none">
                                 <path d="M8.62499 1.20826L3.12499 6.70826L0.604156 4.18743L1.25041 3.54118L3.12499 5.41118L7.97874 0.562012L8.62499 1.20826Z" fill="white"/>
                             </svg>
                         )}
                         조회수순
                     </a>
                </div>

                {works.length > 0 ? (
                    <>
                        <div className={styles.works}>
                            {currentWorks.map((work, index) => (
                                <WorkBox 
                                    key={work.works_id} 
                                    work={work} 
                                    onClick={() => handleWorkClick(indexOfFirstItem + index)} 
                                />
                            ))}
                        </div>
                        
                        {/* 12개 이상일 때만 페이지네이션 표시 */}
                        {works.length > 12 && (
                            <div className={styles.pagination}>
                                <button 
                                    onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={styles.pagination_arrow}
                                >
                                    <img src="/left-arrow 2.svg" alt="이전" />
                                </button>
                                
                                {Array.from({ length: Math.ceil(works.length / itemCountPerPage) }, (_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => handlePageChange(i + 1)}
                                        className={`${styles.pagination_number} ${
                                            currentPage === i + 1 ? styles.pagination_active : ''
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                
                                <button 
                                    onClick={() => handlePageChange(Math.min(currentPage + 1, Math.ceil(works.length / itemCountPerPage)))}
                                    disabled={currentPage === Math.ceil(works.length / itemCountPerPage)}
                                    className={styles.pagination_arrow}
                                >
                                    <img src="/right-arrow 2.svg" alt="다음" />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <p className={styles.message}>표시할 작업물이 없습니다.</p>
                )}
                {selectedWorkIndex !== null && (
                    <WorkDetailModal
                        workId={works[selectedWorkIndex]?.works_id}
                        onClose={handleCloseModal}
                        onPrev={handlePrevWork}
                        onNext={handleNextWork}
                        isPrevDisabled={selectedWorkIndex === 0}
                        isNextDisabled={selectedWorkIndex === works.length - 1}
                    />
                )}
            </div>
        </main>
    );
}
