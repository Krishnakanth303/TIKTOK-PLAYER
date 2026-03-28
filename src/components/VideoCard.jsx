import { useRef, useState, useCallback, useEffect } from 'react';
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

  // 🎯 COMMENTS
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const addComment = (e) => {
    e.stopPropagation();
    if (!comment.trim()) return;
    setComments(prev => [...prev, comment]);
    setComment("");
  };

  // 🎯 SIMPLE SOUND FIX (no oscillator complexity)
  useEffect(() => {
    if (!isActive) return;

    const audio = new Audio('/click.mp3'); // small sound file (optional)
    audio.volume = muted ? 0 : 0.3;

    if (playing) {
      audio.play().catch(() => {});
    }

    return () => audio.pause();
  }, [playing, muted, isActive]);

  // Sync video muted property with React state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = muted;
    }
  }, [muted]);

  const handleTap = useCallback((e) => {
    // ❗ Ignore clicks inside comment box
    if (e.target.closest(".comment-box-area")) return;
    
    togglePlay();
  }, [togglePlay]);

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

      {/* 🔥 COMMENT BOX */}
      <div
        className="comment-box-area"
        style={{
          position: "absolute",
          bottom: "80px",
          left: "10px",
          right: "10px",
          zIndex: 9999,
          pointerEvents: "auto",
          color: "white"
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <div style={{ maxHeight: "100px", overflowY: "auto" }}>
          {comments.map((c, i) => (
            <p key={i} style={{ fontSize: "12px" }}>💬 {c}</p>
          ))}
        </div>

        <div style={{ display: "flex", marginTop: "5px" }} onClick={(e) => e.stopPropagation()}>
          <input
            type="text"
            placeholder="Add comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            style={{
              flex: 1,
              padding: "6px",
              borderRadius: "5px",
              border: "none"
            }}
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              addComment(e);
            }}
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