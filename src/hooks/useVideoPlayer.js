import { useRef, useState, useEffect, useCallback } from 'react';

export function useVideoPlayer(videoRef, isActive) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [muted, setMuted] = useState(false); // unmuted by default
  const [showIcon, setShowIcon] = useState(false);
  const [loading, setLoading] = useState(true);
  const iconTimerRef = useRef(null);

  // Event listeners for video state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Clear skeleton if already ready
    if (video.readyState >= 3) setLoading(false);

    const onCanPlay = () => setLoading(false);
    const onWaiting = () => setLoading(true);
    const onPlaying = () => { setLoading(false); setPlaying(true); };
    const onPause = () => setPlaying(false);
    const onTimeUpdate = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    video.addEventListener('canplay', onCanPlay);
    video.addEventListener('waiting', onWaiting);
    video.addEventListener('playing', onPlaying);
    video.addEventListener('pause', onPause);
    video.addEventListener('timeupdate', onTimeUpdate);

    return () => {
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('waiting', onWaiting);
      video.removeEventListener('playing', onPlaying);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('timeupdate', onTimeUpdate);
    };
  }, [videoRef]);

  // Auto play/pause when active changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      // Must start muted for autoplay, then unmute after play starts
      video.muted = true;
      const timer = setTimeout(() => {
        video.play()
          .then(() => {
            // Unmute after autoplay succeeds
            video.muted = false;
            setMuted(false);
            setPlaying(true);
          })
          .catch(() => {
            // Autoplay blocked even muted - keep muted and try again
            video.muted = true;
            setMuted(true);
          });
      }, 80);
      return () => clearTimeout(timer);
    } else {
      video.pause();
      video.currentTime = 0;
      video.muted = true;
      setPlaying(false);
      setProgress(0);
    }
  }, [isActive, videoRef]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }

    setShowIcon(true);
    clearTimeout(iconTimerRef.current);
    iconTimerRef.current = setTimeout(() => setShowIcon(false), 900);
  }, [videoRef]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const newMuted = !video.muted;
    video.muted = newMuted;
    setMuted(newMuted);
  }, [videoRef]);

  return { playing, progress, muted, showIcon, loading, togglePlay, toggleMute };
}
