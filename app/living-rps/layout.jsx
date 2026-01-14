export const metadata = {
  title: 'Living Rock Paper Scissors',
  description: 'Rock Paper Scissors simulation - coming soon.',
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>✊</text></svg>",
  },
  openGraph: {
    title: 'Living Rock Paper Scissors',
    description: 'Rock Paper Scissors simulation - coming soon.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Living Rock Paper Scissors',
    description: 'Rock Paper Scissors simulation - coming soon.',
  },
};

export const viewport = {
  themeColor: '#0a0a0f',
};

export default function LivingRPSLayout({ children }) {
  return <>{children}</>;
}
