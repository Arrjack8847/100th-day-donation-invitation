"use client";

import { useEffect, type CSSProperties } from "react";
import MilestoneSection from "./MilestoneSection";
import MeaningSection from "./MeaningSection";

const photos = [
  "/child's photo/01-100-days-baby-portrait.jpg",
  "/child's photo/05-sleeping-newborn-closeup.jpg",
  "/child's photo/03-parents-with-newborn-portrait.jpg",
  "/child's photo/06-baby-smiling-with-parents.jpg",
];

type CeremonyDetailType = "date" | "time" | "venue";

function CeremonyIllustration({ type }: { type: CeremonyDetailType }) {
  if (type === "date") {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M18 17.5h28a5 5 0 0 1 5 5v27H13v-27a5 5 0 0 1 5-5Z" />
        <path d="M13 27h38M22 12v10M42 12v10" />
        <path d="M31.9 34.2c-3.8-4.5-10.3 1.1 0 9.1 10.3-8 3.8-13.6 0-9.1Z" />
      </svg>
    );
  }

  if (type === "time") {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="34" r="18.5" />
        <path d="M32 22v12l8 5M24 11h16M27 15h10" />
        <path d="M17.5 20.5 13 16M46.5 20.5 51 16" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M12 50h40M18 46h28M21 41h22M24 36h16" />
      <path d="M27 36h10l-2-5h-6l-2 5ZM29 31h6l-1.5-5h-3L29 31Z" />
      <path d="M30.5 26h3l-1.5-6-1.5 6ZM32 20v-5M29.5 17.5 32 14l2.5 3.5" />
      <path d="M18 46c2-3 4-4 6-5M46 46c-2-3-4-4-6-5" />
    </svg>
  );
}

const details: Array<{
  type: CeremonyDetailType;
  label: string;
  value: string;
  note: string;
}> = [
  {
    type: "date",
    label: "Date",
    value: "To be confirmed",
    note: "Ceremony date",
  },
  {
    type: "time",
    label: "Time",
    value: "To be confirmed",
    note: "Ceremony time",
  },
  {
    type: "venue",
    label: "Venue",
    value: "To be confirmed",
    note: "Full location will be shared soon.",
  },
];

