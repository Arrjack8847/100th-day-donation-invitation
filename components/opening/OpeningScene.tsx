"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal, flushSync } from "react-dom";
import styles from "./OpeningScene.module.css";
import { SectionDecor } from "../decor/SiteDecor";

const INTRO_VIDEO =
  "/opening/Soap_bubbles_floating_upward_1080p_20260928174125.mp4";

const TRANSITION_VIDEO =
  "/opening/Bubbles_transition_for_baby_invitation_20260928174820.mp4";

const INVITATION_BACKGROUND_VIDEO =
  "/opening/invitation-background.mp4";

// Peak center coverage in the transition storyboard is 0.8–1.1s.
const PEAK_COVERAGE_SWAP_SECONDS = 0.95;
const TRANSITION_FADE_SECONDS = 0.18;
const TRANSITION_CLEANUP_MS = 220;
const INTRO_HANDOFF_SECONDS = 0.68;
const INTRO_FADE_MS = 680;
const CONTENT_REVEAL_DELAY_MS = 620;
const BACKDROP_READY_FALLBACK_MS = 500;

type ZeroPhotoKey = "one" | "left" | "right";

type ZeroPhotoLayout = {
  x: number;
  y: number;
  zoom: number;
};

type ZeroPhotoLayouts = Record<ZeroPhotoKey, ZeroPhotoLayout>;

const ZERO_PHOTO_STORAGE_KEY = "opening-100-photo-layout-v1";

