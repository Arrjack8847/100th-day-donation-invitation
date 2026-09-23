const petals = [
  { left: "12%", top: "18%", scale: 0.72 },
  { left: "23%", top: "42%", scale: 0.92 },
  { left: "38%", top: "13%", scale: 0.62 },
  { left: "61%", top: "26%", scale: 0.8 },
  { left: "73%", top: "12%", scale: 0.68 },
  { left: "86%", top: "37%", scale: 0.88 },
];

export default function PetalParticles() {
  return (
    <div className="petal-field" aria-hidden="true">
      {petals.map((petal, index) => (
        <span
          key={index}
          className="petal"
          style={{
            left: petal.left,
            top: petal.top,
            transform: `scale(${petal.scale})`,
          }}
        />
      ))}
    </div>
  );
}
