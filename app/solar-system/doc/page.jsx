"use client";

import Link from "next/link";
import "./styles.css";

export default function SolarSystemDocPage() {
  return (
    <div className="doc-container">
      <header className="doc-header">
        <Link href="/solar-system" className="back-link">← Back to Simulator</Link>
        <h1>Solar System 3D - Technical Documentation</h1>
      </header>

      <main className="doc-content">
        <section className="doc-section">
          <h2>🌌 Overview</h2>
          <p>
            The Solar System 3D Simulator is a real-time interactive visualization built with Three.js and React.
            It simulates the motion of 8 planets around the Sun with accurate relative scaling and orbital mechanics.
          </p>
        </section>

        <section className="doc-section">
          <h2>🎨 3D Rendering Architecture</h2>
          
          <h3>Scene Setup</h3>
          <pre><code>{`// Three.js Scene Initialization
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 2000);
renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: "high-performance"
});`}</code></pre>
          
          <p>
            The scene uses a <strong>PerspectiveCamera</strong> with a 60° field of view for realistic depth perception.
            The renderer is optimized for high performance with disabled shadows to achieve 120fps.
          </p>

          <h3>Lighting Model</h3>
          <ul>
            <li><strong>Point Light:</strong> Emanates from the Sun with intensity of 3, reaching 1000 units</li>
            <li><strong>Ambient Light:</strong> Low-intensity (0.2) for basic visibility</li>
            <li><strong>Hemisphere Light:</strong> Simulates sky light (white) and ground reflection (dark blue)</li>
          </ul>

          <h3>Material System</h3>
          <p>
            Planets use <strong>MeshStandardMaterial</strong> with physically-based rendering (PBR):
          </p>
          <ul>
            <li><strong>Base Color:</strong> Unique hex color for each planet</li>
            <li><strong>Emissive:</strong> Low-intensity self-illumination (0.1) for subtle glow</li>
            <li><strong>Roughness:</strong> 0.7 for semi-matte surface</li>
            <li><strong>Metalness:</strong> 0.2 for slight metallic reflection</li>
          </ul>
        </section>

        <section className="doc-section">
          <h2>⚙️ Orbital Mechanics Algorithm</h2>
          
          <h3>Kepler's Laws Simplified</h3>
          <p>
            Each planet follows a circular orbit (simplified from elliptical) with angular velocity proportional
            to its orbital speed:
          </p>
          
          <pre><code>{`// Orbital Motion Update (per frame)
planet.angle += planet.data.speed * 0.00005 * timeSpeed;
planet.group.rotation.y = planet.angle;

// Position Calculation
x = cos(angle) * distance
z = sin(angle) * distance
y = 0 (all planets on orbital plane)`}</code></pre>

          <h3>Planetary Rotation</h3>
          <p>Each planet rotates on its own axis independent of orbital motion:</p>
          <pre><code>{`// Axial Rotation
planet.mesh.rotation.y += planet.data.rotationSpeed * timeSpeed;`}</code></pre>

          <h3>Time Speed Control</h3>
          <p>
            The simulation supports time manipulation (0.1x to 5x) without resetting the view.
            This is achieved using React refs to avoid re-rendering the entire scene:
          </p>
          <pre><code>{`const timeSpeedRef = useRef(timeSpeed);
// Update in animation loop uses ref value
planet.angle += speed * timeSpeedRef.current;`}</code></pre>
        </section>

        <section className="doc-section">
          <h2>📐 Scaling & Distance Model</h2>
          
          <table className="data-table">
            <thead>
              <tr>
                <th>Planet</th>
                <th>Real Distance (AU)</th>
                <th>Sim Distance</th>
                <th>Real Diameter (km)</th>
                <th>Sim Size</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Mercury</td>
                <td>0.39</td>
                <td>5.8</td>
                <td>4,879</td>
                <td>0.38</td>
              </tr>
              <tr>
                <td>Venus</td>
                <td>0.72</td>
                <td>10.8</td>
                <td>12,104</td>
                <td>0.95</td>
              </tr>
              <tr>
                <td>Earth</td>
                <td>1.00</td>
                <td>15.0</td>
                <td>12,742</td>
                <td>1.00</td>
              </tr>
              <tr>
                <td>Mars</td>
                <td>1.52</td>
                <td>22.8</td>
                <td>6,779</td>
                <td>0.53</td>
              </tr>
              <tr>
                <td>Jupiter</td>
                <td>5.20</td>
                <td>77.8</td>
                <td>139,820</td>
                <td>2.80</td>
              </tr>
              <tr>
                <td>Saturn</td>
                <td>9.58</td>
                <td>143.4</td>
                <td>116,460</td>
                <td>2.30</td>
              </tr>
              <tr>
                <td>Uranus</td>
                <td>19.22</td>
                <td>287.1</td>
                <td>50,724</td>
                <td>1.60</td>
              </tr>
              <tr>
                <td>Neptune</td>
                <td>30.05</td>
                <td>450.4</td>
                <td>49,244</td>
                <td>1.50</td>
              </tr>
            </tbody>
          </table>
          
          <p>
            <strong>Note:</strong> Distances and sizes are scaled logarithmically for visual clarity.
            True-to-scale would make inner planets invisible and distances impractically large.
          </p>
        </section>

        <section className="doc-section">
          <h2>🎮 Camera System</h2>
          
          <h3>OrbitControls</h3>
          <p>Free camera movement with smooth damping:</p>
          <ul>
            <li><strong>Damping Factor:</strong> 0.05 for smooth deceleration</li>
            <li><strong>Distance Limits:</strong> 10 to 800 units</li>
            <li><strong>Pan Speed:</strong> 0.8</li>
            <li><strong>Rotate Speed:</strong> 0.6</li>
            <li><strong>Zoom Speed:</strong> 1.2</li>
          </ul>

          <h3>Keyboard Movement</h3>
          <pre><code>{`// WASD/Arrow Keys
camera.getWorldDirection(forward);
forward.y = 0; // Keep on horizontal plane
forward.normalize();

// Movement
W/↑: camera.position += forward * moveSpeed
S/↓: camera.position -= forward * moveSpeed
A/←: camera.position -= right * moveSpeed  
D/→: camera.position += right * moveSpeed`}</code></pre>

          <h3>Planet Follow Mode</h3>
          <p>Smooth camera tracking with lerp interpolation:</p>
          <pre><code>{`const planetWorldPos = new THREE.Vector3();
planet.mesh.getWorldPosition(planetWorldPos);
const offset = new THREE.Vector3(0, 10, 20);
const targetPos = planetWorldPos.clone().add(offset);

// Smooth lerp (0.02 = 2% per frame)
camera.position.lerp(targetPos, 0.02);
controls.target.lerp(targetLookAt, 0.02);`}</code></pre>
        </section>

        <section className="doc-section">
          <h2>🌠 Asteroid Belt Implementation</h2>
          
          <p>
            The asteroid belt between Mars and Jupiter is rendered using particle system for performance:
          </p>
          
          <pre><code>{`// 1,500 asteroids distributed in a ring
const asteroidCount = 1500;
const innerRadius = 35; // Just beyond Mars
const outerRadius = 65; // Just before Jupiter

for (let i = 0; i < asteroidCount; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  const y = (Math.random() - 0.5) * 2; // Vertical spread
  asteroidPositions.push(x, y, z);
}`}</code></pre>

          <p>
            Uses <strong>THREE.Points</strong> with <strong>PointsMaterial</strong> for efficient rendering
            of thousands of small objects.
          </p>
        </section>

        <section className="doc-section">
          <h2>⚡ Performance Optimizations</h2>
          
          <h3>120 FPS Target</h3>
          <ul>
            <li><strong>Shadows Disabled:</strong> Significant GPU savings</li>
            <li><strong>Star Count Reduced:</strong> 500 stars (down from 10,000)</li>
            <li><strong>Power Preference:</strong> "high-performance" renderer hint</li>
            <li><strong>Geometry LOD:</strong> 64 segments for planets (good balance)</li>
            <li><strong>Pixel Ratio Cap:</strong> Max 2x for retina displays</li>
          </ul>

          <h3>Memory Management</h3>
          <p>Proper cleanup prevents memory leaks:</p>
          <pre><code>{`// Cleanup on unmount
planets.forEach(planet => {
  planet.geometry.dispose();
  planet.material.dispose();
});
renderer.dispose();`}</code></pre>

          <h3>State Management</h3>
          <p>
            Using refs instead of state for high-frequency updates prevents unnecessary re-renders:
          </p>
          <ul>
            <li><strong>timeSpeedRef:</strong> Accessed directly in animation loop</li>
            <li><strong>isPausedRef:</strong> No re-render when toggling pause</li>
          </ul>
        </section>

        <section className="doc-section">
          <h2>🔧 Technical Stack</h2>
          <ul>
            <li><strong>Framework:</strong> Next.js 16 (React 18)</li>
            <li><strong>3D Engine:</strong> Three.js r149+</li>
            <li><strong>Controls:</strong> OrbitControls from Three.js examples</li>
            <li><strong>Rendering:</strong> WebGL 2.0</li>
            <li><strong>Language:</strong> JavaScript (ES6+)</li>
          </ul>
        </section>

        <section className="doc-section">
          <h2>📚 Key Algorithms Summary</h2>
          
          <div className="algorithm-box">
            <h4>1. Circular Orbital Motion</h4>
            <p>θ(t) = θ₀ + ω·t·s</p>
            <p>Where: θ = angle, ω = angular velocity, t = time, s = speed multiplier</p>
          </div>

          <div className="algorithm-box">
            <h4>2. Camera Lerp Smoothing</h4>
            <p>P(t) = P(t-1) + α·(Target - P(t-1))</p>
            <p>Where: α = 0.02 (lerp factor), P = position</p>
          </div>

          <div className="algorithm-box">
            <h4>3. Vector-based Keyboard Movement</h4>
            <p>forward = normalize(camera.direction × {`{0,1,0}`})</p>
            <p>right = cross(camera.up, forward)</p>
          </div>
        </section>

        <section className="doc-section">
          <h2>🎯 Future Enhancements</h2>
          <ul>
            <li>Elliptical orbits with eccentricity</li>
            <li>Axial tilt visualization</li>
            <li>Moon systems for planets</li>
            <li>Comet trajectories</li>
            <li>Realistic texture mapping</li>
            <li>Physics-based collision detection</li>
          </ul>
        </section>
      </main>

      <footer className="doc-footer">
        <p>Built with Three.js and React | <Link href="/solar-system">Try the Simulator →</Link></p>
      </footer>
    </div>
  );
}
