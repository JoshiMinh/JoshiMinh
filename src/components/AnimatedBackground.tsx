import React, { useEffect, useState } from 'react'

export default function AnimatedBackground() {
  const [pos, setPos] = useState({ x: -200, y: -200 })
  useEffect(() => {
    function onMove(e: MouseEvent) {
      setPos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <div style={{
        position: 'absolute',
        left: pos.x - 300,
        top: pos.y - 300,
        width: 600,
        height: 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, rgba(37,99,235,0.02) 40%, transparent 70%)',
        filter: 'blur(60px)',
        transition: 'transform 0.2s ease'
      }} />

      <div style={{position:'absolute', right: -120, top: -80, width:420, height:420, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(37,99,235,0.06), rgba(99,102,241,0.04))', filter:'blur(80px)'}} />
    </div>
  )
}
