"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import SceneBackground from "./SceneBackground";
import ForegroundLotus from "./ForegroundLotus";
import InvitationCard from "./InvitationCard";
import Ribbon from "./Ribbon";
import WaxSeal from "./WaxSeal";
import OpenButton from "./OpenButton";
import PetalParticles from "./PetalParticles";

export default function OpeningScene() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(
          [
            ".scene-background",
            ".foreground-lotus",
            ".invitation-card",
            ".baby-frame",
            ".invitation-copy > *",
            ".open-button",
          ],
          { autoAlpha: 1, clearProps: "transform" }
        );
        return;
      }

      gsap.set(".scene-background", { autoAlpha: 0, scale: 1.04, filter: "blur(8px)" });
      gsap.set(".foreground-lotus", { autoAlpha: 0, y: 24, scale: 1.04 });
      gsap.set(".invitation-card", {
        autoAlpha: 0,
        y: 38,
        scale: 0.94,
        rotateX: 2,
        transformPerspective: 1100,
      });
      gsap.set(".baby-frame", { autoAlpha: 0, scale: 1.07 });
      gsap.set(".invitation-copy > *", { autoAlpha: 0, y: 12 });
      gsap.set(".open-button", { autoAlpha: 0, y: 16 });
      gsap.set(".ribbon-layer", { x: 0, y: 0, rotate: 0 });
      gsap.set(".wax-seal", { rotate: 0, scale: 1 });

      const intro = gsap.timeline({ defaults: { ease: "power2.out" } });

      intro
        .to(".scene-background", {
          autoAlpha: 1,
          scale: 1,
          filter: "blur(2px)",
          duration: 1.15,
        })
        .to(
          ".foreground-lotus",
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 1,
          },
          0.65
        )
        .to(
          ".invitation-card",
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            duration: 1.25,
            ease: "power3.out",
          },
          1.25
        )
        .to(
          ".wax-seal",
          {
            rotate: 7,
            scale: 0.98,
            duration: 0.45,
            ease: "sine.inOut",
          },
          2.45
        )
        .to(
          ".ribbon-layer",
          {
            x: 22,
            y: 8,
            rotate: 5,
            duration: 0.9,
            ease: "power2.inOut",
          },
          2.55
        )
        .to(
          ".baby-frame",
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.9,
            ease: "power2.out",
          },
          3.1
        )
        .to(
          ".invitation-copy > *",
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.2,
          },
          3.75
        )
        .to(
          ".open-button",
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
          },
          5.55
        );

      gsap.to(".scene-glow", {
        opacity: 0.78,
        scale: 1.08,
        duration: 4.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      gsap.to(".petal", {
        y: "18vh",
        x: "random(-18, 18)",
        rotate: "random(-30, 30)",
        duration: "random(5, 8)",
        ease: "sine.inOut",
        stagger: {
          each: 0.65,
          repeat: -1,
          yoyo: true,
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const openInvitation = () => {
    const target = document.getElementById("invitation-content");

    const timeline = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        if (rootRef.current) rootRef.current.style.display = "none";
        target?.scrollIntoView({ behavior: "auto", block: "start" });
      },
    });

    timeline
      .to(".open-button", { scale: 0.97, duration: 0.12 })
      .to(".open-button", { scale: 1, duration: 0.12 })
      .to(
        ".foreground-lotus",
        {
          xPercent: (index) => (index === 0 ? -18 : 18),
          y: 28,
          autoAlpha: 0,
          duration: 0.7,
        },
        0.15
      )
      .to(
        ".scene-background",
        {
          scale: 1.05,
          filter: "blur(10px)",
          autoAlpha: 0.45,
          duration: 0.85,
        },
        0.15
      )
      .to(
        ".invitation-stage",
        {
          scale: 1.6,
          y: -10,
          autoAlpha: 0,
          duration: 0.95,
        },
        0.25
      )
      .to(rootRef.current, { autoAlpha: 0, duration: 0.35 }, 0.9);
  };

  return (
    <section
      ref={rootRef}
      className="opening-scene"
      aria-label="100th Day Donation invitation opening"
    >
      <SceneBackground />
      <PetalParticles />
      <ForegroundLotus side="left" />
      <ForegroundLotus side="right" />

      <div className="invitation-stage">
        <InvitationCard />
        <Ribbon />
        <WaxSeal />
      </div>

      <OpenButton onClick={openInvitation} />
    </section>
  );
}
