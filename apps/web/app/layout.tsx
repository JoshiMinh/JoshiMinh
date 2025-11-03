import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AnimationObserver } from "@/components/AnimationObserver";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Joshi Minh · Software · AI · Design",
  description: "Portfolio of Joshi Minh – cross-platform engineer, designer, and vibe coder building AI-infused experiences across Android, web, and Windows.",
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {children}
        <AnimationObserver />
      </body>
    </html>
  );
}
