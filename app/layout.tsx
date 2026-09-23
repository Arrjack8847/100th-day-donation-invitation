import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "100th Day Donation Invitation",
  description: "A special invitation to celebrate 100 days of love and blessings.",
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
