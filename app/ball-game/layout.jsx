export const metadata = {
  title: 'Ball Game',
  description: 'Create shapes and launch balls with elastic collisions in this physics sandbox.',
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎱</text></svg>",
  },
  openGraph: {
    title: 'Ball Game',
    description: 'Create shapes and launch balls with elastic collisions in this physics sandbox.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ball Game',
    description: 'Create shapes and launch balls with elastic collisions in this physics sandbox.',
  },
};

export const viewport = {
  themeColor: '#0a0a0f',
};

export default function BallGameLayout({ children }) {
  return <>{children}</>;
}
