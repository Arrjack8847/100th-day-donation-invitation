"use client";

import styles from "./MeaningSection.module.css";

function SunriseIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M6 22h20M10 22a6 6 0 0 1 12 0M16 6v5M6.5 11.5l3.4 3.4M25.5 11.5l-3.4 3.4" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M16 26.2 7.6 18C2.7 13.4 9.9 5.2 16 11.6 22.1 5.2 29.3 13.4 24.4 18Z" />
    </svg>
  );
}

function RainbowIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M5 24a11 11 0 0 1 22 0M9 24a7 7 0 0 1 14 0" />
    </svg>
  );
}

export default function MeaningSection() {
  return (
    <section className={styles.section} aria-labelledby="meaning-title">
      <div className={styles.paperTexture} aria-hidden="true" />
      <span className={styles.watermark} aria-hidden="true">100</span>

      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.eyebrow} data-reveal>ABOUT THIS DAY</p>

          <div className={styles.ornament} data-reveal aria-hidden="true">
            <span />
            <b>♡</b>
            <span />
          </div>

          <h2 id="meaning-title" className={styles.title} data-reveal>
            <span>A Meaningful</span>
            <span>100 Days <em>♡</em></span>
          </h2>

          <p className={styles.intro} data-reveal>
            These first one hundred days have been filled with tiny moments,
            warm embraces and so much love. We are grateful to mark this
            milestone by sharing our joy and making a donation in our
            child&apos;s name.
          </p>

          <p className={styles.scriptLine} data-reveal>
            A little one, a big blessing ♡
          </p>
        </header>

        <div className={styles.photoStage}>
          <img
            className={[styles.doodle, styles.sparkles].join(" ")}
            src="/decor/sparkle-doodle.png"
            alt=""
            aria-hidden="true"
            loading="lazy"
            draggable={false}
          />
          <img
            className={[styles.doodle, styles.heartLeft].join(" ")}
            src="/decor/heart-doodle.png"
            alt=""
            aria-hidden="true"
            loading="lazy"
            draggable={false}
          />

          <div className={styles.photoPaper} data-reveal>
            <span className={styles.tape} aria-hidden="true">♡</span>
            <img
              className={styles.babyPhoto}
              src="/child's photo/05-sleeping-newborn-closeup.jpg"
              alt="Our little one sleeping peacefully during the first 100 days"
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          </div>

          <aside className={styles.loveNote} data-reveal aria-label="A note for our little one">
            <svg className={styles.noteArrow} viewBox="0 0 80 70" aria-hidden="true">
              <path d="M72 9C46 13 28 28 25 49M25 49l-8-9M25 49l8-8" />
            </svg>
            <span>Our little one,</span>
            <span>a big blessing</span>
            <b>♡</b>
          </aside>

          <span className={styles.smallHeart} aria-hidden="true">♡</span>

          <img
            className={[styles.doodle, styles.swirl].join(" ")}
            src="/decor/swirl-line.svg"
            alt=""
            aria-hidden="true"
            loading="lazy"
            draggable={false}
          />
        </div>

        <div className={styles.feelings} data-reveal aria-label="What these 100 days mean to us">
          <div className={styles.feeling}>
            <SunriseIcon />
            <span>Tiny moments</span>
          </div>
          <div className={styles.feeling}>
            <HeartIcon />
            <span>Warm embraces</span>
          </div>
          <div className={styles.feeling}>
            <RainbowIcon />
            <span>So much love</span>
          </div>
        </div>

        <div className={styles.closingOrnament} data-reveal aria-hidden="true">
          <span />
          <b>♡</b>
          <span />
        </div>
      </div>
    </section>
  );
}
