"use client";

import { useEffect } from "react";

const galleryImages = [
  "/child's photo/01-100-days-baby-portrait.jpg",
  "/child's photo/02-newborn-hand-closeup.jpg",
  "/child's photo/03-parents-with-newborn-portrait.jpg",
  "/child's photo/04-parents-holding-newborn.jpg",
  "/child's photo/05-sleeping-newborn-closeup.jpg",
  "/child's photo/06-baby-smiling-with-parents.jpg",
  "/child's photo/07-baby-red-hat-portrait.jpg",
  "/child's photo/08-mother-holding-baby.jpg",
];

const detailItems = [
  {
    label: "Date",
    value: "To be confirmed",
    note: "The family will share the confirmed ceremony date here.",
  },
  {
    label: "Time",
    value: "To be confirmed",
    note: "Ceremony time will be added once the schedule is final.",
  },
  {
    label: "Venue",
    value: "To be confirmed",
    note: "The full venue name and address will appear here.",
  },
];

export default function InvitationContent() {
  useEffect(() => {
    const revealItems = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
    );

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
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
      {
        threshold: 0.14,
        rootMargin: "0px 0px -7% 0px",
      }
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="invitation-site">
      <section id="invitation-content" className="invitation-hero">
        <div className="paper-texture" aria-hidden="true" />
        <img
          className="hero-ornament hero-ornament-top"
          src="/opening/09_gold_ornaments.png"
          alt=""
          aria-hidden="true"
        />

        <div className="hero-copy" data-reveal>
          <p className="section-kicker">100TH DAY DONATION CEREMONY</p>
          <p className="hero-script">With love &amp; gratitude</p>
          <h1>100 Days of Love</h1>
          <span className="gold-divider" aria-hidden="true" />
          <p className="hero-intro">
            With grateful hearts, we celebrate one hundred precious days filled
            with love, joy and blessings.
          </p>
        </div>

        <div className="hero-portrait-wrap" data-reveal>
          <div className="hero-portrait-halo" aria-hidden="true" />
          <img
            className="hero-portrait"
            src="/child's photo/01-100-days-baby-portrait.jpg"
            alt="Portrait for the 100th day celebration"
          />
          <img
            className="hero-portrait-frame"
            src="/opening/05_photo_frame.png"
            alt=""
            aria-hidden="true"
          />
        </div>

        <div className="hero-scroll-cue" aria-hidden="true">
          <span />
          <small>Scroll to continue</small>
        </div>
      </section>

      <section className="invitation-section welcome-section">
        <div className="section-shell narrow" data-reveal>
          <p className="section-kicker">A DAY OF GRATITUDE</p>
          <h2>A little life, a hundred beautiful days</h2>
          <span className="gold-divider" aria-hidden="true" />
          <p className="ceremony-copy">
            Today is a quiet celebration of the love, care and blessings that
            have surrounded our little one through the first one hundred days.
            We are grateful to share this meaningful moment with the people who
            are dear to our family.
          </p>
        </div>
      </section>

      <section className="invitation-section details-section">
        <div className="section-shell">
          <div className="section-heading" data-reveal>
            <p className="section-kicker">CEREMONY DETAILS</p>
            <h2>Join us for this special day</h2>
            <p>
              Confirmed date, time and venue information can be placed here as
              soon as the family finalizes the ceremony arrangements.
            </p>
          </div>

          <div className="details-grid">
            {detailItems.map((item) => (
              <article className="detail-card" key={item.label} data-reveal>
                <span className="detail-label">{item.label}</span>
                <strong>{item.value}</strong>
                <span className="detail-rule" aria-hidden="true" />
                <p>{item.note}</p>
              </article>
            ))}
          </div>

          <div className="schedule-note" data-reveal>
            <span className="schedule-mark" aria-hidden="true">✦</span>
            <p>
              A short ceremony schedule can be added here once the final
              sequence is confirmed.
            </p>
          </div>
        </div>
      </section>

      <section className="invitation-section story-section">
        <div className="section-shell story-grid">
          <figure className="story-photo-wrap" data-reveal>
            <img
              src="/child's photo/07-baby-red-hat-portrait.jpg"
              alt="A family memory from the baby's first 100 days"
              loading="lazy"
            />
            <span className="story-photo-border" aria-hidden="true" />
          </figure>

          <div className="story-copy" data-reveal>
            <p className="section-kicker">OUR FIRST 100 DAYS</p>
            <h2>Small moments that became precious memories</h2>
            <span className="gold-divider" aria-hidden="true" />
            <p>
              The first one hundred days have been made of tiny changes,
              sleepy mornings, warm embraces and countless moments our family
              will remember for years to come.
            </p>
            <p>
              This celebration is our way of pausing for a moment, giving
              thanks, and sharing that joy with everyone who has cared for us.
            </p>
          </div>
        </div>
      </section>

      <section className="invitation-section gallery-section">
        <div className="section-shell">
          <div className="section-heading centered" data-reveal>
            <p className="section-kicker">LITTLE MOMENTS</p>
            <h2>A few memories from the journey</h2>
            <span className="gold-divider" aria-hidden="true" />
          </div>

          <div className="gallery-grid">
            {galleryImages.map((src, index) => (
              <figure
                className={`gallery-item gallery-item-${index + 1}`}
                key={src}
                data-reveal
              >
                <img
                  src={src}
                  alt={`Family memory ${index + 1}`}
                  loading="lazy"
                />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="invitation-section venue-section">
        <div className="section-shell venue-grid">
          <div className="venue-copy" data-reveal>
            <p className="section-kicker">VENUE &amp; DIRECTIONS</p>
            <h2>We look forward to welcoming you</h2>
            <span className="gold-divider" aria-hidden="true" />
            <p className="venue-name">Venue to be confirmed</p>
            <p className="venue-address">
              The full venue name, address and map directions will be added
              here when the family confirms the location.
            </p>
            <span className="venue-button is-disabled">
              Directions available after confirmation
            </span>
          </div>

          <div className="venue-art" data-reveal aria-hidden="true">
            <img
              className="venue-pagoda"
              src="/opening/01_pagoda_backdrop.png"
              alt=""
            />
            <div className="venue-art-overlay" />
            <span className="venue-gold-ring" />
          </div>
        </div>
      </section>

      <section className="invitation-section blessing-section">
        <img
          className="blessing-lotus"
          src="/opening/11_lotus_foreground.png"
          alt=""
          aria-hidden="true"
          loading="lazy"
        />
        <img
          className="blessing-petal blessing-petal-one"
          src="/opening/12_floating_petal.png"
          alt=""
          aria-hidden="true"
          loading="lazy"
        />
        <img
          className="blessing-petal blessing-petal-two"
          src="/opening/12_floating_petal.png"
          alt=""
          aria-hidden="true"
          loading="lazy"
        />

        <div className="section-shell narrow blessing-copy" data-reveal>
          <p className="section-kicker">A BLESSING</p>
          <h2>May every day ahead be filled with warmth and grace</h2>
          <span className="gold-divider" aria-hidden="true" />
          <p>
            May our little one grow surrounded by kindness, good health,
            wisdom and people who offer love with generous hearts.
          </p>
          <p className="blessing-thanks">
            Thank you for being part of this beautiful beginning.
          </p>
        </div>
      </section>

      <section className="invitation-closing">
        <div className="closing-card" data-reveal>
          <img
            className="closing-ornament"
            src="/opening/09_gold_ornaments.png"
            alt=""
            aria-hidden="true"
            loading="lazy"
          />
          <p className="section-kicker">WITH LOVE</p>
          <h2>Thank you for celebrating with us</h2>
          <p>
            Your presence, blessings and good wishes make this milestone even
            more meaningful to our family.
          </p>
          <span className="closing-signoff">From our family</span>
        </div>
      </section>
    </div>
  );
}
