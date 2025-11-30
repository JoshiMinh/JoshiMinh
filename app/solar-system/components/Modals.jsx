"use client";

import { colorToHex } from '../utils';

export function PlanetInfoModal({ 
  selectedPlanet, 
  showInfo, 
  handleCloseInfo, 
  focusOnPlanet, 
  cameraMode,
  setShowInfo
}) {
  if (!showInfo || !selectedPlanet) return null;
  
  return (
    <div className="help-overlay" onClick={handleCloseInfo}>
      <div 
        className="help-card" 
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "500px",
          background: "rgba(15, 15, 25, 0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.2)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ margin: 0, fontSize: "24px" }}>{selectedPlanet.name}</h3>
          {cameraMode === 'follow' && selectedPlanet && (
            <span style={{
              padding: "4px 12px",
              background: "rgba(100, 150, 255, 0.2)",
              borderRadius: "12px",
              fontSize: "12px",
              border: "1px solid rgba(100, 150, 255, 0.4)"
            }}>
              Following
            </span>
          )}
        </div>
        
        <div style={{ 
          width: "80px", 
          height: "80px", 
          borderRadius: "50%", 
          background: `radial-gradient(circle at 30% 30%, ${colorToHex(selectedPlanet.color)}, ${colorToHex(selectedPlanet.color)}dd)`,
          margin: "20px auto",
          boxShadow: `0 0 40px ${colorToHex(selectedPlanet.color)}`,
          border: "2px solid rgba(255,255,255,0.2)"
        }}></div>
        
        <p style={{ fontSize: "16px", marginBottom: "20px", lineHeight: "1.6" }}>
          {selectedPlanet.info}
        </p>
        
        <div style={{ 
          fontSize: "14px", 
          opacity: 0.9,
          borderTop: "1px solid rgba(255,255,255,0.15)",
          paddingTop: "16px",
          marginTop: "16px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px"
        }}>
          <div>
            <div style={{ opacity: 0.6, marginBottom: "4px" }}>Diameter</div>
            <div style={{ fontWeight: "bold" }}>{selectedPlanet.realSize}</div>
          </div>
          <div>
            <div style={{ opacity: 0.6, marginBottom: "4px" }}>Distance from Sun</div>
            <div style={{ fontWeight: "bold" }}>{selectedPlanet.realDistance}</div>
          </div>
          <div>
            <div style={{ opacity: 0.6, marginBottom: "4px" }}>Axial Tilt</div>
            <div style={{ fontWeight: "bold" }}>{selectedPlanet.axialTilt?.toFixed(1) || 0}°</div>
          </div>
          <div>
            <div style={{ opacity: 0.6, marginBottom: "4px" }}>Orbital Eccentricity</div>
            <div style={{ fontWeight: "bold" }}>{selectedPlanet.eccentricity?.toFixed(4) || 0}</div>
          </div>
          <div>
            <div style={{ opacity: 0.6, marginBottom: "4px" }}>Relative Size</div>
            <div style={{ fontWeight: "bold" }}>{selectedPlanet.size.toFixed(2)}x Earth</div>
          </div>
          <div>
            <div style={{ opacity: 0.6, marginBottom: "4px" }}>Orbital Speed</div>
            <div style={{ fontWeight: "bold" }}>{selectedPlanet.speed.toFixed(2)} km/s</div>
          </div>
          {selectedPlanet.moons && selectedPlanet.moons.length > 0 && (
            <div style={{ gridColumn: "1 / -1" }}>
              <div style={{ opacity: 0.6, marginBottom: "4px" }}>Moons ({selectedPlanet.moons.length})</div>
              <div style={{ fontWeight: "bold" }}>{selectedPlanet.moons.map(m => m.name).join(', ')}</div>
            </div>
          )}
        </div>
        
        <div style={{ display: "flex", gap: "8px", marginTop: "20px" }}>
          <button 
            className="tool-btn" 
            onClick={() => {
              focusOnPlanet(selectedPlanet);
              setShowInfo(false);
            }}
            style={{ flex: 1, padding: "10px" }}
          >
            📹 Follow Planet
          </button>
          <button 
            className="tool-btn" 
            onClick={handleCloseInfo}
            style={{ flex: 1, padding: "10px" }}
          >
            ✕ Close
          </button>
        </div>
      </div>
    </div>
  );
}

