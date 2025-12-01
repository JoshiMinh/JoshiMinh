"use client";

import { colorToHex } from '../utils';

export function CelestialBodiesPanel({
  filteredBodies,
  searchQuery,
  setSearchQuery,
  selectedPlanet,
  cameraMode,
  focusOnPlanet,
  toggleCompare,
  comparePlanets
}) {
  return (
    <div style={{
      position: "absolute",
      top: 80,
      right: 20,
      background: "rgba(0, 0, 0, 0.85)",
      color: "white",
      padding: "16px",
      borderRadius: "12px",
      maxWidth: "220px",
      maxHeight: "calc(100vh - 200px)",
      overflowY: "auto",
      zIndex: 10,
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.1)"
    }}>
      <div style={{ fontWeight: "bold", marginBottom: "12px", fontSize: "16px" }}>
        🪐 Celestial Bodies
      </div>
      
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          width: "100%",
          padding: "6px 10px",
          marginBottom: "10px",
          background: "rgba(255, 255, 255, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "6px",
          color: "white",
          fontSize: "13px"
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {filteredBodies.map((body) => (
          <div key={body.name} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <button
              className="tool-btn"
              onClick={() => focusOnPlanet(body)}
              style={{ 
                fontSize: "13px", 
                padding: "8px 12px",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flex: 1,
                background: selectedPlanet?.name === body.name && cameraMode === 'follow' 
                  ? 'rgba(100, 150, 255, 0.3)' 
                  : 'rgba(255, 255, 255, 0.1)',
                border: selectedPlanet?.name === body.name && cameraMode === 'follow'
                  ? '1px solid rgba(100, 150, 255, 0.5)'
                  : '1px solid rgba(255, 255, 255, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(100, 150, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                if (!(selectedPlanet?.name === body.name && cameraMode === 'follow')) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }
              }}
            >
              <div style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: colorToHex(body.color),
                boxShadow: `0 0 8px ${colorToHex(body.color)}`
              }}></div>
              {body.name}
              {body.isDwarf && <span style={{ fontSize: "10px", opacity: 0.6 }}>*</span>}
            </button>
            <button
              className="tool-btn"
              onClick={() => toggleCompare(body)}
              style={{
                fontSize: "11px",
                padding: "6px 8px",
                background: comparePlanets.find(p => p.name === body.name) 
                  ? 'rgba(100, 200, 100, 0.3)' 
                  : 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                minWidth: 'auto'
              }}
              title="Compare"
            >
              ⚖️
            </button>
          </div>
        ))}
      </div>
      
      {filteredBodies.some(b => b.isDwarf) && (
        <div style={{ fontSize: "11px", opacity: 0.5, marginTop: "8px" }}>
          * Dwarf planet
        </div>
      )}
    </div>
  );
}

export function ComparePanel({ comparePlanets, setComparePlanets }) {
  if (comparePlanets.length === 0) return null;
  
  return (
    <div style={{
      position: "absolute",
      bottom: 20,
      right: 20,
      background: "rgba(0, 0, 0, 0.9)",
      color: "white",
      padding: "16px",
      borderRadius: "12px",
      maxWidth: "500px",
      zIndex: 10,
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.1)"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <div style={{ fontWeight: "bold", fontSize: "16px" }}>
          ⚖️ Compare Planets
        </div>
        <button 
          className="tool-btn"
          onClick={() => setComparePlanets([])}
          style={{ fontSize: "11px", padding: "4px 8px" }}
        >
          Clear
        </button>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${comparePlanets.length}, 1fr)`, gap: "12px", fontSize: "12px" }}>
        {comparePlanets.map((planet) => (
          <div key={planet.name} style={{ 
            padding: "8px", 
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: "8px",
            border: "1px solid rgba(255, 255, 255, 0.1)"
          }}>
            <div style={{ 
              fontWeight: "bold", 
              marginBottom: "6px",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}>
              <div style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: colorToHex(planet.color)
              }}></div>
              {planet.name}
            </div>
            <div style={{ opacity: 0.8, lineHeight: "1.6" }}>
              <div>Size: {planet.size.toFixed(2)}x</div>
              <div>Distance: {planet.distance.toFixed(1)}</div>
              <div>Speed: {planet.speed.toFixed(2)} km/s</div>
              <div style={{ fontSize: "10px", marginTop: "4px", opacity: 0.6 }}>{planet.realSize}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