const DEFAULT_ZERO_PHOTOS: ZeroPhotoLayouts = {
  one: { x: 50, y: 50, zoom: 1 },
  left: { x: 50, y: 40, zoom: 1 },
  right: { x: 50, y: 38, zoom: 1 },
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export default function OpeningScene() {
  const [leaving, setLeaving] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [introFading, setIntroFading] = useState(false);
  const [introHidden, setIntroHidden] = useState(false);
  const [invitationBackgroundVisible, setInvitationBackgroundVisible] =
    useState(false);
  const [invitationContentVisible, setInvitationContentVisible] =
    useState(false);
  const [transitionActive, setTransitionActive] = useState(false);
  const [transitionFading, setTransitionFading] = useState(false);
  const [transitionFrameReady, setTransitionFrameReady] = useState(false);
  const [mainRevealed, setMainRevealed] = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  const [editHundredPhotos, setEditHundredPhotos] = useState(false);
  const [selectedZero, setSelectedZero] = useState<ZeroPhotoKey>("one");
  const [zeroPhotos, setZeroPhotos] =
    useState<ZeroPhotoLayouts>(DEFAULT_ZERO_PHOTOS);
  const [copiedZeroLayout, setCopiedZeroLayout] = useState(false);

  const openingStartedRef = useRef(false);
  const introFadeStartedRef = useRef(false);
  const visualHandoffStartedRef = useRef(false);
  const transitionDoneRef = useRef(false);
  const mainRevealRef = useRef(false);
  const transitionFrameReadyRef = useRef(false);
  const transitionMediaReadyRef = useRef(false);
  const transitionVideoRef = useRef<HTMLVideoElement | null>(null);
  const invitationBackgroundVideoRef = useRef<HTMLVideoElement | null>(null);
  const introTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const backdropReadyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frameCallbackRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const cancelTransitionFrameTracking = () => {
    const video = transitionVideoRef.current;

    if (
      video &&
      frameCallbackRef.current !== null &&
      typeof video.cancelVideoFrameCallback === "function"
    ) {
      video.cancelVideoFrameCallback(frameCallbackRef.current);
    }

    frameCallbackRef.current = null;

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  useEffect(() => {
    setPortalReady(true);
    document.documentElement.classList.add("intro-active");
    document.body.classList.add("intro-active");

    const editMode =
      new URLSearchParams(window.location.search).get("edit100") === "1";

    if (editMode) {
      setEditHundredPhotos(true);
      introFadeStartedRef.current = true;
      visualHandoffStartedRef.current = true;
      setIntroHidden(true);
      setInvitationBackgroundVisible(true);
      setInvitationContentVisible(true);

      try {
        const saved = window.localStorage.getItem(ZERO_PHOTO_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as Partial<ZeroPhotoLayouts>;
          setZeroPhotos({
            one: {
              x: clamp(Number(parsed.one?.x ?? DEFAULT_ZERO_PHOTOS.one.x), 0, 100),
              y: clamp(Number(parsed.one?.y ?? DEFAULT_ZERO_PHOTOS.one.y), 0, 100),
              zoom: clamp(
                Number(parsed.one?.zoom ?? DEFAULT_ZERO_PHOTOS.one.zoom),
                1,
                3,
              ),
            },
            left: {
              x: clamp(Number(parsed.left?.x ?? DEFAULT_ZERO_PHOTOS.left.x), 0, 100),
              y: clamp(Number(parsed.left?.y ?? DEFAULT_ZERO_PHOTOS.left.y), 0, 100),
              zoom: clamp(
                Number(parsed.left?.zoom ?? DEFAULT_ZERO_PHOTOS.left.zoom),
                1,
                3,
              ),
            },
            right: {
              x: clamp(Number(parsed.right?.x ?? DEFAULT_ZERO_PHOTOS.right.x), 0, 100),
              y: clamp(Number(parsed.right?.y ?? DEFAULT_ZERO_PHOTOS.right.y), 0, 100),
              zoom: clamp(
                Number(parsed.right?.zoom ?? DEFAULT_ZERO_PHOTOS.right.zoom),
                1,
                3,
              ),
            },
          });
        }
      } catch {
        setZeroPhotos(DEFAULT_ZERO_PHOTOS);
      }
    } else if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      introFadeStartedRef.current = true;
      setIntroHidden(true);
      setInvitationBackgroundVisible(true);
      setInvitationContentVisible(true);
    }

    return () => {
      document.documentElement.classList.remove("intro-active");
      document.body.classList.remove("intro-active");
      if (introTimerRef.current) clearTimeout(introTimerRef.current);
      if (contentTimerRef.current) clearTimeout(contentTimerRef.current);
      if (backdropReadyTimerRef.current) clearTimeout(backdropReadyTimerRef.current);
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
      cancelTransitionFrameTracking();
    };
  }, []);

  useEffect(() => {
    if (!portalReady) return;

    const video = transitionVideoRef.current;

    if (video) {
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        transitionMediaReadyRef.current = true;
        video.pause();

        try {
          video.currentTime = 0;
        } catch {
          // Safari can briefly reject a seek while metadata settles.
        }
      } else {
        // Ask mobile Safari to start fetching/decoding before the user taps.
        video.load();
      }
    }

    // The destination is already mounted behind the opening. Decode its hero
    // image now so the hidden page swap never reveals a late image paint.
    const heroImage = document.querySelector<HTMLImageElement>(
      "#invitation-content .hero-photo-blob img",
    );

    if (heroImage && typeof heroImage.decode === "function") {
      void heroImage.decode().catch(() => {});
    }

    if (document.fonts?.ready) {
      void document.fonts.ready.then(() => {
        document
          .getElementById("invitation-content")
          ?.getBoundingClientRect();
      });
    }
  }, [portalReady]);

  const primeTransitionMedia = (video: HTMLVideoElement) => {
    if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;

    transitionMediaReadyRef.current = true;

    if (openingStartedRef.current) return;

    video.pause();
    try {
      video.currentTime = 0;
    } catch {
      // The default first frame is still safe if an early Safari seek fails.
    }
  };

  const markTransitionFrameReady = () => {
    if (transitionFrameReadyRef.current) return;

    transitionFrameReadyRef.current = true;
    flushSync(() => {
      setTransitionFrameReady(true);
    });
  };

  const completeIntroHandoff = () => {
    if (visualHandoffStartedRef.current) return;
    visualHandoffStartedRef.current = true;

    if (backdropReadyTimerRef.current) {
      clearTimeout(backdropReadyTimerRef.current);
      backdropReadyTimerRef.current = null;
    }

    setInvitationBackgroundVisible(true);
    setIntroFading(true);

    introTimerRef.current = setTimeout(() => {
      setIntroHidden(true);
    }, INTRO_FADE_MS);

    contentTimerRef.current = setTimeout(() => {
      setInvitationContentVisible(true);
    }, CONTENT_REVEAL_DELAY_MS);
  };

  const revealInvitation = () => {
    if (introFadeStartedRef.current) return;

    introFadeStartedRef.current = true;

    const backgroundVideo = invitationBackgroundVideoRef.current;

    // The invitation background is deliberately kept paused at frame 0 until
    // this handoff. That makes the first visible frame deterministic across
    // desktop, Android and iOS instead of revealing a random point in a loop.
    if (backgroundVideo) {
      try {
        if (backgroundVideo.readyState >= HTMLMediaElement.HAVE_METADATA) {
          backgroundVideo.currentTime = 0;
        }
      } catch {
        // A seek can fail briefly on slower Safari decoders. The video still
        // starts from its default frame 0 because it has never autoplayed.
      }

      void backgroundVideo.play().catch(() => {
        // Keep the decoded first frame visible if autoplay is temporarily
        // blocked. The invitation itself should never be held hostage by media.
      });

      if (backgroundVideo.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        completeIntroHandoff();
        return;
      }
    }

    // On a slow phone, keep the final intro frame on screen until the next
    // video's first frame is decoded. This prevents a cream/blank flash.
    backdropReadyTimerRef.current = setTimeout(() => {
      completeIntroHandoff();
    }, BACKDROP_READY_FALLBACK_MS);
  };

  const handleIntroProgress = (
    event: React.SyntheticEvent<HTMLVideoElement>,
  ) => {
    const video = event.currentTarget;

    if (
      Number.isFinite(video.duration) &&
      video.duration > 0 &&
      video.duration - video.currentTime <= INTRO_HANDOFF_SECONDS
    ) {
      revealInvitation();
    }
  };

  const unlockMainPage = () => {
    document.documentElement.classList.remove("intro-active");
    document.body.classList.remove("intro-active");

    document.getElementById("invitation-content")?.scrollIntoView({
      block: "start",
      behavior: "auto",
    });
  };

  const startMainMotion = () => {
    document.documentElement.dataset.invitationMotionReady = "true";
    window.dispatchEvent(new Event("invitation:motion-ready"));
  };

  const revealMainUnderlay = () => {
    if (mainRevealRef.current) return;

    mainRevealRef.current = true;

    // Commit the page switch in the same rendered-video-frame callback.
    // There is no crossfade between pages; the bubbles hide this atomic swap.
    flushSync(() => {
      setMainRevealed(true);
    });

    // The main page is now the active experience, so release the intro scroll
    // lock immediately instead of waiting for the bubble MP4 to finish.
    unlockMainPage();
    startMainMotion();
  };

  const finishTransition = () => {
    if (transitionDoneRef.current) return;
    transitionDoneRef.current = true;
    cancelTransitionFrameTracking();

    revealMainUnderlay();

    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }

    setTransitionFading(true);

    exitTimerRef.current = setTimeout(() => {
      setHidden(true);
    }, TRANSITION_CLEANUP_MS);
  };

  const syncTransitionToVideoTime = (
    currentTime: number,
    duration: number,
  ) => {
    if (!Number.isFinite(duration) || duration <= 0) return;

    if (
      !mainRevealRef.current &&
      currentTime >= PEAK_COVERAGE_SWAP_SECONDS
    ) {
      revealMainUnderlay();
    }

    if (duration - currentTime <= TRANSITION_FADE_SECONDS) {
      setTransitionFading(true);
    }
  };

  const handleTransitionProgress = (
    event: React.SyntheticEvent<HTMLVideoElement>,
  ) => {
    const video = event.currentTarget;
    syncTransitionToVideoTime(video.currentTime, video.duration);
  };

  const startTransitionFrameTracking = (video: HTMLVideoElement) => {
    cancelTransitionFrameTracking();

    if (typeof video.requestVideoFrameCallback === "function") {
      const onVideoFrame = (
        _now: number,
        metadata: VideoFrameCallbackMetadata,
      ) => {
        markTransitionFrameReady();
        syncTransitionToVideoTime(metadata.mediaTime, video.duration);

        if (!transitionDoneRef.current && !video.ended) {
          frameCallbackRef.current =
            video.requestVideoFrameCallback(onVideoFrame);
        }
      };

      frameCallbackRef.current =
        video.requestVideoFrameCallback(onVideoFrame);
      return;
    }

    // Older browsers get a display-rate fallback rather than coarse timeupdate
    // timing, keeping the swap close to the intended peak-coverage frame.
    const onAnimationFrame = () => {
      markTransitionFrameReady();
      syncTransitionToVideoTime(video.currentTime, video.duration);

      if (!transitionDoneRef.current && !video.ended) {
        animationFrameRef.current = requestAnimationFrame(onAnimationFrame);
      }
    };

    animationFrameRef.current = requestAnimationFrame(onAnimationFrame);
  };

  const fallbackToSimpleExit = () => {
    cancelTransitionFrameTracking();
    transitionFrameReadyRef.current = false;
    setTransitionFrameReady(false);
    setTransitionActive(false);
    setMainRevealed(false);
    setLeaving(true);

    // The fallback overlay is already leaving and no longer intercepts input,
    // so restore scrolling immediately rather than after the fade delay.
    unlockMainPage();
    startMainMotion();

    exitTimerRef.current = setTimeout(() => {
      setHidden(true);
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

    const destination = document.getElementById("invitation-content");
    destination?.scrollIntoView({
      block: "start",
      behavior: "auto",
    });

    // Force the already-mounted destination to finish layout while the fixed
    // invitation is still covering it.
    destination?.getBoundingClientRect();

    // Freeze the invitation background on its current frame before the full-
    // screen transition video starts. Mobile devices then decode one video
    // instead of two at the same time, while the visible frame stays intact.
    const invitationBackdropVideo = invitationBackgroundVideoRef.current;
    if (invitationBackdropVideo && !invitationBackdropVideo.paused) {
      invitationBackdropVideo.pause();
    }

    transitionDoneRef.current = false;
    mainRevealRef.current = false;
    transitionFrameReadyRef.current = false;

    const video = transitionVideoRef.current;
    if (!video) {
      fallbackToSimpleExit();
      return;
    }

    if (
      !transitionMediaReadyRef.current &&
      video.readyState === HTMLMediaElement.HAVE_NOTHING
    ) {
      video.load();
    }

    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
      try {
        video.currentTime = 0;
      } catch {
        // Playback still begins from the media's natural first frame.
      }
    }

    // Commit the transparent compositor layer before playback. The video stays
    // hidden until the browser has a playable/rendered frame, so slow iPhone
    // decoding cannot expose an empty or intermediate frame.
    flushSync(() => {
      setMainRevealed(false);
      setTransitionFading(false);
      setTransitionFrameReady(false);
      setTransitionActive(true);
    });

    startTransitionFrameTracking(video);

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

  useEffect(() => {
    if (!editHundredPhotos) return;

    try {
      window.localStorage.setItem(
        ZERO_PHOTO_STORAGE_KEY,
        JSON.stringify(zeroPhotos),
      );
    } catch {
      // The editor still works if localStorage is unavailable.
    }
  }, [editHundredPhotos, zeroPhotos]);

  const patchZeroPhoto = (
    key: ZeroPhotoKey,
    values: Partial<ZeroPhotoLayout>,
  ) => {
    setZeroPhotos((previous) => ({
      ...previous,
      [key]: {
        x: clamp(values.x ?? previous[key].x, 0, 100),
        y: clamp(values.y ?? previous[key].y, 0, 100),
        zoom: clamp(values.zoom ?? previous[key].zoom, 1, 3),
      },
    }));
  };

  const resetZeroPhoto = (key: ZeroPhotoKey) => {
    setZeroPhotos((previous) => ({
      ...previous,
      [key]: { ...DEFAULT_ZERO_PHOTOS[key] },
    }));
  };

  const copyZeroLayout = async () => {
    const payload = JSON.stringify(zeroPhotos, null, 2);

    try {
      await navigator.clipboard.writeText(payload);
      setCopiedZeroLayout(true);
      window.setTimeout(() => setCopiedZeroLayout(false), 1400);
    } catch {
      setCopiedZeroLayout(false);
    }
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
          invitationBackgroundVisible ? styles.invitationBackgroundVisible : ""
        }`}
        aria-hidden="true"
      >
        <video
          ref={invitationBackgroundVideoRef}
          className={styles.invitationBackgroundVideo}
          src={INVITATION_BACKGROUND_VIDEO}
          muted
          loop
          playsInline
          preload="auto"
          onLoadedData={(event) => {
            const video = event.currentTarget;

            // If decoding finished after the handoff already began, do not
            // rewind or pause it — that would create a visible mobile stutter.
            if (introFadeStartedRef.current) {
              if (video.paused) {
                void video.play().catch(() => {});
              }
              completeIntroHandoff();
              return;
            }

            video.pause();
            try {
              video.currentTime = 0;
            } catch {
              // Some mobile browsers reject an early seek until metadata settles.
            }
          }}
          onError={() => {
            if (introFadeStartedRef.current) {
              completeIntroHandoff();
            }
          }}
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

      <SectionDecor variant="opening" />

      <div
        className={`${styles.content} ${
          invitationContentVisible ? styles.contentReady : ""
        }`}
      >
        <p className={styles.eyebrow}>WITH LOVE &amp; GRATITUDE</p>

        <div className={styles.hero}>
          <div
            className={`${styles.photoMask} ${
              editHundredPhotos ? styles.photoMaskEditing : ""
            }`}
            aria-hidden="true"
          >
            <div
              className={`${styles.numberPhoto} ${styles.numberOne} ${
                editHundredPhotos && selectedZero === "one"
                  ? styles.photoSliceSelected
                  : ""
              }`}
              onPointerDown={() => {
                if (editHundredPhotos) setSelectedZero("one");
              }}
            >
              <img
                className={styles.zeroPhoto}
                src="/child's photo/05-sleeping-newborn-closeup.jpg"
                alt=""
                draggable={false}
                style={{
                  objectPosition: `${zeroPhotos.one.x}% ${zeroPhotos.one.y}%`,
                  transform: `scale(${zeroPhotos.one.zoom})`,
                  transformOrigin: `${zeroPhotos.one.x}% ${zeroPhotos.one.y}%`,
                }}
              />
            </div>

            <div
              className={`${styles.numberPhoto} ${styles.numberZeroLeft} ${
                editHundredPhotos && selectedZero === "left"
                  ? styles.photoSliceSelected
                  : ""
              }`}
              onPointerDown={() => {
                if (editHundredPhotos) setSelectedZero("left");
              }}
            >
              <img
                className={styles.zeroPhoto}
                src="/child's photo/09-opening-zero-left-photo.jpg"
                alt=""
                draggable={false}
                style={{
                  objectPosition: `${zeroPhotos.left.x}% ${zeroPhotos.left.y}%`,
                  transform: `scale(${zeroPhotos.left.zoom})`,
                  transformOrigin: `${zeroPhotos.left.x}% ${zeroPhotos.left.y}%`,
                }}
              />
            </div>

            <div
              className={`${styles.numberPhoto} ${styles.numberZeroRight} ${
                editHundredPhotos && selectedZero === "right"
                  ? styles.photoSliceSelected
                  : ""
              }`}
              onPointerDown={() => {
                if (editHundredPhotos) setSelectedZero("right");
              }}
            >
              <img
                className={styles.zeroPhoto}
                src="/child's photo/10-opening-zero-right-photo.jpg"
                alt=""
                draggable={false}
                style={{
                  objectPosition: `${zeroPhotos.right.x}% ${zeroPhotos.right.y}%`,
                  transform: `scale(${zeroPhotos.right.zoom})`,
                  transformOrigin: `${zeroPhotos.right.x}% ${zeroPhotos.right.y}%`,
                }}
              />
            </div>
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

      {editHundredPhotos && (
        <aside className={styles.zeroEditor} aria-label="100 photo editor">
          <div className={styles.zeroEditorHeader}>
            <div>
              <strong>100 Photo Editor</strong>
              <small>Adjust each number photo independently</small>
            </div>
            <span>EDIT MODE</span>
          </div>

          <div className={styles.zeroEditorTabs}>
            <button
              type="button"
              className={selectedZero === "one" ? styles.zeroEditorTabActive : ""}
              onClick={() => setSelectedZero("one")}
            >
              1
            </button>
            <button
              type="button"
              className={selectedZero === "left" ? styles.zeroEditorTabActive : ""}
              onClick={() => setSelectedZero("left")}
            >
              Left 0
            </button>
            <button
              type="button"
              className={selectedZero === "right" ? styles.zeroEditorTabActive : ""}
              onClick={() => setSelectedZero("right")}
            >
              Right 0
            </button>
          </div>
          <label className={styles.zeroEditorControl}>
            <span>
              Horizontal
              <b>{Math.round(zeroPhotos[selectedZero].x)}%</b>
            </span>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={zeroPhotos[selectedZero].x}
              onChange={(event) =>
                patchZeroPhoto(selectedZero, { x: Number(event.target.value) })
              }
            />
          </label>

          <label className={styles.zeroEditorControl}>
            <span>
              Vertical
              <b>{Math.round(zeroPhotos[selectedZero].y)}%</b>
            </span>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={zeroPhotos[selectedZero].y}
              onChange={(event) =>
                patchZeroPhoto(selectedZero, { y: Number(event.target.value) })
              }
            />
          </label>

          <label className={styles.zeroEditorControl}>
            <span>
              Zoom
              <b>{zeroPhotos[selectedZero].zoom.toFixed(2)}×</b>
            </span>
            <input
              type="range"
              min="1"
              max="3"
              step="0.01"
              value={zeroPhotos[selectedZero].zoom}
              onChange={(event) =>
                patchZeroPhoto(selectedZero, {
                  zoom: Number(event.target.value),
                })
              }
            />
          </label>

          <div className={styles.zeroEditorActions}>
            <button type="button" onClick={() => resetZeroPhoto(selectedZero)}>
              Reset selected
            </button>
            <button
              type="button"
              className={styles.zeroEditorPrimary}
              onClick={copyZeroLayout}
            >
              {copiedZeroLayout ? "Copied!" : "Copy values"}
            </button>
          </div>

          <p>
            Click 1 or either zero to select it, then move the sliders. Each
            number keeps its own photo position and zoom automatically.
          </p>
        </aside>
      )}

      {portalReady &&
        createPortal(
          <div
            className={`${styles.transitionVideoLayer} ${
              transitionActive ? styles.transitionVideoLayerActive : ""
            } ${
              transitionFading ? styles.transitionVideoLayerFading : ""
            }`}
            aria-hidden="true"
          >
            <video
              ref={transitionVideoRef}
              className={`${styles.transitionVideo} ${
                transitionFrameReady ? styles.transitionVideoReady : ""
              }`}
              src={TRANSITION_VIDEO}
              muted
              playsInline
              preload="auto"
              onLoadedData={(event) => primeTransitionMedia(event.currentTarget)}
              onCanPlay={(event) => primeTransitionMedia(event.currentTarget)}
              onPlaying={markTransitionFrameReady}
              onTimeUpdate={handleTransitionProgress}
              onEnded={finishTransition}
              onError={fallbackToSimpleExit}
            />
          </div>,
          document.body,
        )}
    </section>
  );
}
