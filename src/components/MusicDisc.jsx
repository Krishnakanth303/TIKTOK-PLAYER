import styles from './MusicDisc.module.css';

export default function MusicDisc({ avatar, playing }) {
  return (
    <div className={`${styles.disc} ${playing ? styles.spinning : ''}`}>
      <img src={avatar} alt="music" className={styles.img} />
      <div className={styles.center} />
    </div>
  );
}
