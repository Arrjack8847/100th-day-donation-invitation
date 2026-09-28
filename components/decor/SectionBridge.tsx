"use client";

import styles from "./SectionBridge.module.css";

export type SectionBridgeVariant =
  | "heroToMilestone"
  | "milestoneToMeaning"
  | "meaningToMoments"
  | "momentsToEvent"
  | "eventToDonation"
  | "donationToClosing";

const bridgeAssets: Record<
  SectionBridgeVariant,
  { primary: string; secondary: string }
> = {
  heroToMilestone: {
    primary: "/components/bubble-cluster.png",
    secondary: "/components/sparkle-doodle.svg",
  },
  milestoneToMeaning: {
    primary: "/components/swirl-line.svg",
    secondary: "/components/heart-doodle.svg",
  },
  meaningToMoments: {
    primary: "/components/botanical-sprig.svg",
    secondary: "/components/sparkle-doodle.svg",
  },
  momentsToEvent: {
    primary: "/components/stitched-line.svg",
    secondary: "/components/tiny-bow.svg",
  },
  eventToDonation: {
    primary: "/components/lotus-petal.png",
    secondary: "/components/botanical-sprig.svg",
  },
  donationToClosing: {
    primary: "/components/bubble-cluster.png",
    secondary: "/components/heart-doodle.svg",
  },
};

export default function SectionBridge({
  variant,
}: {
  variant: SectionBridgeVariant;
}) {
  const assets = bridgeAssets[variant];

  return (
    <div
      className={`${styles.bridge} ${styles[variant]}`}
      data-reveal
      aria-hidden="true"
    >
      <div className={styles.canvas}>
        <span className={styles.wash} />

        <svg
          className={styles.thread}
          viewBox="0 0 1000 150"
          preserveAspectRatio="none"
          focusable="false"
        >
          <path
            className={styles.threadPath}
            d="M-40 95 C120 22 252 132 408 75 C566 17 687 132 1040 55"
          />
        </svg>

        <img
          className={`${styles.asset} ${styles.primary}`}
          src={assets.primary}
          alt=""
          draggable={false}
          loading="lazy"
          decoding="async"
        />

        <span className={styles.heart}>♡</span>

        <img
          className={`${styles.asset} ${styles.secondary}`}
          src={assets.secondary}
          alt=""
          draggable={false}
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
}
