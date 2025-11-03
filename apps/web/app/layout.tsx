import type { Metadata } from "next";
import "./globals.css";
import { AnimationObserver } from "@/components/AnimationObserver";

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
        <AnimationObserver />
      </body>
    </html>
  );
}
