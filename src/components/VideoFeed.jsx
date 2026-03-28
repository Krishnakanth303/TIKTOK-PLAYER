import { useRef, useState, useEffect, useCallback } from 'react';
import VideoCard from './VideoCard';
import styles from './VideoFeed.module.css';

export default function VideoFeed({ videos }) {
  const feedRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // IntersectionObserver to detect which video is fully in view
  useEffect(() => {
    const feed = feedRef.current;
    if (!feed) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            const index = parseInt(entry.target.dataset.index, 10);
            setActiveIndex(index);
          }
        });
      },
      { threshold: 0.6, root: feed }
    );

    const cards = feed.querySelectorAll('[data-index]');
    cards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, [videos]);

  // Keyboard navigation
  useEffect(() => {
    const scrollToIndex = (index) => {
      const feed = feedRef.current;
      if (!feed) return;
      const card = feed.querySelector(`[data-index="${index}"]`);
      if (card) card.scrollIntoView({ behavior: 'smooth' });
    };

    const handleKey = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(prev => {
          const next = (prev + 1) % videos.length;
          scrollToIndex(next);
          return next;
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(prev => {
          const next = (prev - 1 + videos.length) % videos.length;
          scrollToIndex(next);
          return next;
        });
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [videos.length]);

  return (
    <div className={styles.feed} ref={feedRef}>
      {videos.map((video, i) => (
        <div key={video.id} className={styles.slide} data-index={i}>
          <VideoCard video={video} isActive={i === activeIndex} />
        </div>
      ))}
    </div>
  );
}
