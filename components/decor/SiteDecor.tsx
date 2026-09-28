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

  "botanical-corner": "/components/botanical-corner.svg",
  "bottom-floral-accent": "/components/bottom-floral-accent.svg",
  "closing-botanical": "/components/closing-botanical.svg",
  "closing-decor-cluster": "/components/closing-decor-cluster.png",
  "corner-doodle-cluster": "/components/corner-doodle-cluster.svg",
  "curved-path": "/components/curved-path.svg",
  "decor-cluster": "/components/decor-cluster.svg",
  "floating-petal-01": "/components/floating-petals/floating-petal-01.png",
  "floating-petal-02": "/components/floating-petals/floating-petal-02.png",
  "floating-petal-03": "/components/floating-petals/floating-petal-03.png",
  "floating-petal-04": "/components/floating-petals/floating-petal-04.png",
  "floating-petal-05": "/components/floating-petals/floating-petal-05.png",
  "floating-petal-06": "/components/floating-petals/floating-petal-06.png",
  "floating-sparkle-set": "/components/floating-sparkle-set.svg",
  "handdrawn-frame": "/components/handdrawn-frame.svg",
  "location-pin-doodle": "/components/location-pin-doodle.svg",
  "lotus-divider": "/components/lotus-divider.svg",
  "mini-confetti": "/components/mini-confetti.svg",
  "mini-flower": "/components/mini-flower.svg",
  "petal-corner-cluster": "/components/petal-corner-cluster.png",
  "photo-corner": "/components/photo-corner.png",
  "polaroid-frame": "/components/polaroid-frame.png",
  "sage-watercolor-blob": "/components/sage-watercolor-blob.svg",
  "simple-divider": "/components/simple-divider.svg",
  "soft-glow": "/components/soft-glow.png",
  "timeline-dot": "/components/timeline-dot.svg",
  "timeline-heart": "/components/timeline-heart.svg",
  "tiny-dots": "/components/tiny-dots.svg",
  "top-floral-accent": "/components/top-floral-accent.svg",
  "watercolor-blob": "/components/watercolor-blob.svg",
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
  eager?: boolean;
};

