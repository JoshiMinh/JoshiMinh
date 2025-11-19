"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import "./styles.css";

// Utility function to convert hex color number to CSS hex string
const colorToHex = (color) => {
  if (typeof color !== 'number') return '#000000';
  return `#${color.toString(16).padStart(6, '0')}`;
};

// Enhanced planet data with more realistic properties
const PLANETS_DATA = [
  { 
    name: "Mercury", 
    color: 0xB8B8B8, 
    size: 0.38, 
    distance: 5.8, 
    speed: 4.74,
    rotationSpeed: 0.004,
    info: "Smallest planet, closest to the Sun. Has extreme temperature variations.",
    realDistance: "57.9 million km",
    realSize: "4,879 km diameter"
  },
  { 
    name: "Venus", 
    color: 0xFFC649, 
    size: 0.95, 
    distance: 10.8, 
    speed: 3.5,
    rotationSpeed: -0.002,
    info: "Hottest planet with thick atmosphere. Rotates backwards!",
    realDistance: "108.2 million km",
    realSize: "12,104 km diameter"
  },
  { 
    name: "Earth", 
    color: 0x4A90E2, 
    size: 1, 
    distance: 15, 
    speed: 2.98,
    rotationSpeed: 0.02,
    info: "Our home planet with liquid water and abundant life.",
    realDistance: "149.6 million km",
    realSize: "12,742 km diameter"
  },
  { 
    name: "Mars", 
    color: 0xCD5C5C, 
    size: 0.53, 
    distance: 22.8, 
    speed: 2.41,
    rotationSpeed: 0.018,
    info: "The Red Planet with polar ice caps and ancient river beds.",
    realDistance: "227.9 million km",
    realSize: "6,779 km diameter"
  },
  { 
    name: "Jupiter", 
    color: 0xDAA520, 
    size: 2.8, 
    distance: 77.8, 
    speed: 1.31,
    rotationSpeed: 0.04,
    info: "Largest planet with the Great Red Spot, a massive storm.",
    realDistance: "778.5 million km",
    realSize: "139,820 km diameter"
  },
  { 
    name: "Saturn", 
    color: 0xF4E7C6, 
    size: 2.3, 
    distance: 143.4, 
    speed: 0.97,
    rotationSpeed: 0.038,
    info: "Famous for its spectacular ring system made of ice and rock.",
    realDistance: "1.434 billion km",
    realSize: "116,460 km diameter"
  },
  { 
    name: "Uranus", 
    color: 0x4FD0E7, 
    size: 1.6, 
    distance: 287.1, 
    speed: 0.68,
    rotationSpeed: -0.03,
    info: "Ice giant tilted on its side, rotates at 98° angle.",
    realDistance: "2.871 billion km",
    realSize: "50,724 km diameter"
  },
  { 
    name: "Neptune", 
    color: 0x4166F5, 
    size: 1.5, 
    distance: 450.4, 
    speed: 0.54,
    rotationSpeed: 0.032,
    info: "Windiest planet with supersonic winds up to 2,100 km/h.",
    realDistance: "4.495 billion km",
    realSize: "49,244 km diameter"
  }
];

