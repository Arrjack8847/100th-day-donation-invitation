"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./OpeningScene.module.css";

export default function OpeningScene() {
  const [leaving, setLeaving] = useState(false);
  const [hidden, setHidden] = useState(false);
  const openingStartedRef = useRef(false);

  useEffect(() => {
    document.body.classList.add("intro-active");
    return () => document.body.classList.remove("intro-active");
  }, []);

  const openInvitation = () => {
    if (openingStartedRef.current) return;
    openingStartedRef.current = true;

    setLeaving(true);

    window.setTimeout(() => {
      setHidden(true);
      document.body.classList.remove("intro-active");
      document.getElementById("invitation-content")?.scrollIntoView({
        block: "start",
      });
    }, 620);
  };

  if (hidden) return null;

  return (
    <section
      className={`${styles.opening} ${leaving ? styles.leaving : ""}`}
      aria-label="100 Days of Love opening"
    >
      <div className={styles.content}>
        <p className={styles.eyebrow}>WITH LOVE &amp; GRATITUDE</p>

        <div className={styles.hero}>
          <div className={styles.photoMask} aria-hidden="true">
            <div className={`${styles.photoSlice} ${styles.photoOne}`} />
            <div className={`${styles.photoSlice} ${styles.photoTwo}`} />
            <div className={`${styles.photoSlice} ${styles.photoThree}`} />
          </div>

          <h1 className={styles.scriptTitle}>
            <span className={styles.srOnly}>100 </span>
            Days of Love
          </h1>
        </div>

        <p className={styles.subtitle}>
          A little life. A hundred beautiful days.
        </p>

        <a
          className={styles.openButton}
          href="#invitation-content"
          onClick={(event) => {
            event.preventDefault();
            openInvitation();
          }}
          onPointerUp={(event) => {
            if (event.pointerType !== "touch") return;
            event.preventDefault();
            openInvitation();
          }}
          aria-label="Open the invitation"
        >
          <span>Open Invitation</span>
          <span className={styles.arrow} aria-hidden="true">→</span>
        </a>

        <div className={styles.divider} aria-hidden="true">
          <span />
          <b>♥</b>
          <span />
        </div>
      </div>
    </section>
  );
}
