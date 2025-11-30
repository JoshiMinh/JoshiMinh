"use client";

import { colorToHex } from '../utils';
import { SCALE_MODES } from '../data';

export function ControlsPanel({ 
  showOrbits, 
  timeSpeed, 
  setTimeSpeed, 
  cameraMode, 
  selectedPlanet 
}) {
  return (
    <div style={{
      position: "absolute",
      bottom: 20,
      left: 20,
      background: "rgba(0, 0, 0, 0.85)",
      color: "white",
      padding: "16px 20px",
      borderRadius: "12px",
      fontSize: "13px",
      maxWidth: "320px",
      zIndex: 10,
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.1)"
    }}>
      <div style={{ fontWeight: "bold", marginBottom: "12px", fontSize: "16px" }}>
        🎮 Controls
      </div>
      <div style={{ lineHeight: "1.7" }}>
        <div>🖱️ Left drag - Rotate view</div>
        <div>🖱️ Right drag - Pan camera</div>
        <div>🔍 Scroll - Zoom in/out</div>
        <div>⌨️ WASD/QE - Move camera</div>
        <div>⚡ Shift/Alt - Speed modifiers</div>
        <div>👆 Click - Info | Double-click - Focus</div>
        <div>🔢 1-8 - Quick planet select</div>
      </div>
      
      <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.2)" }}>
        <div style={{ fontWeight: "bold", marginBottom: "8px" }}>⏱️ Time Speed</div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button 
            className="tool-btn" 
            onClick={() => setTimeSpeed(Math.max(0.1, timeSpeed - 0.5))}
            style={{ padding: "4px 8px", fontSize: "12px" }}
          >
            −
          </button>
          <span style={{ minWidth: "40px", textAlign: "center" }}>{timeSpeed}x</span>
          <button 
            className="tool-btn" 
            onClick={() => setTimeSpeed(Math.min(10, timeSpeed + 0.5))}
            style={{ padding: "4px 8px", fontSize: "12px" }}
          >
            +
          </button>
        </div>
      </div>
      
      {cameraMode === 'follow' && selectedPlanet && (
        <div style={{ 
          marginTop: "12px", 
          paddingTop: "12px", 
          borderTop: "1px solid rgba(255,255,255,0.2)",
          background: "rgba(100, 150, 255, 0.1)",
          padding: "10px",
          borderRadius: "8px",
          marginLeft: "-10px",
          marginRight: "-10px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <span style={{ fontSize: "14px" }}>📹 Following: <strong>{selectedPlanet.name}</strong></span>
          </div>
          <div style={{ fontSize: "11px", opacity: 0.7 }}>
            Press ESC to exit follow mode
          </div>
        </div>
      )}
    </div>
  );
}

export function ScaleModePanel({ scaleMode, setScaleMode }) {
  return (
    <div style={{
      position: "absolute",
      top: 80,
      left: 20,
      background: "rgba(0, 0, 0, 0.85)",
      color: "white",
      padding: "12px 16px",
      borderRadius: "12px",
      fontSize: "13px",
      zIndex: 10,
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.1)"
    }}>
      <div style={{ fontWeight: "bold", marginBottom: "10px", fontSize: "14px" }}>📐 Scale Mode</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {Object.entries(SCALE_MODES).map(([key, mode]) => (
          <button
            key={key}
            className="tool-btn"
            onClick={() => setScaleMode(key)}
            style={{
              fontSize: "11px",
              padding: "6px 10px",
              textAlign: "left",
              background: scaleMode === key ? 'rgba(100, 150, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
              border: scaleMode === key ? '1px solid rgba(100, 150, 255, 0.5)' : '1px solid rgba(255, 255, 255, 0.2)'
            }}
            title={mode.description}
          >
            {mode.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export function DateDisplay({ simulationDate, showDatePicker, setShowDatePicker, setSimulationDate }) {
  return (
    <div style={{
      position: "absolute",
      top: 80,
      left: "50%",
      transform: "translateX(-50%)",
      background: "rgba(0, 0, 0, 0.85)",
      color: "white",
      padding: "10px 20px",
      borderRadius: "12px",
      fontSize: "14px",
      zIndex: 10,
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      textAlign: "center"
    }}>
      <div style={{ fontSize: "12px", opacity: 0.7, marginBottom: "4px" }}>📅 Simulation Date</div>
      <div style={{ fontSize: "18px", fontWeight: "bold", cursor: "pointer" }} onClick={() => setShowDatePicker(!showDatePicker)}>
        {simulationDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
      </div>
      {showDatePicker && (
        <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px solid rgba(255,255,255,0.2)" }}>
          <input
            type="date"
            value={simulationDate.toISOString().split('T')[0]}
            onChange={(e) => {
              setSimulationDate(new Date(e.target.value));
              setShowDatePicker(false);
            }}
            style={{
              padding: "6px",
              borderRadius: "6px",
              border: "1px solid rgba(255,255,255,0.3)",
              background: "rgba(255,255,255,0.1)",
              color: "white"
            }}
          />
          <div style={{ marginTop: "8px" }}>
            <button 
              className="tool-btn" 
              onClick={() => { setSimulationDate(new Date()); setShowDatePicker(false); }}
              style={{ fontSize: "11px", padding: "4px 8px" }}
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function StatsPanel({ stats, showStats, scaleMode, timeSpeed }) {
  if (!showStats) return null;
  
  return (
    <div style={{
      position: "absolute",
      top: 200,
      left: 20,
      background: "rgba(0, 0, 0, 0.85)",
      color: "white",
      padding: "16px",
      borderRadius: "12px",
      maxWidth: "200px",
      zIndex: 10,
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.1)"
    }}>
      <div style={{ fontWeight: "bold", marginBottom: "12px", fontSize: "16px" }}>
        📊 Statistics
      </div>
      <div style={{ fontSize: "13px", lineHeight: "1.8" }}>
        <div>FPS: <strong>{stats.fps}</strong></div>
        <div>Objects: <strong>{stats.objects}</strong></div>
        <div>Time: <strong>{timeSpeed}x</strong></div>
        <div>Scale: <strong>{SCALE_MODES[scaleMode].name}</strong></div>
      </div>
    </div>
  );
}
