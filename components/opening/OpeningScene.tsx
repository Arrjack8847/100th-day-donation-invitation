"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function OpeningScene() {
  const rootRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(buttonRef.current, { autoAlpha: 0, y: 16 });

      if (ready) {
        gsap.to(buttonRef.current, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, [ready]);

  const openInvitation = () => {
    const target = document.getElementById("invitation-content");

    gsap
      .timeline()
      .to(rootRef.current, {
        scale: 1.03,
        filter: "blur(3px)",
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
      })
      .set(rootRef.current, { display: "none" })
      .add(() => {
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
  };

  return (
    <section ref={rootRef} className="opening-scene" aria-label="Invitation opening">
      <video
        className="opening-video opening-video-desktop"
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={() => setReady(true)}
      >
        <source src="/opening/intro-desktop.mp4" type="video/mp4" />
      </video>

      <video
        className="opening-video opening-video-mobile"
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={() => setReady(true)}
      >
        <source src="/opening/intro-mobile.mp4" type="video/mp4" />
      </video>

      <div className="opening-overlay" />

      <button
        ref={buttonRef}
        type="button"
        className="open-button"
        onClick={openInvitation}
      >
        Open Invitation
        <span aria-hidden="true">›</span>
      </button>
    </section>
  );
}
