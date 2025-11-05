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
  themeColor: '#667eea',
};

export default function ConwayLayout({ children }) {
  return <>{children}</>;
}
