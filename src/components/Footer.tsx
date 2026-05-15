import React from 'react'
import bio from '../data/bio.json'

export default function Footer(){
  return (
    <footer className="mt-12 py-12 text-center text-sm text-muted">
      <div className="mb-4">Connect: <a href={`https://github.com/${bio.github}`} className="underline">GitHub</a> • <a href={bio.linkedin} className="underline">LinkedIn</a></div>
      <div>&copy; {new Date().getFullYear()} {bio.name}</div>
    </footer>
  )
}
