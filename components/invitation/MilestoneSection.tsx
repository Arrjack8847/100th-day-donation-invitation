"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./MilestoneSection.module.css";

const SOUND_SRC = "/mu-hehehehe-cat-memes-hehe-shorts_v8KezVEr.mp3";

export default function MilestoneSection() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const playSurprise = () => {
    if (isShaking) return;

    setIsShaking(true);
    setHasPlayed(true);

    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio.volume = 0.62;
      void audio.play().catch(() => {});
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIsShaking(false), 650);
  };

  return (
    <section
      className={styles.section}
      data-reveal
      aria-label="Celebrating one hundred days"
    >
      <audio ref={audioRef} src={SOUND_SRC} preload="auto" />
      <div className={styles.paperGlow} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.portraitStage}>
          <div
            className={`${styles.assetDoodles} ${isShaking ? styles.assetDoodlesReacting : ""}`}
            aria-hidden="true"
          >
            <img
              className={`${styles.doodleAsset} ${styles.sparkleLeft}`}
              src="/decor/sparkle-doodle.png"
              alt=""
              draggable={false}
            />
            <img
              className={`${styles.doodleAsset} ${styles.sparkleRight}`}
              src="/decor/sparkle-doodle.png"
              alt=""
              draggable={false}
            />
            <img
              className={`${styles.doodleAsset} ${styles.heartLeft}`}
              src="/decor/heart-doodle.png"
              alt=""
              draggable={false}
            />
            <img
              className={`${styles.doodleAsset} ${styles.heartRight}`}
              src="/decor/heart-doodle.png"
              alt=""
              draggable={false}
            />
            <img
              className={`${styles.doodleAsset} ${styles.swirl}`}
              src="/decor/swirl-line.svg"
              alt=""
              draggable={false}
            />
          </div>

          <button
            type="button"
            className={`${styles.portraitButton} ${isShaking ? styles.isShaking : ""}`}
            onClick={playSurprise}
            aria-label="Tap the baby for a little surprise"
          >
            <img
              className={styles.portrait}
              src="/photo_2026-09-28_14-18-19-Photoroom.png"
              alt="Our little one celebrating 100 days"
              loading="lazy"
              decoding="async"
              draggable={false}
            />
            <span
              className={`${styles.tapHeart} ${isShaking ? styles.tapHeartActive : ""}`}
              aria-hidden="true"
            >
              ♡
            </span>
          </button>

          <svg
            className={styles.lineBow}
            viewBox="0 0 150 54"
            aria-hidden="true"
          >
            <path d="M75 17C60 1 35 2 30 14c-5 12 18 17 45 7" />
            <path d="M75 17c15-16 40-15 45-3 5 12-18 17-45 7" />
            <path d="M75 21c-7 11-14 19-24 27" />
            <path d="M75 21c7 11 14 19 24 27" />
            <circle cx="75" cy="19" r="3.5" />
          </svg>
        </div>

        <p
          className={`${styles.tapHint} ${hasPlayed ? styles.tapHintUsed : ""}`}
          aria-hidden="true"
        >
          tap for a little surprise ♡
        </p>

        <div className={styles.message}>
          <img
            className={styles.textArtwork}
            src="/text.png"
            alt="100 Days of Love"
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
