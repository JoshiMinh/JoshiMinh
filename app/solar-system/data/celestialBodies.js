// Planet data with realistic properties including axial tilt and orbital eccentricity
export const PLANETS_DATA = [
  { 
    name: "Mercury", 
    color: 0xB8B8B8, 
    size: 0.38, 
    distance: 5.8, 
    speed: 4.74,
    rotationSpeed: 0.004,
    axialTilt: 0.034,
    eccentricity: 0.2056,
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
    axialTilt: 177.4,
    eccentricity: 0.0067,
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
    axialTilt: 23.44,
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
    axialTilt: 25.19,
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
    axialTilt: 3.13,
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
    axialTilt: 26.73,
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
    axialTilt: 97.77,
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
    axialTilt: 28.32,
    eccentricity: 0.0113,
    info: "Windiest planet with supersonic winds up to 2,100 km/h.",
    realDistance: "4.495 billion km",
    realSize: "49,244 km diameter"
  }
];

// Dwarf planets and other celestial bodies
export const DWARF_PLANETS_DATA = [
  {
    name: "Pluto",
    color: 0xC4A582,
    size: 0.18,
    distance: 590.6,
    speed: 0.47,
    rotationSpeed: -0.008,
    axialTilt: 122.53,
    eccentricity: 0.2488,
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
    axialTilt: 4.0,
    eccentricity: 0.0758,
    info: "Largest object in the asteroid belt, classified as a dwarf planet.",
    realDistance: "413.7 million km",
    realSize: "940 km diameter",
    isDwarf: true
  }
];

// Comet data for procedural comet trails
export const COMETS_DATA = [
  {
    name: "Halley",
    color: 0xCCFFFF,
    size: 0.08,
    perihelion: 8.8,
    aphelion: 350.6,
    speed: 2.5,
    inclination: 0.3,
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
export const SCALE_MODES = {
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

// Texture paths configuration
export const TEXTURE_CONFIG = {
  enabled: false,
  basePath: '/textures/solar-system/',
  sun: 'sun.jpg',
  planets: {
    Mercury: 'mercury.jpg',
    Venus: 'venus.jpg',
    Earth: 'earth.jpg',
    Mars: 'mars.jpg',
    Jupiter: 'jupiter.jpg',
    Saturn: 'saturn.jpg',
    Uranus: 'uranus.jpg',
    Neptune: 'neptune.jpg',
    Pluto: 'pluto.jpg',
    Ceres: 'ceres.jpg',
  },
  rings: {
    Saturn: 'saturn_ring.png',
    Uranus: 'uranus_ring.png',
  },
  moons: {
    Moon: 'moon.jpg',
    Io: 'io.jpg',
    Europa: 'europa.jpg',
    Ganymede: 'ganymede.jpg',
    Callisto: 'callisto.jpg',
    Titan: 'titan.jpg',
    Enceladus: 'enceladus.jpg',
  }
};
