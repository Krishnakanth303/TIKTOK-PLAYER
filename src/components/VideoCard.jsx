import { useRef, useState } from 'react';
import { useVideoPlayer } from '../hooks/useVideoPlayer';
import ActionBar from './ActionBar';
import UserInfo from './UserInfo';
import MusicDisc from './MusicDisc';
import ProgressBar from './ProgressBar';
import styles from './VideoCard.module.css';

export default function VideoCard({ video, isActive }) {
  const videoRef = useRef(null);
  const { playing, progress, muted, showIcon, loading, togglePlay, toggleMute } =
    useVideoPlayer(videoRef, isActive);

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const handleTap = (e) => {
    const tag = e.target.tagName.toLowerCase();
    if (tag === "input" || tag === "button") return;
    togglePlay();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setComments([...comments, comment]);
    setComment("");
  };

  return (
    <div className={styles.card} onClick={handleTap}>
      {loading && <div className={styles.skeleton} />}

      <video
        ref={videoRef}
        className={styles.video}
        src={video.url}
        loop
        muted={muted}
        playsInline
      />

      <div className={styles.tapArea} />

      <div className={`${styles.playIcon} ${showIcon ? styles.visible : ''}`}>
        {playing ? '▶' : '⏸'}
      </div>

      <ActionBar video={video} />
      <UserInfo video={video} />

      <button
        className={styles.soundBtn}
        onClick={(e) => {
          e.stopPropagation();
          toggleMute();
        }}
      >
        {muted ? '🔇' : '🔊'}
      </button>

      <MusicDisc avatar={video.user.avatar} playing={playing} />

      {/* COMMENT BOX */}
      <div
        style={{
          position: "absolute",
          bottom: "80px",
          left: "10px",
          right: "10px",
          zIndex: 9999,
          background: "rgba(0,0,0,0.6)",
          padding: "10px",
          borderRadius: "10px"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ maxHeight: "100px", overflowY: "auto" }}>
          {comments.map((c, i) => (
            <p key={i}>💬 {c}</p>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex" }}>
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add comment..."
            style={{ flex: 1, padding: "5px" }}
          />
          <button type="submit">Post</button>
        </form>
      </div>

      <ProgressBar progress={progress} />
    </div>
  );
}