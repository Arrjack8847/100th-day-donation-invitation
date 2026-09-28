"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./OpeningScene.module.css";

const INTRO_VIDEO =
  "/opening/Soap_bubbles_floating_upward_1080p_20260928174125.mp4";

const TRANSITION_VIDEO =
  "/opening/Bubbles_transition_for_baby_invitation_20260928174820.mp4";

const INVITATION_BACKGROUND_VIDEO =
  "/opening/invitation-background.mp4";

const PAGE_SWAP_TIME_SECONDS = 0.95;

export default function OpeningScene() {
  const [leaving, setLeaving] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [introFading, setIntroFading] = useState(false);
  const [introHidden, setIntroHidden] = useState(false);
  const [invitationVisible, setInvitationVisible] = useState(false);
  const [transitionActive, setTransitionActive] = useState(false);
  const [transitionFading, setTransitionFading] = useState(false);
  const [mainRevealed, setMainRevealed] = useState(false);

  const openingStartedRef = useRef(false);
  const introFadeStartedRef = useRef(false);
  const transitionDoneRef = useRef(false);
  const mainRevealRef = useRef(false);
  const transitionVideoRef = useRef<HTMLVideoElement | null>(null);
  const introTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
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

  const revealMainUnderlay = () => {
    if (mainRevealRef.current) return;
    mainRevealRef.current = true;
    setMainRevealed(true);
  };

  const finishTransition = () => {
    if (transitionDoneRef.current) return;
    transitionDoneRef.current = true;

    revealMainUnderlay();

    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }

    setTransitionFading(true);

    exitTimerRef.current = setTimeout(() => {
      setHidden(true);
      document.body.classList.remove("intro-active");
      document.getElementById("invitation-content")?.scrollIntoView({
        block: "start",
        behavior: "auto",
      });
    }, 320);
  };

  const handleTransitionProgress = (
    event: React.SyntheticEvent<HTMLVideoElement>,
  ) => {
    const video = event.currentTarget;

    if (!Number.isFinite(video.duration) || video.duration <= 0) return;

    if (
      !mainRevealRef.current &&
      video.currentTime >= PAGE_SWAP_TIME_SECONDS
    ) {
      revealMainUnderlay();
    }

    const fadeWindow = Math.min(0.28, video.duration * 0.12);
    if (video.duration - video.currentTime <= fadeWindow) {
      setTransitionFading(true);
    }
  };

  const fallbackToSimpleExit = () => {
    setTransitionActive(false);
    setMainRevealed(false);
    setLeaving(true);

    exitTimerRef.current = setTimeout(() => {
      setHidden(true);
      document.body.classList.remove("intro-active");
      document.getElementById("invitation-content")?.scrollIntoView({
        block: "start",
        behavior: "auto",
      });
    }, 520);
  };

  const openInvitation = () => {
    if (openingStartedRef.current || !introHidden) return;
    openingStartedRef.current = true;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      fallbackToSimpleExit();
      return;
    }

    document.getElementById("invitation-content")?.scrollIntoView({
      block: "start",
      behavior: "auto",
    });

    transitionDoneRef.current = false;
    mainRevealRef.current = false;
    setMainRevealed(false);
    setTransitionFading(false);
    setTransitionActive(true);

    const video = transitionVideoRef.current;
    if (!video) {
      fallbackToSimpleExit();
      return;
    }

    video.currentTime = 0;

    void video.play().catch(() => {
      fallbackToSimpleExit();
    });

    const fallbackDuration =
      Number.isFinite(video.duration) && video.duration > 0
        ? Math.ceil((video.duration + 0.8) * 1000)
        : 8000;

    fallbackTimerRef.current = setTimeout(() => {
      finishTransition();
    }, fallbackDuration);
  };

  if (hidden) return null;

  return (
    <section
      className={`${styles.opening} ${leaving ? styles.leaving : ""} ${
        transitionActive ? styles.transitioning : ""
      } ${mainRevealed ? styles.mainRevealed : ""}`}
      aria-label="100 Days of Love opening"
    >
      <div
        className={`${styles.invitationBackground} ${
          invitationVisible ? styles.invitationBackgroundVisible : ""
        }`}
        aria-hidden="true"
      >
        <video
          className={styles.invitationBackgroundVideo}
          src={INVITATION_BACKGROUND_VIDEO}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        <div className={styles.invitationBackgroundVeil} />
      </div>

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

      <div
        className={`${styles.transitionVideoLayer} ${
          transitionActive ? styles.transitionVideoLayerActive : ""
        } ${transitionFading ? styles.transitionVideoLayerFading : ""}`}
        aria-hidden="true"
      >
        <video
          ref={transitionVideoRef}
          className={styles.transitionVideo}
          src={TRANSITION_VIDEO}
          muted
          playsInline
          preload="auto"
          onTimeUpdate={handleTransitionProgress}
          onEnded={finishTransition}
          onError={fallbackToSimpleExit}
        />
      </div>
    </section>
  );
}
