import { useState, useEffect } from "react";
import styles from "@/styles/Pagination.module.css"

// 페이지네이션 핵심 값들
interface Props {
  totalItems: number; // 전체 아이템 개수
  itemCountPerPage: number; // 한 페이지당 표시할 아이템 개수 (예: 한 페이지당 10개)
  pageCount: number; // 한 번에 보여줄 페이지 개수
  currentPage: number; // 현재 선택된 페이지
  onPageChange: (pageNumber: number) => void; // 페이지 변경 핸들러 함수
}

// 페이지 이동 버튼 기능(페이지네이션) 구현
export default function Pagination({ totalItems, itemCountPerPage, pageCount, currentPage, onPageChange }: Props) {
  const totalPages = Math.ceil(totalItems / itemCountPerPage); // 전체 페이지 개수 계산 (ceil로 올림처리)
  const [start, setStart] = useState(1); // 현재 페이지 그룹의 시작 페이지
  const noPrev = start === 1; // 이전&다음 버튼 비활성화 조건
  const noNext = start + pageCount - 1 >= totalPages;

  useEffect(() => { // 사용자가 다음 페이지 그룹으로 이동하면 start 값을 증가
    if (currentPage === start + pageCount) setStart((prev) => prev + pageCount);
    if (currentPage < start) setStart((prev) => prev - pageCount);
  }, [currentPage, pageCount, start]);

  return ( // 렌더링
    <div className={styles.wrapper}>
      <ul>
        {/* 이전 버튼 */}
        <li className={`${styles.move} ${noPrev && styles.invisible}`}>
          <button onClick={() => onPageChange(start - 1)} disabled={noPrev}>이전</button>
        </li>

        {/* 페이지 번호 버튼 */}
        {[...Array(pageCount)].map((a, i) => (
          <>
            {start + i <= totalPages && (
              <li key={i}>
                <button className={`${styles.page} ${currentPage === start + i && styles.active}`}
                  onClick={() => onPageChange(start + i)}>
                  {start + i}
                </button>
              </li>
            )}
          </>
        ))}
        
        {/* 다음 버튼 */}
        <li className={`${styles.move} ${noNext && styles.invisible}`}>
          <button onClick={() => onPageChange(start + pageCount)} disabled={noNext}>다음</button>
        </li>
      </ul>
    </div>
  );
}