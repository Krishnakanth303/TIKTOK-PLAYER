import { useState } from 'react';
import styles from './UserInfo.module.css';

export default function UserInfo({ video }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={styles.info}>
      <p className={styles.username}>@{video.user.name}</p>
      <p className={`${styles.desc} ${expanded ? styles.expanded : ''}`}>
        {video.description}
      </p>
      {!expanded && (
        <button className={styles.more} onClick={() => setExpanded(true)}>more</button>
      )}
      <div className={styles.music}>
        <span>♫</span>
        <span className={styles.musicText}>{video.music}</span>
      </div>
    </div>
  );
}