// Main component
export default function SolarSystemPage() {
  const containerRef = useRef(null);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeSpeed, setTimeSpeed] = useState(1);
  const [showOrbits, setShowOrbits] = useState(true);
  const [cameraMode, setCameraMode] = useState('free'); // 'free' or 'follow'
  const sceneRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    let THREE;
    let scene, camera, renderer, controls;
    let planets = [];
    let sun;
    let animationId;
    let orbitLines = [];

    const initScene = async () => {
      // Dynamically import Three.js
      THREE = await import("three");
      const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");

      const container = containerRef.current;
      
      // Ensure container has dimensions
      if (!container.clientWidth || !container.clientHeight) {
        console.error('Container has no dimensions');
        return;
      }
      
      const width = container.clientWidth;
      const height = container.clientHeight;

      // Scene setup
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000011);

      // Camera with better initial position
      camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 2000);
      camera.position.set(0, 50, 100);
      camera.lookAt(0, 0, 0);

      // Renderer with enhanced settings
      renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: false 
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      container.appendChild(renderer.domElement);

      // Enhanced controls
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.minDistance = 10;
      controls.maxDistance = 800;
      controls.enablePan = true;
      controls.panSpeed = 0.8;
      controls.rotateSpeed = 0.6;
      controls.zoomSpeed = 1.2;

      // Lighting - ambient light for overall visibility
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
      scene.add(ambientLight);

      // Create an enhanced Sun with proper material
      const sunGeometry = new THREE.SphereGeometry(3, 64, 64);
      const sunMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xFDB813
      });
      sun = new THREE.Mesh(sunGeometry, sunMaterial);
      sun.castShadow = false;
      scene.add(sun);

      // Add sun glow effect
      const sunGlowGeometry = new THREE.SphereGeometry(3.5, 32, 32);
      const sunGlowMaterial = new THREE.MeshBasicMaterial({
        color: 0xFDB813,
        transparent: true,
        opacity: 0.3
      });
      const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
      sun.add(sunGlow);

      // Point light from the sun
      const sunLight = new THREE.PointLight(0xffffff, 3, 1000);
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.width = 2048;
      sunLight.shadow.mapSize.height = 2048;
      sun.add(sunLight);

      // Add more distant ambient glow
      const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000033, 0.3);
      scene.add(hemisphereLight);

      // Enhanced starfield
      const starsGeometry = new THREE.BufferGeometry();
      const starsMaterial = new THREE.PointsMaterial({ 
        color: 0xffffff, 
        size: 1.5,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.8
      });
      const starsVertices = [];
      for (let i = 0; i < 10000; i++) {
        const x = (Math.random() - 0.5) * 1500;
        const y = (Math.random() - 0.5) * 1500;
        const z = (Math.random() - 0.5) * 1500;
        starsVertices.push(x, y, z);
      }
      starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
      const stars = new THREE.Points(starsGeometry, starsMaterial);
      scene.add(stars);

      // Create planets with enhanced materials
      PLANETS_DATA.forEach((planetData, index) => {
        // Orbit line
        const orbitGeometry = new THREE.BufferGeometry();
        const orbitPoints = [];
        const segments = 256;
        for (let i = 0; i <= segments; i++) {
          const theta = (i / segments) * Math.PI * 2;
          orbitPoints.push(
            Math.cos(theta) * planetData.distance,
            0,
            Math.sin(theta) * planetData.distance
          );
        }
        orbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(orbitPoints, 3));
        const orbitMaterial = new THREE.LineBasicMaterial({ 
          color: 0x444444, 
          opacity: 0.4, 
          transparent: true 
        });
        const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
        scene.add(orbitLine);
        orbitLines.push(orbitLine);

        // Planet with enhanced material
        const planetGeometry = new THREE.SphereGeometry(planetData.size * 0.6, 64, 64);
        const planetMaterial = new THREE.MeshStandardMaterial({ 
          color: planetData.color,
          emissive: planetData.color,
          emissiveIntensity: 0.1,
          roughness: 0.7,
          metalness: 0.2
        });
        const planet = new THREE.Mesh(planetGeometry, planetMaterial);
        planet.castShadow = true;
        planet.receiveShadow = true;
        
        // Add subtle atmosphere glow for some planets
        if (['Earth', 'Venus', 'Neptune', 'Uranus'].includes(planetData.name)) {
          const glowGeometry = new THREE.SphereGeometry(planetData.size * 0.65, 32, 32);
          const glowMaterial = new THREE.MeshBasicMaterial({
            color: planetData.color,
            transparent: true,
            opacity: 0.15,
            side: THREE.BackSide
          });
          const glow = new THREE.Mesh(glowGeometry, glowMaterial);
          planet.add(glow);
        }

        // Add Saturn's rings
        if (planetData.name === 'Saturn') {
          const ringGeometry = new THREE.RingGeometry(
            planetData.size * 0.8,
            planetData.size * 1.4,
            64
          );
          const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0xC9B58B,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.7
          });
          const ring = new THREE.Mesh(ringGeometry, ringMaterial);
          ring.rotation.x = Math.PI / 2;
          planet.add(ring);
        }
        
        // Group for planet orbit
        const planetGroup = new THREE.Group();
        planet.position.x = planetData.distance;
        planetGroup.add(planet);
        scene.add(planetGroup);

        // Store planet data
        planets.push({
          group: planetGroup,
          mesh: planet,
          data: planetData,
          geometry: planetGeometry,
          material: planetMaterial,
          angle: Math.random() * Math.PI * 2  // Random starting position
        });
      });

      // Raycaster for planet clicking
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      const onMouseClick = (event) => {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(
          planets.map(p => p.mesh)
        );

        if (intersects.length > 0) {
          const clickedPlanet = planets.find(p => p.mesh === intersects[0].object);
          if (clickedPlanet) {
            setSelectedPlanet(clickedPlanet.data);
            setShowInfo(true);
          }
        }
      };

      renderer.domElement.addEventListener('click', onMouseClick);

      // Animation loop with improved performance
      const clock = new THREE.Clock();
      const animate = () => {
        animationId = requestAnimationFrame(animate);
        const delta = clock.getDelta();

        // Rotate sun
        if (sun) {
          sun.rotation.y += 0.001;
        }

        // Update planets with time speed
        if (!isPaused) {
          planets.forEach(planet => {
            // Orbital motion
            planet.angle += planet.data.speed * 0.00005 * timeSpeed;
            planet.group.rotation.y = planet.angle;
            
            // Planetary rotation
            planet.mesh.rotation.y += planet.data.rotationSpeed * timeSpeed;
          });
        }

        // Camera follow mode
        if (cameraMode === 'follow' && selectedPlanet) {
          const planet = planets.find(p => p.data.name === selectedPlanet.name);
          if (planet) {
            const planetWorldPos = new THREE.Vector3();
            planet.mesh.getWorldPosition(planetWorldPos);
            const offset = new THREE.Vector3(0, 10, 20);
            const targetPos = planetWorldPos.clone().add(offset);
            camera.position.lerp(targetPos, 0.05);
            camera.lookAt(planetWorldPos);
          }
        } else {
          controls.update();
        }

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

      sceneRef.current = { 
        scene, 
        camera, 
        renderer, 
        controls, 
        sun,
        planets,
        orbitLines,
        cleanup: () => {
          window.removeEventListener('resize', handleResize);
          renderer.domElement.removeEventListener('click', onMouseClick);
          if (animationId) cancelAnimationFrame(animationId);
          
          // Dispose of all geometries and materials
          planets.forEach(planet => {
            if (planet.geometry) planet.geometry.dispose();
            if (planet.material) planet.material.dispose();
          });
          
          orbitLines.forEach(line => {
            if (line.geometry) line.geometry.dispose();
            if (line.material) line.material.dispose();
          });
          
          if (renderer) {
            renderer.dispose();
            if (container && container.contains(renderer.domElement)) {
              container.removeChild(renderer.domElement);
            }
          }
        }
      };
    };

    initScene();

    return () => {
      if (sceneRef.current?.cleanup) {
        sceneRef.current.cleanup();
      }
    };
  }, [isPaused, timeSpeed, cameraMode, selectedPlanet]);

  // Update orbit visibility
  useEffect(() => {
    if (sceneRef.current?.orbitLines) {
      sceneRef.current.orbitLines.forEach(line => {
        line.visible = showOrbits;
      });
    }
  }, [showOrbits]);

  const handleCloseInfo = useCallback(() => {
    setShowInfo(false);
  }, []);

  const resetCamera = useCallback(() => {
    if (sceneRef.current?.camera && sceneRef.current?.controls) {
      sceneRef.current.camera.position.set(0, 50, 100);
      sceneRef.current.controls.target.set(0, 0, 0);
      sceneRef.current.controls.update();
      setCameraMode('free');
    }
  }, []);

  const handlePlanetSelect = useCallback((planet) => {
    setSelectedPlanet(planet);
    setShowInfo(true);
  }, []);

  const focusOnPlanet = useCallback((planetData) => {
    setSelectedPlanet(planetData);
    setCameraMode('follow');
  }, []);

  return (
    <div className="game-container">
      <div className="topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/" className="back-link">← Home</Link>
          <h1 style={{ fontSize: 24, margin: 0 }}>Solar System Simulator 3D</h1>
        </div>
        <div className="topbar-actions">
          <button 
            className="tool-btn" 
            onClick={() => setIsPaused(!isPaused)}
            style={{ background: isPaused ? 'rgba(255, 100, 100, 0.2)' : 'rgba(100, 255, 100, 0.2)' }}
          >
            {isPaused ? '▶️ Play' : '⏸️ Pause'}
          </button>
          <button className="tool-btn" onClick={resetCamera}>
            🔄 Reset View
          </button>
          <button 
            className="tool-btn" 
            onClick={() => setShowOrbits(!showOrbits)}
            style={{ opacity: showOrbits ? 1 : 0.5 }}
          >
            {showOrbits ? '🔵 Orbits' : '⚪ Orbits'}
          </button>
        </div>
      </div>

      <main className="game-content">
        <div className="stage">
          <div 
            ref={containerRef} 
            className="canvas-wrapper"
          />

          {/* Enhanced control instructions */}
          <div style={{
            position: "absolute",
            bottom: 20,
            left: 20,
            background: "rgba(0, 0, 0, 0.85)",
            color: "white",
            padding: "16px 20px",
            borderRadius: "12px",
            fontSize: "14px",
            maxWidth: "320px",
            zIndex: 10,
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)"
          }}>
            <div style={{ fontWeight: "bold", marginBottom: "12px", fontSize: "16px" }}>
              🎮 Controls
            </div>
            <div style={{ lineHeight: "1.8" }}>
              <div>🖱️ Left drag - Rotate view</div>
              <div>🖱️ Right drag - Pan camera</div>
              <div>🔍 Scroll - Zoom in/out</div>
              <div>👆 Click planet - View details</div>
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
                  onClick={() => setTimeSpeed(Math.min(5, timeSpeed + 0.5))}
                  style={{ padding: "4px 8px", fontSize: "12px" }}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced planet selector */}
          <div style={{
            position: "absolute",
            top: 80,
            right: 20,
            background: "rgba(0, 0, 0, 0.85)",
            color: "white",
            padding: "16px",
            borderRadius: "12px",
            maxWidth: "220px",
            zIndex: 10,
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)"
          }}>
            <div style={{ fontWeight: "bold", marginBottom: "12px", fontSize: "16px" }}>
              🪐 Planets
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {PLANETS_DATA.map((planet) => (
                <button
                  key={planet.name}
                  className="tool-btn"
                  onClick={() => focusOnPlanet(planet)}
                  style={{ 
                    fontSize: "13px", 
                    padding: "8px 12px",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: selectedPlanet?.name === planet.name && cameraMode === 'follow' 
                      ? 'rgba(100, 150, 255, 0.3)' 
                      : 'rgba(255, 255, 255, 0.1)',
                    border: selectedPlanet?.name === planet.name && cameraMode === 'follow'
                      ? '1px solid rgba(100, 150, 255, 0.5)'
                      : '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(100, 150, 255, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    if (!(selectedPlanet?.name === planet.name && cameraMode === 'follow')) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    }
                  }}
                >
                  <div style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: colorToHex(planet.color),
                    boxShadow: `0 0 8px ${colorToHex(planet.color)}`
                  }}></div>
                  {planet.name}
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced planet info panel */}
          {showInfo && selectedPlanet && (
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
                    <div style={{ opacity: 0.6, marginBottom: "4px" }}>Relative Size</div>
                    <div style={{ fontWeight: "bold" }}>{selectedPlanet.size.toFixed(2)}x Earth</div>
                  </div>
                  <div>
                    <div style={{ opacity: 0.6, marginBottom: "4px" }}>Orbital Speed</div>
                    <div style={{ fontWeight: "bold" }}>{selectedPlanet.speed.toFixed(2)} km/s</div>
                  </div>
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
          )}
        </div>
      </main>
    </div>
  );
}
