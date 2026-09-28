"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./MilestoneSection.module.css";
import { SectionDecor } from "../decor/SiteDecor";

export default function MilestoneSection() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isReacting, setIsReacting] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const playSurprise = () => {
    if (isReacting) return;

    setIsReacting(true);
    setHasInteracted(true);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIsReacting(false), 900);
  };

  return (
    <section
      className={styles.section}
      data-reveal
      aria-labelledby="milestone-title"
    >
      <div className={styles.paperGlow} aria-hidden="true" />
      <SectionDecor variant="milestone" />

      <div className={styles.inner}>
        <header className={styles.heading}>
          <p className={styles.eyebrow}>OUR FIRST 100 DAYS</p>

          <div className={styles.ornament} aria-hidden="true">
            <span />
            <b>♡</b>
            <span />
          </div>

          <h2 id="milestone-title">
            One little milestone,
            <em>so much love.</em>
          </h2>
        </header>

        <div className={styles.portraitStage}>
          <span className={styles.peachWash} aria-hidden="true" />
          <span className={styles.sageWash} aria-hidden="true" />

          <button
            type="button"
            className={`${styles.portraitButton} ${isReacting ? styles.isReacting : ""}`}
            onClick={playSurprise}
            aria-label="Tap our little one for a tiny celebration"
          >
            <span className={styles.portraitHalo} aria-hidden="true" />

            <img
              className={styles.portrait}
              src="/photo_2026-09-28_14-18-19-Photoroom.png"
              alt="Our little one celebrating the first 100 days"
              loading="lazy"
              decoding="async"
              draggable={false}
            />

            <span
              className={`${styles.heartPop} ${isReacting ? styles.heartPopActive : ""}`}
              aria-hidden="true"
            >
              ♡
            </span>

            <span
              className={`${styles.sparklePop} ${isReacting ? styles.sparklePopActive : ""}`}
              aria-hidden="true"
            >
              ✦
            </span>
          </button>

          <span className={styles.doodleHeart} aria-hidden="true">♡</span>
          <span className={styles.doodleSparkle} aria-hidden="true">✧</span>
        </div>

        <p className={styles.tapHint} aria-live="polite">
          {hasInteracted
            ? "a little love for you ♡"
            : "tap for a tiny celebration ♡"}
        </p>

        <div className={styles.story}>
          <p>
            A hundred days of sleepy cuddles, tiny smiles, and little moments
            we never want to forget.
          </p>

          <div className={styles.memoryLine} aria-hidden="true">
            <span>100 days</span>
            <b>♡</b>
            <span>countless cuddles</span>
            <b>♡</b>
            <span>endless love</span>
          </div>
        </div>
      </div>
    </section>
  );
}
