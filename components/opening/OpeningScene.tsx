"use client";

import { useEffect, useState } from "react";

const bubbles = [
  "bubble-a",
  "bubble-b",
  "bubble-c",
  "bubble-d",
  "bubble-e",
  "bubble-f",
  "bubble-g",
  "bubble-h",
  "bubble-i",
];

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
    }, 760);
  };

  if (hidden) return null;

  return (
    <section
      className={`love-opening${leaving ? " is-leaving" : ""}`}
      aria-label="100 Days of Love opening"
    >
      <div className="opening-paper" aria-hidden="true" />

      <div className="bubble-field" aria-hidden="true">
        {bubbles.map((bubble) => (
          <span className={`soft-bubble ${bubble}`} key={bubble} />
        ))}
      </div>

      <div className="opening-copy">
        <p className="opening-eyebrow">WITH LOVE &amp; GRATITUDE</p>

        <div className="opening-title" aria-label="100 Days of Love">
          <span className="opening-100">100</span>
          <h1>Days of Love</h1>
        </div>

        <span className="tiny-heart" aria-hidden="true">♡</span>

        <p className="opening-note">
          A little life. A hundred beautiful days.
        </p>

        <button
          className="opening-button"
          type="button"
          onClick={openInvitation}
          aria-label="Open the invitation"
        >
          <span>Open invitation</span>
          <span aria-hidden="true">→</span>
        </button>

        <p className="opening-hint">Tap to begin</p>
      </div>
    </section>
  );
}
