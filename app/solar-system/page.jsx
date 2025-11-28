"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import "./styles.css";

// Utility function to convert hex color number to CSS hex string
const colorToHex = (color) => {
  if (typeof color !== 'number') return '#000000';
  return `#${color.toString(16).padStart(6, '0')}`;
};

// Enhanced planet data with more realistic properties including axial tilt and orbital eccentricity
const PLANETS_DATA = [
  { 
    name: "Mercury", 
    color: 0xB8B8B8, 
    size: 0.38, 
    distance: 5.8, 
    speed: 4.74,
    rotationSpeed: 0.004,
    axialTilt: 0.034, // 0.034 degrees - almost no tilt
    eccentricity: 0.2056, // Most eccentric planet
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
    axialTilt: 177.4, // 177.4 degrees - retrograde rotation
    eccentricity: 0.0067, // Nearly circular
    info: "Hottest planet with thick atmosphere. Rotates backwards at 177.4° tilt!",
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
    axialTilt: 23.44, // 23.44 degrees - causes seasons
    eccentricity: 0.0167,
    info: "Our home planet with liquid water and abundant life. 23.5° tilt causes seasons.",
    realDistance: "149.6 million km",
    realSize: "12,742 km diameter",
    moons: [
      { name: "Moon", color: 0xAAAAAA, size: 0.27, distance: 1.5, speed: 12, info: "Earth's only natural satellite" }
    ]
  },
  { 
    name: "Mars", 
    color: 0xCD5C5C, 
    size: 0.53, 
    distance: 22.8, 
    speed: 2.41,
    rotationSpeed: 0.018,
    axialTilt: 25.19, // 25.19 degrees - similar to Earth
    eccentricity: 0.0934,
    info: "The Red Planet with polar ice caps and ancient river beds. Has 2 small moons.",
    realDistance: "227.9 million km",
    realSize: "6,779 km diameter",
    moons: [
      { name: "Phobos", color: 0x8B7355, size: 0.08, distance: 0.8, speed: 25, info: "Larger moon, will crash into Mars" },
      { name: "Deimos", color: 0x9C8B6E, size: 0.05, distance: 1.2, speed: 18, info: "Smaller outer moon" }
    ]
  },
  { 
    name: "Jupiter", 
    color: 0xDAA520, 
    size: 2.8, 
    distance: 77.8, 
    speed: 1.31,
    rotationSpeed: 0.04,
    axialTilt: 3.13, // 3.13 degrees - minimal tilt
    eccentricity: 0.0489,
    info: "Largest planet with the Great Red Spot. Has 95 known moons including 4 Galilean moons.",
    realDistance: "778.5 million km",
    realSize: "139,820 km diameter",
    moons: [
      { name: "Io", color: 0xFFFF00, size: 0.29, distance: 3.5, speed: 15, info: "Most volcanically active body in solar system" },
      { name: "Europa", color: 0xE8E8E8, size: 0.25, distance: 4.5, speed: 12, info: "Ice-covered ocean moon, potential for life" },
      { name: "Ganymede", color: 0xA0A0A0, size: 0.41, distance: 5.5, speed: 9, info: "Largest moon in the solar system" },
      { name: "Callisto", color: 0x888888, size: 0.38, distance: 6.5, speed: 7, info: "Most heavily cratered object in solar system" }
    ]
  },
  { 
    name: "Saturn", 
    color: 0xF4E7C6, 
    size: 2.3, 
    distance: 143.4, 
    speed: 0.97,
    rotationSpeed: 0.038,
    axialTilt: 26.73, // 26.73 degrees
    eccentricity: 0.0565,
    info: "Famous for its spectacular ring system. Has 146 known moons including Titan.",
    realDistance: "1.434 billion km",
    realSize: "116,460 km diameter",
    moons: [
      { name: "Titan", color: 0xD4A574, size: 0.40, distance: 4.5, speed: 8, info: "Only moon with a dense atmosphere" },
      { name: "Enceladus", color: 0xFFFFFF, size: 0.12, distance: 3.0, speed: 14, info: "Active ice geysers, subsurface ocean" }
    ]
  },
  { 
    name: "Uranus", 
    color: 0x4FD0E7, 
    size: 1.6, 
    distance: 287.1, 
    speed: 0.68,
    rotationSpeed: -0.03,
    axialTilt: 97.77, // 97.77 degrees - rolls on its side!
    eccentricity: 0.0457,
    info: "Ice giant tilted on its side at 98°. Rotates nearly perpendicular to its orbit.",
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
    axialTilt: 28.32, // 28.32 degrees
    eccentricity: 0.0113,
    info: "Windiest planet with supersonic winds up to 2,100 km/h.",
    realDistance: "4.495 billion km",
    realSize: "49,244 km diameter"
  }
];

