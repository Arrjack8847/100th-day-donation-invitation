"use client";

import { useEffect, useRef } from "react";
import styles from "./MotionSystem.module.css";

const MOTION_READY_EVENT = "invitation:motion-ready";

function asElements<T extends Element>(
  parent: ParentNode | null,
  selector: string,
): T[] {
  return parent ? Array.from(parent.querySelectorAll<T>(selector)) : [];
}

export default function MotionSystem() {
  const layerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = document.getElementById("invitation-content");
    const layer = layerRef.current;

    if (!root || !layer) return;

    let disposed = false;
    let startRequested = false;
    let startExperience: (() => void) | null = null;
    let cleanup: (() => void) | null = null;

    const revealEverything = () => {
      asElements<HTMLElement>(root, "[data-reveal]").forEach((element) => {
        element.classList.add("is-visible");
        element.style.opacity = "";
        element.style.transform = "";
        element.style.transition = "";
        element.style.visibility = "";
      });

      asElements<HTMLElement>(
        root,
        ".hero-photo-shell, .hero-intro, .hero-title-main, .hero-title-script, .hero-invite-copy, .hero-scroll-cue",
      ).forEach((element) => {
        element.style.opacity = "";
        element.style.visibility = "";
      });
    };

    const runReducedMotion = () => {
      const items = asElements<HTMLElement>(root, "[data-reveal]");

      items.forEach((item) => {
        item.style.opacity = "0";
        item.style.transform = "none";
        item.style.transition = "opacity 240ms ease";
        item.style.visibility = "visible";
      });

      if (!("IntersectionObserver" in window)) {
        items.forEach((item) => {
          item.classList.add("is-visible");
          item.style.opacity = "1";
        });
        return () => undefined;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const item = entry.target as HTMLElement;
            item.classList.add("is-visible");
            item.style.opacity = "1";
            observer.unobserve(item);
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -4% 0px" },
      );

      items.forEach((item) => observer.observe(item));
      return () => observer.disconnect();
    };

    const requestStart = () => {
      startRequested = true;
      startExperience?.();
    };

    window.addEventListener(MOTION_READY_EVENT, requestStart);

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      startExperience = () => {
        if (cleanup) return;
        cleanup = runReducedMotion();
      };

      if (
        document.documentElement.dataset.invitationMotionReady === "true"
      ) {
        requestStart();
      }

      return () => {
        disposed = true;
        window.removeEventListener(MOTION_READY_EVENT, requestStart);
        cleanup?.();
        revealEverything();
      };
    }

    // Hide the hero synchronously while the GSAP chunk is loading. The main
    // page is mounted behind the opening, so this prevents a one-frame flash
    // of the final hero pose on slower mobile devices.
    asElements<HTMLElement>(
      root,
      ".hero-photo-shell, .hero-intro, .hero-title-main, .hero-title-script, .hero-invite-copy, .hero-scroll-cue",
    ).forEach((element) => {
      element.style.opacity = "0";
    });

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")])
      .then(([gsapModule, scrollTriggerModule]) => {
        if (disposed) return;

        const gsap = gsapModule.gsap;
        const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.config({
          ignoreMobileResize: true,
          limitCallbacks: true,
        });

        let started = false;
        let pointerCleanup: (() => void) | null = null;
        let resizeTimer: ReturnType<typeof setTimeout> | null = null;

        const context = gsap.context(() => {
          const compactMotion = window.innerWidth <= 768;
          const distanceScale = compactMotion ? 0.52 : 1;
          const durationScale = compactMotion ? 0.88 : 1;
          const staggerScale = compactMotion ? 0.78 : 1;
          const allReveal = asElements<HTMLElement>(root, "[data-reveal]");

          // GSAP owns reveal transforms once the motion system is active.
          // Keep the old CSS reveal classes as a no-JS/fallback safety net,
          // but remove their transitions so two animation engines never fight.
          gsap.set(allReveal, { transition: "none" });
          allReveal.forEach((element) => element.classList.add("is-visible"));

          const hero = root.querySelector<HTMLElement>(".love-hero");
          const heroPhoto = hero?.querySelector<HTMLElement>(".hero-photo-shell");
          const heroIntro = hero?.querySelector<HTMLElement>(".hero-intro");
          const heroTitleMain =
            hero?.querySelector<HTMLElement>(".hero-title-main");
          const heroTitleScript =
            hero?.querySelector<HTMLElement>(".hero-title-script");
          const heroCopy =
            hero?.querySelector<HTMLElement>(".hero-invite-copy");
          const heroCue =
            hero?.querySelector<HTMLElement>(".hero-scroll-cue");

          const heroTargets = [
            heroPhoto,
            heroIntro,
            heroTitleMain,
            heroTitleScript,
            heroCopy,
            heroCue,
          ].filter(Boolean) as HTMLElement[];

          if (heroPhoto) {
            gsap.set(heroPhoto, {
              autoAlpha: 0,
              y: 22,
              scale: 0.97,
              transformOrigin: "50% 55%",
            });
          }

          if (heroIntro) {
            gsap.set(heroIntro, { autoAlpha: 0, y: 8 });
          }

          if (heroTitleMain) {
            gsap.set(heroTitleMain, { autoAlpha: 0, y: 15 });
          }

          if (heroTitleScript) {
            gsap.set(heroTitleScript, { autoAlpha: 0, y: 12 });
          }

          if (heroCopy) {
            gsap.set(heroCopy, { autoAlpha: 0, y: 12 });
          }

          if (heroCue) {
            gsap.set(heroCue, { autoAlpha: 0, y: 8 });
          }

          const heroTimeline = gsap.timeline({
            paused: true,
            defaults: { ease: "power3.out" },
          });

          if (heroPhoto) {
            heroTimeline.to(heroPhoto, {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 1.06,
              clearProps: "willChange",
            });
          }

          if (heroIntro) {
            heroTimeline.to(
              heroIntro,
              { autoAlpha: 1, y: 0, duration: 0.7 },
              0.15,
            );
          }

          if (heroTitleMain) {
            heroTimeline.to(
              heroTitleMain,
              { autoAlpha: 1, y: 0, duration: 0.86 },
              0.29,
            );
          }

          if (heroTitleScript) {
            heroTimeline.to(
              heroTitleScript,
              { autoAlpha: 1, y: 0, duration: 0.82 },
              0.39,
            );
          }

          if (heroCopy) {
            heroTimeline.to(
              heroCopy,
              { autoAlpha: 1, y: 0, duration: 0.72 },
              0.53,
            );
          }

          if (heroCue) {
            heroTimeline.to(
              heroCue,
              { autoAlpha: 1, y: 0, duration: 0.62 },
              0.67,
            );
          }

          const prep = (
            targets: HTMLElement[],
            from: Record<string, unknown>,
          ) => {
            if (!targets.length) return;
            gsap.set(
              targets,
              compactMotion
                ? from
                : { ...from, willChange: "transform, opacity" },
            );
          };

          const addSectionTimeline = (
            section: HTMLElement | null,
            targets: HTMLElement[],
            options?: {
              y?: number;
              stagger?: number;
              duration?: number;
              start?: string;
              scale?: number;
            },
          ) => {
            if (!section || !targets.length) return;

            const {
              y = 15,
              stagger = 0.12,
              duration = 0.82,
              start = "top 80%",
              scale = 1,
            } = options ?? {};

            prep(targets, {
              autoAlpha: 0,
              y,
              scale: scale === 1 ? undefined : scale,
            });

            gsap.to(targets, {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: duration * durationScale,
              stagger: stagger * staggerScale,
              ease: "power3.out",
              clearProps: "willChange",
              scrollTrigger: {
                trigger: section,
                start,
                once: true,
              },
            });
          };

          const milestone = root.querySelector<HTMLElement>(
            '[data-motion-section="milestone"]',
          );
          const milestoneTargets = [
            milestone?.querySelector<HTMLElement>(
              '[data-motion-role="milestone-portrait"]',
            ),
            milestone?.querySelector<HTMLElement>(
              '[data-motion-role="milestone-message"]',
            ),
            milestone?.querySelector<HTMLElement>(
              '[data-motion-role="milestone-divider"]',
            ),
            milestone?.querySelector<HTMLElement>(
              '[data-motion-role="milestone-banner"]',
            ),
          ].filter(Boolean) as HTMLElement[];

          addSectionTimeline(milestone, milestoneTargets, {
            y: 18,
            stagger: 0.13,
            duration: 0.86,
            start: "top 78%",
            scale: 0.985,
          });

          const meaning = root.querySelector<HTMLElement>(
            '[data-motion-section="meaning"]',
          );
          const meaningText = asElements<HTMLElement>(
            meaning,
            '[data-motion-role="meaning-copy"] [data-reveal]',
          );
          const meaningPhoto = meaning?.querySelector<HTMLElement>(
            '[data-motion-role="meaning-photo"]',
          );
          const meaningNote = meaning?.querySelector<HTMLElement>(
            '[data-motion-role="meaning-note"]',
          );
          const meaningFeelings = meaning?.querySelector<HTMLElement>(
            '[data-motion-role="meaning-feelings"]',
          );

          if (meaning) {
            prep(meaningText, { autoAlpha: 0, y: 15 });
            prep(
              [meaningPhoto, meaningNote, meaningFeelings].filter(
                Boolean,
              ) as HTMLElement[],
              { autoAlpha: 0, y: 14 },
            );

            const meaningTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: meaning,
                start: "top 80%",
                once: true,
              },
              defaults: { ease: "power3.out" },
            });

            meaningTimeline.to(meaningText, {
              autoAlpha: 1,
              y: 0,
              duration: 0.8 * durationScale,
              stagger: 0.11 * staggerScale,
              clearProps: "willChange",
            });

            if (meaningPhoto) {
              meaningTimeline.fromTo(
                meaningPhoto,
                { autoAlpha: 0, y: 14, scale: 0.96 },
                {
                  autoAlpha: 1,
                  y: 0,
                  scale: 1,
                  duration: 0.92 * durationScale,
                  clearProps: "willChange",
                },
                "-=0.35",
              );

              const image = meaningPhoto.querySelector<HTMLImageElement>("img");
              if (image && !compactMotion) {
                meaningTimeline.fromTo(
                  image,
                  { filter: "blur(2.4px)", scale: 1.012 },
                  {
                    filter: "blur(0px)",
                    scale: 1,
                    duration: 0.72 * durationScale,
                    ease: "power2.out",
                  },
                  "<",
                );
              }
            }

            if (meaningNote) {
              meaningTimeline.to(
                meaningNote,
                { autoAlpha: 1, y: 0, duration: 0.7 * durationScale },
                "-=0.48",
              );
            }

            if (meaningFeelings) {
              meaningTimeline.to(
                meaningFeelings,
                { autoAlpha: 1, y: 0, duration: 0.7 * durationScale },
                "-=0.38",
              );
            }
          }

          const moments = root.querySelector<HTMLElement>(
            '[data-motion-section="moments"]',
          );
          const momentHeading =
            moments?.querySelector<HTMLElement>(".moments-heading");
          const momentPhotos = asElements<HTMLElement>(
            moments,
            ".moment-photo",
          );
          const momentCaption =
            moments?.querySelector<HTMLElement>(".moments-handwritten");
          const momentClosing =
            moments?.querySelector<HTMLElement>(".moments-closing");

          if (moments && momentPhotos.length) {
            prep(
              [momentHeading, momentCaption, momentClosing].filter(
                Boolean,
              ) as HTMLElement[],
              { autoAlpha: 0, y: 12 },
            );

            const directions = [
              { x: -25 * distanceScale, y: 15 * distanceScale, extraRotation: -3.2 * distanceScale },
              { x: 24 * distanceScale, y: 13 * distanceScale, extraRotation: 2.6 * distanceScale },
              { x: -16 * distanceScale, y: 20 * distanceScale, extraRotation: -2.2 * distanceScale },
              { x: 18 * distanceScale, y: 18 * distanceScale, extraRotation: 2.1 * distanceScale },
            ];

            momentPhotos.forEach((photo, index) => {
              const finalRotation =
                Number.parseFloat(
                  getComputedStyle(photo).getPropertyValue(
                    "--moment-rotation",
                  ),
                ) || 0;
              const direction = directions[index] ?? directions[0];

              gsap.set(photo, {
                autoAlpha: 0,
                x: direction.x,
                y: direction.y,
                rotation: finalRotation + direction.extraRotation,
                transformOrigin: "50% 50%",
                willChange: compactMotion ? "auto" : "transform, opacity",
              });
            });

            const momentTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: moments,
                start: "top 80%",
                once: true,
              },
              defaults: { ease: "power3.out" },
            });

            if (momentHeading) {
              momentTimeline.to(momentHeading, {
                autoAlpha: 1,
                y: 0,
                duration: 0.7,
              });
            }

            momentPhotos.forEach((photo, index) => {
              const finalRotation =
                Number.parseFloat(
                  getComputedStyle(photo).getPropertyValue(
                    "--moment-rotation",
                  ),
                ) || 0;
              const placementTime = 0.18 + index * 0.16;

              momentTimeline
                .to(
                  photo,
                  {
                    autoAlpha: 1,
                    x: 0,
                    y: 0,
                    rotation: finalRotation + (index % 2 === 0 ? 0.7 : -0.7),
                    duration: 0.72 * durationScale,
                    ease: "power3.out",
                  },
                  placementTime,
                )
                .to(
                  photo,
                  {
                    rotation: finalRotation,
                    duration: 0.26 * durationScale,
                    ease: "power2.out",
                    clearProps: "willChange",
                  },
                  placementTime + 0.58,
                );

              const tape = photo.querySelector<HTMLElement>(
                'img[src*="tape"]',
              );
              if (tape) {
                momentTimeline.fromTo(
                  tape,
                  { autoAlpha: 0, scale: 0.92 },
                  {
                    autoAlpha: 1,
                    scale: 1,
                    duration: 0.42 * durationScale,
                    ease: "power2.out",
                  },
                  placementTime + 0.48,
                );
              }
            });

            if (momentCaption) {
              momentTimeline.to(
                momentCaption,
                { autoAlpha: 1, y: 0, duration: 0.65 * durationScale },
                0.78,
              );
            }

            if (momentClosing) {
              momentTimeline.to(
                momentClosing,
                { autoAlpha: 1, y: 0, duration: 0.68 * durationScale },
                0.94,
              );
            }
          }

          const eventSection = root.querySelector<HTMLElement>(
            '[data-motion-section="event"]',
          );
          if (eventSection) {
            const card =
              eventSection.querySelector<HTMLElement>(".ceremony-paper");
            const details = asElements<HTMLElement>(
              eventSection,
              ".ceremony-detail",
            );

            if (card) {
              prep([card], { autoAlpha: 0, y: 15 });
              prep(details, { autoAlpha: 0, y: 9 });

              const eventTimeline = gsap.timeline({
                scrollTrigger: {
                  trigger: eventSection,
                  start: "top 82%",
                  once: true,
                },
                defaults: { ease: "power3.out" },
              });

              eventTimeline.to(card, {
                autoAlpha: 1,
                y: 0,
                duration: 0.78 * durationScale,
              });

              eventTimeline.to(
                details,
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.58 * durationScale,
                  stagger: 0.1 * staggerScale,
                  clearProps: "willChange",
                },
                "-=0.36",
              );
            }
          }

          const donation = root.querySelector<HTMLElement>(
            '[data-motion-section="donation"]',
          );
          if (donation) {
            const targets = [
              donation.querySelector<HTMLElement>(".donation-heading"),
              donation.querySelector<HTMLElement>(".donation-card"),
              donation.querySelector<HTMLElement>(".donation-closing-note"),
            ].filter(Boolean) as HTMLElement[];

            addSectionTimeline(donation, targets, {
              y: 13,
              stagger: 0.14,
              duration: 0.78,
              start: "top 82%",
            });
          }

          const closing = root.querySelector<HTMLElement>(
            '[data-motion-section="closing"]',
          );
          if (closing) {
            const photo =
              closing.querySelector<HTMLElement>(".closing-photo");
            const copy =
              closing.querySelector<HTMLElement>(".closing-copy-new");

            prep([photo, copy].filter(Boolean) as HTMLElement[], {
              autoAlpha: 0,
              y: 12,
            });

            const closingTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: closing,
                start: "top 82%",
                once: true,
              },
              defaults: { ease: "power3.out" },
            });

            if (photo) {
              closingTimeline.to(photo, {
                autoAlpha: 1,
                y: 0,
                duration: 0.9 * durationScale,
              });

              const image = photo.querySelector<HTMLImageElement>("img");
              if (image && !compactMotion) {
                closingTimeline.fromTo(
                  image,
                  { filter: "blur(2px)", scale: 1.01 },
                  {
                    filter: "blur(0px)",
                    scale: 1,
                    duration: 0.78,
                    ease: "power2.out",
                  },
                  "<",
                );
              }
            }

            if (copy) {
              closingTimeline.to(
                copy,
                { autoAlpha: 1, y: 0, duration: 0.82 * durationScale },
                "-=0.44",
              );
            }
          }

          // Hand-drawn treatment is intentionally limited to two sections,
          // and each section shares one trigger instead of creating a trigger
          // for every SVG path.
          if (!compactMotion) ["meaning", "event"].forEach((sectionName) => {
            const section = root.querySelector<HTMLElement>(
              `[data-motion-section="${sectionName}"]`,
            );
            if (!section) return;

            const paths = asElements<SVGPathElement>(section, "svg path")
              .filter((path) => {
                try {
                  return path.getTotalLength() >= 18;
                } catch {
                  return false;
                }
              });

            if (!paths.length) return;

            paths.forEach((path) => {
              const length = path.getTotalLength();
              gsap.set(path, {
                strokeDasharray: length,
                strokeDashoffset: length,
              });
            });

            gsap.to(paths, {
              strokeDashoffset: 0,
              duration: 0.9,
              stagger: 0.055,
              ease: "power2.out",
              scrollTrigger: {
                trigger: section,
                start: "top 82%",
                once: true,
              },
            });
          });

          // Use only a few shared scrubbed depth timelines. This keeps the
          // dimensional effect while avoiding dozens of simultaneous triggers.
          if (!compactMotion) ["hero", "meaning", "moments", "closing"].forEach(
            (sectionName) => {
              const section = root.querySelector<HTMLElement>(
                `[data-motion-section="${sectionName}"]`,
              );
              if (!section) return;

              const decor = asElements<HTMLElement>(
                section,
                ':scope > div[aria-hidden="true"] img',
              ).slice(0, 2);

              if (!decor.length) return;

              const parallaxTimeline = gsap.timeline({
                scrollTrigger: {
                  trigger: section,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1.15,
                },
              });

              decor.forEach((asset, index) => {
                parallaxTimeline.to(
                  asset,
                  {
                    y: (index === 0 ? -7 : 10) * distanceScale,
                    duration: 1,
                    ease: "none",
                  },
                  0,
                );
              });
            },
          );

          // Section bridges are allowed to breathe across boundaries, but are
          // deliberately quieter than the section content itself.
          const bridges = Array.from(root.children).filter(
            (child): child is HTMLElement =>
              child instanceof HTMLElement &&
              child.matches('[data-reveal][aria-hidden="true"]'),
          );

          bridges.forEach((bridge) => {
            const bridgeArt = asElements<HTMLElement>(
              bridge,
              "img, span",
            );

            gsap.set(bridgeArt, { autoAlpha: 0, y: 5 });

            gsap.to(bridgeArt, {
              autoAlpha: 1,
              y: 0,
              duration: 0.72,
              stagger: 0.08,
              ease: "power2.out",
              scrollTrigger: {
                trigger: bridge,
                start: "top 90%",
                once: true,
              },
            });
          });

          // Dedicated mobile GSAP profile: section content still gets full
          // one-time reveals, plus one tiny ambient transform while the section
          // is visible. Off-screen ambient tweens are paused, so only nearby
          // content consumes animation frames.
          if (compactMotion) {
            const mobileSections = asElements<HTMLElement>(
              root,
              "[data-motion-section]",
            );

            mobileSections.forEach((section, sectionIndex) => {
              const decorAssets = asElements<HTMLImageElement>(
                section,
                ':scope > div[aria-hidden="true"] img',
              );

              const ambientTarget =
                decorAssets.find((asset) => {
                  const src = asset.getAttribute("src") ?? "";
                  return !src.includes("soft-glow") && !src.includes("wash");
                }) ?? decorAssets[0];

              if (!ambientTarget) return;

              const ambientTween = gsap.to(ambientTarget, {
                y: sectionIndex % 2 === 0 ? -4 : 4,
                x: sectionIndex % 3 === 0 ? 2 : -2,
                duration: 3.4 + (sectionIndex % 3) * 0.45,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
                paused: true,
                force3D: true,
              });

              ScrollTrigger.create({
                trigger: section,
                start: "top 92%",
                end: "bottom 8%",
                onEnter: () => ambientTween.play(),
                onEnterBack: () => ambientTween.play(),
                onLeave: () => ambientTween.pause(),
                onLeaveBack: () => ambientTween.pause(),
              });
            });
          }

          const memoryTrail =
            layer.querySelector<HTMLElement>("[data-memory-trail]");
          const memoryBubble =
            layer.querySelector<HTMLElement>("[data-memory-bubble]");
          const memorySparkle =
            layer.querySelector<HTMLElement>("[data-memory-sparkle]");
          const memoryHeart =
            layer.querySelector<HTMLElement>("[data-memory-heart]");
          const petalOne =
            layer.querySelector<HTMLElement>("[data-foreground-petal-one]");
          const petalTwo =
            layer.querySelector<HTMLElement>("[data-foreground-petal-two]");
          const sparkle =
            layer.querySelector<HTMLElement>("[data-foreground-sparkle]");

          if (memorySparkle) {
            gsap.set(memorySparkle, { autoAlpha: 0, scale: 0.72 });
          }
          if (memoryHeart) {
            gsap.set(memoryHeart, { autoAlpha: 0, scale: 0.72 });
          }

          const storyTimeline = compactMotion
            ? null
            : gsap.timeline({
                scrollTrigger: {
                  trigger: root,
                  start: "top top",
                  end: "bottom bottom",
                  scrub: 1.2,
                  invalidateOnRefresh: true,
                },
              });

          if (memoryTrail && storyTimeline) {
            storyTimeline
              .to(
                memoryTrail,
                {
                  y: () => root.scrollHeight * 0.17,
                  x: compactMotion ? "-3vw" : "-7vw",
                  duration: 1,
                  ease: "none",
                },
                0,
              )
              .to(
                memoryBubble,
                { autoAlpha: 0, scale: 0.68, duration: 0.22 },
                0.72,
              )
              .to(
                memorySparkle,
                { autoAlpha: 0.72, scale: 1, duration: 0.24 },
                0.76,
              )
              .to(
                memoryTrail,
                {
                  y: () => root.scrollHeight * 0.34,
                  x: compactMotion ? "2vw" : "5vw",
                  duration: 1,
                  ease: "none",
                },
                1,
              )
              .to(
                memoryTrail,
                {
                  y: () => root.scrollHeight * 0.51,
                  x: compactMotion ? "-1.5vw" : "-3vw",
                  duration: 1,
                  ease: "none",
                },
                2,
              )
              .to(
                memorySparkle,
                { autoAlpha: 0, scale: 0.72, duration: 0.24 },
                2.58,
              )
              .to(
                memoryHeart,
                { autoAlpha: 0.64, scale: 1, duration: 0.26 },
                2.62,
              )
              .to(
                memoryTrail,
                {
                  y: () => root.scrollHeight * 0.69,
                  x: compactMotion ? "1.5vw" : "4vw",
                  duration: 1,
                  ease: "none",
                },
                3,
              )
              .to(
                memoryTrail,
                {
                  y: () => root.scrollHeight * 0.87,
                  x: compactMotion ? "-2vw" : "-5vw",
                  duration: 1,
                  ease: "none",
                },
                4,
              )
              .to(
                [memoryHeart, memoryTrail],
                { autoAlpha: 0, duration: 0.34 },
                4.56,
              );
          }

          if (petalOne && storyTimeline) {
            storyTimeline.fromTo(
              petalOne,
              { y: 0, x: 0, rotation: -14 },
              {
                y: () => root.scrollHeight * 0.58,
                x: compactMotion ? "1.2vw" : "3vw",
                rotation: compactMotion ? 8 : 18,
                duration: 5,
                ease: "none",
              },
              0,
            );
          }

          if (petalTwo && storyTimeline) {
            storyTimeline.fromTo(
              petalTwo,
              { y: 0, x: 0, rotation: 18 },
              {
                y: () => root.scrollHeight * 0.42,
                x: compactMotion ? "-1vw" : "-2vw",
                rotation: compactMotion ? 5 : -12,
                duration: 5,
                ease: "none",
              },
              0,
            );
          }

          if (sparkle && storyTimeline) {
            storyTimeline.to(
              sparkle,
              {
                y: () => root.scrollHeight * 0.3,
                duration: 5,
                ease: "none",
              },
              0,
            );
          }

          const velocityPetal =
            layer.querySelector<HTMLElement>("[data-velocity-petal]");

          if (velocityPetal && !compactMotion) {
            const rotateTo = gsap.quickTo(velocityPetal, "rotation", {
              duration: 0.55,
              ease: "power2.out",
            });

            ScrollTrigger.create({
              trigger: root,
              start: "top top",
              end: "bottom bottom",
              onUpdate: (self) => {
                const velocity = Math.max(
                  -7,
                  Math.min(7, self.getVelocity() / 280),
                );
                rotateTo(velocity);
              },
            });
          }

          const desktopQuery = window.matchMedia(
            "(hover: hover) and (pointer: fine) and (min-width: 769px)",
          );

          if (desktopQuery.matches) {
            const pointerItems = asElements<HTMLElement>(
              layer,
              "[data-pointer-depth]",
            );

            const onPointerMove = (event: PointerEvent) => {
              const nx = event.clientX / window.innerWidth - 0.5;
              const ny = event.clientY / window.innerHeight - 0.5;

              pointerItems.forEach((item) => {
                const depth =
                  Number(item.dataset.pointerDepth ?? "1") || 1;

                gsap.to(item, {
                  x: nx * 5 * depth,
                  y: ny * 4 * depth,
                  duration: 0.75,
                  ease: "power2.out",
                  overwrite: "auto",
                });
              });
            };

            window.addEventListener("pointermove", onPointerMove, {
              passive: true,
            });
            pointerCleanup = () =>
              window.removeEventListener("pointermove", onPointerMove);
          }

          const tapTarget =
            layer.querySelector<HTMLElement>("[data-motion-tap]");

          if (tapTarget) {
            const onTap = () => {
              gsap.fromTo(
                tapTarget,
                { scale: 1 },
                {
                  scale: 1.08,
                  duration: 0.14,
                  yoyo: true,
                  repeat: 1,
                  ease: "power2.out",
                },
              );
            };

            tapTarget.addEventListener("pointerdown", onTap);
            const previousPointerCleanup = pointerCleanup;
            pointerCleanup = () => {
              previousPointerCleanup?.();
              tapTarget.removeEventListener("pointerdown", onTap);
            };
          }

          let lastViewportWidth = window.innerWidth;
          const onResize = () => {
            if (compactMotion) {
              const nextWidth = window.innerWidth;
              if (Math.abs(nextWidth - lastViewportWidth) < 24) return;
              lastViewportWidth = nextWidth;
            }

            if (resizeTimer) clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 180);
          };

          window.addEventListener("resize", onResize, { passive: true });

          const previousPointerCleanup = pointerCleanup;
          pointerCleanup = () => {
            previousPointerCleanup?.();
            window.removeEventListener("resize", onResize);
            if (resizeTimer) clearTimeout(resizeTimer);
          };

          startExperience = () => {
            if (started || disposed) return;
            started = true;

            heroTargets.forEach((target) => {
              target.style.willChange = "transform, opacity";
            });

            heroTimeline.play(0);
            ScrollTrigger.refresh();
          };

          if (
            startRequested ||
            document.documentElement.dataset.invitationMotionReady === "true"
          ) {
            startExperience();
          }
        }, root);

        cleanup = () => {
          pointerCleanup?.();
          context.revert();
        };
      })
      .catch(() => {
        if (!disposed) revealEverything();
      });

    return () => {
      disposed = true;
      window.removeEventListener(MOTION_READY_EVENT, requestStart);
      cleanup?.();
      revealEverything();
    };
  }, []);

  return (
    <div ref={layerRef} className={styles.layer} aria-hidden="true">
      <div
        className={styles.memoryTrail}
        data-memory-trail
        data-motion-tap
      >
        <span
          className={styles.memoryPointer}
          data-pointer-depth="0.8"
        >
          <span className={styles.memoryBubble} data-memory-bubble />
          <span className={styles.memorySparkle} data-memory-sparkle>
            ✦
          </span>
          <span className={styles.memoryHeart} data-memory-heart>
            ♡
          </span>
        </span>
      </div>

      <span className={styles.foregroundPetalOne} data-foreground-petal-one>
        <span data-pointer-depth="0.65">
          <img
            src="/components/floating-petals/floating-petal-02.png"
            alt=""
            draggable={false}
          />
        </span>
      </span>

      <span
        className={styles.foregroundPetalTwo}
        data-foreground-petal-two
      >
        <span data-pointer-depth="0.5" data-velocity-petal>
          <img
            src="/components/floating-petals/floating-petal-05.png"
            alt=""
            draggable={false}
          />
        </span>
      </span>

      <span className={styles.foregroundSparkle} data-foreground-sparkle>
        <span data-pointer-depth="0.9">✦</span>
      </span>
    </div>
  );
}
