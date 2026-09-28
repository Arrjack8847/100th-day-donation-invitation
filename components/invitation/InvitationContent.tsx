"use client";

import { useEffect, type CSSProperties } from "react";
import MilestoneSection from "./MilestoneSection";
import MeaningSection from "./MeaningSection";
import SectionBridge from "../decor/SectionBridge";
import {
  PaperTexture,
  ScrapbookTape,
  SectionDecor,
  SectionDivider,
} from "../decor/SiteDecor";

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
      <PaperTexture />

      <section className="love-hero">
        <SectionDecor variant="hero" />

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

      <SectionBridge variant="heroToMilestone" />

      <MilestoneSection />
      <SectionBridge variant="milestoneToMeaning" />

      <MeaningSection />
      <SectionBridge variant="meaningToMoments" />

      <section className="love-section moments-section">
        <div className="moments-paper" aria-hidden="true" />
        <SectionDecor variant="moments" />

        <div className="mobile-shell moments-shell">
          <header className="moments-heading" data-reveal>
            <p className="mini-label">OUR LITTLE ONE</p>
            <h2>
              Moments <em>of Joy</em>
              <span className="moments-title-heart" aria-hidden="true">♡</span>
            </h2>
            <p className="moments-subtitle">A hundred days of little memories.</p>

            <SectionDivider />
          </header>

          <div className="moments-collage">
            <figure className="moment-photo moment-photo-hero" data-reveal>
              <ScrapbookTape kind="gingham" placement="topLeft" />
              <img
                src={photos[0]}
                alt="Our little one celebrating 100 days"
                loading="lazy"
              />
            </figure>

            <figure className="moment-photo moment-photo-newborn" data-reveal>
              <ScrapbookTape kind="paper" placement="topCenter" />
              <img
                src={photos[1]}
                alt="A peaceful newborn memory"
                loading="lazy"
              />
            </figure>

            <figure className="moment-photo moment-photo-family" data-reveal>
              <img
                src={photos[2]}
                alt="A family memory from the first 100 days"
                loading="lazy"
              />
            </figure>

            <figure className="moment-photo moment-photo-smile" data-reveal>
              <ScrapbookTape kind="paper" placement="corner" />
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

      <SectionBridge variant="momentsToEvent" />

      <section id="event-details" className="love-section event-section">
        <div className="event-paper-texture" aria-hidden="true" />
        <SectionDecor variant="event" />

        <div className="mobile-shell event-shell">
          <article className="ceremony-paper" data-reveal>
            <div className="ceremony-paper-grain" aria-hidden="true" />
            <ScrapbookTape kind="paper" placement="topCenter" />

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

              <SectionDivider />
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

            {details.some((detail) => detail.value === "To be confirmed") && (
              <p className="ceremony-pending-note">
                We&apos;ll share the confirmed ceremony details here soon. <span aria-hidden="true">♡</span>
              </p>
            )}

            <div className="ceremony-finial" aria-hidden="true">♡</div>
          </article>
        </div>
      </section>

      <SectionBridge variant="eventToDonation" />

      <section className="love-section donation-section">
        <div className="donation-paper" aria-hidden="true" />
        <SectionDecor variant="donation" />

        <div className="mobile-shell donation-wrap">
          <header className="donation-heading" data-reveal>
            <p className="mini-label">A GESTURE OF GRATITUDE</p>

            <div className="donation-ornament" aria-hidden="true">
              <span />
              <b>♡</b>
              <span />
            </div>

            <h2>Sharing Love</h2>
          </header>

          <article className="donation-card" data-reveal>
            <p className="donation-lead">
              In celebration of our little one&apos;s first 100 days, we&apos;re
              sharing this joy through a donation made with gratitude and love.
            </p>

            <SectionDivider />

            <p className="donation-presence">
              Your presence, warm wishes, and blessings are already the most
              meaningful gifts to our family.
            </p>

            <blockquote className="donation-quote">
              Love grows when it is shared.
            </blockquote>
          </article>

          <p className="donation-closing-note" data-reveal>
            With thankful hearts, we celebrate and give. <span aria-hidden="true">♡</span>
          </p>
        </div>
      </section>

      <SectionBridge variant="donationToClosing" />

      <section className="love-closing">
        <SectionDecor variant="closing" />
        <div className="closing-paper" aria-hidden="true" />

        <div className="closing-inner">
          <figure className="closing-photo" data-reveal>
            <span className="closing-photo-wash" aria-hidden="true" />
            <img
              src="/child's photo/06-baby-smiling-with-parents.jpg"
              alt="A joyful family memory with our little one"
              loading="lazy"
              decoding="async"
            />
            <span className="closing-photo-heart" aria-hidden="true">♡</span>
          </figure>

          <div className="closing-copy-new" data-reveal>
            <p className="mini-label">WITH ALL OUR LOVE</p>

            <div className="closing-ornament" aria-hidden="true">
              <span />
              <b>♡</b>
              <span />
            </div>

            <h2>
              <span>Thank You</span>
              <em>for sharing in our joy.</em>
            </h2>

            <p className="closing-message">
              Thank you for being part of this beautiful beginning and for
              surrounding our little one with so much love.
            </p>

            <p className="closing-see-you">See you on this special day ♡</p>

            <div className="closing-signoff" aria-hidden="true">
              <span>with grateful hearts,</span>
              <b>our little family ♡</b>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
