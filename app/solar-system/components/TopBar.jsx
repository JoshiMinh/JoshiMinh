"use client";

import Link from "next/link";

export function TopBar({
  isPaused,
  setIsPaused,
  resetCamera,
  showOrbits,
  setShowOrbits,
  showDwarfPlanets,
  setShowDwarfPlanets,
  showMoons,
  setShowMoons,
  showComets,
  setShowComets,
  showStats,
  setShowStats,
  takeScreenshot,
  setShowKeyboardHelp
}) {
  return (
    <div className="topbar">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Link href="/" className="back-link" title="Back to Home">←</Link>
        <h1 style={{ fontSize: 24, margin: 0 }}>Solar System Simulator 3D</h1>
      </div>
      <div className="topbar-actions">
        <button 
          className="tool-btn" 
          onClick={() => setIsPaused(!isPaused)}
          style={{ background: isPaused ? 'rgba(255, 100, 100, 0.2)' : 'rgba(100, 255, 100, 0.2)' }}
          title="Space to toggle"
        >
          {isPaused ? '▶️ Play' : '⏸️ Pause'}
        </button>
        <button className="tool-btn" onClick={resetCamera} title="Reset camera view">
          🔄 Reset View
        </button>
        <button 
          className="tool-btn" 
          onClick={() => setShowOrbits(!showOrbits)}
          style={{ opacity: showOrbits ? 1 : 0.5 }}
          title="Press 'O' to toggle"
        >
          {showOrbits ? '🔵 Orbits' : '⚪ Orbits'}
        </button>
        <button 
          className="tool-btn" 
          onClick={() => setShowDwarfPlanets(!showDwarfPlanets)}
          style={{ opacity: showDwarfPlanets ? 1 : 0.5 }}
          title="Show/hide dwarf planets"
        >
          {showDwarfPlanets ? '🌑 Dwarfs' : '⚫ Dwarfs'}
        </button>
        <button 
          className="tool-btn" 
          onClick={() => setShowMoons(!showMoons)}
          style={{ opacity: showMoons ? 1 : 0.5 }}
          title="Show/hide moons"
        >
          {showMoons ? '🌙 Moons' : '⚫ Moons'}
        </button>
        <button 
          className="tool-btn" 
          onClick={() => setShowComets(!showComets)}
          style={{ opacity: showComets ? 1 : 0.5 }}
          title="Show/hide comets"
        >
          {showComets ? '☄️ Comets' : '⚫ Comets'}
        </button>
        <button 
          className="tool-btn" 
          onClick={() => setShowStats(!showStats)}
          style={{ opacity: showStats ? 1 : 0.5 }}
          title="Ctrl+S to toggle"
        >
          📊 Stats
        </button>
        <button 
          className="tool-btn" 
          onClick={takeScreenshot}
          title="Save screenshot"
        >
          📸 Save
        </button>
        <button 
          className="tool-btn" 
          onClick={() => setShowKeyboardHelp(true)}
          title="Press '?' for help"
        >
          ❓ Help
        </button>
      </div>
    </div>
  );
}
