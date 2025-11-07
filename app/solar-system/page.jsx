"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import "../styles/game-page.css";

// Planet data with realistic relative sizes and orbital periods
const PLANETS_DATA = [
  { 
    name: "Mercury", 
    color: 0x8C7853, 
    size: 0.4, 
    distance: 4, 
    speed: 4.74, 
    info: "Smallest planet, closest to the Sun"
  },
  { 
    name: "Venus", 
    color: 0xFFC649, 
    size: 0.9, 
    distance: 6, 
    speed: 3.5, 
    info: "Hottest planet with thick atmosphere"
  },
  { 
    name: "Earth", 
    color: 0x4A90E2, 
    size: 1, 
    distance: 8, 
    speed: 2.98, 
    info: "Our home planet with liquid water"
  },
  { 
    name: "Mars", 
    color: 0xE27B58, 
    size: 0.53, 
    distance: 10, 
    speed: 2.41, 
    info: "The Red Planet with polar ice caps"
  },
  { 
    name: "Jupiter", 
    color: 0xC88B3A, 
    size: 2.5, 
    distance: 14, 
    speed: 1.31, 
    info: "Largest planet with Great Red Spot"
  },
  { 
    name: "Saturn", 
    color: 0xFAD5A5, 
    size: 2.1, 
    distance: 18, 
    speed: 0.97, 
    info: "Famous for its beautiful ring system"
  },
  { 
    name: "Uranus", 
    color: 0x4FD0E0, 
    size: 1.4, 
    distance: 22, 
    speed: 0.68, 
    info: "Ice giant tilted on its side"
  },
  { 
    name: "Neptune", 
    color: 0x4166F5, 
    size: 1.4, 
    distance: 26, 
    speed: 0.54, 
    info: "Windiest planet in the solar system"
  }
];

