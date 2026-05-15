import React from 'react'
import { motion } from 'framer-motion'
import bio from '../data/bio.json'
import TerminalCard from './TerminalCard'

function getAge(dob: string) {
  const b = new Date(dob)
  const now = new Date()
  let age = now.getFullYear() - b.getFullYear()
  const m = now.getMonth() - b.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age--
  return age
}

export default function Hero() {
  const age = getAge(bio.dob)
  return (
    <motion.header initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
      <div className="inline-block mb-6">
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#1e293b] to-[#0f1720] flex items-center justify-center text-4xl border border-white/6">JM</div>
      </div>
      <h1 className="text-6xl md:text-7xl font-extrabold mb-2">Joshi Minh</h1>
      <div className="text-accent mb-4">AI Engineer • Full-Stack Builder • Japanese Learner</div>
      <p className="max-w-2xl mx-auto text-muted mb-6">{bio.shortIntro} — {age} years old.</p>
      <div className="flex items-center justify-center gap-4 mb-8">
        <a className="btn" href="#projects">View Projects</a>
        <a className="btn ghost" href={`https://github.com/${bio.github}`} target="_blank" rel="noreferrer">GitHub</a>
        <a className="btn ghost" href={`mailto:${bio.contact}`}>Contact</a>
      </div>

      <div className="max-w-xl mx-auto">
        <TerminalCard />
      </div>
    </motion.header>
  )
}
