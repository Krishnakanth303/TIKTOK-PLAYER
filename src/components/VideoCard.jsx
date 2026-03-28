import { useRef, useState, useCallback } from 'react';
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

  const addComment = (e) => {
    e.stopPropagation();
    if (!comment.trim()) return;
    setComments((prev) => [...prev, comment]);
    setComment("");
  };

  const handleTap = useCallback(() => {
    togglePlay();
  }, [togglePlay]);

  return (
    <div
      className={styles.card}
      onClick={handleTap}
    >
      {loading && <div className={styles.skeleton} />}

      <video
        ref={videoRef}
        className={styles.video}
        src={video.url}
        loop
        muted
        playsInline
      />

      {/* 🔥 tap layer (no blocking now) */}
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

      {/* 🔥 FIXED COMMENT BOX */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          bottom: "80px",
          left: "10px",
          right: "10px",
          zIndex: 9999,              // 🔥 HIGH PRIORITY
          pointerEvents: "auto",     // 🔥 ENABLE INPUT
          color: "white"
        }}
      >
        <div style={{ maxHeight: "100px", overflowY: "auto" }}>
          {comments.map((c, i) => (
            <p key={i} style={{ fontSize: "12px", margin: "2px 0" }}>
              💬 {c}
            </p>
          ))}
        </div>

        <div style={{ display: "flex", marginTop: "5px" }}>
          <input
            type="text"
            placeholder="Add comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onClick={(e) => e.stopPropagation()} // 🔥 IMPORTANT
            style={{
              flex: 1,
              padding: "6px",
              borderRadius: "5px",
              border: "none"
            }}
          />

          <button
            onClick={addComment}
            style={{
              marginLeft: "5px",
              padding: "6px 10px",
              background: "#ff2c55",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Post
          </button>
        </div>
      </div>

      <ProgressBar progress={progress} />
    </div>
  );
}