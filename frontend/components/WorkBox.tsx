import styles from "../styles/WorkBox.module.css";

export default function WorkBox({ onWorkClick }) {
  return (
    <div className={styles.artwork}>
      <img src="https://picsum.photos/331/331"></img>
      <div className={styles.artwork_detail} onClick={onWorkClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
        >
          <path d="M18 0V36" stroke="white" stroke-width="3" />
          <path d="M0 18H36" stroke="white" stroke-width="3" />
        </svg>
      </div>
    </div>
  );
}
