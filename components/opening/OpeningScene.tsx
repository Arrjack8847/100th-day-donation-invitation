"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { openingAssets as A } from "./openingAssets";

export default function OpeningScene() {
  const sceneRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(".box-left-flap", { rotateY: -86 });
        gsap.set(".box-right-flap", { rotateY: 86 });
        gsap.set(
          [".box-card-slot", ".photo-frame", ".baby-mask", ".invitation-type", ".open-invitation"],
          { autoAlpha: 1 }
        );
        return;
      }

      gsap.set(".box-card-slot", { autoAlpha: 0, scale: 0.94, y: 18 });
      gsap.set([".photo-frame", ".baby-mask", ".invitation-type"], { autoAlpha: 0 });
      gsap.set(".open-invitation", { autoAlpha: 0, y: 12 });

      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });

      intro
        .fromTo(
          ".opening-bg",
          { autoAlpha: 0, scale: 1.035, filter: "blur(7px)" },
          {
            autoAlpha: 1,
            scale: 1,
            filter: "blur(1.5px)",
            duration: 0.95,
            ease: "power2.out",
          },
          0
        )
        .fromTo(
          ".box-stage",
          { autoAlpha: 0, y: 30, scale: 0.96 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.95 },
          0.45
        )
        .to(
          ".box-left-flap",
          { rotateY: -86, xPercent: 0, duration: 1.05, ease: "power3.inOut" },
          1.45
        )
        .to(
          ".box-right-flap",
          { rotateY: 86, xPercent: 0, duration: 1.05, ease: "power3.inOut" },
          1.58
        )
        .to(
          ".box-card-slot",
          { autoAlpha: 1, scale: 1, y: 0, duration: 0.75, ease: "power3.out" },
          2.02
        )
        .fromTo(
          ".photo-frame",
          { autoAlpha: 0, y: 7 },
          { autoAlpha: 1, y: 0, duration: 0.42, ease: "power2.out" },
          2.5
        )
        .fromTo(
          ".baby-mask",
          { autoAlpha: 0, scale: 0.98 },
          { autoAlpha: 1, scale: 1, duration: 0.55, ease: "power2.out" },
          2.62
        )
        .fromTo(
          ".invitation-type",
          { autoAlpha: 0, y: 11 },
          { autoAlpha: 1, y: 0, duration: 0.72, ease: "power2.out" },
          2.95
        )
        .to(
          ".open-invitation",
          { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out" },
          3.65
        );

      gsap.to(".floating-petal", {
        y: "random(24, 70)",
        x: "random(-18, 18)",
        rotate: "random(-28, 28)",
        duration: "random(5.5, 8)",
        ease: "sine.inOut",
        stagger: { each: 0.65, repeat: -1, yoyo: true },
      });
    }, sceneRef);

    return () => ctx.revert();
  }, []);

  const openInvitation = () => {
    const content = document.getElementById("invitation-content");

    gsap
      .timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => {
          if (sceneRef.current) sceneRef.current.style.display = "none";
          content?.scrollIntoView({ block: "start" });
        },
      })
      .to(".open-invitation", { scale: 0.97, duration: 0.12 })
      .to(".open-invitation", { scale: 1, duration: 0.12 })
      .to(".open-invitation", { autoAlpha: 0, y: 8, duration: 0.28 }, 0.18)
      .to(
        [".box-left-flap", ".box-right-flap"],
        { autoAlpha: 0, duration: 0.48, ease: "power2.in" },
        0.24
      )
      .to(
        ".box-back",
        { autoAlpha: 0, scale: 0.97, duration: 0.7 },
        0.28
      )
      .to(
        ".opening-bg",
        { scale: 1.07, filter: "blur(10px)", autoAlpha: 0.36, duration: 0.85 },
        0.25
      )
      .to(
        ".box-card-slot",
        { scale: 1.42, y: -8, autoAlpha: 0, duration: 0.95 },
        0.3
      )
      .to(sceneRef.current, { autoAlpha: 0, duration: 0.3 }, 1.02);
  };

  return (
    <section
      ref={sceneRef}
      className="opening-scene"
      aria-label="100th Day Donation invitation opening"
    >
      <img className="opening-layer opening-bg" src={A.background} alt="" />

      <div className="petal-field" aria-hidden="true">
        {[10, 24, 42, 63, 79, 91].map((left, index) => (
          <img
            key={left}
            className="opening-layer floating-petal"
            src={A.floatingPetal}
            alt=""
            style={{
              left: left + "%",
              top: 8 + ((index * 12) % 40) + "%",
              width: 22 + (index % 3) * 7,
            }}
          />
        ))}
      </div>

      <div className="box-composition">
        <div className="box-stage">
          <img
            className="opening-layer box-full-layer box-back"
            src={A.box.back}
            alt=""
          />
          <div className="box-card-slot">
            <div className="card-stage">
              <img
                className="opening-layer card-container"
                src={A.card}
                alt=""
              />
              <div className="baby-mask">
                <img src={A.babyPhoto} alt="Child portrait" />
              </div>
              <img
                className="opening-layer photo-frame"
                src={A.photoFrame}
                alt=""
              />
              <img
                className="opening-layer invitation-type"
                src={A.typography}
                alt="100th Day Donation Ceremony"
              />
            </div>
          </div>

          <div className="box-door box-left-flap" aria-hidden="true">
            <img className="box-door-art" src={A.box.leftFlap} alt="" />
          </div>
          <div className="box-door box-right-flap" aria-hidden="true">
            <img className="box-door-art" src={A.box.rightFlap} alt="" />
          </div>
        </div>

        <button
          className="open-invitation"
          type="button"
          onClick={openInvitation}
          aria-label="Open invitation"
        >
          <img src={A.openButton} alt="" />
        </button>
      </div>
    </section>
  );
}
