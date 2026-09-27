"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./OpeningScene.module.css";

const openingPhotos = [
  {
    src: "/child's photo/05-sleeping-newborn-closeup.jpg",
    className: styles.photoOne,
  },
  {
    src: "/child's photo/01-100-days-baby-portrait.jpg",
    className: styles.photoTwo,
  },
  {
    src: "/child's photo/07-baby-red-hat-portrait.jpg",
    className: styles.photoThree,
  },
] as const;

export default function OpeningScene() {
  const [leaving, setLeaving] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    document.body.classList.add("intro-active");
    return () => document.body.classList.remove("intro-active");
  }, []);

  const openInvitation = () => {
    if (leaving) return;

    setLeaving(true);

    window.setTimeout(() => {
      setHidden(true);
      document.body.classList.remove("intro-active");
      document.getElementById("invitation-content")?.scrollIntoView({
        block: "start",
      });
    }, 720);
  };

  if (hidden) return null;

  return (
    <section
      className={`${styles.opening} ${leaving ? styles.leaving : ""}`}
      aria-label="100 Days of Love opening"
    >
      <div className={styles.paperTexture} aria-hidden="true" />

      <div className={styles.ambient} aria-hidden="true">
        <span className={styles.bubbleOne} />
        <span className={styles.bubbleTwo} />
        <span className={styles.bubbleThree} />
        <span className={styles.bubbleFour} />
      </div>

      <div className={styles.content}>
        <p className={styles.eyebrow}>WITH LOVE &amp; GRATITUDE</p>

        <div className={styles.maskStage} aria-hidden="true">
          <div className={styles.photoMask}>
            {openingPhotos.map((photo, index) => (
              <div
                className={`${styles.photoSlice} ${photo.className}`}
                key={photo.src}
              >
                <Image
                  src={photo.src}
                  alt=""
                  fill
                  priority={index === 1}
                  sizes="(max-width: 560px) 92vw, 640px"
                />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.copyBlock}>
          <h1>
            <span className={styles.srOnly}>100 </span>
            Days of Love
          </h1>

          <p className={styles.subtitle}>
            A little life. A hundred beautiful days.
          </p>
        </div>

        <button
          className={styles.openButton}
          type="button"
          onClick={openInvitation}
          aria-label="Open the invitation"
        >
          <span>Open Invitation</span>
          <span className={styles.arrow} aria-hidden="true">
            →
          </span>
        </button>

        <div className={styles.divider} aria-hidden="true">
          <span />
          <b>100</b>
          <span />
        </div>
      </div>
    </section>
  );
}
