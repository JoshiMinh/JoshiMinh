import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-grid min-h-screen">
      <div className="container mx-auto px-6 py-12">{children}</div>
    </div>
  )
}
