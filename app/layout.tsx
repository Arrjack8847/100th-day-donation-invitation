import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "100 Days of Love | 100th Day Donation",
  description:
    "A warm, mobile-first invitation celebrating 100 days of love, gratitude and giving.",
  viewport: {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
  },
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