export function KeyboardHelpModal({ showKeyboardHelp, setShowKeyboardHelp }) {
  if (!showKeyboardHelp) return null;
  
  return (
    <div className="help-overlay" onClick={() => setShowKeyboardHelp(false)}>
      <div 
        className="help-card" 
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "750px",
          background: "rgba(15, 15, 25, 0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          maxHeight: "85vh",
          overflowY: "auto"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ margin: 0, fontSize: "24px" }}>⌨️ Keyboard Shortcuts & Controls</h3>
          <button 
            className="tool-btn"
            onClick={() => setShowKeyboardHelp(false)}
            style={{ padding: "6px 12px" }}
          >
            ✕
          </button>
        </div>
        
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "16px",
          fontSize: "13px"
        }}>
          <div>
            <h4 style={{ fontSize: "15px", marginBottom: "10px", color: "#4A90E2" }}>🎮 Camera Movement</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div><kbd>W</kbd> / <kbd>↑</kbd> - Move forward</div>
              <div><kbd>S</kbd> / <kbd>↓</kbd> - Move backward</div>
              <div><kbd>A</kbd> / <kbd>←</kbd> - Move left</div>
              <div><kbd>D</kbd> / <kbd>→</kbd> - Move right</div>
              <div><kbd>Q</kbd> - Move down</div>
              <div><kbd>E</kbd> - Move up</div>
              <div><kbd>PgUp</kbd> / <kbd>PgDn</kbd> - Fast vertical</div>
            </div>
            
            <h4 style={{ fontSize: "15px", marginTop: "16px", marginBottom: "10px", color: "#4A90E2" }}>⚡ Speed Modifiers</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div><kbd>Shift</kbd> + move - 3x faster</div>
              <div><kbd>Alt</kbd> + move - 3x slower</div>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: "15px", marginBottom: "10px", color: "#4A90E2" }}>🖱️ Mouse Controls</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div>Left drag - Rotate view</div>
              <div>Right drag - Pan camera</div>
              <div>Scroll - Zoom in/out</div>
              <div>Click planet - View info</div>
              <div>Double-click - Instant focus</div>
            </div>
            
            <h4 style={{ fontSize: "15px", marginTop: "16px", marginBottom: "10px", color: "#4A90E2" }}>🎯 Quick Navigation</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div><kbd>1</kbd>-<kbd>9</kbd> - Jump to planet/dwarf</div>
              <div><kbd>0</kbd> - Focus on Sun</div>
              <div><kbd>H</kbd> / <kbd>Home</kbd> - Focus Sun</div>
              <div><kbd>[</kbd> / <kbd>]</kbd> - Prev/Next planet</div>
              <div><kbd>F</kbd> - Follow selected</div>
              <div><kbd>R</kbd> - Reset camera</div>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: "15px", marginBottom: "10px", color: "#4A90E2" }}>⏱️ Simulation</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div><kbd>Space</kbd> - Pause/Play</div>
              <div><kbd>+</kbd> / <kbd>=</kbd> - Speed up time</div>
              <div><kbd>-</kbd> - Slow down time</div>
            </div>
            
            <h4 style={{ fontSize: "15px", marginTop: "16px", marginBottom: "10px", color: "#4A90E2" }}>👁️ Display Toggle</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div><kbd>O</kbd> - Toggle orbits</div>
              <div><kbd>M</kbd> - Toggle moons</div>
              <div><kbd>C</kbd> - Toggle comets</div>
              <div><kbd>Ctrl</kbd>+<kbd>S</kbd> - Stats panel</div>
            </div>
            
            <h4 style={{ fontSize: "15px", marginTop: "16px", marginBottom: "10px", color: "#4A90E2" }}>📋 Other</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div><kbd>?</kbd> - Show this help</div>
              <div><kbd>ESC</kbd> - Close/Exit follow</div>
            </div>
          </div>
        </div>

        <div style={{ 
          marginTop: "20px", 
          paddingTop: "16px", 
          borderTop: "1px solid rgba(255,255,255,0.15)",
          fontSize: "12px",
          opacity: 0.8
        }}>
          <h4 style={{ fontSize: "14px", marginBottom: "8px" }}>💡 Tips</h4>
          <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "1.7" }}>
            <li>Double-click any planet for instant camera focus</li>
            <li>Use <kbd>[</kbd> and <kbd>]</kbd> to cycle through planets while exploring</li>
            <li>Hold <kbd>Shift</kbd> while moving for faster camera speed</li>
            <li>Press <kbd>ESC</kbd> to exit follow mode and return to free camera</li>
            <li>Use number keys <kbd>1</kbd>-<kbd>8</kbd> for quick planet access</li>
            <li>Click the compare button (⚖️) to compare up to 3 planets side by side</li>
          </ul>
        </div>

        <button 
          className="tool-btn" 
          onClick={() => setShowKeyboardHelp(false)}
          style={{ width: "100%", padding: "10px", marginTop: "16px" }}
        >
          Got it!
        </button>
      </div>
    </div>
  );
}
