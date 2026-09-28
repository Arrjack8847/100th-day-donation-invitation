"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./OpeningScene.module.css";

const INTRO_VIDEO =
  "/opening/Soap_bubbles_floating_upward_1080p_20260928174125.mp4";

const TRANSITION_VIDEO =
  "/opening/Bubbles_transition_for_baby_invitation_20260928174820.mp4";

const INVITATION_BACKGROUND_VIDEO =
  "/opening/invitation-background.mp4";

const COVERAGE_CANVAS_WIDTH = 48;
const COVERAGE_CANVAS_HEIGHT = 84;
const MIN_PEAK_TIME_SECONDS = 0.55;

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
  const peakCoverageRef = useRef(0);
  const peakCoverageTimeRef = useRef(0);
  const coverageCanvasRef = useRef<HTMLCanvasElement | null>(null);
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

  const measureCentralBubbleCoverage = (video: HTMLVideoElement) => {
    if (
      video.readyState < 2 ||
      video.videoWidth === 0 ||
      video.videoHeight === 0
    ) {
      return null;
    }

    try {
      let canvas = coverageCanvasRef.current;

      if (!canvas) {
        canvas = document.createElement("canvas");
        canvas.width = COVERAGE_CANVAS_WIDTH;
        canvas.height = COVERAGE_CANVAS_HEIGHT;
        coverageCanvasRef.current = canvas;
      }

      const context = canvas.getContext("2d", {
        alpha: false,
        willReadFrequently: true,
      });

      if (!context) return null;

      context.drawImage(
        video,
        0,
        0,
        COVERAGE_CANVAS_WIDTH,
        COVERAGE_CANVAS_HEIGHT,
      );

      const image = context.getImageData(
        0,
        0,
        COVERAGE_CANVAS_WIDTH,
        COVERAGE_CANVAS_HEIGHT,
      ).data;

      const left = Math.floor(COVERAGE_CANVAS_WIDTH * 0.16);
      const right = Math.ceil(COVERAGE_CANVAS_WIDTH * 0.84);
      const top = Math.floor(COVERAGE_CANVAS_HEIGHT * 0.14);
      const bottom = Math.ceil(COVERAGE_CANVAS_HEIGHT * 0.86);

      let brightnessTotal = 0;
      let brightPixels = 0;
      let pixelCount = 0;

      for (let y = top; y < bottom; y += 1) {
        for (let x = left; x < right; x += 1) {
          const index = (y * COVERAGE_CANVAS_WIDTH + x) * 4;
          const brightness = Math.max(
            image[index],
            image[index + 1],
            image[index + 2],
          );

          brightnessTotal += brightness / 255;
          if (brightness > 52) brightPixels += 1;
          pixelCount += 1;
        }
      }

      if (pixelCount === 0) return null;

      const averageBrightness = brightnessTotal / pixelCount;
      const brightPixelRatio = brightPixels / pixelCount;

      return averageBrightness * 0.58 + brightPixelRatio * 0.42;
    } catch {
      return null;
    }
  };

  const handleTransitionProgress = (
    event: React.SyntheticEvent<HTMLVideoElement>,
  ) => {
    const video = event.currentTarget;

    if (!Number.isFinite(video.duration) || video.duration <= 0) return;

    if (!mainRevealRef.current) {
      const coverage = measureCentralBubbleCoverage(video);

      if (coverage !== null) {
        if (coverage > peakCoverageRef.current) {
          peakCoverageRef.current = coverage;
          peakCoverageTimeRef.current = video.currentTime;
        }

        const peakWasStrongEnough = peakCoverageRef.current >= 0.045;
        const peakWasAfterTheOpeningBeat =
          peakCoverageTimeRef.current >= MIN_PEAK_TIME_SECONDS;
        const hasMovedPastPeak =
          video.currentTime - peakCoverageTimeRef.current >= 0.1;
        const hasStartedClearing =
          coverage <= peakCoverageRef.current * 0.9;

        if (
          peakWasStrongEnough &&
          peakWasAfterTheOpeningBeat &&
          hasMovedPastPeak &&
          hasStartedClearing
        ) {
          revealMainUnderlay();
        }
      }

      const safetySwapWindow = Math.min(0.72, video.duration * 0.16);
      if (video.duration - video.currentTime <= safetySwapWindow) {
        revealMainUnderlay();
      }
    }

    const fadeWindow = Math.min(0.3, video.duration * 0.12);
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
    peakCoverageRef.current = 0;
    peakCoverageTimeRef.current = 0;
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
