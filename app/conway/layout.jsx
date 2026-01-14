import { Viewport } from 'next';

export const metadata = {
  title: "Conway's Game of Life",
  description: "An interactive implementation of Conway's Game of Life - a cellular automaton devised by mathematician John Conway in 1970.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧬</text></svg>",
  },
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
