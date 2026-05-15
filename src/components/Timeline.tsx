import React from 'react'
import timeline from '../data/timeline.json'

export default function Timeline(){
  return (
    <ol className="border-l border-white/6 ml-4">
      {timeline.map(item=> (
        <li key={item.id} className="mb-6 ml-6">
          <div className="absolute -ml-8 w-4 h-4 rounded-full bg-accent" />
          <div className="text-sm font-semibold">{item.title}</div>
          <div className="text-xs text-muted">{item.date}</div>
          <p className="text-sm text-muted mt-2">{item.description}</p>
        </li>
      ))}
    </ol>
  )
}
