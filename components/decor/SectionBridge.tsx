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
    secondary: "/components/floating-sparkle-set.svg",
  },
  milestoneToMeaning: {
    primary: "/components/curved-path.svg",
    secondary: "/components/tiny-dots.svg",
  },
  meaningToMoments: {
    primary: "/components/botanical-corner.svg",
    secondary: "/components/decor-cluster.svg",
  },
  momentsToEvent: {
    primary: "/components/top-floral-accent.svg",
    secondary: "/components/simple-divider.svg",
  },
  eventToDonation: {
    primary: "/components/floating-petals/floating-petal-06.png",
    secondary: "/components/bottom-floral-accent.svg",
  },
  donationToClosing: {
    primary: "/components/bubble-cluster.png",
    secondary: "/components/closing-decor-cluster.png",
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

        <img
          className={`${styles.asset} ${styles.primary}`}
          src={assets.primary}
          alt=""
          draggable={false}
          loading="lazy"
          decoding="async"
        />

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
