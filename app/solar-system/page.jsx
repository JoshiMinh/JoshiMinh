"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import "./styles.css";

// Import data from separate module
import { 
  PLANETS_DATA, 
  DWARF_PLANETS_DATA, 
  COMETS_DATA, 
  SCALE_MODES, 
  TEXTURE_CONFIG,
  PHYSICS_CONFIG
} from './data';

// Import utility functions
import { colorToHex, getEllipticalPosition, createEllipticalOrbitPath, CollisionSystem } from './utils';

// Import UI components
import { 
  ControlsPanel, 
  ScaleModePanel, 
  DateDisplay, 
  StatsPanel,
  CelestialBodiesPanel,
  ComparePanel,
  PlanetInfoModal,
  KeyboardHelpModal,
  TopBar,
  PhysicsPanel,
  ObjectCreatorPanel,
  ObjectEditorPanel
} from './components';

// Import custom hooks
import { useKeyboardControls } from './hooks';

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
  // Physics state
  const [simulationMode, setSimulationMode] = useState('kepler'); // 'kepler' or 'nbody'
  const [gravityMultiplier, setGravityMultiplier] = useState(1.0);
  // Object creation state
  const [showObjectCreator, setShowObjectCreator] = useState(false);
  const [showObjectEditor, setShowObjectEditor] = useState(false);
  const [customObjects, setCustomObjects] = useState([]);
  const [objectToCreate, setObjectToCreate] = useState(null);
  const [creationMode, setCreationMode] = useState('click'); // 'click' or 'drag'
  const [dragStartPos, setDragStartPos] = useState(null);
  const [dragCurrentPos, setDragCurrentPos] = useState(null);
  const sceneRef = useRef(null);
  const timeSpeedRef = useRef(timeSpeed);
  const isPausedRef = useRef(isPaused);
  const simulationModeRef = useRef(simulationMode);
  const gravityMultiplierRef = useRef(gravityMultiplier);
  const fpsCounterRef = useRef({ frames: 0, lastTime: Date.now() });
  
  // Keep refs in sync with state
  useEffect(() => {
    timeSpeedRef.current = timeSpeed;
  }, [timeSpeed]);
  
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    simulationModeRef.current = simulationMode;
  }, [simulationMode]);

  useEffect(() => {
    gravityMultiplierRef.current = gravityMultiplier;
  }, [gravityMultiplier]);

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

      // Texture loader for loading planet textures
      const textureLoader = new THREE.TextureLoader();
      
      // Helper function to load texture or return null
      const loadTexture = (path) => {
        if (!TEXTURE_CONFIG.enabled) return null;
        try {
          return textureLoader.load(
            TEXTURE_CONFIG.basePath + path,
            undefined,
            undefined,
            (error) => console.warn(`Could not load texture: ${path}`, error.message || error)
          );
        } catch (e) {
          console.warn(`Error loading texture: ${path}`, e.message || e);
          return null;
        }
      };

      // Lighting - ambient light for overall visibility
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
      scene.add(ambientLight);

      // Initialize collision detection system
      const collisionSystem = new CollisionSystem(scene, THREE);

      // Create an enhanced Sun with proper material (supports texture)
      const sunGeometry = new THREE.SphereGeometry(3, 64, 64);
      const sunTexture = loadTexture(TEXTURE_CONFIG.sun);
      const sunMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xFDB813,
        map: sunTexture
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

      // Helper function to create custom planet at a specific position
      function createCustomPlanetAtPosition(planetData, x, z, scene, planets, orbitLines, THREE) {
        // Calculate distance from sun
        const distance = Math.sqrt(x * x + z * z);
        planetData.distance = distance;
        
        // Create the planet geometry
        const planetGeometry = new THREE.SphereGeometry(planetData.size * 0.6, 64, 64);
        const planetMaterial = new THREE.MeshStandardMaterial({ 
          color: planetData.color,
          emissive: planetData.type === 'star' ? planetData.color : 0x000000,
          emissiveIntensity: planetData.type === 'star' ? 0.5 : 0.1,
          roughness: 0.7,
          metalness: 0.2
        });
        const planet = new THREE.Mesh(planetGeometry, planetMaterial);
        
        // Add glow for stars
        if (planetData.type === 'star') {
          const glowGeometry = new THREE.SphereGeometry(planetData.size * 0.7, 32, 32);
          const glowMaterial = new THREE.MeshBasicMaterial({
            color: planetData.color,
            transparent: true,
            opacity: 0.3
          });
          const glow = new THREE.Mesh(glowGeometry, glowMaterial);
          planet.add(glow);
          
          // Add light for stars
          const starLight = new THREE.PointLight(planetData.color, 1, 200);
          planet.add(starLight);
        }
        
        // Create planet group
        const planetGroup = new THREE.Group();
        planet.position.set(x, 0, z);
        planetGroup.add(planet);
        scene.add(planetGroup);
        
        // Calculate orbital parameters based on current position
        const angle = Math.atan2(z, x);
        const eccentricity = 0;
        
        // Create orbit line (circular for custom objects)
        if (distance > 1) {
          const orbitGeometry = new THREE.BufferGeometry();
          const orbitPoints = createEllipticalOrbitPath(distance, 0);
          orbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(orbitPoints, 3));
          const orbitMaterial = new THREE.LineBasicMaterial({ 
            color: planetData.color, 
            opacity: 0.3, 
            transparent: true 
          });
          const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
          scene.add(orbitLine);
          orbitLines.push({ line: orbitLine, isCustom: true });
        }
        
        // Store planet data with velocity for n-body simulation
        planets.push({
          group: planetGroup,
          mesh: planet,
          data: planetData,
          geometry: planetGeometry,
          material: planetMaterial,
          moons: [],
          angle: angle,
          eccentricity: eccentricity,
          baseDistance: distance,
          axialTilt: 0,
          // Initialize velocity (perpendicular to position for circular orbit)
          vx: -z * planetData.speed * PHYSICS_CONFIG.INITIAL_VELOCITY_SCALE * 0.01,
          vy: 0,
          vz: x * planetData.speed * PHYSICS_CONFIG.INITIAL_VELOCITY_SCALE * 0.01,
          ax: 0,
          ay: 0,
          az: 0
        });
      }

      // Helper function to create custom planet with initial velocity
      function createCustomPlanetWithVelocity(planetData, x, z, vx, vz, scene, planets, orbitLines, THREE) {
        // Calculate distance from sun
        const distance = Math.sqrt(x * x + z * z);
        planetData.distance = distance;
        
        // Create the planet geometry
        const planetGeometry = new THREE.SphereGeometry(planetData.size * 0.6, 64, 64);
        const planetMaterial = new THREE.MeshStandardMaterial({ 
          color: planetData.color,
          emissive: planetData.type === 'star' ? planetData.color : 0x000000,
          emissiveIntensity: planetData.type === 'star' ? 0.5 : 0.1,
          roughness: 0.7,
          metalness: 0.2
        });
        const planet = new THREE.Mesh(planetGeometry, planetMaterial);
        
        // Add glow for stars
        if (planetData.type === 'star') {
          const glowGeometry = new THREE.SphereGeometry(planetData.size * 0.7, 32, 32);
          const glowMaterial = new THREE.MeshBasicMaterial({
            color: planetData.color,
            transparent: true,
            opacity: 0.3
          });
          const glow = new THREE.Mesh(glowGeometry, glowMaterial);
          planet.add(glow);
          
          // Add light for stars
          const starLight = new THREE.PointLight(planetData.color, 1, 200);
          planet.add(starLight);
        }
        
        // Create planet group
        const planetGroup = new THREE.Group();
        planet.position.set(x, 0, z);
        planetGroup.add(planet);
        scene.add(planetGroup);
        
        // Calculate orbital parameters based on current position
        const angle = Math.atan2(z, x);
        const eccentricity = 0;
        
        // Don't create orbit line for launched objects (they have custom velocities)
        
        // Store planet data with custom velocity for n-body simulation
        planets.push({
          group: planetGroup,
          mesh: planet,
          data: planetData,
          geometry: planetGeometry,
          material: planetMaterial,
          moons: [],
          angle: angle,
          eccentricity: eccentricity,
          baseDistance: distance,
          axialTilt: 0,
          // Use custom velocity
          vx: vx,
          vy: 0,
          vz: vz,
          ax: 0,
          ay: 0,
          az: 0
        });
      }

      // Helper function to create planets with elliptical orbits, axial tilts, moons, and texture support
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

        // Load planet texture if available
        const planetTexturePath = TEXTURE_CONFIG.planets[planetData.name];
        const planetTexture = planetTexturePath ? loadTexture(planetTexturePath) : null;

        // Planet with enhanced material (supports texture)
        const planetGeometry = new THREE.SphereGeometry(planetData.size * 0.6, 64, 64);
        const planetMaterial = new THREE.MeshStandardMaterial({ 
          color: planetTexture ? 0xffffff : planetData.color,
          map: planetTexture ,
          emissive: planetTexture ? 0x000000 : planetData.color,
          emissiveIntensity: planetTexture ? 0 : 0.1,
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

        // Add Saturn's rings (with texture support)
        if (planetData.name === 'Saturn') {
          const ringGeometry = new THREE.RingGeometry(
            planetData.size * 0.8,
            planetData.size * 1.4,
            64
          );
          const ringTexturePath = TEXTURE_CONFIG.rings.Saturn;
          const ringTexture = ringTexturePath ? loadTexture(ringTexturePath) : null;
          const ringMaterial = new THREE.MeshBasicMaterial({
            color: ringTexture ? 0xffffff : 0xC9B58B,
            map: ringTexture ,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.7
          });
          const ring = new THREE.Mesh(ringGeometry, ringMaterial);
          ring.rotation.x = Math.PI / 2;
          planet.add(ring);
        }
        
        // Add Uranus rings (with texture support)
        if (planetData.name === 'Uranus') {
          const ringGeometry = new THREE.RingGeometry(
            planetData.size * 0.7,
            planetData.size * 1.0,
            64
          );
          const ringTexturePath = TEXTURE_CONFIG.rings.Uranus;
          const ringTexture = ringTexturePath ? loadTexture(ringTexturePath) : null;
          const ringMaterial = new THREE.MeshBasicMaterial({
            color: ringTexture ? 0xffffff : 0x4FD0E7,
            map: ringTexture ,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.3
          });
          const ring = new THREE.Mesh(ringGeometry, ringMaterial);
          ring.rotation.x = Math.PI / 2;
          planet.add(ring);
        }

        // Create moons for planets that have them (with texture support)
        const moons = [];
        if (planetData.moons && planetData.moons.length > 0) {
          planetData.moons.forEach(moonData => {
            // Load moon texture if available
            const moonTexturePath = TEXTURE_CONFIG.moons[moonData.name];
            const moonTexture = moonTexturePath ? loadTexture(moonTexturePath) : null;
            
            // Moon sphere
            const moonGeometry = new THREE.SphereGeometry(moonData.size * 0.3, 32, 32);
            const moonMaterial = new THREE.MeshStandardMaterial({
              color: moonTexture ? 0xffffff : moonData.color,
              map: moonTexture ,
              emissive: moonTexture ? 0x000000 : moonData.color,
              emissiveIntensity: moonTexture ? 0 : 0.05,
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

      // Helper to get clicked planet
      const getClickedPlanet = (event) => {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(
          planets.map(p => p.mesh)
        );

        if (intersects.length > 0) {
          return planets.find(p => p.mesh === intersects[0].object);
        }
        return null;
      };

      // Single click - show info panel or place object
      const onMouseClick = (event) => {
        // Check if we're in object creation mode
        if (objectToCreate) {
          // Get intersection with a plane at y=0
          const raycaster = new THREE.Raycaster();
          const mouse = new THREE.Vector2();
          mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
          mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
          
          raycaster.setFromCamera(mouse, camera);
          
          // Create a large plane for intersection
          const planeGeometry = new THREE.PlaneGeometry(10000, 10000);
          planeGeometry.rotateX(-Math.PI / 2);
          const plane = new THREE.Mesh(planeGeometry);
          
          const intersects = raycaster.intersectObject(plane);
          
          if (intersects.length > 0) {
            const point = intersects[0].point;
            
            // Create the new object at this position
            createCustomPlanetAtPosition(objectToCreate, point.x, point.z, scene, planets, orbitLines, THREE);
            
            setObjectToCreate(null);
          }
          return;
        }
        
        const clickedPlanet = getClickedPlanet(event);
        if (clickedPlanet) {
          setSelectedPlanet(clickedPlanet.data);
          setShowInfo(true);
          // If it's a custom object, allow editing
          if (clickedPlanet.data.isCustom) {
            setShowObjectEditor(true);
          }
        }
      };

      // Double click - instant focus/follow on planet
      const onMouseDblClick = (event) => {
        const clickedPlanet = getClickedPlanet(event);
        if (clickedPlanet) {
          setSelectedPlanet(clickedPlanet.data);
          setCameraMode('follow');
          
          // Instantly move camera near the planet
          const planetWorldPos = new THREE.Vector3();
          clickedPlanet.mesh.getWorldPosition(planetWorldPos);
          const distance = Math.max(clickedPlanet.data.size * 10, 15);
          camera.position.set(
            planetWorldPos.x + distance,
            planetWorldPos.y + distance * 0.5,
            planetWorldPos.z + distance
          );
          controls.target.copy(planetWorldPos);
          controls.update();
        }
      };

      renderer.domElement.addEventListener('click', onMouseClick);
      renderer.domElement.addEventListener('dblclick', onMouseDblClick);

      // Drag-and-launch functionality
      let dragStartPoint = null;
      let dragPreviewLine = null;
      let dragArrow = null;
      let isDragging = false;

      const onMouseDown = (event) => {
        if (objectToCreate && creationMode === 'drag') {
          // Start dragging for launch
          const raycaster = new THREE.Raycaster();
          const mouse = new THREE.Vector2();
          mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
          mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
          
          raycaster.setFromCamera(mouse, camera);
          
          // Create a large plane for intersection
          const planeGeometry = new THREE.PlaneGeometry(10000, 10000);
          planeGeometry.rotateX(-Math.PI / 2);
          const plane = new THREE.Mesh(planeGeometry);
          
          const intersects = raycaster.intersectObject(plane);
          
          if (intersects.length > 0) {
            dragStartPoint = intersects[0].point.clone();
            isDragging = true;
            
            // Create trajectory preview line
            const lineGeometry = new THREE.BufferGeometry();
            const lineMaterial = new THREE.LineBasicMaterial({ 
              color: objectToCreate.color,
              linewidth: 2 
            });
            dragPreviewLine = new THREE.Line(lineGeometry, lineMaterial);
            scene.add(dragPreviewLine);
            
            // Create velocity arrow
            dragArrow = new THREE.ArrowHelper(
              new THREE.Vector3(0, 1, 0),
              dragStartPoint,
              10,
              objectToCreate.color,
              2,
              1
            );
            scene.add(dragArrow);
          }
        }
      };

      const onMouseMove = (event) => {
        if (isDragging && dragStartPoint && objectToCreate && creationMode === 'drag') {
          const raycaster = new THREE.Raycaster();
          const mouse = new THREE.Vector2();
          mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
          mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
          
          raycaster.setFromCamera(mouse, camera);
          
          const planeGeometry = new THREE.PlaneGeometry(10000, 10000);
          planeGeometry.rotateX(-Math.PI / 2);
          const plane = new THREE.Mesh(planeGeometry);
          
          const intersects = raycaster.intersectObject(plane);
          
          if (intersects.length > 0) {
            const currentPoint = intersects[0].point;
            const dragVector = new THREE.Vector3().subVectors(dragStartPoint, currentPoint);
            
            // Update preview line
            if (dragPreviewLine) {
              const points = [dragStartPoint, currentPoint];
              dragPreviewLine.geometry.setFromPoints(points);
            }
            
            // Update arrow to show velocity direction and magnitude
            if (dragArrow) {
              const direction = dragVector.clone().normalize();
              const length = Math.min(dragVector.length() * 0.5, 50);
              dragArrow.setDirection(direction);
              dragArrow.setLength(length, length * 0.2, length * 0.15);
            }
          }
        }
      };

      const onMouseUp = (event) => {
        if (isDragging && dragStartPoint && objectToCreate && creationMode === 'drag') {
          const raycaster = new THREE.Raycaster();
          const mouse = new THREE.Vector2();
          mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
          mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
          
          raycaster.setFromCamera(mouse, camera);
          
          const planeGeometry = new THREE.PlaneGeometry(10000, 10000);
          planeGeometry.rotateX(-Math.PI / 2);
          const plane = new THREE.Mesh(planeGeometry);
          
          const intersects = raycaster.intersectObject(plane);
          
          if (intersects.length > 0) {
            const endPoint = intersects[0].point;
            const velocityVector = new THREE.Vector3().subVectors(dragStartPoint, endPoint);
            
            // Create object with initial velocity
            createCustomPlanetWithVelocity(
              objectToCreate, 
              dragStartPoint.x, 
              dragStartPoint.z,
              velocityVector.x * 0.1,
              velocityVector.z * 0.1,
              scene, 
              planets, 
              orbitLines, 
              THREE
            );
            
            setObjectToCreate(null);
          }
          
          // Clean up preview
          if (dragPreviewLine) {
            scene.remove(dragPreviewLine);
            dragPreviewLine = null;
          }
          if (dragArrow) {
            scene.remove(dragArrow);
            dragArrow = null;
          }
          
          isDragging = false;
          dragStartPoint = null;
        }
      };

      renderer.domElement.addEventListener('mousedown', onMouseDown);
      renderer.domElement.addEventListener('mousemove', onMouseMove);
      renderer.domElement.addEventListener('mouseup', onMouseUp);

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

        // Update planets based on simulation mode
        if (!isPausedRef.current) {
          const G = PHYSICS_CONFIG.G_SCALED * gravityMultiplierRef.current;
          const sunMass = PHYSICS_CONFIG.SUN_MASS;
          const dt = 0.016 * timeSpeedRef.current; // Time step

          if (simulationModeRef.current === 'nbody') {
            // N-Body simulation: Calculate gravitational forces between all bodies
            
            // Reset accelerations
            planets.forEach(planet => {
              planet.ax = 0;
              planet.ay = 0;
              planet.az = 0;
            });

            // Calculate gravitational acceleration from the Sun for each planet
            planets.forEach(planet => {
              const px = planet.mesh.position.x;
              const py = planet.mesh.position.y;
              const pz = planet.mesh.position.z;
              
              // Distance to Sun (at origin)
              const r = Math.sqrt(px * px + py * py + pz * pz);
              if (r > 0.1) {
                // Gravitational acceleration from Sun: a = G * M / r^2 (direction toward Sun)
                const aTotal = G * sunMass / (r * r);
                planet.ax -= (px / r) * aTotal;
                planet.ay -= (py / r) * aTotal;
                planet.az -= (pz / r) * aTotal;
              }

              // Calculate gravitational effects from other planets
              planets.forEach(other => {
                if (other !== planet) {
                  const dx = other.mesh.position.x - px;
                  const dy = other.mesh.position.y - py;
                  const dz = other.mesh.position.z - pz;
                  const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                  
                  if (dist > 0.5) {
                    const otherMass = other.data.mass || 1;
                    // Apply planet-to-planet gravity scaling from config
                    const aTotal = G * otherMass / (dist * dist) * PHYSICS_CONFIG.PLANET_GRAVITY_SCALE;
                    planet.ax += (dx / dist) * aTotal;
                    planet.ay += (dy / dist) * aTotal;
                    planet.az += (dz / dist) * aTotal;
                  }
                }
              });
            });

            // Update velocities and positions using Velocity Verlet integration
            planets.forEach(planet => {
              // Initialize velocity if not set
              if (planet.vx === undefined) {
                // Calculate initial orbital velocity (perpendicular to radius)
                const r = Math.sqrt(
                  planet.mesh.position.x ** 2 + 
                  planet.mesh.position.y ** 2 + 
                  planet.mesh.position.z ** 2
                );
                // Apply initial velocity scaling from config for stable orbits
                const orbitalSpeed = Math.sqrt(G * sunMass / r) * PHYSICS_CONFIG.INITIAL_VELOCITY_SCALE;
                // Velocity perpendicular to position vector (in XZ plane)
                planet.vx = -planet.mesh.position.z / r * orbitalSpeed;
                planet.vy = 0;
                planet.vz = planet.mesh.position.x / r * orbitalSpeed;
              }

              // Update velocity
              planet.vx += planet.ax * dt;
              planet.vy += planet.ay * dt;
              planet.vz += planet.az * dt;

              // Update position
              planet.mesh.position.x += planet.vx * dt;
              planet.mesh.position.y += planet.vy * dt;
              planet.mesh.position.z += planet.vz * dt;

              // Planetary rotation
              planet.mesh.rotation.y += planet.data.rotationSpeed * timeSpeedRef.current;

              // Update moons (simple circular orbits relative to planet)
              if (planet.moons && planet.moons.length > 0) {
                planet.moons.forEach(moon => {
                  moon.angle += moon.data.speed * 0.0005 * timeSpeedRef.current * gravityMultiplierRef.current;
                  moon.mesh.position.x = Math.cos(moon.angle) * moon.data.distance;
                  moon.mesh.position.z = Math.sin(moon.angle) * moon.data.distance;
                  moon.mesh.rotation.y += 0.01 * timeSpeedRef.current;
                });
              }
            });
          } else {
            // Kepler mode: Fixed elliptical orbits
            planets.forEach(planet => {
              // Calculate orbital velocity based on Kepler's second law
              // Faster near perihelion, slower near aphelion
              const r = getEllipticalPosition(planet.angle, planet.baseDistance, planet.eccentricity).r;
              const velocityFactor = (planet.baseDistance / r) * gravityMultiplierRef.current;
              
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
                  moon.angle += moon.data.speed * 0.0005 * timeSpeedRef.current * gravityMultiplierRef.current;
                  moon.mesh.position.x = Math.cos(moon.angle) * moon.data.distance;
                  moon.mesh.position.z = Math.sin(moon.angle) * moon.data.distance;
                  moon.mesh.rotation.y += 0.01 * timeSpeedRef.current;
                });
              }
            });
          }
          
          // Update comets with procedural tails (always use Kepler for comets)
          comets.forEach(comet => {
            // Calculate comet velocity (faster near perihelion)
            const cometPos = getEllipticalPosition(comet.angle, comet.semiMajorAxis, comet.eccentricity);
            const velocityFactor = (comet.semiMajorAxis / cometPos.r) * gravityMultiplierRef.current;
            
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

        // Collision detection (only in N-Body mode for realistic physics)
        if (simulationModeRef.current === 'nbody') {
          const collisions = collisionSystem.checkCollisions(planets, PHYSICS_CONFIG);
          
          // Process collisions (handle in reverse order to maintain array indices)
          const indicesToRemove = [];
          collisions.forEach(collision => {
            const indexToRemove = collisionSystem.handleCollision(collision, planets, orbitLines);
            if (indexToRemove !== null && indexToRemove !== undefined) {
              indicesToRemove.push(indexToRemove);
            }
          });
          
          // Remove absorbed planets from array (sort in descending order to maintain indices)
          indicesToRemove.sort((a, b) => b - a).forEach(index => {
            planets.splice(index, 1);
          });
        }
        
        // Update collision effects
        collisionSystem.updateEffects(delta);

        // Camera follow mode - track planet while allowing free camera control
        if (cameraMode === 'follow' && selectedPlanet) {
          const planet = planets.find(p => p.data.name === selectedPlanet.name);
          if (planet) {
            const planetWorldPos = new THREE.Vector3();
            planet.mesh.getWorldPosition(planetWorldPos);
            
            // Calculate the offset between current camera and current target
            const cameraOffset = camera.position.clone().sub(controls.target);
            
            // Smoothly move the controls target to the planet position
            controls.target.lerp(planetWorldPos, 0.05);
            
            // Move camera by the same amount to maintain relative position
            // This allows free orbiting around the planet
            camera.position.copy(controls.target).add(cameraOffset);
          }
        }
        
        // Always update controls to allow free camera movement
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
          renderer.domElement.removeEventListener('dblclick', onMouseDblClick);
          renderer.domElement.removeEventListener('mousedown', onMouseDown);
          renderer.domElement.removeEventListener('mousemove', onMouseMove);
          renderer.domElement.removeEventListener('mouseup', onMouseUp);
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
          
          // Clean up collision system
          collisionSystem.cleanup();
          
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

  // Enhanced keyboard controls for camera movement
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Show keyboard help with '?'
      if (event.key === '?' && !showKeyboardHelp) {
        setShowKeyboardHelp(true);
        return;
      }

      // ESC to close help or info, or exit follow mode
      if (event.key === 'Escape') {
        if (showKeyboardHelp) {
          setShowKeyboardHelp(false);
        } else if (showInfo) {
          setShowInfo(false);
        } else if (cameraMode === 'follow') {
          setCameraMode('free');
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
      if (event.key.toLowerCase() === 'o' && !event.ctrlKey && !event.altKey) {
        setShowOrbits(prev => !prev);
        return;
      }

      // 'M' to toggle moons
      if (event.key.toLowerCase() === 'm' && !event.ctrlKey && !event.altKey) {
        setShowMoons(prev => !prev);
        return;
      }

      // 'C' to toggle comets
      if (event.key.toLowerCase() === 'c' && !event.ctrlKey && !event.altKey) {
        setShowComets(prev => !prev);
        return;
      }

      // 'Ctrl+S' to toggle stats
      if (event.key.toLowerCase() === 's' && event.ctrlKey) {
        event.preventDefault();
        setShowStats(prev => !prev);
        return;
      }

      // 'R' to reset camera view
      if (event.key.toLowerCase() === 'r' && !event.ctrlKey && !event.altKey) {
        if (sceneRef.current?.camera && sceneRef.current?.controls) {
          sceneRef.current.camera.position.set(0, 50, 100);
          sceneRef.current.controls.target.set(0, 0, 0);
          sceneRef.current.controls.update();
          setCameraMode('free');
          setSelectedPlanet(null);
        }
        return;
      }

      // 'F' to focus on currently selected planet
      if (event.key.toLowerCase() === 'f' && selectedPlanet && !event.ctrlKey) {
        setCameraMode('follow');
        return;
      }

      // 'Home' or 'H' to focus on Sun
      if (event.key === 'Home' || (event.key.toLowerCase() === 'h' && !event.ctrlKey)) {
        if (sceneRef.current?.camera && sceneRef.current?.controls) {
          sceneRef.current.camera.position.set(0, 30, 50);
          sceneRef.current.controls.target.set(0, 0, 0);
          sceneRef.current.controls.update();
          setCameraMode('free');
          setSelectedPlanet(null);
        }
        return;
      }

      // Number keys 1-9 for quick planet selection (1-8 for planets, 9 for Pluto)
      const allBodies = [...PLANETS_DATA, ...DWARF_PLANETS_DATA];
      if (event.key >= '1' && event.key <= '9' && !event.ctrlKey && !event.altKey) {
        const planetIndex = parseInt(event.key) - 1;
        if (planetIndex < allBodies.length) {
          const planet = allBodies[planetIndex];
          setSelectedPlanet(planet);
          setCameraMode('follow');
        }
        return;
      }

      // '0' for Sun
      if (event.key === '0' && !event.ctrlKey && !event.altKey) {
        if (sceneRef.current?.camera && sceneRef.current?.controls) {
          sceneRef.current.camera.position.set(0, 30, 50);
          sceneRef.current.controls.target.set(0, 0, 0);
          sceneRef.current.controls.update();
          setCameraMode('free');
          setSelectedPlanet(null);
        }
        return;
      }

      // '+' / '=' to increase time speed
      if ((event.key === '+' || event.key === '=') && !event.ctrlKey) {
        setTimeSpeed(prev => Math.min(10, prev + 0.5));
        return;
      }

      // '-' to decrease time speed
      if (event.key === '-' && !event.ctrlKey) {
        setTimeSpeed(prev => Math.max(0.1, prev - 0.5));
        return;
      }

      // '[' to go to previous planet
      if (event.key === '[') {
        if (selectedPlanet) {
          const currentIndex = allBodies.findIndex(p => p.name === selectedPlanet.name);
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : allBodies.length - 1;
          setSelectedPlanet(allBodies[prevIndex]);
          setCameraMode('follow');
        } else {
          setSelectedPlanet(allBodies[allBodies.length - 1]);
          setCameraMode('follow');
        }
        return;
      }

      // ']' to go to next planet
      if (event.key === ']') {
        if (selectedPlanet) {
          const currentIndex = allBodies.findIndex(p => p.name === selectedPlanet.name);
          const nextIndex = (currentIndex + 1) % allBodies.length;
          setSelectedPlanet(allBodies[nextIndex]);
          setCameraMode('follow');
        } else {
          setSelectedPlanet(allBodies[0]);
          setCameraMode('follow');
        }
        return;
      }

      if (!sceneRef.current?.camera || !sceneRef.current?.controls || !sceneRef.current?.THREE) return;
      
      const { camera, controls, THREE } = sceneRef.current;
      
      // Calculate move speed with modifiers
      // Shift = faster (3x), Alt = slower (0.3x)
      let moveSpeed = 5;
      if (event.shiftKey) moveSpeed *= 3;
      if (event.altKey) moveSpeed *= 0.3;
      
      // Get camera direction vectors
      const forward = new THREE.Vector3();
      const right = new THREE.Vector3();
      const up = new THREE.Vector3(0, 1, 0);
      
      camera.getWorldDirection(forward);
      forward.y = 0; // Keep movement on horizontal plane
      forward.normalize();
      
      right.crossVectors(camera.up, forward).normalize();
      
      let moved = false;
      
      switch(event.key.toLowerCase()) {
        case 'w':
          camera.position.addScaledVector(forward, moveSpeed);
          controls.target.addScaledVector(forward, moveSpeed);
          moved = true;
          break;
        case 's':
          if (!event.ctrlKey) {
            camera.position.addScaledVector(forward, -moveSpeed);
            controls.target.addScaledVector(forward, -moveSpeed);
            moved = true;
          }
          break;
        case 'a':
          camera.position.addScaledVector(right, -moveSpeed);
          controls.target.addScaledVector(right, -moveSpeed);
          moved = true;
          break;
        case 'd':
          camera.position.addScaledVector(right, moveSpeed);
          controls.target.addScaledVector(right, moveSpeed);
          moved = true;
          break;
        case 'arrowup':
          camera.position.addScaledVector(forward, moveSpeed);
          controls.target.addScaledVector(forward, moveSpeed);
          moved = true;
          break;
        case 'arrowdown':
          camera.position.addScaledVector(forward, -moveSpeed);
          controls.target.addScaledVector(forward, -moveSpeed);
          moved = true;
          break;
        case 'arrowleft':
          camera.position.addScaledVector(right, -moveSpeed);
          controls.target.addScaledVector(right, -moveSpeed);
          moved = true;
          break;
        case 'arrowright':
          camera.position.addScaledVector(right, moveSpeed);
          controls.target.addScaledVector(right, moveSpeed);
          moved = true;
          break;
        // Q/E for vertical movement
        case 'q':
          camera.position.addScaledVector(up, -moveSpeed);
          controls.target.addScaledVector(up, -moveSpeed);
          moved = true;
          break;
        case 'e':
          camera.position.addScaledVector(up, moveSpeed);
          controls.target.addScaledVector(up, moveSpeed);
          moved = true;
          break;
        // Page Up/Down for vertical movement
        case 'pageup':
          camera.position.addScaledVector(up, moveSpeed * 2);
          controls.target.addScaledVector(up, moveSpeed * 2);
          moved = true;
          break;
        case 'pagedown':
          camera.position.addScaledVector(up, -moveSpeed * 2);
          controls.target.addScaledVector(up, -moveSpeed * 2);
          moved = true;
          break;
      }
      
      if (moved) {
        controls.update();
        // Switch to free camera mode when using keyboard movement
        setCameraMode('free');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showKeyboardHelp, showInfo, cameraMode, selectedPlanet]);

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
            onClick={() => setShowObjectCreator(!showObjectCreator)}
            style={{ 
              background: showObjectCreator ? 'rgba(74, 144, 226, 0.3)' : 'rgba(255, 255, 255, 0.1)',
              border: showObjectCreator ? '1px solid rgba(74, 144, 226, 0.8)' : '1px solid rgba(255, 255, 255, 0.2)'
            }}
            title="Create custom objects"
          >
            🪐 Create
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

          {/* Physics Panel */}
          <PhysicsPanel 
            simulationMode={simulationMode}
            setSimulationMode={setSimulationMode}
            gravityMultiplier={gravityMultiplier}
            setGravityMultiplier={setGravityMultiplier}
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
          )}

          {/* Object Creator Panel */}
          {showObjectCreator && (
            <ObjectCreatorPanel
              onCreateObject={(newObject) => {
                setObjectToCreate(newObject);
                setShowObjectCreator(false);
              }}
              onClose={() => setShowObjectCreator(false)}
              creationMode={creationMode}
              onToggleCreationMode={(mode) => setCreationMode(mode)}
            />
          )}

          {/* Object Editor Panel */}
          {showObjectEditor && selectedPlanet && selectedPlanet.isCustom && (
            <ObjectEditorPanel
              selectedObject={selectedPlanet}
              onUpdateObject={(updatedObject) => {
                // Update the custom object in the scene
                if (sceneRef.current?.planets) {
                  const planetIndex = sceneRef.current.planets.findIndex(
                    p => p.data.name === updatedObject.name
                  );
                  if (planetIndex !== -1) {
                    const planet = sceneRef.current.planets[planetIndex];
                    planet.data = updatedObject;
                    // Update visual properties
                    planet.mesh.material.color.setHex(updatedObject.color);
                    planet.mesh.scale.setScalar(updatedObject.size * 0.6);
                  }
                }
                setSelectedPlanet(updatedObject);
              }}
              onDeleteObject={(objectToDelete) => {
                // Remove object from scene
                if (sceneRef.current?.planets) {
                  const planetIndex = sceneRef.current.planets.findIndex(
                    p => p.data.name === objectToDelete.name
                  );
                  if (planetIndex !== -1) {
                    const planet = sceneRef.current.planets[planetIndex];
                    sceneRef.current.scene.remove(planet.group);
                    sceneRef.current.planets.splice(planetIndex, 1);
                  }
                }
                setShowObjectEditor(false);
                setSelectedPlanet(null);
              }}
              onClose={() => setShowObjectEditor(false)}
            />
          )}
        </div>
      </main>
    </div>
  );
}
