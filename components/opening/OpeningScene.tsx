"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./OpeningScene.module.css";

const INTRO_VIDEO =
  "/opening/Soap_bubbles_floating_upward_1080p_20260928174125.mp4";

export default function OpeningScene() {
  const [leaving, setLeaving] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [introFading, setIntroFading] = useState(false);
  const [introHidden, setIntroHidden] = useState(false);
  const [invitationVisible, setInvitationVisible] = useState(false);

  const openingStartedRef = useRef(false);
  const introFadeStartedRef = useRef(false);
  const introTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    document.body.classList.add("intro-active");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      introFadeStartedRef.current = true;
      setIntroHidden(true);
      setInvitationVisible(true);
    }

    return () => {
      document.body.classList.remove("intro-active");
      if (introTimerRef.current) clearTimeout(introTimerRef.current);
    };
  }, []);

  const revealInvitation = () => {
    if (introFadeStartedRef.current) return;

    introFadeStartedRef.current = true;
    setInvitationVisible(true);
    setIntroFading(true);

    introTimerRef.current = setTimeout(() => {
      setIntroHidden(true);
    }, 720);
  };

  const handleIntroProgress = (
    event: React.SyntheticEvent<HTMLVideoElement>,
  ) => {
    const video = event.currentTarget;

    if (
      Number.isFinite(video.duration) &&
      video.duration > 0 &&
      video.duration - video.currentTime <= 0.78
    ) {
      revealInvitation();
    }
  };

  const openInvitation = () => {
    if (openingStartedRef.current || !introHidden) return;
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
      {!introHidden && (
        <div
          className={`${styles.videoIntro} ${
            introFading ? styles.videoIntroFading : ""
          }`}
          aria-hidden="true"
        >
          <video
            className={styles.introVideo}
            src={INTRO_VIDEO}
            autoPlay
            muted
            playsInline
            preload="auto"
            onTimeUpdate={handleIntroProgress}
            onEnded={revealInvitation}
            onError={revealInvitation}
          />
          <div className={styles.videoVeil} />
        </div>
      )}

      <div
        className={`${styles.content} ${
          invitationVisible ? styles.contentReady : ""
        }`}
      >
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
