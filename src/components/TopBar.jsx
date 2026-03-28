import styles from './TopBar.module.css';

export default function TopBar({ darkMode, onToggleDark }) {
  return (
    <div className={styles.bar}>
      <div className={styles.logo}>
        <span className={styles.logoAccent}>K</span>amao
        <span className={styles.logoDot}>▶</span>
      </div>

      <nav className={styles.nav}>
        <span className={styles.navItem}>For You</span>
        <span className={`${styles.navItem} ${styles.active}`}>Following</span>
        <span className={styles.navItem}>Live</span>
      </nav>

      <button className={styles.iconBtn} onClick={onToggleDark} title="Toggle theme">
        {darkMode ? '☀️' : '🌙'}
      </button>
    </div>
  );
}
