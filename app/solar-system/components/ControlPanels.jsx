"use client";

import { useState } from 'react';
import { colorToHex } from '../utils';
import { SCALE_MODES, PHYSICS_CONFIG } from '../data';

export function ControlsPanel({ 
  showOrbits, 
  timeSpeed, 
  setTimeSpeed, 
  cameraMode, 
  selectedPlanet 
}) {
  const [customTimeInput, setCustomTimeInput] = useState(timeSpeed.toString());
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleCustomTimeSubmit = () => {
    const value = parseFloat(customTimeInput);
    if (!isNaN(value) && value >= 0.01 && value <= 1000) {
      setTimeSpeed(value);
    }
    setShowCustomInput(false);
  };

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
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <button 
            className="tool-btn" 
            onClick={() => {
              const decrement = timeSpeed > 1 
                ? PHYSICS_CONFIG.TIME_SPEED_INCREMENT_LARGE 
                : PHYSICS_CONFIG.TIME_SPEED_INCREMENT_SMALL;
              setTimeSpeed(Math.max(0.01, timeSpeed - decrement));
            }}
            style={{ padding: "4px 8px", fontSize: "12px" }}
          >
            −
          </button>
          {showCustomInput ? (
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <input
                type="number"
                value={customTimeInput}
                onChange={(e) => setCustomTimeInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCustomTimeSubmit()}
                onBlur={handleCustomTimeSubmit}
                style={{
                  width: "60px",
                  padding: "4px",
                  borderRadius: "4px",
                  border: "1px solid rgba(255,255,255,0.3)",
                  background: "rgba(255,255,255,0.1)",
                  color: "white",
                  fontSize: "12px",
                  textAlign: "center"
                }}
                autoFocus
                min="0.01"
                max="1000"
                step="0.1"
              />
              <span style={{ fontSize: "12px" }}>x</span>
            </div>
          ) : (
            <span 
              style={{ 
                minWidth: "50px", 
                textAlign: "center", 
                cursor: "pointer",
                padding: "4px 8px",
                borderRadius: "4px",
                background: "rgba(255,255,255,0.1)"
              }}
              onClick={() => {
                setCustomTimeInput(timeSpeed.toString());
                setShowCustomInput(true);
              }}
              title="Click to enter custom value"
            >
              {timeSpeed}x
            </span>
          )}
          <button 
            className="tool-btn" 
            onClick={() => {
              const increment = timeSpeed >= 1 
                ? PHYSICS_CONFIG.TIME_SPEED_INCREMENT_LARGE 
                : PHYSICS_CONFIG.TIME_SPEED_INCREMENT_SMALL;
              setTimeSpeed(Math.min(1000, timeSpeed + increment));
            }}
            style={{ padding: "4px 8px", fontSize: "12px" }}
          >
            +
          </button>
        </div>
        <div style={{ fontSize: "10px", opacity: 0.6, marginTop: "4px" }}>
          Click value to enter custom (0.01-1000)
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

export function PhysicsPanel({ 
  simulationMode, 
  setSimulationMode, 
  gravityMultiplier, 
  setGravityMultiplier 
}) {
  const [showGravityInput, setShowGravityInput] = useState(false);
  const [customGravityInput, setCustomGravityInput] = useState(gravityMultiplier.toString());

  const handleGravitySubmit = () => {
    const value = parseFloat(customGravityInput);
    if (!isNaN(value) && value >= 0 && value <= 10) {
      setGravityMultiplier(value);
    }
    setShowGravityInput(false);
  };

  return (
    <div style={{
      position: "absolute",
      top: 220,
      left: 20,
      background: "rgba(0, 0, 0, 0.85)",
      color: "white",
      padding: "12px 16px",
      borderRadius: "12px",
      fontSize: "13px",
      zIndex: 10,
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      minWidth: "180px"
    }}>
      <div style={{ fontWeight: "bold", marginBottom: "10px", fontSize: "14px" }}>🔬 Physics</div>
      
      <div style={{ marginBottom: "12px" }}>
        <div style={{ fontSize: "11px", opacity: 0.7, marginBottom: "6px" }}>Simulation Mode</div>
        <div style={{ display: "flex", gap: "4px" }}>
          <button
            className="tool-btn"
            onClick={() => setSimulationMode('kepler')}
            style={{
              fontSize: "10px",
              padding: "4px 8px",
              background: simulationMode === 'kepler' ? 'rgba(100, 150, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
              border: simulationMode === 'kepler' ? '1px solid rgba(100, 150, 255, 0.5)' : '1px solid rgba(255, 255, 255, 0.2)'
            }}
            title="Kepler orbital mechanics - planets follow fixed elliptical paths"
          >
            Kepler
          </button>
          <button
            className="tool-btn"
            onClick={() => setSimulationMode('nbody')}
            style={{
              fontSize: "10px",
              padding: "4px 8px",
              background: simulationMode === 'nbody' ? 'rgba(100, 150, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
              border: simulationMode === 'nbody' ? '1px solid rgba(100, 150, 255, 0.5)' : '1px solid rgba(255, 255, 255, 0.2)'
            }}
            title="N-Body simulation - real gravitational interactions between all bodies"
          >
            N-Body
          </button>
        </div>
      </div>
      
      <div>
        <div style={{ fontSize: "11px", opacity: 0.7, marginBottom: "6px" }}>Gravity Multiplier</div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <button 
            className="tool-btn" 
            onClick={() => setGravityMultiplier(Math.max(0, gravityMultiplier - 0.1))}
            style={{ padding: "2px 6px", fontSize: "11px" }}
          >
            −
          </button>
          {showGravityInput ? (
            <input
              type="number"
              value={customGravityInput}
              onChange={(e) => setCustomGravityInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGravitySubmit()}
              onBlur={handleGravitySubmit}
              style={{
                width: "50px",
                padding: "2px 4px",
                borderRadius: "4px",
                border: "1px solid rgba(255,255,255,0.3)",
                background: "rgba(255,255,255,0.1)",
                color: "white",
                fontSize: "11px",
                textAlign: "center"
              }}
              autoFocus
              min="0"
              max="10"
              step="0.1"
            />
          ) : (
            <span 
              style={{ 
                minWidth: "40px", 
                textAlign: "center", 
                cursor: "pointer",
                fontSize: "12px"
              }}
              onClick={() => {
                setCustomGravityInput(gravityMultiplier.toString());
                setShowGravityInput(true);
              }}
              title="Click to enter custom value"
            >
              {gravityMultiplier.toFixed(1)}x
            </span>
          )}
          <button 
            className="tool-btn" 
            onClick={() => setGravityMultiplier(Math.min(10, gravityMultiplier + 0.1))}
            style={{ padding: "2px 6px", fontSize: "11px" }}
          >
            +
          </button>
        </div>
        <div style={{ fontSize: "9px", opacity: 0.5, marginTop: "4px" }}>
          {simulationMode === 'nbody' ? 'Affects gravitational force' : 'Affects orbital speeds'}
        </div>
      </div>
      
      <div style={{ 
        marginTop: "10px", 
        paddingTop: "8px", 
        borderTop: "1px solid rgba(255,255,255,0.1)",
        fontSize: "10px",
        opacity: 0.6,
        lineHeight: "1.4"
      }}>
        {simulationMode === 'kepler' ? (
          <div>📐 Kepler: Fixed elliptical orbits using Kepler's laws</div>
        ) : (
          <div>🌌 N-Body: Real-time gravitational simulation between all bodies</div>
        )}
      </div>
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
