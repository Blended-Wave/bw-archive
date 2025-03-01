import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "@/styles/Pagination.module.css"

// 페이지네이션 핵심 값들
interface Props {
  totalItems: number; // 전체 아이템 개수
  itemCountPerPage: number; // 한 페이지당 표시할 아이템 개수 (예: 한 페이지당 10개)
  pageCount: number; // 한 번에 보여줄 페이지 개수
  currentPage: number; // 현재 선택된 페이지
}

// 페이지 이동 버튼 기능(페이지네이션) 구현
export default function Pagination({ totalItems, itemCountPerPage, pageCount, currentPage }: Props) {
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
          <Link href={`?page=${start - 1}`}>이전</Link>
        </li>

        {/* 페이지 번호 버튼 */}
        {[...Array(pageCount)].map((a, i) => (
          <>
            {start + i <= totalPages && (
              <li key={i}>
                <Link className={`${styles.page} ${currentPage === start + i && styles.active}`}
                  href={`?page=${start + i}`}>
                  {start + i}
                </Link>
              </li>
            )}
          </>
        ))}
        
        {/* 다음 버튼 */}
        <li className={`${styles.move} ${noNext && styles.invisible}`}>
          <Link href={`?page=${start + pageCount}`}>다음</Link>
        </li>
      </ul>
    </div>
  );
}