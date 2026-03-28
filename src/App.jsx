import { useState } from 'react';
import VideoFeed from './components/VideoFeed';
import TopBar from './components/TopBar';
import videos from './data/videos';
import styles from './App.module.css';

export default function App() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className={`${styles.app} ${darkMode ? styles.dark : styles.light}`}>
      <TopBar darkMode={darkMode} onToggleDark={() => setDarkMode(p => !p)} />
      <VideoFeed videos={videos} />
    </div>
  );
}
