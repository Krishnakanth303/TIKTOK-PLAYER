import { useRef, useState, useCallback, useEffect } from 'react';
import { useVideoPlayer } from '../hooks/useVideoPlayer';
import ActionBar from './ActionBar';
import UserInfo from './UserInfo';
import MusicDisc from './MusicDisc';
import ProgressBar from './ProgressBar';
import styles from './VideoCard.module.css';

// Different note sequences per video
const NOTE_SETS = [
  [261.63, 329.63, 392.00, 523.25, 392.00, 329.63],
  [220.00, 261.63, 311.13, 369.99, 311.13, 261.63],
  [293.66, 349.23, 440.00, 587.33, 440.00, 349.23],
  [246.94, 293.66, 369.99, 493.88, 369.99, 293.66],
  [261.63, 311.13, 392.00, 523.25, 392.00, 311.13],
];

export default function VideoCard({ video, isActive }) {
  const videoRef = useRef(null);
  const { playing, progress, muted, showIcon, loading, togglePlay, toggleMute } = useVideoPlayer(videoRef, isActive);

  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const intervalRef = useRef(null);
  const stepRef = useRef(0);

  const [hearts, setHearts] = useState([]);
  const tapTimerRef = useRef(null);
  const tapCountRef = useRef(0);
  const longPressRef = useRef(null);
  const [longPressed, setLongPressed] = useState(false);

  // Start / stop generated lofi music
  useEffect(() => {
    if (isActive && playing) {
      // Create AudioContext lazily (requires user gesture)
      if (!audioCtxRef.current) {
        try {
          audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
          gainNodeRef.current = audioCtxRef.current.createGain();
          gainNodeRef.current.connect(audioCtxRef.current.destination);
        } catch (e) {
          return;
        }
      }

      const ctx = audioCtxRef.current;
      const gain = gainNodeRef.current;

      if (ctx.state === 'suspended') ctx.resume();
      gain.gain.setValueAtTime(muted ? 0 : 0.35, ctx.currentTime);

      const notes = NOTE_SETS[(video.id - 1) % NOTE_SETS.length];
      const BPM = 75;
      const interval = (60 / BPM) * 1000;

      const tick = () => {
        try {
          const freq = notes[stepRef.current % notes.length];
          const osc = ctx.createOscillator();
          const env = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          env.gain.setValueAtTime(0, ctx.currentTime);
          env.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.06);
          env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65);

          osc.connect(env);
          env.connect(gain);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.7);

          stepRef.current++;
        } catch (e) {}
      };

      tick();
      intervalRef.current = setInterval(tick, interval);
    } else {
      clearInterval(intervalRef.current);
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
      }
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, playing, video.id]);

  // Sync mute → gain volume
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(
        muted ? 0 : 0.35,
        audioCtxRef.current.currentTime
      );
    }
  }, [muted]);

  const handleTap = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    tapCountRef.current += 1;
    clearTimeout(tapTimerRef.current);

    tapTimerRef.current = setTimeout(() => {
      if (tapCountRef.current === 1) {
        togglePlay();
      } else if (tapCountRef.current >= 2) {
        const id = Date.now();
        setHearts(prev => [...prev, { id, x, y }]);
        setTimeout(() => setHearts(prev => prev.filter(h => h.id !== id)), 1000);
      }
      tapCountRef.current = 0;
    }, 250);
  }, [togglePlay]);

  const handlePressStart = useCallback(() => {
    longPressRef.current = setTimeout(() => {
      const video = videoRef.current;
      if (video && !video.paused) {
        video.pause();
        setLongPressed(true);
      }
    }, 500);
  }, []);

  const handlePressEnd = useCallback(() => {
    clearTimeout(longPressRef.current);
    if (longPressed) {
      videoRef.current?.play().catch(() => {});
      setLongPressed(false);
    }
  }, [longPressed]);

  return (
    <div className={styles.card}>
      {loading && <div className={styles.skeleton} />}

      <video
        ref={videoRef}
        className={styles.video}
        src={video.url}
        loop
        muted
        playsInline
        preload="auto"
      />

      <div
        className={styles.tapArea}
        onClick={handleTap}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
      />

      <div className={`${styles.playIcon} ${showIcon ? styles.visible : ''}`}>
        {playing ? '▶' : '⏸'}
      </div>

      <div className={styles.heartsLayer}>
        {hearts.map(h => (
          <div key={h.id} className={styles.heart} style={{ left: h.x, top: h.y }}>
            ❤️
          </div>
        ))}
      </div>

      <div className={styles.gradientTop} />
      <div className={styles.gradientBottom} />

      <ActionBar video={video} />
      <UserInfo video={video} />

      <button className={styles.soundBtn} onClick={toggleMute} title="Toggle Sound">
        {muted ? '🔇' : '🔊'}
      </button>

      <MusicDisc avatar={video.user.avatar} playing={playing} />
      <ProgressBar progress={progress} />
    </div>
  );
}
