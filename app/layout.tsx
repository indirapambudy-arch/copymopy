import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Inter 400 and 600 for the UI, 700 for the logo wordmark.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Copymopy",
  description: "Describe a UI moment and get three approaches to the copy, in your product's voice.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
