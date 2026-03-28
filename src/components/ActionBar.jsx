import { useState } from 'react';
import styles from './ActionBar.module.css';

export default function ActionBar({ video }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(video.likes); // starts at 0
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(video.bookmarks);
  const [followed, setFollowed] = useState(false);
  const [likeAnim, setLikeAnim] = useState(false);

  const handleLike = () => {
    setLiked(p => !p);
    setLikeCount(p => liked ? p - 1 : p + 1);
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 400);
  };

  return (
    <div className={styles.bar}>
      {/* Avatar + follow */}
      <div className={styles.avatarWrap}>
        <img src={video.user.avatar} alt={video.user.name} className={styles.avatar} />
        <button
          className={`${styles.followBtn} ${followed ? styles.following : ''}`}
          onClick={() => setFollowed(p => !p)}
        >
          {followed ? '✓' : '+'}
        </button>
      </div>

      {/* Like */}
      <button className={`${styles.action} ${likeAnim ? styles.pop : ''}`} onClick={handleLike}>
        <span className={styles.icon}>{liked ? '❤️' : '🤍'}</span>
        <span className={styles.count}>{likeCount}</span>
      </button>

      {/* Comment */}
      <button className={styles.action}>
        <span className={styles.icon}>💬</span>
        <span className={styles.count}>{video.comments}</span>
      </button>

      {/* Bookmark */}
      <button className={styles.action} onClick={() => {
        setBookmarked(p => !p);
        setBookmarkCount(p => bookmarked ? p - 1 : p + 1);
      }}>
        <span className={styles.icon}>{bookmarked ? '🔖' : '📑'}</span>
        <span className={styles.count}>{bookmarkCount}</span>
      </button>

      {/* Share */}
      <button className={styles.action}>
        <span className={styles.icon}>↗️</span>
        <span className={styles.count}>{video.shares}</span>
      </button>
    </div>
  );
}
