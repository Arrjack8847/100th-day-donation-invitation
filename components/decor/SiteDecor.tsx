import type { CSSProperties } from "react";
import styles from "./SiteDecor.module.css";

const ASSETS = {
  "peach-wash-01": "/components/peach-wash-01.svg",
  "peach-wash-02": "/components/peach-wash-02.svg",
  "heart-doodle": "/components/heart-doodle.svg",
  "sparkle-doodle": "/components/sparkle-doodle.svg",
  "tiny-bow": "/components/tiny-bow.svg",
  "swirl-line": "/components/swirl-line.svg",
  "botanical-sprig": "/components/botanical-sprig.svg",
  "lotus-line-art": "/components/lotus-line-art.svg",
  "lotus-petal": "/components/lotus-petal.png",
  "gingham-tape": "/components/gingham-tape.png",
  "paper-tape": "/components/paper-tape.png",
  "stitched-line": "/components/stitched-line.svg",
  "heart-divider": "/components/heart-divider.svg",
  "paper-grain": "/components/paper-grain.png",
  "bubble-cluster": "/components/bubble-cluster.png",
} as const;

type DecorAssetName = keyof typeof ASSETS;
type DecorVariant =
  | "opening"
  | "hero"
  | "milestone"
  | "meaning"
  | "moments"
  | "event"
  | "donation"
  | "closing";

type DecorAssetProps = {
  asset: DecorAssetName;
  className?: string;
  size?: number | string;
  opacity?: number;
  rotation?: number;
  delay?: number;
  duration?: number;
};

function vars({
  size,
  opacity,
  rotation,
  delay,
  duration,
}: Omit<DecorAssetProps, "asset" | "className">): CSSProperties {
  return {
    "--decor-size": typeof size === "number" ? `${size}px` : size,
    "--decor-opacity": opacity,
    "--decor-rotation": rotation === undefined ? undefined : `${rotation}deg`,
    "--decor-delay": delay === undefined ? undefined : `${delay}s`,
    "--decor-duration":
      duration === undefined ? undefined : `${duration}s`,
  } as CSSProperties;
}

export function DecorAsset({
  asset,
  className = "",
  size,
  opacity,
  rotation,
  delay,
  duration,
}: DecorAssetProps) {
  return (
    <img
      className={`${styles.asset} ${className}`}
      src={ASSETS[asset]}
      alt=""
      aria-hidden="true"
      draggable={false}
      loading="lazy"
      decoding="async"
      style={vars({ size, opacity, rotation, delay, duration })}
    />
  );
}

export function PaperTexture() {
  return (
    <div className={styles.paperTexture} aria-hidden="true">
      <img src={ASSETS["paper-grain"]} alt="" draggable={false} />
    </div>
  );
}

export function SectionDivider({ className = "" }: { className?: string }) {
  return (
    <img
      className={`${styles.inlineDivider} ${className}`}
      src={ASSETS["heart-divider"]}
      alt=""
      aria-hidden="true"
      draggable={false}
      loading="lazy"
    />
  );
}

export function ScrapbookTape({
  kind = "paper",
  placement = "topCenter",
}: {
  kind?: "paper" | "gingham";
  placement?: "topLeft" | "topCenter" | "topRight" | "corner";
}) {
  return (
    <img
      className={`${styles.scrapbookTape} ${styles[placement]}`}
      src={ASSETS[kind === "gingham" ? "gingham-tape" : "paper-tape"]}
      alt=""
      aria-hidden="true"
      draggable={false}
      loading="lazy"
    />
  );
}