export default function InvitationContent() {
  useEffect(() => {
    const items = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
    );

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -5% 0px" }
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <div id="invitation-content" className="love-site">
      <section className="love-hero">
        <div className="page-bubbles page-bubbles-hero" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>

        <div className="hero-inner">
          <header className="hero-intro" data-reveal>
            <p className="mini-label hero-kicker">OUR LITTLE ONE</p>

            <div className="hero-ornament" aria-hidden="true">
              <span />
              <b>♡</b>
              <span />
            </div>
          </header>

          <div className="hero-photo-shell">
            <div className="hero-photo-glow" aria-hidden="true" />

            <div className="hero-photo-blob">
              <img
                src="/child's photo/01-100-days-baby-portrait.jpg"
                alt="Our little one celebrating 100 days"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </div>

            <span className="hero-photo-bubble hero-photo-bubble-one" aria-hidden="true" />
            <span className="hero-photo-bubble hero-photo-bubble-two" aria-hidden="true" />
            <span className="hero-heart hero-heart-one" aria-hidden="true">♡</span>
            <span className="hero-heart hero-heart-two" aria-hidden="true">♡</span>
          </div>

          <div className="hero-copy-new">
            <h1 className="hero-title">
              <span className="hero-title-main">100 tiny days,</span>
              <span className="hero-title-script">
                a lifetime of love ahead. <i aria-hidden="true">♡</i>
              </span>
            </h1>

            <p className="hero-invite-copy">
              Thank you for celebrating this beautiful beginning with us.
            </p>

            <div className="hero-scroll-cue" aria-hidden="true">
              <span>our little story</span>
              <b>↓</b>
            </div>
          </div>
        </div>
      </section>

      <MilestoneSection />

      <MeaningSection />

      <section className="love-section moments-section">
        <div className="moments-paper" aria-hidden="true" />

        <div className="mobile-shell moments-shell">
          <header className="moments-heading" data-reveal>
            <p className="mini-label">OUR LITTLE ONE</p>
            <h2>
              Moments <em>of Joy</em>
              <span className="moments-title-heart" aria-hidden="true">♡</span>
            </h2>
            <p className="moments-subtitle">A hundred days of little memories.</p>

            <svg
              className="moments-divider"
              viewBox="0 0 210 24"
              role="presentation"
              aria-hidden="true"
            >
              <path d="M3 12C35 5 69 18 101 12C133 6 168 18 207 12" />
              <path d="M105 11C97 2 90 5 94 11C97 16 102 14 105 11C113 2 120 5 116 11C113 16 108 14 105 11M105 12V21" />
            </svg>
          </header>

          <div className="moments-collage">
            <span className="moments-wash moments-wash-peach" aria-hidden="true" />
            <span className="moments-wash moments-wash-sage" aria-hidden="true" />

            <div className="moments-accents" data-reveal aria-hidden="true">
              <span className="moments-heart moments-heart-one">♡</span>
              <span className="moments-heart moments-heart-two">♡</span>
              <span className="moments-sparkle moments-sparkle-one">✦</span>
              <span className="moments-sparkle moments-sparkle-two">✧</span>
              <span className="moments-dots">···</span>
            </div>

            <figure className="moment-photo moment-photo-hero" data-reveal>
              <span className="moment-tape moment-tape-left" aria-hidden="true" />
              <img
                src={photos[0]}
                alt="Our little one celebrating 100 days"
                loading="lazy"
              />
            </figure>

            <figure className="moment-photo moment-photo-newborn" data-reveal>
              <span className="moment-tape moment-tape-center" aria-hidden="true" />
              <img
                src={photos[1]}
                alt="A peaceful newborn memory"
                loading="lazy"
              />
            </figure>

            <figure className="moment-photo moment-photo-family" data-reveal>
              <span className="moment-tape moment-tape-center" aria-hidden="true" />
              <img
                src={photos[2]}
                alt="A family memory from the first 100 days"
                loading="lazy"
              />
            </figure>

            <figure className="moment-photo moment-photo-smile" data-reveal>
              <span className="moment-tape moment-tape-right" aria-hidden="true" />
              <img
                src={photos[3]}
                alt="A joyful memory with our little one"
                loading="lazy"
              />
            </figure>

            <p className="moments-handwritten" data-reveal>
              our little sunshine <span aria-hidden="true">♡</span>
            </p>
          </div>

          <div className="moments-closing" data-reveal>
            <span>100 little days,</span>
            <span>a lifetime of love. <b aria-hidden="true">♡</b></span>
          </div>
        </div>
      </section>

      <section id="event-details" className="love-section event-section">
        <div className="event-paper-texture" aria-hidden="true" />

        <div className="mobile-shell event-shell">
          <article className="ceremony-paper" data-reveal>
            <div className="ceremony-paper-grain" aria-hidden="true" />
            <span className="ceremony-tape" aria-hidden="true" />
            <span className="ceremony-ribbon" aria-hidden="true">
              <i />
              <b />
            </span>

            <svg
              className="ceremony-botanical ceremony-botanical-top"
              viewBox="0 0 120 150"
              aria-hidden="true"
            >
              <path d="M83 142C78 108 80 71 99 20" />
              <path d="M88 99c-17-7-27-20-26-32 15 2 25 12 26 32ZM91 79c16-8 24-20 22-31-14 2-22 12-22 31ZM80 119c-13-4-23-13-26-24 13-1 23 7 26 24Z" />
              <circle cx="100" cy="18" r="7" />
              <path d="M100 10c-5-9-13-5-11 2M107 13c8-7 12 1 8 5M96 23c-7 7 1 12 6 8" />
            </svg>

            <svg
              className="ceremony-botanical ceremony-botanical-bottom"
              viewBox="0 0 120 150"
              aria-hidden="true"
            >
              <path d="M35 145C37 108 34 74 17 25" />
              <path d="M31 113c15-7 24-18 23-29-14 2-23 11-23 29ZM28 91c-14-6-22-17-21-27 13 1 21 10 21 27ZM38 130c12-3 21-11 24-21-12-1-21 6-24 21Z" />
            </svg>

            <header className="ceremony-heading">
              <p className="ceremony-kicker">THE CEREMONY</p>
              <h2>
                Join Us for
                <span>
                  A Special Day <i aria-hidden="true">♡</i>
                </span>
              </h2>
              <p className="ceremony-script">
                celebrating 100 beautiful days <span aria-hidden="true">♡</span>
              </p>

              <div className="ceremony-divider" aria-hidden="true">
                <span />
                <b>♡</b>
                <span />
              </div>
            </header>

            <div className="ceremony-details">
              {details.map((detail, index) => (
                <div
                  className={`ceremony-detail ceremony-detail-${detail.type}`}
                  data-reveal
                  key={detail.label}
                  style={{ "--detail-delay": `${0.12 + index * 0.11}s` } as CSSProperties}
                >
                  <span className="ceremony-illustration" aria-hidden="true">
                    <CeremonyIllustration type={detail.type} />
                  </span>

                  <div className="ceremony-detail-copy">
                    <span className="ceremony-detail-label">{detail.label}</span>
                    <strong>{detail.value}</strong>
                    <em>{detail.note}</em>
                  </div>
                </div>
              ))}
            </div>

            <p className="ceremony-pending-note">
              We&apos;ll share the confirmed ceremony details here soon. <span aria-hidden="true">♡</span>
            </p>

            <div className="ceremony-finial" aria-hidden="true">♡</div>
          </article>
        </div>
      </section>

      <section className="love-section donation-section">
        <div className="mobile-shell donation-card" data-reveal>
          <div className="donation-decoration" aria-hidden="true">♡</div>
          <p className="mini-label">DONATION</p>
          <h2>Sharing Love</h2>
          <p>
            In celebration of our child&apos;s 100th day, we will be making a
            donation as a gesture of gratitude and kindness. Your presence and
            blessings are the most meaningful gifts to us.
          </p>
          <span className="script-note">Love grows when it is shared.</span>
        </div>
      </section>

      <section className="love-closing">
        <div className="closing-photo" data-reveal>
          <img
            src="/child's photo/06-baby-smiling-with-parents.jpg"
            alt="A joyful family memory"
            loading="lazy"
          />
        </div>

        <div className="closing-copy-new" data-reveal>
          <p className="mini-label">WITH LOVE</p>
          <h2>See You<br />There ♡</h2>
          <p>
            Thank you for being part of this beautiful beginning with us.
          </p>
        </div>
      </section>
    </div>
  );
}