// Main component
export default function SolarSystemPage() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [cameraReset, setCameraReset] = useState(0);
  const sceneRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    let THREE;
    let scene, camera, renderer, controls;
    let planets = [];
    let sun;
    let animationId;

    const initScene = async () => {
      // Dynamically import Three.js
      THREE = await import("three");
      const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");

      const container = containerRef.current;
      const width = container.clientWidth;
      const height = container.clientHeight;

      // Scene setup
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000000);

      // Camera
      camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
      camera.position.set(0, 20, 35);

      // Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
      container.appendChild(renderer.domElement);

      // Controls
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.minDistance = 5;
      controls.maxDistance = 60;

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
      scene.add(ambientLight);

      // Sun
      const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
      const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xFDB813 });
      sun = new THREE.Mesh(sunGeometry, sunMaterial);
      scene.add(sun);

      // Sun light
      const sunLight = new THREE.PointLight(0xffffff, 2, 100);
      sun.add(sunLight);

      // Stars
      const starsGeometry = new THREE.BufferGeometry();
      const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.7 });
      const starsVertices = [];
      for (let i = 0; i < 5000; i++) {
        const x = (Math.random() - 0.5) * 200;
        const y = (Math.random() - 0.5) * 200;
        const z = (Math.random() - 0.5) * 200;
        starsVertices.push(x, y, z);
      }
      starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
      const stars = new THREE.Points(starsGeometry, starsMaterial);
      scene.add(stars);

      // Create planets
      PLANETS_DATA.forEach((planetData) => {
        // Orbit line
        const orbitGeometry = new THREE.BufferGeometry();
        const orbitPoints = [];
        const segments = 128;
        for (let i = 0; i <= segments; i++) {
          const theta = (i / segments) * Math.PI * 2;
          orbitPoints.push(
            Math.cos(theta) * planetData.distance,
            0,
            Math.sin(theta) * planetData.distance
          );
        }
        orbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(orbitPoints, 3));
        const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x444444, opacity: 0.3, transparent: true });
        const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
        scene.add(orbit);

        // Planet
        const planetGeometry = new THREE.SphereGeometry(planetData.size * 0.5, 32, 32);
        const planetMaterial = new THREE.MeshStandardMaterial({ 
          color: planetData.color,
          emissive: 0x000000,
          emissiveIntensity: 0
        });
        const planet = new THREE.Mesh(planetGeometry, planetMaterial);
        
        // Group for planet orbit
        const planetGroup = new THREE.Group();
        planet.position.x = planetData.distance;
        planetGroup.add(planet);
        scene.add(planetGroup);

        planets.push({
          group: planetGroup,
          mesh: planet,
          data: planetData,
          angle: Math.random() * Math.PI * 2
        });
      });

      // Animation loop
      const animate = () => {
        animationId = requestAnimationFrame(animate);

        // Rotate sun
        if (sun) {
          sun.rotation.y += 0.002;
        }

        // Update planets
        planets.forEach(planet => {
          planet.angle += planet.data.speed * 0.0001;
          planet.group.rotation.y = planet.angle;
          planet.mesh.rotation.y += 0.01;
        });

        controls.update();
        renderer.render(scene, camera);
      };

      animate();

      // Handle resize
      const handleResize = () => {
        if (!container) return;
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };
      window.addEventListener('resize', handleResize);

      sceneRef.current = { scene, camera, renderer, controls, cleanup: () => {
        window.removeEventListener('resize', handleResize);
        if (animationId) cancelAnimationFrame(animationId);
        if (renderer) {
          renderer.dispose();
          container.removeChild(renderer.domElement);
        }
      }};
    };

    initScene();

    return () => {
      if (sceneRef.current?.cleanup) {
        sceneRef.current.cleanup();
      }
    };
  }, [cameraReset]);

  const handleCloseInfo = () => {
    setShowInfo(false);
    setSelectedPlanet(null);
  };

  const resetCamera = () => {
    setCameraReset(prev => prev + 1);
  };

  const handlePlanetSelect = (planet) => {
    setSelectedPlanet(planet);
    setShowInfo(true);
  };

  return (
    <div className="game-container">
      <div className="topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/" className="back-link">← Home</Link>
          <h1 style={{ fontSize: 24, margin: 0 }}>Solar System Simulator</h1>
        </div>
        <div className="topbar-actions">
          <button className="tool-btn" onClick={resetCamera}>Reset View</button>
          <button className="tool-btn" onClick={() => setShowInfo(!showInfo)}>
            {showInfo ? "Hide" : "Show"} Info
          </button>
        </div>
      </div>

      <main className="game-content">
        <div className="stage">
          <div 
            ref={containerRef} 
            className="canvas-wrapper" 
            style={{ background: "#000000", position: "relative" }}
          />

          {/* Control instructions overlay */}
          <div style={{
            position: "absolute",
            bottom: 20,
            left: 20,
            background: "rgba(0, 0, 0, 0.7)",
            color: "white",
            padding: "12px 16px",
            borderRadius: "8px",
            fontSize: "14px",
            maxWidth: "300px",
            zIndex: 10
          }}>
            <div style={{ fontWeight: "bold", marginBottom: "8px" }}>Controls:</div>
            <div>• Left click + drag to rotate</div>
            <div>• Right click + drag to pan</div>
            <div>• Scroll to zoom in/out</div>
            <div>• Click planets to view info</div>
          </div>

          {/* Planet selector buttons */}
          <div style={{
            position: "absolute",
            top: 20,
            right: 20,
            background: "rgba(0, 0, 0, 0.7)",
            color: "white",
            padding: "12px",
            borderRadius: "8px",
            maxWidth: "200px",
            zIndex: 10
          }}>
            <div style={{ fontWeight: "bold", marginBottom: "8px" }}>Planets:</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {PLANETS_DATA.map((planet) => (
                <button
                  key={planet.name}
                  className="tool-btn"
                  onClick={() => handlePlanetSelect(planet)}
                  style={{ 
                    fontSize: "12px", 
                    padding: "6px 10px",
                    textAlign: "left"
                  }}
                >
                  {planet.name}
                </button>
              ))}
            </div>
          </div>

          {/* Planet info panel */}
          {showInfo && selectedPlanet && (
            <div className="help-overlay" onClick={handleCloseInfo}>
              <div className="help-card" onClick={(e) => e.stopPropagation()}>
                <h3>{selectedPlanet.name}</h3>
                <div style={{ 
                  width: "60px", 
                  height: "60px", 
                  borderRadius: "50%", 
                  background: `#${selectedPlanet.color.toString(16).padStart(6, '0')}`,
                  margin: "12px auto",
                  boxShadow: `0 0 20px #${selectedPlanet.color.toString(16).padStart(6, '0')}`
                }}></div>
                <p style={{ fontSize: "16px", marginBottom: "12px" }}>
                  {selectedPlanet.info}
                </p>
                <div style={{ 
                  fontSize: "14px", 
                  opacity: 0.8,
                  borderTop: "1px solid rgba(255,255,255,0.2)",
                  paddingTop: "12px",
                  marginTop: "12px"
                }}>
                  <div>Relative size: {selectedPlanet.size.toFixed(1)}x</div>
                  <div>Orbital distance: {selectedPlanet.distance} AU (scaled)</div>
                  <div>Orbital speed: {selectedPlanet.speed.toFixed(2)} (scaled)</div>
                </div>
                <button 
                  className="tool-btn" 
                  onClick={handleCloseInfo}
                  style={{ marginTop: "16px", width: "100%" }}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
