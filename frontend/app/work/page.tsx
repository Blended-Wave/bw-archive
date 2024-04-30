import styles from '@/styles/Work.module.css';
import Link from 'next/link';
import WorkBox from '@/components/WorkBox';

export default function Work() {
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
                    <WorkBox />
                    <WorkBox />
                    <WorkBox />
                    <WorkBox />
                    <WorkBox />
                    <WorkBox />
                    <WorkBox />
                    <WorkBox />
                    <WorkBox />

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
            </div>
        </div>
    );
}
