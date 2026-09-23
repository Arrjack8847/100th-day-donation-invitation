import OpeningScene from "@/components/opening/OpeningScene";

export default function Home() {
  return (
    <main>
      <OpeningScene />

      <section id="invitation-content" className="content-section">
        <p className="eyebrow">100 DAYS</p>
        <h1>100 Days of Love</h1>
        <p className="intro-copy">
          One hundred beautiful days of love, joy, gratitude and blessings.
        </p>
      </section>
    </main>
  );
}
