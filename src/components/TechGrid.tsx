import React from 'react'
import { motion } from 'framer-motion'

export default function TechGrid({ items }:{items:{id:string;name:string;}[]}){
  return (
    <div className="flex flex-wrap gap-3">
      {items.map(it=> (
        <motion.div key={it.id} whileHover={{ scale:1.04 }} className="px-3 py-2 bg-white/3 rounded-md text-sm">{it.name}</motion.div>
      ))}
    </div>
  )
}
