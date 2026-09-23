type ForegroundLotusProps = {
  side: "left" | "right";
};

export default function ForegroundLotus({ side }: ForegroundLotusProps) {
  return (
    <div
      className={`foreground-lotus foreground-lotus-${side}`}
      aria-hidden="true"
    />
  );
}
