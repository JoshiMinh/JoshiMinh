"use client";

export function GravityVisualizationPanel({
  showGravityWell,
  showLagrangePoints,
  showRocheLimit,
  showBarycenter,
  onToggleGravityWell,
  onToggleLagrangePoints,
  onToggleRocheLimit,
  onToggleBarycenter
}) {
  return (
    <div style={{
      position: "absolute",
      bottom: 180,
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
        🌌 Gravity Effects
      </div>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {/* Gravity Well Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={() => onToggleGravityWell(!showGravityWell)}
            style={{
              flex: 1,
              padding: "8px 12px",
              background: showGravityWell 
                ? "rgba(68, 136, 255, 0.3)" 
                : "rgba(255, 255, 255, 0.1)",
              border: showGravityWell
                ? "1px solid rgba(68, 136, 255, 0.8)"
                : "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "6px",
              color: "white",
              cursor: "pointer",
              fontSize: "13px",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <span style={{ fontSize: "16px" }}>🕳️</span>
            <span>Gravity Well</span>
          </button>
        </div>
        
        {showGravityWell && (
          <div style={{ 
            fontSize: "11px", 
            opacity: 0.7,
            marginTop: "-6px",
            paddingLeft: "8px",
            lineHeight: "1.4"
          }}>
            3D grid shows spacetime curvature. Colors: blue (weak) → red (strong)
          </div>
        )}
        
        {/* Lagrange Points Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={() => onToggleLagrangePoints(!showLagrangePoints)}
            style={{
              flex: 1,
              padding: "8px 12px",
              background: showLagrangePoints 
                ? "rgba(255, 255, 0, 0.3)" 
                : "rgba(255, 255, 255, 0.1)",
              border: showLagrangePoints
                ? "1px solid rgba(255, 255, 0, 0.8)"
                : "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "6px",
              color: "white",
              cursor: "pointer",
              fontSize: "13px",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <span style={{ fontSize: "16px" }}>📍</span>
            <span>Lagrange Points</span>
          </button>
        </div>
        
        {showLagrangePoints && (
          <div style={{ 
            fontSize: "11px", 
            opacity: 0.7,
            marginTop: "-6px",
            paddingLeft: "8px",
            lineHeight: "1.4"
          }}>
            L1-L5 stable orbital zones. L4/L5 (green) are most stable
          </div>
        )}
        
        {/* Roche Limit Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={() => onToggleRocheLimit(!showRocheLimit)}
            style={{
              flex: 1,
              padding: "8px 12px",
              background: showRocheLimit 
                ? "rgba(255, 51, 51, 0.3)" 
                : "rgba(255, 255, 255, 0.1)",
              border: showRocheLimit
                ? "1px solid rgba(255, 51, 51, 0.8)"
                : "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "6px",
              color: "white",
              cursor: "pointer",
              fontSize: "13px",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <span style={{ fontSize: "16px" }}>⚠️</span>
            <span>Roche Limit</span>
          </button>
        </div>
        
        {showRocheLimit && (
          <div style={{ 
            fontSize: "11px", 
            opacity: 0.7,
            marginTop: "-6px",
            paddingLeft: "8px",
            lineHeight: "1.4"
          }}>
            Red zones where tidal forces tear objects apart
          </div>
        )}
        
        {/* Barycenter Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={() => onToggleBarycenter(!showBarycenter)}
            style={{
              flex: 1,
              padding: "8px 12px",
              background: showBarycenter 
                ? "rgba(255, 0, 255, 0.3)" 
                : "rgba(255, 255, 255, 0.1)",
              border: showBarycenter
                ? "1px solid rgba(255, 0, 255, 0.8)"
                : "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "6px",
              color: "white",
              cursor: "pointer",
              fontSize: "13px",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <span style={{ fontSize: "16px" }}>⊕</span>
            <span>Barycenter</span>
          </button>
        </div>
        
        {showBarycenter && (
          <div style={{ 
            fontSize: "11px", 
            opacity: 0.7,
            marginTop: "-6px",
            paddingLeft: "8px",
            lineHeight: "1.4"
          }}>
            Center of mass for the two most massive objects
          </div>
        )}
      </div>
      
      <div style={{ 
        marginTop: "12px", 
        paddingTop: "12px",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        fontSize: "11px",
        opacity: 0.6,
        lineHeight: "1.5"
      }}>
        💡 Tip: Combine with N-Body mode for realistic gravitational dynamics
      </div>
    </div>
  );
}
