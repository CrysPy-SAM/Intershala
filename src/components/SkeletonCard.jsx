import styles from './SkeletonCard.module.css';

function Skel({ w, h, radius }) {
  return (
    <div
      className={styles.skel}
      style={{ width: w, height: h, borderRadius: radius ?? 6 }}
    />
  );
}

export default function SkeletonCard() {
  return (
    <div className={styles.card}>
      <div className={styles.topRow}>
        <Skel w={90} h={22} radius={99} />
        <Skel w={24} h={24} radius={6} />
      </div>
      <div className={styles.identity}>
        <Skel w={48} h={48} radius={10} />
        <div className={styles.textBlock}>
          <Skel w="70%" h={16} />
          <Skel w="45%" h={13} />
        </div>
      </div>
      <Skel w={90} h={22} radius={99} />
      <div className={styles.grid}>
        <Skel w="80%" h={13} />
        <Skel w="60%" h={13} />
        <Skel w="70%" h={13} />
        <Skel w="75%" h={13} />
      </div>
      <div className={styles.footer}>
        <Skel w={80} h={12} />
        <Skel w={90} h={32} radius={8} />
      </div>
    </div>
  );
}
