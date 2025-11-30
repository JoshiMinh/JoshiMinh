# Solar System Simulator 3D

An interactive 3D solar system visualization built with Three.js and React.

## Features

- 🌍 All 8 planets with realistic orbital mechanics
- 🌑 Dwarf planets (Pluto, Ceres)
- 🌙 Major moons for Earth, Mars, Jupiter, and Saturn
- ☄️ Comets with particle trails
- 🪨 Asteroid belt visualization
- 📐 Multiple scale modes (Balanced, True Distance, True Size)
- 🎮 Comprehensive keyboard and mouse controls

## Using Custom Textures

The solar system simulator supports custom textures for planets, moons, rings, and the sun. Follow these steps to add realistic textures:

### Step 1: Create the Textures Directory

Create a folder for your textures in the public directory:

```
public/
  textures/
    solar-system/
      sun.jpg
      mercury.jpg
      venus.jpg
      earth.jpg
      mars.jpg
      jupiter.jpg
      saturn.jpg
      saturn_ring.png
      uranus.jpg
      uranus_ring.png
      neptune.jpg
      pluto.jpg
      ceres.jpg
      moon.jpg
      io.jpg
      europa.jpg
      ganymede.jpg
      callisto.jpg
      titan.jpg
      enceladus.jpg
```

### Step 2: Enable Texture Loading

In `page.jsx`, find the `TEXTURE_CONFIG` object at the top of the file and set `enabled` to `true`:

```javascript
const TEXTURE_CONFIG = {
  enabled: true,  // Change from false to true
  basePath: '/textures/solar-system/',
  // ... rest of configuration
};
```

### Step 3: Texture Specifications

#### Recommended Texture Formats
- **Planets & Moons**: JPG format (smaller file size, good quality)
- **Rings**: PNG format (supports transparency for ring gaps)
- **Sun**: JPG format

#### Recommended Texture Sizes
| Object Type | Minimum Size | Recommended Size |
|------------|--------------|------------------|
| Sun | 1024x512 | 2048x1024 |
| Major Planets | 1024x512 | 2048x1024 |
| Dwarf Planets | 512x256 | 1024x512 |
| Large Moons | 512x256 | 1024x512 |
| Small Moons | 256x128 | 512x256 |
| Rings | 1024x64 | 2048x128 |

#### Texture Projection
- Planet and moon textures should use **equirectangular projection** (standard UV sphere mapping)
- Ring textures should be radial gradients or concentric patterns

### Step 4: Where to Find Free Textures

Here are some sources for high-quality, free planet textures:

1. **NASA's Scientific Visualization Studio**
   - https://svs.gsfc.nasa.gov/
   - Official NASA imagery, public domain

2. **Solar System Scope**
   - https://www.solarsystemscope.com/textures/
   - Free textures for educational use

3. **Planet Pixel Emporium**
   - https://planetpixelemporium.com/
   - Various resolutions available

4. **NASA 3D Resources**
   - https://nasa3d.arc.nasa.gov/
   - Official NASA 3D models and textures

### Custom Texture Configuration

You can customize which textures to load by modifying the `TEXTURE_CONFIG` object:

```javascript
const TEXTURE_CONFIG = {
  enabled: true,
  basePath: '/textures/solar-system/',
  
  // Sun texture
  sun: 'sun.jpg',
  
  // Planet textures (key must match planet name exactly)
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
  
  // Ring textures
  rings: {
    Saturn: 'saturn_ring.png',
    Uranus: 'uranus_ring.png',
  },
  
  // Moon textures (key must match moon name exactly)
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
```

### Adding Custom Moons/Planets

If you add new moons or modify planets, add their texture paths to the appropriate section:

```javascript
// Adding a new moon texture
moons: {
  // ... existing moons
  Triton: 'triton.jpg',  // Add Neptune's moon
}
```

### Troubleshooting

#### Textures Not Loading
1. Check that `enabled: true` is set in `TEXTURE_CONFIG`
2. Verify the texture file exists in `/public/textures/solar-system/`
3. Check the browser console for loading errors
4. Ensure file names match exactly (case-sensitive)

#### Performance Issues
- Use smaller texture sizes (512x256 for distant objects)
- Use JPG format for non-transparent textures
- Consider reducing texture quality on mobile devices

#### Texture Appears Dark
- When using textures, the material color is set to white (0xffffff) and emissive is disabled
- Ensure your scene has adequate lighting
- Check that the texture file isn't too dark

## Controls

### Keyboard
| Key | Action |
|-----|--------|
| W/A/S/D | Move camera |
| Q/E | Move up/down |
| Shift | Speed boost (3x) |
| Alt | Precision mode (slow) |
| 1-9 | Quick planet select |
| 0/H | Focus on Sun |
| [ / ] | Cycle planets |
| F | Follow selected |
| R | Reset camera |
| Space | Pause/Play |
| O | Toggle orbits |
| M | Toggle moons |
| C | Toggle comets |
| ? | Show help |
| ESC | Exit follow mode |

### Mouse
- **Left drag**: Rotate view
- **Right drag**: Pan camera
- **Scroll**: Zoom in/out
- **Click planet**: View info
- **Double-click**: Instant focus

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## License

This project is open source. Planet data is based on NASA's publicly available information.