export function SectionDecor({ variant }: { variant: DecorVariant }) {
  if (variant === "opening") {
    return (
      <div className={`${styles.layer} ${styles.openingLayer}`} aria-hidden="true">
        <DecorAsset asset="peach-wash-01" className={styles.openingWash} opacity={0.18} rotation={-7} />
        <DecorAsset asset="bubble-cluster" className={`${styles.bubble} ${styles.openingBubbleLeft}`} opacity={0.7} duration={13} />
        <DecorAsset asset="bubble-cluster" className={`${styles.bubble} ${styles.openingBubbleRight}`} opacity={0.58} duration={16} delay={-5} rotation={8} />
        <DecorAsset asset="bubble-cluster" className={`${styles.bubble} ${styles.openingBubbleBottom}`} opacity={0.46} duration={11} delay={-2} rotation={-10} />
        <DecorAsset asset="sparkle-doodle" className={`${styles.sparkle} ${styles.openingSparkleOne}`} opacity={0.66} duration={5.8} />
        <DecorAsset asset="sparkle-doodle" className={`${styles.sparkle} ${styles.openingSparkleTwo}`} opacity={0.52} duration={6.8} delay={-2} rotation={8} />
      </div>
    );
  }

  if (variant === "hero") {
    return (
      <div className={`${styles.layer} ${styles.heroLayer}`} aria-hidden="true">
        <DecorAsset asset="peach-wash-02" className={styles.heroWash} opacity={0.47} rotation={-6} />
        <DecorAsset asset="heart-doodle" className={styles.heroHeart} opacity={0.6} rotation={-9} />
        <DecorAsset asset="sparkle-doodle" className={`${styles.sparkle} ${styles.heroSparkle}`} opacity={0.58} duration={6.5} />
        <DecorAsset asset="tiny-bow" className={styles.heroBow} opacity={0.72} rotation={3} />
      </div>
    );
  }

  if (variant === "milestone") {
    return (
      <div className={`${styles.layer} ${styles.milestoneLayer}`} aria-hidden="true">
        <DecorAsset asset="peach-wash-01" className={styles.milestoneWash} opacity={0.24} rotation={8} />
        <DecorAsset asset="tiny-bow" className={styles.milestoneBow} opacity={0.68} rotation={-3} />
      </div>
    );
  }

  if (variant === "meaning") {
    return (
      <div className={`${styles.layer} ${styles.meaningLayer}`} aria-hidden="true">
        <DecorAsset asset="peach-wash-01" className={styles.meaningWash} opacity={0.24} rotation={-7} />
        <DecorAsset asset="swirl-line" className={styles.meaningSwirl} opacity={0.45} rotation={4} />
        <DecorAsset asset="botanical-sprig" className={styles.meaningSprig} opacity={0.54} rotation={-11} />
        <DecorAsset asset="heart-doodle" className={styles.meaningHeart} opacity={0.48} rotation={10} />
      </div>
    );
  }

  if (variant === "moments") {
    return (
      <div className={`${styles.layer} ${styles.momentsLayer}`} aria-hidden="true">
        <DecorAsset asset="peach-wash-01" className={styles.momentsWashOne} opacity={0.34} rotation={-10} />
        <DecorAsset asset="peach-wash-02" className={styles.momentsWashTwo} opacity={0.24} rotation={8} />
        <DecorAsset asset="stitched-line" className={styles.momentsStitch} opacity={0.42} rotation={5} />
        <DecorAsset asset="heart-doodle" className={styles.momentsHeart} opacity={0.58} rotation={-12} />
        <DecorAsset asset="tiny-bow" className={styles.momentsBow} opacity={0.72} rotation={8} />
        <DecorAsset asset="sparkle-doodle" className={`${styles.sparkle} ${styles.momentsSparkleOne}`} opacity={0.58} duration={7} />
        <DecorAsset asset="sparkle-doodle" className={`${styles.sparkle} ${styles.momentsSparkleTwo}`} opacity={0.44} duration={6.2} delay={-2.2} rotation={9} />
      </div>
    );
  }

  if (variant === "event") {
    return (
      <div className={`${styles.layer} ${styles.eventLayer}`} aria-hidden="true">
        <DecorAsset asset="botanical-sprig" className={styles.eventSprigTop} opacity={0.42} rotation={-17} />
        <DecorAsset asset="botanical-sprig" className={styles.eventSprigBottom} opacity={0.3} rotation={164} />
      </div>
    );
  }

  if (variant === "donation") {
    return (
      <div className={`${styles.layer} ${styles.donationLayer}`} aria-hidden="true">
        <DecorAsset asset="lotus-line-art" className={styles.donationLotus} opacity={0.1} />
        <DecorAsset asset="lotus-petal" className={`${styles.petal} ${styles.donationPetalOne}`} opacity={0.56} duration={14} rotation={-18} />
        <DecorAsset asset="lotus-petal" className={`${styles.petal} ${styles.donationPetalTwo}`} opacity={0.43} duration={17} delay={-6} rotation={24} />
        <DecorAsset asset="botanical-sprig" className={styles.donationSprig} opacity={0.42} rotation={12} />
      </div>
    );
  }

  return (
    <div className={`${styles.layer} ${styles.closingLayer}`} aria-hidden="true">
      <DecorAsset asset="bubble-cluster" className={`${styles.bubble} ${styles.closingBubbles}`} opacity={0.36} duration={15} />
      <DecorAsset asset="heart-doodle" className={styles.closingHeart} opacity={0.52} rotation={-7} />
      <DecorAsset asset="sparkle-doodle" className={`${styles.sparkle} ${styles.closingSparkle}`} opacity={0.48} duration={7.4} />
      <DecorAsset asset="lotus-petal" className={`${styles.petal} ${styles.closingPetalOne}`} opacity={0.45} duration={16} rotation={-12} />
      <DecorAsset asset="lotus-petal" className={`${styles.petal} ${styles.closingPetalTwo}`} opacity={0.36} duration={18} delay={-7} rotation={22} />
    </div>
  );
}
