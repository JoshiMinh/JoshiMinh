// Utility function to convert hex color number to CSS hex string
export const colorToHex = (color) => {
  if (typeof color !== 'number') return '#000000';
  return `#${color.toString(16).padStart(6, '0')}`;
};

// Helper function to calculate position on elliptical orbit
export function getEllipticalPosition(angle, distance, eccentricity) {
  const a = distance;
  const r = (a * (1 - eccentricity * eccentricity)) / (1 + eccentricity * Math.cos(angle));
  return {
    x: Math.cos(angle) * r,
    z: Math.sin(angle) * r,
    r: r
  };
}

// Create elliptical orbit path points
export function createEllipticalOrbitPath(distance, eccentricity, segments = 256) {
  const points = [];
  const a = distance;
  
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    const r = (a * (1 - eccentricity * eccentricity)) / (1 + eccentricity * Math.cos(theta));
    points.push(
      Math.cos(theta) * r,
      0,
      Math.sin(theta) * r
    );
  }
  return points;
}
