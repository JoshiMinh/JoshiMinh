import React from 'react'
import Layout from './components/Layout'
import Hero from './components/Hero'
import ProjectCard from './components/ProjectCard'
import TechGrid from './components/TechGrid'
import Timeline from './components/Timeline'
import Footer from './components/Footer'
import AnimatedBackground from './components/AnimatedBackground'

import projects from './data/projects.json'
import tech from './data/tech.json'

export default function App() {
  return (
    <div className="min-h-screen bg-bg text-white">
      <AnimatedBackground />
      <Layout>
        <Hero />
        <section id="projects" className="max-w-5xl mx-auto px-6 py-12">
          <h2 className="text-3xl font-semibold mb-8">Featured Projects</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>
        <section className="max-w-4xl mx-auto px-6 py-8">
          <h2 className="text-3xl font-semibold mb-6">Tech Stack</h2>
          <TechGrid items={tech} />
        </section>
        <section className="max-w-3xl mx-auto px-6 py-8">
          <h2 className="text-3xl font-semibold mb-6">Timeline</h2>
          <Timeline />
        </section>
        <Footer />
      </Layout>
    </div>
  )
}
