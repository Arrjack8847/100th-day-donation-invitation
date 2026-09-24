"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { openingAssets as A } from "./openingAssets";
import LayoutEditor from "./LayoutEditor";

const isLayoutEditorEnabled = () =>
  process.env.NODE_ENV !== "production" &&
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).get("edit") === "1";



export default function OpeningScene() {
  const sceneRef = useRef<HTMLElement>(null);
  const openedRef = useRef(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    setEditMode(isLayoutEditorEnabled());
  }, []);

  useLayoutEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const editing = isLayoutEditorEnabled();

    const ctx = gsap.context(() => {
      if (editing) {
        gsap.set(".opening-bg", {
          autoAlpha: 1,
          scale: 1,
          filter: "blur(1.5px) saturate(0.82) contrast(0.90) brightness(1.06) sepia(0.06)",
        });
        gsap.set(".box-stage", { autoAlpha: 1, y: 0, scale: 1 });
        gsap.set(
          [".box-left-flap .box-door-art", ".box-right-flap .box-door-art"],
          { rotateY: 0 }
        );
        gsap.set(".box-card-slot", { autoAlpha: 0, y: 0, scale: 1 });
        gsap.set([".baby-mask", ".photo-frame", ".invitation-type"], { autoAlpha: 0 });
        gsap.set(".open-invitation", { autoAlpha: 1, y: 0, scale: 1 });
        return;
      }
      gsap.set([".box-card-slot", ".photo-frame", ".baby-mask", ".invitation-type"], {
        autoAlpha: 0,
      });
      gsap.set(
          [".box-left-flap .box-door-art", ".box-right-flap .box-door-art"],
          { rotateY: 0 }
        );
      gsap.set(".open-invitation", { autoAlpha: 0, y: 12 });

      if (reduced) {
        gsap.set(".opening-bg", { autoAlpha: 1 });
        gsap.set(".box-stage", { autoAlpha: 1 });
        gsap.set(".open-invitation", { autoAlpha: 1, y: 0 });
        return;
      }

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(
          ".opening-bg",
          { autoAlpha: 0, scale: 1.035, filter: "blur(7px) saturate(0.78) contrast(0.88) brightness(1.08) sepia(0.08)" },
          {
            autoAlpha: 1,
            scale: 1,
            filter: "blur(1.5px) saturate(0.82) contrast(0.90) brightness(1.06) sepia(0.06)",
            duration: 0.95,
            ease: "power2.out",
          },
          0
        )
        .fromTo(
          ".box-stage",
          { autoAlpha: 0, y: 28, scale: 0.97 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.9 },
          0.38
        )
        .to(
          ".open-invitation",
          { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" },
          0.95
        );
    }, sceneRef);

    return () => ctx.revert();
  }, []);

  const enterInvitation = () => {
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
      .to(".open-invitation", { autoAlpha: 0, y: 8, duration: 0.25 }, 0.18)
      .to(
        [".box-left-flap", ".box-right-flap"],
        { autoAlpha: 0, duration: 0.42, ease: "power2.in" },
        0.22
      )
      .to(
        ".box-inner-tray",
        { autoAlpha: 0, duration: 0.65 },
        0.26
      )
      .to(
        ".opening-bg",
        { scale: 1.07, filter: "blur(10px) saturate(0.76) contrast(0.88) brightness(1.08) sepia(0.08)", autoAlpha: 0.36, duration: 0.8 },
        0.24
      )
      .to(
        ".box-card-slot",
        { scale: 1.42, y: -8, autoAlpha: 0, duration: 0.9 },
        0.3
      )
      .to(sceneRef.current, { autoAlpha: 0, duration: 0.3 }, 0.98);
  };

  const openInvitation = () => {
    if (isLayoutEditorEnabled()) return;

    if (openedRef.current) {
      enterInvitation();
      return;
    }

    openedRef.current = true;

    gsap
      .timeline({ defaults: { ease: "power3.inOut" } })
      .to(".open-invitation", { scale: 0.97, duration: 0.12 })
      .to(".open-invitation", { scale: 1, duration: 0.12 })
      .to(".open-invitation", { autoAlpha: 0, y: 8, duration: 0.22 }, 0.16)
      .to(
        ".box-left-flap .box-door-art",
        { rotateY: -90, duration: 1.05, ease: "power3.inOut" },
        0.34
      )
      .to(
        ".box-right-flap .box-door-art",
        { rotateY: 90, duration: 1.05, ease: "power3.inOut" },
        0.46
      )
      .fromTo(
        ".box-card-slot",
        { autoAlpha: 0, scale: 0.95, y: 16 },
        { autoAlpha: 1, scale: 1, y: 0, duration: 0.7, ease: "power3.out" },
        1.05
      )
      .fromTo(
        ".baby-mask",
        { autoAlpha: 0, scale: 0.98 },
        { autoAlpha: 1, scale: 1, duration: 0.5, ease: "power2.out" },
        1.42
      )
      .fromTo(
        ".photo-frame",
        { autoAlpha: 0, y: 6 },
        { autoAlpha: 1, y: 0, duration: 0.42, ease: "power2.out" },
        1.5
      )
      .fromTo(
        ".invitation-type",
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.62, ease: "power2.out" },
        1.72
      )
      .to(
        ".open-invitation",
        { autoAlpha: 1, y: 0, duration: 0.48, ease: "power2.out" },
        2.28
      );
  };

  return (
    <section
      ref={sceneRef}
      className={`opening-scene${editMode ? " layout-editing" : ""}`}
      aria-label="100th Day Donation invitation opening"
    >
      <img className="opening-layer opening-bg" src={A.background} alt="" />

      <div className="box-composition">
        <div className="box-stage">
          <img
            className="opening-layer box-full-layer box-inner-tray"
            data-edit-key="tray"
            src={A.box.innerTray}
            alt=""
          />

          <div className="box-card-slot" data-edit-key="card">
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

          <div className="box-door box-left-flap" data-edit-key="leftFlap" aria-hidden="true">
            <img className="box-door-art" src={A.box.leftFlap} alt="" />
          </div>
          <div className="box-door box-right-flap" data-edit-key="rightFlap" aria-hidden="true">
            <img className="box-door-art" src={A.box.rightFlap} alt="" />
          </div>
        </div>

        <button
          className="open-invitation"
          data-edit-key="button"
          type="button"
          onClick={openInvitation}
          aria-label="Open invitation"
        >
          <img src={A.openButton} alt="" />
        </button>
      </div>

      {editMode && <LayoutEditor />}
    </section>
  );
}
