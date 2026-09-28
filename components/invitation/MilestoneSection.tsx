import styles from "./MilestoneSection.module.css";

export default function MilestoneSection() {
  return (
    <section
      className={styles.section}
      data-reveal
      aria-label="Celebrating one hundred days"
    >
      <div className={styles.paperGlow} aria-hidden="true" />

      <div className={styles.doodles} aria-hidden="true">
        <span className={styles.heartOne}>♡</span>
        <span className={styles.heartTwo}>♡</span>
        <span className={styles.sparkOne}>✦</span>
        <span className={styles.sparkTwo}>✦</span>
      </div>

      <div className={styles.inner}>
        <div className={styles.portraitGroup}>
          <img
            className={styles.portrait}
            src="/photo_2026-09-28_14-18-19-Photoroom.png"
            alt="Our little one celebrating 100 days"
            loading="lazy"
            decoding="async"
          />

          <img
            className={styles.bow}
            src="/ribbon%20bow.png"
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className={styles.message}>
          <img
            className={styles.textArtwork}
            src="/text.png"
            alt="A 100-day celebration message"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className={styles.bannerWrap} aria-hidden="true">
          <img
            className={styles.banner}
            src="/banner.png"
            alt=""
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
}
