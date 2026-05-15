import React from 'react'

export default function Badge({ label }:{label:string}){
  return (
    <span className="text-xs px-2 py-1 rounded-md bg-white/3">{label}</span>
  )
}
