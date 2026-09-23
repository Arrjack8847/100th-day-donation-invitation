"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const A = "/opening/";

export default function OpeningScene() {
  const sceneRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (!reduced) {
        gsap.fromTo(
          ".opening-bg",
          { autoAlpha: 0, scale: 1.025, filter: "blur(5px)" },
          { autoAlpha: 1, scale: 1, filter: "blur(1.5px)", duration: 0.9, ease: "power2.out" }
        );

        gsap.fromTo(
          ".card-stage",
          { autoAlpha: 0, y: 28, scale: 0.965 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 1.05, delay: 0.35, ease: "power3.out" }
        );

        gsap.fromTo(
          ".open-invitation",
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.65, delay: 1.05, ease: "power2.out" }
        );

        gsap.fromTo(
          ".lotus-foreground",
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.9, delay: 0.5, ease: "power2.out" }
        );

        gsap.to(".seal", {
          rotate: 4,
          duration: 1.8,
          delay: 1.3,
          ease: "sine.inOut",
          yoyo: true,
          repeat: 1,
        });

        gsap.to(".floating-petal", {
          y: "random(24, 70)",
          x: "random(-18, 18)",
          rotate: "random(-28, 28)",
          duration: "random(5.5, 8)",
          ease: "sine.inOut",
          stagger: { each: 0.65, repeat: -1, yoyo: true },
        });
      }
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
      .to(".lotus-foreground", { y: 40, autoAlpha: 0, duration: 0.7 }, 0.18)
      .to(
        ".opening-bg",
        { scale: 1.06, filter: "blur(10px)", autoAlpha: 0.35, duration: 0.85 },
        0.18
      )
      .to(".card-stage", { scale: 1.45, y: -8, autoAlpha: 0, duration: 0.95 }, 0.25)
      .to(sceneRef.current, { autoAlpha: 0, duration: 0.3 }, 0.9);
  };

  return (
    <section
      ref={sceneRef}
      className="opening-scene"
      aria-label="100th Day Donation invitation opening"
    >
      <img
        className="opening-layer opening-bg"
        src={A + "01_pagoda_backdrop.png"}
        alt=""
      />

      <div className="petal-field" aria-hidden="true">
        {[10, 24, 42, 63, 79, 91].map((left, index) => (
          <img
            key={left}
            className="opening-layer floating-petal"
            src={A + "12_floating_petal.png"}
            alt=""
            style={{
              left: left + "%",
              top: 8 + ((index * 12) % 40) + "%",
              width: 22 + (index % 3) * 7,
            }}
          />
        ))}
      </div>

      <div className="invitation-stack">
        <div className="card-stage">
          <img
            className="opening-layer card-container"
            src={A + "03_card_container.png"}
            alt=""
          />
          <img
            className="opening-layer paper-texture"
            src={A + "02_ivory_paper_texture.png"}
            alt=""
          />
          <img
            className="opening-layer gold-ornaments"
            src={A + "09_gold_ornaments.png"}
            alt=""
          />
          <img
            className="opening-layer baby-photo"
            src={A + "04_baby_photo_sample.png"}
            alt="Child portrait"
          />
          <img
            className="opening-layer photo-frame"
            src={A + "05_photo_frame.png"}
            alt=""
          />
          <img
            className="opening-layer invitation-type"
            src={A + "06_invitation_typography.png"}
            alt="100th Day Donation Ceremony"
          />
          <img
            className="opening-layer ribbon"
            src={A + "07_satin_ribbon.png"}
            alt=""
          />
          <img
            className="opening-layer seal"
            src={A + "08_lotus_wax_seal.png"}
            alt=""
          />
        </div>

        <button
          className="open-invitation"
          type="button"
          onClick={openInvitation}
          aria-label="Open invitation"
        >
          <img src={A + "10_open_invitation_button.png"} alt="" />
        </button>
      </div>

      <img
        className="opening-layer lotus-foreground"
        src={A + "11_lotus_foreground.png"}
        alt=""
      />
    </section>
  );
}
