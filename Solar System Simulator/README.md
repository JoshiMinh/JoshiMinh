# Solar System Simulator - Static Site (Work in Progress)

An interactive 3D solar system visualization with realistic orbits, physics simulation, and educational features.

## Status: ⚠️ In Development

The build process is complete but there's a runtime issue that needs to be resolved:
- **Issue**: `ReferenceError: React is not defined`  
- **Cause**: Module scoping issue in the bundled code
- **Next Steps**: Debug React references and module resolution

## What's Been Done

✅ Complete build pipeline with esbuild  
✅ Bundled all dependencies (React, ReactDOM, Three.js)  
✅ Minified production bundle (~990KB)  
✅ Automatic JSX transform  
✅ Standalone HTML + JS files generated  

## Features (Once Working)

- Real-time 3D visualization using Three.js
- Realistic planetary orbits with Kepler mechanics
- N-body physics simulation
- Collision detection system
- Gravity visualization (wells, Lagrange points, Roche limits)
- Interactive controls and camera
- Custom object creation
- 20+ celestial bodies (planets, moons, comets)

## Files

- `index.html` - Entry point  
- `bundle.js` - Complete application bundle (990KB)

## Build Process

The site was built using:
1. esbuild for bundling
2. React 19.2.4
3. Three.js 0.169.0
4. Automatic JSX transform
5. IIFE format for browser compatibility

## Original Source

Source code is in `/app/solar-system/` of the main repository.

## Contributing

If you'd like to help resolve the React reference issue, check the bundle.js for:
- Global `React` variable references
- JSX transform configuration
- Module import/export patterns

## License

Part of the JoshiMinh portfolio repository.
