import { Viewport } from 'next';

export const metadata = {
  title: "Conway's Game of Life",
  description: "An interactive implementation of Conway's Game of Life - a cellular automaton devised by mathematician John Conway in 1970.",
  openGraph: {
    title: "Conway's Game of Life",
    description: "An interactive implementation of Conway's Game of Life - explore cellular automaton patterns and create your own.",
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Conway's Game of Life",
    description: "An interactive implementation of Conway's Game of Life - explore cellular automaton patterns.",
  },
};

export const viewport = {
  themeColor: '#0f0f23',
};

export default function ConwayLayout({ children }) {
  return <>{children}</>;
}