// Dwarf planets and other celestial bodies
const DWARF_PLANETS_DATA = [
  {
    name: "Pluto",
    color: 0xC4A582,
    size: 0.18,
    distance: 590.6,
    speed: 0.47,
    rotationSpeed: -0.008,
    axialTilt: 122.53, // 122.53 degrees
    eccentricity: 0.2488, // Very eccentric orbit
    info: "Former 9th planet, now classified as a dwarf planet. Has 5 known moons.",
    realDistance: "5.906 billion km",
    realSize: "2,377 km diameter",
    isDwarf: true
  },
  {
    name: "Ceres",
    color: 0x8B8680,
    size: 0.07,
    distance: 41.4,
    speed: 1.78,
    rotationSpeed: 0.035,
    axialTilt: 4.0, // ~4 degrees
    eccentricity: 0.0758,
    info: "Largest object in the asteroid belt, classified as a dwarf planet.",
    realDistance: "413.7 million km",
    realSize: "940 km diameter",
    isDwarf: true
  }
];

// Comet data for procedural comet trails
const COMETS_DATA = [
  {
    name: "Halley",
    color: 0xCCFFFF,
    size: 0.08,
    perihelion: 8.8,     // Closest to sun (scaled)
    aphelion: 350.6,     // Farthest from sun (scaled)
    speed: 2.5,
    inclination: 0.3,    // Orbital tilt
    tailLength: 15,
    info: "Most famous comet, visible every 75-79 years"
  },
  {
    name: "Hale-Bopp",
    color: 0xFFFFCC,
    size: 0.12,
    perihelion: 13.6,
    aphelion: 520.0,
    speed: 1.8,
    inclination: 0.5,
    tailLength: 20,
    info: "Great Comet of 1997, visible for 18 months"
  },
  {
    name: "Encke",
    color: 0xE8E8FF,
    size: 0.05,
    perihelion: 5.1,
    aphelion: 62.0,
    speed: 4.2,
    inclination: 0.2,
    tailLength: 8,
    info: "Shortest orbital period of any known comet (3.3 years)"
  }
];

// Scale mode configurations
const SCALE_MODES = {
  balanced: {
    name: "Balanced",
    description: "Optimized for visibility",
    sizeMultiplier: 1,
    distanceMultiplier: 1
  },
  trueDistance: {
    name: "True Distance",
    description: "Accurate relative distances (planets appear tiny)",
    sizeMultiplier: 0.3,
    distanceMultiplier: 2.5
  },
  trueSize: {
    name: "True Size", 
    description: "Accurate relative sizes",
    sizeMultiplier: 2.5,
    distanceMultiplier: 0.8
  }
};

