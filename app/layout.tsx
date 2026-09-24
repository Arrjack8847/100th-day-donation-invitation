import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "100th Day Donation Ceremony Invitation",
  description:
    "A premium Myanmar ceremonial invitation celebrating 100 days of love, gratitude and blessings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
