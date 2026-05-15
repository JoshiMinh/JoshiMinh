import React from 'react'
import { motion } from 'framer-motion'
import Button from './ui/Button'
import Badge from './ui/Badge'

type Project = {
  id: string
  title: string
  description: string
  tags: string[]
  repo?: string
  demo?: string
}

export default function ProjectCard({ project }: { project: Project }){
  return (
    <motion.article whileHover={{ y: -6 }} className="card p-4 h-full flex flex-col">
      <div className="h-40 rounded-md mb-4 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-sm text-muted">Image placeholder</div>
      <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
      <p className="text-sm text-muted flex-1">{project.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.tags.map(t=> <Badge key={t} label={t} />)}
      </div>
      <div className="mt-4 flex gap-2">
        {project.repo && <Button as="a" href={project.repo} variant="ghost">GitHub</Button>}
        {project.demo && <Button as="a" href={project.demo}>Demo</Button>}
      </div>
    </motion.article>
  )
}
