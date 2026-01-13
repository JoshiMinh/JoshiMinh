import '../styles/globals.css'

export const metadata = {
  title: 'JoshiMinh',
  description: 'Next.js app installed with pnpm',
  icons: {
    icon: '/icon.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