function vars({
  size,
  opacity,
  rotation,
  delay,
  duration,
}: Omit<DecorAssetProps, "asset" | "className" | "eager">): CSSProperties {
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
  eager = false,
}: DecorAssetProps) {
  return (
    <img
      className={`${styles.asset} ${className}`}
      src={ASSETS[asset]}
      alt=""
      aria-hidden="true"
      draggable={false}
      loading={eager ? "eager" : "lazy"}
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

export function SectionDivider({
  className = "",
  variant = "heart",
}: {
  className?: string;
  variant?: "heart" | "simple" | "lotus";
}) {
  const asset =
    variant === "lotus"
      ? ASSETS["lotus-divider"]
      : variant === "simple"
        ? ASSETS["simple-divider"]
        : ASSETS["heart-divider"];

  return (
    <img
      className={`${styles.inlineDivider} ${styles[`${variant}Divider`]} ${className}`}
      src={asset}
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

export function ScrapbookPhotoDecor({
  variant,
}: {
  variant: "hero" | "newborn" | "family" | "smile";
}) {
  if (variant === "hero") {
    return (
      <img
        className={`${styles.photoDecor} ${styles.polaroidFrame}`}
        src={ASSETS["polaroid-frame"]}
        alt=""
        aria-hidden="true"
        draggable={false}
        loading="lazy"
      />
    );
  }

  if (variant === "newborn") {
    return (
      <img
        className={`${styles.photoDecorAccent} ${styles.photoMiniFlower}`}
        src={ASSETS["mini-flower"]}
        alt=""
        aria-hidden="true"
        draggable={false}
        loading="lazy"
      />
    );
  }

  if (variant === "family") {
    return (
      <>
        <img
          className={`${styles.photoDecor} ${styles.handdrawnFrame}`}
          src={ASSETS["handdrawn-frame"]}
          alt=""
          aria-hidden="true"
          draggable={false}
          loading="lazy"
        />
        <img
          className={`${styles.photoDecorAccent} ${styles.photoHeart}`}
          src={ASSETS["heart-doodle"]}
          alt=""
          aria-hidden="true"
          draggable={false}
          loading="lazy"
        />
      </>
    );
  }

  return (
    <>
      <img
        className={`${styles.photoDecorAccent} ${styles.photoCorner}`}
        src={ASSETS["photo-corner"]}
        alt=""
        aria-hidden="true"
        draggable={false}
        loading="lazy"
      />
      <img
        className={`${styles.photoDecorAccent} ${styles.photoCluster}`}
        src={ASSETS["decor-cluster"]}
        alt=""
        aria-hidden="true"
        draggable={false}
        loading="lazy"
      />
    </>
  );
}

export function SectionDecor({ variant }: { variant: DecorVariant }) {
  if (variant === "opening") {
    return (
      <div className={`${styles.layer} ${styles.openingLayer}`} aria-hidden="true">
        <DecorAsset asset="soft-glow" className={styles.openingGlow} opacity={0.42} eager />
        <DecorAsset asset="bubble-cluster" className={`${styles.bubble} ${styles.openingBubbleLeft}`} opacity={0.66} duration={14} eager />
        <DecorAsset asset="bubble-cluster" className={`${styles.bubble} ${styles.openingBubbleRight}`} opacity={0.5} duration={17} delay={-5} rotation={8} eager />
        <DecorAsset asset="floating-sparkle-set" className={`${styles.sparkle} ${styles.openingSparkleSet}`} opacity={0.62} duration={7.5} eager />
        <DecorAsset asset="mini-confetti" className={styles.openingConfetti} opacity={0.25} rotation={-6} eager />
      </div>
    );
  }

  if (variant === "hero") {
    return (
      <div className={`${styles.layer} ${styles.heroLayer}`} aria-hidden="true">
        <DecorAsset asset="soft-glow" className={styles.heroGlow} opacity={0.34} eager />
        <DecorAsset asset="peach-wash-02" className={styles.heroWash} opacity={0.44} rotation={-6} eager />
        <DecorAsset asset="decor-cluster" className={styles.heroCluster} opacity={0.58} rotation={6} eager />
        <DecorAsset asset="heart-doodle" className={styles.heroHeart} opacity={0.55} rotation={-9} eager />
        <DecorAsset asset="tiny-bow" className={styles.heroBow} opacity={0.7} rotation={3} eager />
      </div>
    );
  }

  if (variant === "milestone") {
    return (
      <div className={`${styles.layer} ${styles.milestoneLayer}`} aria-hidden="true">
        <DecorAsset asset="watercolor-blob" className={styles.milestoneWash} opacity={0.28} rotation={8} />
        <DecorAsset asset="corner-doodle-cluster" className={styles.milestoneCorner} opacity={0.46} rotation={-6} />
        <DecorAsset asset="mini-flower" className={styles.milestoneFlower} opacity={0.64} rotation={7} />
        <DecorAsset asset="tiny-dots" className={styles.milestoneDots} opacity={0.44} rotation={-4} />
      </div>
    );
  }

  if (variant === "meaning") {
    return (
      <div className={`${styles.layer} ${styles.meaningLayer}`} aria-hidden="true">
        <DecorAsset asset="sage-watercolor-blob" className={styles.meaningWash} opacity={0.2} rotation={-7} />
        <DecorAsset asset="botanical-corner" className={styles.meaningBotanical} opacity={0.5} rotation={-4} />
        <DecorAsset asset="curved-path" className={styles.meaningPath} opacity={0.4} rotation={3} />
        <DecorAsset asset="heart-doodle" className={styles.meaningHeart} opacity={0.46} rotation={10} />
        <DecorAsset asset="decor-cluster" className={styles.meaningCluster} opacity={0.4} rotation={-5} />
      </div>
    );
  }

  if (variant === "moments") {
    return (
      <div className={`${styles.layer} ${styles.momentsLayer}`} aria-hidden="true">
        <DecorAsset asset="peach-wash-01" className={styles.momentsWashOne} opacity={0.3} rotation={-10} />
        <DecorAsset asset="peach-wash-02" className={styles.momentsWashTwo} opacity={0.2} rotation={8} />
        <DecorAsset asset="stitched-line" className={styles.momentsStitch} opacity={0.4} rotation={5} />
        <DecorAsset asset="corner-doodle-cluster" className={styles.momentsCornerCluster} opacity={0.44} rotation={-8} />
        <DecorAsset asset="tiny-dots" className={styles.momentsDots} opacity={0.42} />
        <DecorAsset asset="decor-cluster" className={styles.momentsCluster} opacity={0.4} rotation={7} />
      </div>
    );
  }

  if (variant === "event") {
    return (
      <div className={`${styles.layer} ${styles.eventLayer}`} aria-hidden="true">
        <DecorAsset asset="top-floral-accent" className={styles.eventFloral} opacity={0.34} />
        <DecorAsset asset="botanical-corner" className={styles.eventBotanical} opacity={0.38} rotation={5} />
      </div>
    );
  }

  if (variant === "donation") {
    return (
      <div className={`${styles.layer} ${styles.donationLayer}`} aria-hidden="true">
        <DecorAsset asset="lotus-line-art" className={styles.donationLotus} opacity={0.09} />
        <DecorAsset asset="petal-corner-cluster" className={styles.donationPetalCluster} opacity={0.3} rotation={-5} />
        <DecorAsset asset="bottom-floral-accent" className={styles.donationFloral} opacity={0.3} />
        <DecorAsset asset="floating-petal-01" className={`${styles.petal} ${styles.donationPetalOne}`} opacity={0.52} duration={16} rotation={-18} />
        <DecorAsset asset="floating-petal-03" className={`${styles.petal} ${styles.donationPetalTwo}`} opacity={0.42} duration={19} delay={-6} rotation={22} />
        <DecorAsset asset="floating-petal-05" className={`${styles.petal} ${styles.donationPetalThree}`} opacity={0.34} duration={21} delay={-10} rotation={8} />
      </div>
    );
  }

  return (
    <div className={`${styles.layer} ${styles.closingLayer}`} aria-hidden="true">
      <DecorAsset asset="closing-botanical" className={styles.closingBotanical} opacity={0.38} />
      <DecorAsset asset="closing-decor-cluster" className={styles.closingCluster} opacity={0.42} rotation={-5} />
      <DecorAsset asset="bubble-cluster" className={`${styles.bubble} ${styles.closingBubbles}`} opacity={0.34} duration={16} />
      <DecorAsset asset="floating-sparkle-set" className={`${styles.sparkle} ${styles.closingSparkleSet}`} opacity={0.46} duration={8} />
      <DecorAsset asset="floating-petal-02" className={`${styles.petal} ${styles.closingPetalOne}`} opacity={0.42} duration={17} rotation={-12} />
      <DecorAsset asset="floating-petal-04" className={`${styles.petal} ${styles.closingPetalTwo}`} opacity={0.34} duration={20} delay={-7} rotation={22} />
      <DecorAsset asset="floating-petal-06" className={`${styles.petal} ${styles.closingPetalThree}`} opacity={0.3} duration={22} delay={-11} rotation={6} />
    </div>
  );
}
