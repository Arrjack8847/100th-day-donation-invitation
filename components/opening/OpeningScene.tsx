"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const A = "/opening/";

export default function OpeningScene() {
  const sceneRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(".opening-layer, .open-invitation", {
          autoAlpha: 1,
          clearProps: "transform,filter",
        });
        return;
      }

      gsap.set(".opening-bg", {
        autoAlpha: 0,
        scale: 1.05,
        filter: "blur(8px)",
      });
      gsap.set(".lotus-foreground", { autoAlpha: 0, y: 30, scale: 1.04 });
      gsap.set(".card-stage", {
        autoAlpha: 0,
        y: 42,
        scale: 0.94,
        rotateX: 3,
        transformPerspective: 1100,
      });
      gsap.set(".baby-photo, .photo-frame", { autoAlpha: 0, scale: 1.06 });
      gsap.set(".invitation-type", { autoAlpha: 0, y: 12 });
      gsap.set(".ribbon", { x: 0, y: 0, rotate: 0 });
      gsap.set(".seal", { rotate: 0, scale: 1 });
      gsap.set(".open-invitation", { autoAlpha: 0, y: 18 });

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.to(".opening-bg", {
        autoAlpha: 1,
        scale: 1,
        filter: "blur(1.5px)",
        duration: 1.1,
      })
        .to(
          ".lotus-foreground",
          { autoAlpha: 1, y: 0, scale: 1, duration: 1 },
          0.65
        )
        .to(
          ".card-stage",
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
        .to(".seal", { rotate: 7, scale: 0.98, duration: 0.4 }, 2.5)
        .to(
          ".ribbon",
          {
            x: 24,
            y: 8,
            rotate: 5,
            duration: 0.85,
            ease: "power2.inOut",
          },
          2.55
        )
        .to(
          ".baby-photo, .photo-frame",
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.9,
            stagger: 0.08,
          },
          3.15
        )
        .to(
          ".invitation-type",
          { autoAlpha: 1, y: 0, duration: 0.75 },
          3.95
        )
        .to(
          ".open-invitation",
          { autoAlpha: 1, y: 0, duration: 0.8 },
          5.05
        );

      gsap.to(".floating-petal", {
        y: "random(30, 90)",
        x: "random(-22, 22)",
        rotate: "random(-35, 35)",
        duration: "random(5, 8)",
        ease: "sine.inOut",
        stagger: { each: 0.55, repeat: -1, yoyo: true },
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
      .to(
        ".lotus-foreground",
        { scale: 1.08, y: 55, autoAlpha: 0, duration: 0.75 },
        0.15
      )
      .to(
        ".opening-bg",
        { scale: 1.08, filter: "blur(12px)", autoAlpha: 0.35, duration: 0.9 },
        0.15
      )
      .to(
        ".card-stage",
        { scale: 1.65, y: -12, autoAlpha: 0, duration: 1 },
        0.25
      )
      .to(sceneRef.current, { autoAlpha: 0, duration: 0.35 }, 0.95);
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
        {[8, 22, 37, 61, 77, 89].map((left, index) => (
          <img
            key={left}
            className="opening-layer floating-petal"
            src={A + "12_floating_petal.png"}
            alt=""
            style={{
              left: left + "%",
              top: 9 + ((index * 13) % 42) + "%",
              width: 28 + (index % 3) * 9,
            }}
          />
        ))}
      </div>

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

      <img
        className="opening-layer lotus-foreground"
        src={A + "11_lotus_foreground.png"}
        alt=""
      />

      <button
        className="open-invitation"
        type="button"
        onClick={openInvitation}
        aria-label="Open invitation"
      >
        <img src={A + "10_open_invitation_button.png"} alt="" />
      </button>
    </section>
  );
}
