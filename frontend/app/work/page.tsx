'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import WorkBox from '@/components/WorkBox';
import styles from '@/styles/Work.module.css';
import Pagination from '@/components/Pagination';
import axios from 'axios'; // api 대신 axios 직접 사용
import WorkDetailModal from '@/components/WorkDetailModal'; 

// Work 인터페이스를 WorkDetailModal의 WorkDetails와 유사하게 확장
interface Work {
    id: number;
    title: string;
    thumbnail_url: string;
    series: string | null;
    main_artist: any; // 상세 정보 포함을 위해 any로 임시 변경
    description?: string;
    created_at?: string;
    credits?: any[];
    file_url?: string;
    type?: string;
}

export default function Work() {
    const searchParams = useSearchParams();
    const [works, setWorks] = useState<Work[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemCountPerPage, setItemCountPerPage] = useState(12);
    const [selectedWorkIndex, setSelectedWorkIndex] = useState<number | null>(null);

    useEffect(() => {
        const fetchWorks = async () => {
            try {
                setLoading(true);
                const sortOrder = searchParams.get('sort') || 'recent';
                console.log('Fetching works with sort order:', sortOrder);
                
                // axios를 직접 사용하여 전체 URL로 요청
                const response = await axios.get('http://localhost:4000/api/works/pub_works', {
                    params: { sort: sortOrder },
                    withCredentials: true,
                });
                
                console.log('Raw API response:', response);
                console.log('Response data:', response.data);
                console.log('Response status:', response.status);

                const fetchedWorks = response.data || [];
                console.log('Fetched works array:', fetchedWorks);
                console.log('Number of works:', fetchedWorks.length);
                
                if (fetchedWorks.length > 0) {
                    console.log('First work example:', fetchedWorks[0]);
                    console.log('First work keys:', Object.keys(fetchedWorks[0]));
                    console.log('First work file_url:', fetchedWorks[0].file_url);
                    console.log('First work thumbnail_url:', fetchedWorks[0].thumbnail_url);
                }
                
                setWorks(fetchedWorks);
                setError(null);
            } catch (err) {
                setError('데이터를 불러오는 데 실패했습니다.');
                console.error('Error fetching works:', err);
                console.error('Error response:', err.response);
            } finally {
                setLoading(false);
            }
        };
        fetchWorks();
    }, [searchParams]);

    const handleWorkClick = (workIndex: number) => {
        console.log('=== WORK CLICK DEBUG ===');
        console.log('Selected work index:', workIndex);
        console.log('Selected work data:', works[workIndex]);
        console.log('Selected work type:', typeof works[workIndex]);
        console.log('Selected work keys:', works[workIndex] ? Object.keys(works[workIndex]) : 'No work data');
        
        if (works[workIndex]) {
            console.log('Selected work file_url:', works[workIndex].file_url);
            console.log('Selected work thumbnail_url:', works[workIndex].thumbnail_url);
            console.log('Selected work type:', works[workIndex].type);
            console.log('Selected work main_artist:', works[workIndex].main_artist);
            console.log('Selected work credits:', works[workIndex].credits);
        }
        
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
    
    const indexOfLastItem = currentPage * itemCountPerPage;
    const indexOfFirstItem = indexOfLastItem - itemCountPerPage;
    const currentWorks = works.slice(indexOfFirstItem, indexOfLastItem);

    if (loading) {
        return <div className={styles.background}><p className={styles.message}>로딩 중...</p></div>;
    }

    if (error) {
        return <div className={styles.background}><p className={styles.message}>{error}</p></div>;
    }

    const selectedWork = selectedWorkIndex !== null ? works[selectedWorkIndex] : null;
    
    // Debug: Log the transformed data
    if (selectedWork) {
        const transformedData = {
            title: selectedWork.title,
            description: selectedWork.description || '',
            series: selectedWork.series || '',
            created_at: selectedWork.created_at || new Date().toISOString(),
            main_artist: {
                id: selectedWork.main_artist?.id || 0,
                nickname: selectedWork.main_artist?.nickname || 'Unknown',
                avatar_url: selectedWork.main_artist?.avatar_url
            },
            credits: selectedWork.credits || [],
            file_url: selectedWork.file_url || selectedWork.thumbnail_url || '',
            type: selectedWork.type || 'image'
        };
        console.log('Transformed work data for modal:', transformedData);
    }

    return (
        <main className={styles.background}>
            <div className={styles.work_container}>
                <h1>ARTWORKS</h1>
                {/* ... 정렬 옵션 ... */}
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
                            {works.map((work, index) => (
                                <WorkBox key={work.id} work={work} onClick={() => handleWorkClick(index)} />
                    ))}
                </div>
                        {/* 페이지네이션은 아이템이 많을 경우를 위해 유지 */}
                    </>
                ) : (
                    <p className={styles.message}>표시할 작업물이 없습니다.</p>
                )}
                {selectedWork && (
                    <WorkDetailModal
                        workDetails={{
                            title: selectedWork.title,
                            description: selectedWork.description || '',
                            series: selectedWork.series || '',
                            created_at: selectedWork.created_at || new Date().toISOString(),
                            main_artist: {
                                id: selectedWork.main_artist?.id || 0,
                                nickname: selectedWork.main_artist?.nickname || 'Unknown',
                                avatar_url: selectedWork.main_artist?.avatar_url
                            },
                            credits: selectedWork.credits || [],
                            file_url: selectedWork.file_url || selectedWork.thumbnail_url || '',
                            type: selectedWork.type || 'image'
                        }}
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
