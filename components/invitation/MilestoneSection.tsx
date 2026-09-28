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
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
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
      void audio.play().catch(() => {
        // Some browsers can still block audio in unusual playback modes.
        // The visual interaction remains available.
      });
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setIsShaking(false);
    }, 620);
  };

  return (
    <section
      className={styles.section}
      data-reveal
      aria-label="Celebrating one hundred days"
    >
      <audio ref={audioRef} src={SOUND_SRC} preload="auto" />

      <div className={styles.paperGlow} aria-hidden="true" />

      <div className={styles.doodles} aria-hidden="true">
        <span className={styles.heartOne}>♡</span>
        <span className={styles.heartTwo}>♡</span>
        <span className={styles.sparkOne}>✦</span>
        <span className={styles.sparkTwo}>✦</span>
      </div>

      <div className={styles.inner}>
        <div className={styles.portraitGroup}>
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

            <img
              className={styles.bow}
              src="/ribbon%20bow.png"
              alt=""
              aria-hidden="true"
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

          <p
            className={`${styles.tapHint} ${hasPlayed ? styles.tapHintUsed : ""}`}
            aria-hidden="true"
          >
            tap for a little surprise ♡
          </p>
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
