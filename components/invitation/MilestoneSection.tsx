"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./MilestoneSection.module.css";
import { SectionDecor, SectionDivider } from "../decor/SiteDecor";

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
      data-motion-section="milestone"
    >
      <audio ref={audioRef} src={SOUND_SRC} preload="auto" />
      <div className={styles.paperGlow} aria-hidden="true" />
      <SectionDecor variant="milestone" />

      <div className={styles.inner}>
        <div className={styles.portraitStage} data-motion-role="milestone-portrait">
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

          <div
            className={`${styles.assetDoodles} ${isShaking ? styles.assetDoodlesReacting : ""}`}
            aria-hidden="true"
          >
            <img
              className={`${styles.doodleAsset} ${styles.sparkleLeft}`}
              src="/sparkle-doodle.png"
              alt=""
              loading="lazy"
              decoding="async"
              draggable={false}
            />
            <img
              className={`${styles.doodleAsset} ${styles.sparkleRight}`}
              src="/sparkle-doodle.png"
              alt=""
              loading="lazy"
              decoding="async"
              draggable={false}
            />
            <img
              className={`${styles.doodleAsset} ${styles.heartLeft}`}
              src="/components/heart-doodle.png"
              alt=""
              loading="lazy"
              decoding="async"
              draggable={false}
            />
            <img
              className={`${styles.doodleAsset} ${styles.heartRight}`}
              src="/components/heart-doodle.png"
              alt=""
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          </div>
        </div>

        <p
          className={`${styles.tapHint} ${hasPlayed ? styles.tapHintUsed : ""}`}
          aria-hidden="true"
        >
          tap for a little surprise ♡
        </p>

        <div className={styles.message} data-motion-role="milestone-message">
          <img
            className={styles.textArtwork}
            src="/text.png"
            alt="100 Days of Love"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div data-motion-role="milestone-divider"><SectionDivider variant="simple" /></div>

        <div className={styles.bannerWrap} data-motion-role="milestone-banner" aria-hidden="true">
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
