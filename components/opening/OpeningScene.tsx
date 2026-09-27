"use client";

import { useEffect, useState } from "react";
import styles from "./OpeningScene.module.css";

export default function OpeningScene() {
  const [leaving, setLeaving] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    document.body.classList.add("intro-active");
    return () => document.body.classList.remove("intro-active");
  }, []);

  const openInvitation = () => {
    if (leaving) return;

    setLeaving(true);

    window.setTimeout(() => {
      setHidden(true);
      document.body.classList.remove("intro-active");
      document.getElementById("invitation-content")?.scrollIntoView({
        block: "start",
      });
    }, 680);
  };

  if (hidden) return null;

  return (
    <section
      className={`${styles.opening} ${leaving ? styles.leaving : ""}`}
      aria-label="100 Days of Love opening"
    >
      <div className={styles.paperTexture} aria-hidden="true" />

      <div className={styles.content}>
        <p className={styles.eyebrow}>WITH LOVE &amp; GRATITUDE</p>

        <div className={styles.heroTitle}>
          <div className={styles.numberWrap} aria-hidden="true">
            <span className={`${styles.photoDigit} ${styles.digitOne}`}>1</span>
            <span className={`${styles.photoDigit} ${styles.digitZeroOne}`}>0</span>
            <span className={`${styles.photoDigit} ${styles.digitZeroTwo}`}>0</span>
          </div>

          <span className={styles.srOnly}>100</span>
          <h1>Days of Love</h1>
        </div>

        <p className={styles.subtitle}>
          A little life. A hundred beautiful days.
        </p>

        <button
          className={styles.openButton}
          type="button"
          onClick={openInvitation}
          aria-label="Open the invitation"
        >
          <span>Open Invitation</span>
          <span className={styles.arrow} aria-hidden="true">→</span>
        </button>

        <div className={styles.divider} aria-hidden="true">
          <span />
          <b>♥</b>
          <span />
        </div>
      </div>
    </section>
  );
}
