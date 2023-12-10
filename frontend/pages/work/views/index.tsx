import Link from "next/link";
import styles from "../../../styles/Work.module.css";
import WorkBox from "@/components/WorkBox";
import WorkModal from "@/components/WorkModal";
import { useEffect, useRef, useState } from "react";

export default function Work() {
  const [modalOpen, setModalOpen] = useState(false);
  const modalBackground = useRef();

  // 모달창 외부를 클릭시에 모달창이 닫힘
  useEffect(() => {
    function onClickOutside(e) {
      if (e.target == modalBackground.current) {
        setModalOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, []);

  return (
    <div className={styles.background}>
      <p className={styles.main}>ARTWORKS</p>
      <div className={styles.sort}>
        <p>정렬방식:</p>
        <Link href="/work">최신순</Link>
        <p>|</p>
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
        <Link href="/work/views" style={{ color: "#fff" }}>
          조회수순
        </Link>
      </div>
      <div className={styles.artwork_container}>
        <WorkBox onWorkClick={() => setModalOpen(true)} />
        <WorkBox onWorkClick={() => setModalOpen(true)} />
        <WorkBox onWorkClick={() => setModalOpen(true)} />
        <WorkBox onWorkClick={() => setModalOpen(true)} />
        <WorkBox onWorkClick={() => setModalOpen(true)} />
        <WorkBox onWorkClick={() => setModalOpen(true)} />
        <WorkBox onWorkClick={() => setModalOpen(true)} />
        <WorkBox onWorkClick={() => setModalOpen(true)} />
        <WorkBox onWorkClick={() => setModalOpen(true)} />
        <WorkBox onWorkClick={() => setModalOpen(true)} />
        <WorkBox onWorkClick={() => setModalOpen(true)} />
        <WorkBox onWorkClick={() => setModalOpen(true)} />
        <WorkBox onWorkClick={() => setModalOpen(true)} />
      </div>
      <div className={styles.pagination}>
        <img src="/left_arrow.svg" style={{ margin: "0 35px 0 0" }} />
        <p>1</p>
        <p>2</p>
        <p>3</p>
        <p>4</p>
        <p>5</p>
        <img src="/right_arrow.svg" />
      </div>
      {modalOpen && <WorkModal modalBackground={modalBackground} />}
    </div>
  );
}
