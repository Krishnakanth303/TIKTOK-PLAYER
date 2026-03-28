import { useRef, useState, useEffect } from 'react';
import VideoCard from './VideoCard';
import styles from './VideoFeed.module.css';

export default function VideoFeed({ videos }) {
  const feedRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // ✅ Detect active video using IntersectionObserver
  useEffect(() => {
    const feed = feedRef.current;
    if (!feed) return;

    const cards = feed.querySelectorAll('[data-index]');
    if (!cards.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            const index = Number(entry.target.dataset.index);
            setActiveIndex(index);
          }
        });
      },
      {
        threshold: [0.6],
        root: feed,
      }
    );

    cards.forEach(card => observer.observe(card));

    return () => {
      cards.forEach(card => observer.unobserve(card));
      observer.disconnect();
    };
  }, [videos]);

  // ✅ Keyboard navigation (Up / Down arrows)
  useEffect(() => {
    const feed = feedRef.current;
    if (!feed) return;

    const scrollToIndex = (index) => {
      const card = feed.querySelector(`[data-index="${index}"]`);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth' });
      }
    };

    const handleKey = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(prev => {
          const next = (prev + 1) % videos.length;
          scrollToIndex(next);
          return next;
        });
      }

      if (e.key === 'ArrowUp') {
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

  // Comment section state
  const [openCommentIdx, setOpenCommentIdx] = useState(null);
  const [videoComments, setVideoComments] = useState(videos.map(() => []));

  const handleCommentClick = idx => setOpenCommentIdx(idx);
  const handleCloseComments = () => setOpenCommentIdx(null);
  const handleUpdateComments = (idx, comments) => {
    setVideoComments(prev => prev.map((c, i) => (i === idx ? comments : c)));
  };

  return (
    <div className={styles.feed} ref={feedRef}>
      {videos.map((video, i) => (
        <div key={video.id} className={styles.slide} data-index={i}>
          <VideoCard
            video={video}
            isActive={i === activeIndex}
            comments={videoComments[i]}
            setComments={comments => handleUpdateComments(i, comments)}
            showComments={openCommentIdx === i}
            onCommentClick={() => handleCommentClick(i)}
            onCloseComments={handleCloseComments}
          />
        </div>
      ))}
    </div>
  );
}