// Main component
export default function SolarSystemPage() {
  const containerRef = useRef(null);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeSpeed, setTimeSpeed] = useState(1);
  const [showOrbits, setShowOrbits] = useState(true);
  const [cameraMode, setCameraMode] = useState('free'); // 'free' or 'follow'
  const [showDwarfPlanets, setShowDwarfPlanets] = useState(true);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [comparePlanets, setComparePlanets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({ fps: 0, objects: 0 });
  const [scaleMode, setScaleMode] = useState('balanced');
  const [showMoons, setShowMoons] = useState(true);
  const [showComets, setShowComets] = useState(true);
  const [simulationDate, setSimulationDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const sceneRef = useRef(null);
  const timeSpeedRef = useRef(timeSpeed);
  const isPausedRef = useRef(isPaused);
  const fpsCounterRef = useRef({ frames: 0, lastTime: Date.now() });
  
  // Keep refs in sync with state
  useEffect(() => {
    timeSpeedRef.current = timeSpeed;
  }, [timeSpeed]);
  
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Update simulation date based on time speed
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setSimulationDate(prev => {
        const newDate = new Date(prev);
        // Each real second = timeSpeed days in simulation
        newDate.setDate(newDate.getDate() + timeSpeedRef.current);
        return newDate;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isPaused]);

  // Apply scale mode changes to planets
  useEffect(() => {
    if (sceneRef.current?.planets) {
      const mode = SCALE_MODES[scaleMode];
      sceneRef.current.planets.forEach(planet => {
        // Scale the planet mesh size
        const baseSize = planet.data.size * 0.6;
        const newScale = mode.sizeMultiplier;
        planet.mesh.scale.setScalar(newScale);
        
        // Adjust position based on distance multiplier
        const baseDistance = planet.baseDistance;
        const newDistance = baseDistance * mode.distanceMultiplier;
        const pos = getEllipticalPositionStatic(planet.angle, newDistance, planet.eccentricity);
        planet.mesh.position.x = pos.x;
        planet.mesh.position.z = pos.z;
      });
    }
  }, [scaleMode]);

  // Helper function for scale mode (static version for useEffect)
  function getEllipticalPositionStatic(angle, distance, eccentricity) {
    const a = distance;
    const r = (a * (1 - eccentricity * eccentricity)) / (1 + eccentricity * Math.cos(angle));
    return {
      x: Math.cos(angle) * r,
      z: Math.sin(angle) * r,
      r: r
    };
  }

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

      // Renderer optimized for 120fps
      renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: false,
        powerPreference: "high-performance"
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = false; // Disable shadows for better performance
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
      sun.add(sunLight);

      // Add more distant ambient glow
      const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000033, 0.3);
      scene.add(hemisphereLight);

      // Minimal starfield for cleaner look
      const starsGeometry = new THREE.BufferGeometry();
      const starsMaterial = new THREE.PointsMaterial({ 
        color: 0xffffff, 
        size: 0.8,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.6
      });
      const starsVertices = [];
      for (let i = 0; i < 500; i++) {
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
        createPlanetWithOrbit(planetData, scene, planets, orbitLines, THREE);
      });

      // Create dwarf planets if enabled
      DWARF_PLANETS_DATA.forEach((planetData) => {
        createPlanetWithOrbit(planetData, scene, planets, orbitLines, THREE);
      });

      // Helper function to create elliptical orbit path
      function createEllipticalOrbitPath(distance, eccentricity, segments = 256) {
        const points = [];
        const a = distance; // semi-major axis
        const c = a * eccentricity; // distance from center to focus
        const b = Math.sqrt(a * a - c * c); // semi-minor axis
        
        for (let i = 0; i <= segments; i++) {
          const theta = (i / segments) * Math.PI * 2;
          // Ellipse equation with sun at one focus
          const r = (a * (1 - eccentricity * eccentricity)) / (1 + eccentricity * Math.cos(theta));
          points.push(
            Math.cos(theta) * r,
            0,
            Math.sin(theta) * r
          );
        }
        return points;
      }

      // Helper function to calculate position on elliptical orbit
      function getEllipticalPosition(angle, distance, eccentricity) {
        const a = distance;
        const r = (a * (1 - eccentricity * eccentricity)) / (1 + eccentricity * Math.cos(angle));
        return {
          x: Math.cos(angle) * r,
          z: Math.sin(angle) * r,
          r: r
        };
      }

      // Helper function to create planets with elliptical orbits, axial tilts, and moons
      function createPlanetWithOrbit(planetData, scene, planets, orbitLines, THREE) {
        const eccentricity = planetData.eccentricity || 0;
        
        // Create elliptical orbit line
        const orbitGeometry = new THREE.BufferGeometry();
        const orbitPoints = createEllipticalOrbitPath(planetData.distance, eccentricity);
        orbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(orbitPoints, 3));
        const orbitMaterial = new THREE.LineBasicMaterial({ 
          color: planetData.isDwarf ? 0x666666 : 0x444444, 
          opacity: planetData.isDwarf ? 0.3 : 0.4, 
          transparent: true 
        });
        const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
        scene.add(orbitLine);
        orbitLines.push({ line: orbitLine, isDwarf: planetData.isDwarf || false });

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
        
        // Apply axial tilt - convert degrees to radians
        const axialTilt = (planetData.axialTilt || 0) * Math.PI / 180;
        planet.rotation.z = axialTilt;
        
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

        // Add Saturn's rings (tilted with planet)
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
        
        // Add Uranus rings (faint)
        if (planetData.name === 'Uranus') {
          const ringGeometry = new THREE.RingGeometry(
            planetData.size * 0.7,
            planetData.size * 1.0,
            64
          );
          const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0x4FD0E7,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.3
          });
          const ring = new THREE.Mesh(ringGeometry, ringMaterial);
          ring.rotation.x = Math.PI / 2;
          planet.add(ring);
        }

        // Create moons for planets that have them
        const moons = [];
        if (planetData.moons && planetData.moons.length > 0) {
          planetData.moons.forEach(moonData => {
            // Moon sphere
            const moonGeometry = new THREE.SphereGeometry(moonData.size * 0.3, 32, 32);
            const moonMaterial = new THREE.MeshStandardMaterial({
              color: moonData.color,
              emissive: moonData.color,
              emissiveIntensity: 0.05,
              roughness: 0.8,
              metalness: 0.1
            });
            const moon = new THREE.Mesh(moonGeometry, moonMaterial);
            
            // Moon orbit line around planet
            const moonOrbitGeometry = new THREE.BufferGeometry();
            const moonOrbitPoints = [];
            for (let i = 0; i <= 64; i++) {
              const theta = (i / 64) * Math.PI * 2;
              moonOrbitPoints.push(
                Math.cos(theta) * moonData.distance,
                0,
                Math.sin(theta) * moonData.distance
              );
            }
            moonOrbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(moonOrbitPoints, 3));
            const moonOrbitMaterial = new THREE.LineBasicMaterial({
              color: 0x333333,
              transparent: true,
              opacity: 0.2
            });
            const moonOrbitLine = new THREE.Line(moonOrbitGeometry, moonOrbitMaterial);
            planet.add(moonOrbitLine);
            
            // Position moon
            moon.position.x = moonData.distance;
            planet.add(moon);
            
            moons.push({
              mesh: moon,
              orbitLine: moonOrbitLine,
              data: moonData,
              angle: Math.random() * Math.PI * 2
            });
          });
        }
        
        // Group for planet orbit
        const planetGroup = new THREE.Group();
        
        // Set initial position on elliptical orbit
        const startAngle = Math.random() * Math.PI * 2;
        const startPos = getEllipticalPosition(startAngle, planetData.distance, eccentricity);
        planet.position.x = startPos.x;
        planet.position.z = startPos.z;
        
        planetGroup.add(planet);
        scene.add(planetGroup);

        // Store planet data
        planets.push({
          group: planetGroup,
          mesh: planet,
          data: planetData,
          geometry: planetGeometry,
          material: planetMaterial,
          moons: moons,
          angle: startAngle,
          eccentricity: eccentricity,
          baseDistance: planetData.distance,
          axialTilt: axialTilt
        });
      }

      // Create comets with procedural particle trails
      const comets = [];
      COMETS_DATA.forEach(cometData => {
        // Comet nucleus
        const cometGeometry = new THREE.SphereGeometry(cometData.size, 16, 16);
        const cometMaterial = new THREE.MeshBasicMaterial({
          color: cometData.color
        });
        const comet = new THREE.Mesh(cometGeometry, cometMaterial);
        
        // Comet tail using particles
        const tailParticleCount = 200;
        const tailGeometry = new THREE.BufferGeometry();
        const tailPositions = new Float32Array(tailParticleCount * 3);
        const tailColors = new Float32Array(tailParticleCount * 3);
        const tailSizes = new Float32Array(tailParticleCount);
        
        // Initialize tail particles
        for (let i = 0; i < tailParticleCount; i++) {
          tailPositions[i * 3] = 0;
          tailPositions[i * 3 + 1] = 0;
          tailPositions[i * 3 + 2] = 0;
          
          // Gradient color from white/blue to transparent
          const t = i / tailParticleCount;
          tailColors[i * 3] = 0.8 + 0.2 * (1 - t);     // R
          tailColors[i * 3 + 1] = 0.9 + 0.1 * (1 - t); // G
          tailColors[i * 3 + 2] = 1.0;                  // B
          
          tailSizes[i] = cometData.size * 2 * (1 - t * 0.8);
        }
        
        tailGeometry.setAttribute('position', new THREE.BufferAttribute(tailPositions, 3));
        tailGeometry.setAttribute('color', new THREE.BufferAttribute(tailColors, 3));
        tailGeometry.setAttribute('size', new THREE.BufferAttribute(tailSizes, 1));
        
        const tailMaterial = new THREE.PointsMaterial({
          size: 0.3,
          transparent: true,
          opacity: 0.6,
          vertexColors: true,
          blending: THREE.AdditiveBlending
        });
        
        const tail = new THREE.Points(tailGeometry, tailMaterial);
        
        // Comet group
        const cometGroup = new THREE.Group();
        cometGroup.add(comet);
        cometGroup.add(tail);
        scene.add(cometGroup);
        
        // Create elliptical orbit for comet
        const a = (cometData.perihelion + cometData.aphelion) / 2; // semi-major axis
        const c = (cometData.aphelion - cometData.perihelion) / 2; // distance to focus
        const e = c / a; // eccentricity
        
        const cometOrbitGeometry = new THREE.BufferGeometry();
        const cometOrbitPoints = createEllipticalOrbitPath(a, e, 128);
        
        // Apply inclination
        for (let i = 0; i < cometOrbitPoints.length; i += 3) {
          const y = cometOrbitPoints[i + 1];
          const z = cometOrbitPoints[i + 2];
          cometOrbitPoints[i + 1] = y * Math.cos(cometData.inclination) - z * Math.sin(cometData.inclination);
          cometOrbitPoints[i + 2] = y * Math.sin(cometData.inclination) + z * Math.cos(cometData.inclination);
        }
        
        cometOrbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(cometOrbitPoints, 3));
        const cometOrbitMaterial = new THREE.LineBasicMaterial({
          color: 0x224466,
          transparent: true,
          opacity: 0.2
        });
        const cometOrbitLine = new THREE.Line(cometOrbitGeometry, cometOrbitMaterial);
        scene.add(cometOrbitLine);
        
        comets.push({
          group: cometGroup,
          mesh: comet,
          tail: tail,
          tailGeometry: tailGeometry,
          orbitLine: cometOrbitLine,
          data: cometData,
          angle: Math.random() * Math.PI * 2,
          semiMajorAxis: a,
          eccentricity: e,
          tailPositions: [],
          prevPositions: []
        });
      });

      // Create asteroid belt between Mars and Jupiter
      const asteroidBeltGeometry = new THREE.BufferGeometry();
      const asteroidPositions = [];
      const asteroidBeltInnerRadius = 35; // Between Mars (22.8) and Jupiter (77.8)
      const asteroidBeltOuterRadius = 65;
      const asteroidCount = 1500;
      
      for (let i = 0; i < asteroidCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = asteroidBeltInnerRadius + Math.random() * (asteroidBeltOuterRadius - asteroidBeltInnerRadius);
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = (Math.random() - 0.5) * 2; // Small vertical spread
        asteroidPositions.push(x, y, z);
      }
      
      asteroidBeltGeometry.setAttribute('position', new THREE.Float32BufferAttribute(asteroidPositions, 3));
      const asteroidMaterial = new THREE.PointsMaterial({
        color: 0x999999,
        size: 0.3,
        transparent: true,
        opacity: 0.7
      });
      const asteroidBelt = new THREE.Points(asteroidBeltGeometry, asteroidMaterial);
      scene.add(asteroidBelt);

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

        // Update FPS counter
        fpsCounterRef.current.frames++;
        const now = Date.now();
        if (now - fpsCounterRef.current.lastTime >= 1000) {
          setStats(prev => ({ 
            ...prev, 
            fps: fpsCounterRef.current.frames,
            objects: scene.children.length 
          }));
          fpsCounterRef.current.frames = 0;
          fpsCounterRef.current.lastTime = now;
        }

        // Rotate sun
        if (sun) {
          sun.rotation.y += 0.001;
        }

        // Update planets with elliptical orbits and time speed
        if (!isPausedRef.current) {
          planets.forEach(planet => {
            // Calculate orbital velocity based on Kepler's second law
            // Faster near perihelion, slower near aphelion
            const r = getEllipticalPosition(planet.angle, planet.baseDistance, planet.eccentricity).r;
            const velocityFactor = (planet.baseDistance / r); // Kepler's equal area law
            
            // Update orbital angle
            planet.angle += planet.data.speed * 0.00005 * timeSpeedRef.current * velocityFactor;
            
            // Calculate new position on elliptical orbit
            const pos = getEllipticalPosition(planet.angle, planet.baseDistance, planet.eccentricity);
            planet.mesh.position.x = pos.x;
            planet.mesh.position.z = pos.z;
            
            // Planetary rotation on tilted axis
            planet.mesh.rotation.y += planet.data.rotationSpeed * timeSpeedRef.current;
            
            // Update moons
            if (planet.moons && planet.moons.length > 0) {
              planet.moons.forEach(moon => {
                moon.angle += moon.data.speed * 0.0005 * timeSpeedRef.current;
                moon.mesh.position.x = Math.cos(moon.angle) * moon.data.distance;
                moon.mesh.position.z = Math.sin(moon.angle) * moon.data.distance;
                moon.mesh.rotation.y += 0.01 * timeSpeedRef.current;
              });
            }
          });
          
          // Update comets with procedural tails
          comets.forEach(comet => {
            // Calculate comet velocity (faster near perihelion)
            const cometPos = getEllipticalPosition(comet.angle, comet.semiMajorAxis, comet.eccentricity);
            const velocityFactor = (comet.semiMajorAxis / cometPos.r);
            
            // Update orbital angle
            comet.angle += comet.data.speed * 0.00008 * timeSpeedRef.current * velocityFactor;
            
            // Apply inclination to position
            const x = cometPos.x;
            const y = cometPos.z * Math.sin(comet.data.inclination);
            const z = cometPos.z * Math.cos(comet.data.inclination);
            
            // Store previous position for tail
            comet.prevPositions.unshift({ x, y, z });
            if (comet.prevPositions.length > 200) {
              comet.prevPositions.pop();
            }
            
            // Update comet position
            comet.mesh.position.set(x, y, z);
            comet.group.position.set(0, 0, 0);
            
            // Update tail particles - trail behind comet, pointing away from sun
            const tailPositions = comet.tailGeometry.attributes.position.array;
            // Sun direction: normalized vector pointing FROM sun TO comet (tail points away from sun)
            const sunDir = new THREE.Vector3(x, y, z).normalize();
            const tailLength = comet.data.tailLength * (1 / Math.max(0.5, cometPos.r / 50)); // Longer tail when closer to sun
            
            for (let i = 0; i < 200; i++) {
              const t = i / 200;
              // Use deterministic spread based on particle index instead of random
              const spreadX = Math.sin(i * 0.5) * t * 0.3;
              const spreadY = Math.cos(i * 0.7) * t * 0.15;
              const spreadZ = Math.sin(i * 0.3 + 1.5) * t * 0.3;
              
              // Tail follows orbital path but also points away from sun
              if (comet.prevPositions[i]) {
                tailPositions[i * 3] = comet.prevPositions[i].x + sunDir.x * t * tailLength + spreadX;
                tailPositions[i * 3 + 1] = comet.prevPositions[i].y + sunDir.y * t * tailLength * 0.3 + spreadY;
                tailPositions[i * 3 + 2] = comet.prevPositions[i].z + sunDir.z * t * tailLength + spreadZ;
              } else {
                tailPositions[i * 3] = x + sunDir.x * t * tailLength;
                tailPositions[i * 3 + 1] = y + sunDir.y * t * tailLength * 0.3;
                tailPositions[i * 3 + 2] = z + sunDir.z * t * tailLength;
              }
            }
            comet.tailGeometry.attributes.position.needsUpdate = true;
          });
        }

        // Camera follow mode with smoother transitions
        if (cameraMode === 'follow' && selectedPlanet) {
          const planet = planets.find(p => p.data.name === selectedPlanet.name);
          if (planet) {
            const planetWorldPos = new THREE.Vector3();
            planet.mesh.getWorldPosition(planetWorldPos);
            const offset = new THREE.Vector3(0, 10, 20);
            const targetPos = planetWorldPos.clone().add(offset);
            camera.position.lerp(targetPos, 0.02); // Smoother transition
            
            // Smooth camera rotation
            const targetLookAt = planetWorldPos.clone();
            const currentLookAt = new THREE.Vector3();
            controls.target.lerp(targetLookAt, 0.02);
            camera.lookAt(controls.target);
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
        comets,
        THREE,
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
          
          comets.forEach(comet => {
            if (comet.tailGeometry) comet.tailGeometry.dispose();
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
  }, [cameraMode, selectedPlanet]);

  // Update orbit visibility
  useEffect(() => {
    if (sceneRef.current?.orbitLines) {
      sceneRef.current.orbitLines.forEach(orbitItem => {
        if (typeof orbitItem === 'object' && orbitItem.line) {
          // Handle dwarf planet visibility
          if (orbitItem.isDwarf) {
            orbitItem.line.visible = showOrbits && showDwarfPlanets;
          } else {
            orbitItem.line.visible = showOrbits;
          }
        } else {
          // Legacy support for old orbit line format
          orbitItem.visible = showOrbits;
        }
      });
    }
  }, [showOrbits, showDwarfPlanets]);

  // Update dwarf planet visibility
  useEffect(() => {
    if (sceneRef.current?.planets) {
      sceneRef.current.planets.forEach(planet => {
        if (planet.data.isDwarf) {
          planet.group.visible = showDwarfPlanets;
        }
      });
    }
  }, [showDwarfPlanets]);

  // Update moon visibility
  useEffect(() => {
    if (sceneRef.current?.planets) {
      sceneRef.current.planets.forEach(planet => {
        if (planet.moons && planet.moons.length > 0) {
          planet.moons.forEach(moon => {
            moon.mesh.visible = showMoons;
            moon.orbitLine.visible = showMoons && showOrbits;
          });
        }
      });
    }
  }, [showMoons, showOrbits]);

  // Update comet visibility
  useEffect(() => {
    if (sceneRef.current?.comets) {
      sceneRef.current.comets.forEach(comet => {
        comet.group.visible = showComets;
        comet.orbitLine.visible = showComets && showOrbits;
      });
    }
  }, [showComets, showOrbits]);

  // Keyboard controls for camera movement (WASD and Arrow keys)
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Show keyboard help with '?'
      if (event.key === '?' && !showKeyboardHelp) {
        setShowKeyboardHelp(true);
        return;
      }

      // ESC to close help or info
      if (event.key === 'Escape') {
        if (showKeyboardHelp) {
          setShowKeyboardHelp(false);
        } else if (showInfo) {
          setShowInfo(false);
        }
        return;
      }

      // Space to toggle pause
      if (event.key === ' ' && !event.target.closest('input, textarea')) {
        event.preventDefault();
        setIsPaused(prev => !prev);
        return;
      }

      // 'O' to toggle orbits
      if (event.key.toLowerCase() === 'o') {
        setShowOrbits(prev => !prev);
        return;
      }

      // 'S' to toggle stats (if not using for movement)
      if (event.key.toLowerCase() === 's' && event.ctrlKey) {
        event.preventDefault();
        setShowStats(prev => !prev);
        return;
      }

      if (!sceneRef.current?.camera || !sceneRef.current?.controls || !sceneRef.current?.THREE) return;
      
      const { camera, controls, THREE } = sceneRef.current;
      const moveSpeed = 5;
      
      // Get camera direction vectors
      const forward = new THREE.Vector3();
      const right = new THREE.Vector3();
      
      camera.getWorldDirection(forward);
      forward.y = 0; // Keep movement on horizontal plane
      forward.normalize();
      
      right.crossVectors(camera.up, forward).normalize();
      
      let moved = false;
      
      switch(event.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          camera.position.addScaledVector(forward, moveSpeed);
          controls.target.addScaledVector(forward, moveSpeed);
          moved = true;
          break;
        case 's':
        case 'arrowdown':
          camera.position.addScaledVector(forward, -moveSpeed);
          controls.target.addScaledVector(forward, -moveSpeed);
          moved = true;
          break;
        case 'a':
        case 'arrowleft':
          camera.position.addScaledVector(right, -moveSpeed);
          controls.target.addScaledVector(right, -moveSpeed);
          moved = true;
          break;
        case 'd':
        case 'arrowright':
          camera.position.addScaledVector(right, moveSpeed);
          controls.target.addScaledVector(right, moveSpeed);
          moved = true;
          break;
      }
      
      if (moved) {
        controls.update();
        // Switch to free camera mode when using keyboard
        setCameraMode('free');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showKeyboardHelp, showInfo]);

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

  const toggleCompare = useCallback((planetData) => {
    setComparePlanets(prev => {
      const exists = prev.find(p => p.name === planetData.name);
      if (exists) {
        return prev.filter(p => p.name !== planetData.name);
      } else if (prev.length < 3) {
        return [...prev, planetData];
      }
      return prev;
    });
  }, []);

  const takeScreenshot = useCallback(() => {
    if (sceneRef.current?.renderer && sceneRef.current?.scene && sceneRef.current?.camera) {
      const { renderer, scene, camera } = sceneRef.current;
      renderer.render(scene, camera);
      const dataURL = renderer.domElement.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `solar-system-${Date.now()}.png`;
      link.href = dataURL;
      link.click();
    }
  }, []);

  const allCelestialBodies = [...PLANETS_DATA, ...DWARF_PLANETS_DATA];
  const filteredBodies = allCelestialBodies.filter(body => 
    body.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="game-container">
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

      <main className="game-content">
        <div className="stage">
          <div 
            ref={containerRef} 
            className="canvas-wrapper"
          />

          {/* Date/Timeline Display */}
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

          {/* Scale Mode Toggle */}
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
              <div>⌨️ WASD/Arrows - Move camera</div>
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
            maxHeight: "calc(100vh - 200px)",
            overflowY: "auto",
            zIndex: 10,
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)"
          }}>
            <div style={{ fontWeight: "bold", marginBottom: "12px", fontSize: "16px" }}>
              🪐 Celestial Bodies
            </div>
            
            {/* Search input */}
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

          {/* Stats panel */}
          {showStats && (
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
                <div>Planets: <strong>{PLANETS_DATA.length}</strong></div>
                <div>Moons: <strong>{PLANETS_DATA.reduce((acc, p) => acc + (p.moons?.length || 0), 0)}</strong></div>
                <div>Comets: <strong>{COMETS_DATA.length}</strong></div>
                <div>Dwarfs: <strong>{DWARF_PLANETS_DATA.length}</strong></div>
                <div>Time: <strong>{timeSpeed}x</strong></div>
                <div>Scale: <strong>{SCALE_MODES[scaleMode].name}</strong></div>
              </div>
            </div>
          )}

          {/* Planet comparison panel */}
          {comparePlanets.length > 0 && (
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
          )}

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
          )}

          {/* Keyboard shortcuts help overlay */}
          {showKeyboardHelp && (
            <div className="help-overlay" onClick={() => setShowKeyboardHelp(false)}>
              <div 
                className="help-card" 
                onClick={(e) => e.stopPropagation()}
                style={{
                  maxWidth: "600px",
                  background: "rgba(15, 15, 25, 0.95)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h3 style={{ margin: 0, fontSize: "24px" }}>⌨️ Keyboard Shortcuts</h3>
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
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  fontSize: "14px"
                }}>
                  <div>
                    <h4 style={{ fontSize: "16px", marginBottom: "10px", color: "#4A90E2" }}>Camera Controls</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div><kbd>W</kbd> / <kbd>↑</kbd> - Move forward</div>
                      <div><kbd>S</kbd> / <kbd>↓</kbd> - Move backward</div>
                      <div><kbd>A</kbd> / <kbd>←</kbd> - Move left</div>
                      <div><kbd>D</kbd> / <kbd>→</kbd> - Move right</div>
                      <div><kbd>Mouse drag</kbd> - Rotate view</div>
                      <div><kbd>Scroll</kbd> - Zoom in/out</div>
                    </div>
                  </div>

                  <div>
                    <h4 style={{ fontSize: "16px", marginBottom: "10px", color: "#4A90E2" }}>Controls</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div><kbd>Space</kbd> - Pause/Play</div>
                      <div><kbd>O</kbd> - Toggle orbits</div>
                      <div><kbd>Ctrl</kbd>+<kbd>S</kbd> - Toggle stats</div>
                      <div><kbd>?</kbd> - Show this help</div>
                      <div><kbd>ESC</kbd> - Close panels</div>
                      <div><kbd>Click planet</kbd> - View info</div>
                    </div>
                  </div>
                </div>

                <div style={{ 
                  marginTop: "20px", 
                  paddingTop: "16px", 
                  borderTop: "1px solid rgba(255,255,255,0.15)",
                  fontSize: "13px",
                  opacity: 0.8
                }}>
                  <h4 style={{ fontSize: "14px", marginBottom: "8px" }}>💡 Tips</h4>
                  <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "1.8" }}>
                    <li>Use the planet list to quickly focus on any celestial body</li>
                    <li>Click the compare button (⚖️) to compare up to 3 planets</li>
                    <li>Adjust time speed to see orbital motion more clearly</li>
                    <li>Toggle dwarf planets to see Pluto and Ceres</li>
                    <li>Take screenshots to save your favorite views</li>
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
          )}
        </div>
      </main>
    </div>
  );
}
