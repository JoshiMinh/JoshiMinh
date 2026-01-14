export const metadata = {
  title: 'Solar System Simulator',
  description: 'Interactive 3D solar system with realistic planet orbits, moons, comets, and more.',
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🪐</text></svg>",
  },
  openGraph: {
    title: 'Solar System Simulator',
    description: 'Interactive 3D solar system with realistic planet orbits, moons, comets, and more.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solar System Simulator',
    description: 'Interactive 3D solar system with realistic planet orbits, moons, comets, and more.',
  },
};

export const viewport = {
  themeColor: '#0a0a0f',
};

export default function SolarSystemLayout({ children }) {
  return <>{children}</>;
}
