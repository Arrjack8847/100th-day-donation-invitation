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
        behavior: "smooth",
      });
    }, 620);
  };

  if (hidden) return null;

  return (
    <section
      className={`${styles.opening} ${leaving ? styles.leaving : ""}`}
      aria-label="100 Days of Love opening"
    >
      <div className={styles.atmosphere} aria-hidden="true">
        <span className={`${styles.bubble} ${styles.bubbleOne}`} />
        <span className={`${styles.bubble} ${styles.bubbleTwo}`} />
        <span className={`${styles.bubble} ${styles.bubbleThree}`} />
        <span className={`${styles.bubble} ${styles.bubbleFour}`} />
      </div>

      <div className={styles.content}>
        <header className={styles.intro}>
          <p className={styles.eyebrow}>WITH LOVE &amp; GRATITUDE</p>
          <div className={styles.ornament} aria-hidden="true">
            <span />
            <b>♥</b>
            <span />
          </div>

          <h1 className={styles.title}>
            <span className={styles.number}>100</span>
            <span className={styles.days}>Days of Love</span>
          </h1>
        </header>

        <figure className={styles.photoFrame}>
          <img
            src="/child's photo/01-100-days-baby-portrait.jpg"
            alt="Our little one at 100 days"
          />
        </figure>

        <p className={styles.subtitle}>
          Join us for our little one&rsquo;s 100th-day
          <br className={styles.subtitleBreak} />
          donation ceremony.
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
          aria-label="View the invitation"
        >
          <span>View invitation</span>
          <svg
            className={styles.arrow}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 4v15m0 0-6-6m6 6 6-6" />
          </svg>
        </a>

        <div className={styles.continuationMark} aria-hidden="true">
          <span />
          <b />
        </div>
      </div>
    </section>
  );
}
