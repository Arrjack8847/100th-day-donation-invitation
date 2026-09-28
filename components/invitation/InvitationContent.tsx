"use client";

import { useEffect } from "react";
import MilestoneSection from "./MilestoneSection";\nimport MeaningSection from "./MeaningSection";

const photos = [
  "/child's photo/01-100-days-baby-portrait.jpg",
  "/child's photo/05-sleeping-newborn-closeup.jpg",
  "/child's photo/03-parents-with-newborn-portrait.jpg",
  "/child's photo/06-baby-smiling-with-parents.jpg",
];

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 3v3M17 3v3M4.5 9h15M6 5h12a2 2 0 0 1 2 2v12H4V7a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s6-5.1 6-11a6 6 0 1 0-12 0c0 5.9 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2" />
    </svg>
  );
}

const details = [
  {
    icon: <CalendarIcon />,
    label: "Date",
    value: "To be confirmed",
    note: "The family will share the ceremony date here.",
  },
  {
    icon: <ClockIcon />,
    label: "Time",
    value: "To be confirmed",
    note: "The final ceremony time will be added here.",
  },
  {
    icon: <PinIcon />,
    label: "Venue",
    value: "To be confirmed",
    note: "The complete venue and address will appear here.",
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
          <div className="hero-copy-new" data-reveal>
            <p className="mini-label hero-kicker">WITH LOVE &amp; GRATITUDE</p>

            <div className="hero-ornament" aria-hidden="true">
              <span />
              <b>♥</b>
              <span />
            </div>

            <h1 className="hero-title">
              <span className="hero-number">100</span>
              <span className="hero-days">Days of Love</span>
            </h1>

            <p className="hero-invite-copy">
              Join us for our little one&apos;s
              <br />
              100th-day donation ceremony.
            </p>

            <a className="sage-button hero-cta" href="#event-details">
              <span>View invitation</span>
              <span className="hero-cta-arrow" aria-hidden="true">↓</span>
            </a>
          </div>

          <div className="hero-photo-shell" data-reveal>
            <div className="hero-photo-glow" aria-hidden="true" />
            <div className="hero-photo-blob">
              <img
                src="/child's photo/01-100-days-baby-portrait.jpg"
                alt="Our little one celebrating 100 days"
              />
            </div>
            <span className="hero-photo-bubble hero-photo-bubble-one" aria-hidden="true" />
            <span className="hero-photo-bubble hero-photo-bubble-two" aria-hidden="true" />
          </div>
        </div>
      </section>

      <MilestoneSection />

      <MeaningSection />

      <section className="love-section moments-section">
        <div className="mobile-shell">
          <div className="section-heading-new" data-reveal>
            <p className="mini-label">OUR LITTLE ONE</p>
            <h2>Moments of Joy</h2>
            <p>A few pieces of our first 100 days that we will always keep close.</p>
          </div>

          <div className="moments-grid">
            {photos.map((src, index) => (
              <figure
                className={`moment-card moment-${index + 1}`}
                key={src}
                data-reveal
              >
                <img
                  src={src}
                  alt={`A family memory from the first 100 days, photo ${index + 1}`}
                  loading="lazy"
                />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="event-details" className="love-section event-section">
        <div className="page-bubbles page-bubbles-details" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className="mobile-shell">
          <div className="section-heading-new" data-reveal>
            <p className="mini-label">YOU&apos;RE INVITED</p>
            <h2>Ceremony Information</h2>
            <p>Everything you need for the special day, kept simple and easy to read.</p>
          </div>

          <div className="event-card" data-reveal>
            {details.map((detail) => (
              <div className="event-row" key={detail.label}>
                <span className="event-icon">{detail.icon}</span>
                <div>
                  <span className="event-label">{detail.label}</span>
                  <strong>{detail.value}</strong>
                  <p>{detail.note}</p>
                </div>
              </div>
            ))}
          </div>
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
