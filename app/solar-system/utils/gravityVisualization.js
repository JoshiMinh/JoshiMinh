// Advanced Gravitational Effects Visualization System
// Handles gravity wells, Lagrange points, Roche limits, and binary systems

export class GravityVisualization {
  constructor(scene, THREE) {
    this.scene = scene;
    this.THREE = THREE;
    this.gravityGrid = null;
    this.lagrangePoints = [];
    this.rocheZones = [];
    this.barycenterMarker = null;
    this.showGravityWell = false;
    this.showLagrangePoints = false;
    this.showRocheLimit = false;
    this.showBarycenter = false;
  }

  // Create 3D gravity well grid
  createGravityWell(size = 200, divisions = 40) {
    if (this.gravityGrid) {
      this.scene.remove(this.gravityGrid);
      this.gravityGrid.geometry.dispose();
      this.gravityGrid.material.dispose();
    }

    const geometry = new this.THREE.PlaneGeometry(size, size, divisions, divisions);
    const material = new this.THREE.MeshBasicMaterial({
      color: 0x4488ff,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
      side: this.THREE.DoubleSide
    });

    this.gravityGrid = new this.THREE.Mesh(geometry, material);
    this.gravityGrid.rotation.x = -Math.PI / 2;
    this.gravityGrid.position.y = -20;
    
    // Store original positions for deformation
    const positions = geometry.attributes.position;
    this.originalPositions = new Float32Array(positions.array);
    
    if (this.showGravityWell) {
      this.scene.add(this.gravityGrid);
    }
  }

  // Update gravity well deformation based on massive objects
  updateGravityWell(planets, sun) {
    if (!this.gravityGrid || !this.showGravityWell) return;

    const positions = this.gravityGrid.geometry.attributes.position;
    const gridPos = this.gravityGrid.position;

    // Reset to original positions
    for (let i = 0; i < positions.count; i++) {
      positions.setXYZ(
        i,
        this.originalPositions[i * 3],
        this.originalPositions[i * 3 + 1],
        this.originalPositions[i * 3 + 2]
      );
    }

    // Deform grid based on sun
    if (sun) {
      const sunMass = 333000; // Sun mass in Earth masses
      this.deformGrid(positions, gridPos, { x: 0, y: 0, z: 0 }, sunMass * 0.01);
    }

    // Deform grid based on planets
    planets.forEach(planet => {
      const planetPos = planet.mesh.position;
      this.deformGrid(positions, gridPos, planetPos, planet.data.mass);
    });

    positions.needsUpdate = true;

    // Update color based on deformation depth
    this.updateGridColors(positions);
  }

  // Deform grid vertices based on mass and distance
  deformGrid(positions, gridPos, objectPos, mass) {
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i) + gridPos.x;
      const z = positions.getZ(i) + gridPos.z;
      
      // Calculate distance to object in XZ plane
      const dx = x - objectPos.x;
      const dz = z - objectPos.z;
      const distance = Math.sqrt(dx * dx + dz * dz);
      
      if (distance > 0.1) {
        // Gravity well depth proportional to mass / distance
        const depth = (mass * 5) / (distance + 5);
        const currentY = positions.getY(i);
        positions.setY(i, currentY - depth);
      }
    }
  }

  // Update grid colors based on depth (gravity strength)
  updateGridColors(positions) {
    const colors = new Float32Array(positions.count * 3);
    
    for (let i = 0; i < positions.count; i++) {
      const depth = -positions.getY(i); // Negative depth
      
      // Color gradient: blue (weak) -> cyan -> green -> yellow -> red (strong)
      let r, g, b;
      if (depth < 5) {
        // Blue to Cyan
        r = 0;
        g = depth / 5;
        b = 1;
      } else if (depth < 15) {
        // Cyan to Green
        r = 0;
        g = 1;
        b = 1 - (depth - 5) / 10;
      } else if (depth < 30) {
        // Green to Yellow
        r = (depth - 15) / 15;
        g = 1;
        b = 0;
      } else {
        // Yellow to Red
        r = 1;
        g = Math.max(0, 1 - (depth - 30) / 20);
        b = 0;
      }
      
      colors[i * 3] = r;
      colors[i * 3 + 1] = g;
      colors[i * 3 + 2] = b;
    }
    
    this.gravityGrid.geometry.setAttribute(
      'color',
      new this.THREE.BufferAttribute(colors, 3)
    );
    this.gravityGrid.material.vertexColors = true;
  }

  // Calculate Lagrange points for a two-body system
  calculateLagrangePoints(primary, secondary) {
    const primaryPos = primary.mesh.position;
    const secondaryPos = secondary.mesh.position;
    
    // Distance between bodies
    const dx = secondaryPos.x - primaryPos.x;
    const dy = secondaryPos.y - primaryPos.y;
    const dz = secondaryPos.z - primaryPos.z;
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
    
    if (distance < 0.1) return null;
    
    // Direction vector (normalized)
    const dirX = dx / distance;
    const dirY = dy / distance;
    const dirZ = dz / distance;
    
    // Mass ratio
    const m1 = primary.data.mass;
    const m2 = secondary.data.mass;
    const massRatio = m2 / (m1 + m2);
    
    // Simplified Lagrange point calculations
    // L1: Between the two bodies
    const r1 = distance * (1 - Math.pow(massRatio / 3, 1/3));
    const L1 = {
      x: primaryPos.x + dirX * r1,
      y: primaryPos.y + dirY * r1,
      z: primaryPos.z + dirZ * r1,
      type: 'L1'
    };
    
    // L2: Beyond secondary
    const r2 = distance * (1 + Math.pow(massRatio / 3, 1/3));
    const L2 = {
      x: primaryPos.x + dirX * r2,
      y: primaryPos.y + dirY * r2,
      z: primaryPos.z + dirZ * r2,
      type: 'L2'
    };
    
    // L3: Opposite side of primary
    const r3 = distance * (1 + 5 * massRatio / 12);
    const L3 = {
      x: primaryPos.x - dirX * r3,
      y: primaryPos.y - dirY * r3,
      z: primaryPos.z - dirZ * r3,
      type: 'L3'
    };
    
    // L4 and L5: 60 degrees ahead/behind secondary
    // Perpendicular vector for L4/L5
    const perpX = -dirZ;
    const perpZ = dirX;
    
    const L4 = {
      x: primaryPos.x + dirX * distance * 0.5 + perpX * distance * Math.sqrt(3) / 2,
      y: primaryPos.y + dirY * distance * 0.5,
      z: primaryPos.z + dirZ * distance * 0.5 + perpZ * distance * Math.sqrt(3) / 2,
      type: 'L4'
    };
    
    const L5 = {
      x: primaryPos.x + dirX * distance * 0.5 - perpX * distance * Math.sqrt(3) / 2,
      y: primaryPos.y + dirY * distance * 0.5,
      z: primaryPos.z + dirZ * distance * 0.5 - perpZ * distance * Math.sqrt(3) / 2,
      type: 'L5'
    };
    
    return { L1, L2, L3, L4, L5 };
  }

  // Visualize Lagrange points
  updateLagrangePoints(planets) {
    // Clear existing markers
    this.lagrangePoints.forEach(marker => {
      this.scene.remove(marker.mesh);
      marker.mesh.geometry.dispose();
      marker.mesh.material.dispose();
      if (marker.label) {
        this.scene.remove(marker.label);
      }
    });
    this.lagrangePoints = [];
    
    if (!this.showLagrangePoints) return;
    
    // Find planet-moon pairs
    planets.forEach(planet => {
      if (planet.data.moons && planet.data.moons.length > 0 && planet.moons) {
        planet.moons.forEach(moon => {
          const points = this.calculateLagrangePoints(planet, moon);
          if (points) {
            Object.values(points).forEach(point => {
              this.createLagrangeMarker(point);
            });
          }
        });
      }
    });
  }

  // Create visual marker for Lagrange point
  createLagrangeMarker(point) {
    const geometry = new this.THREE.SphereGeometry(0.3, 16, 16);
    const color = point.type === 'L4' || point.type === 'L5' ? 0x00ff00 : 0xffff00;
    const material = new this.THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.8
    });
    
    const mesh = new this.THREE.Mesh(geometry, material);
    mesh.position.set(point.x, point.y, point.z);
    
    // Add glow
    const glowGeometry = new this.THREE.SphereGeometry(0.5, 16, 16);
    const glowMaterial = new this.THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.3,
      side: this.THREE.BackSide
    });
    const glow = new this.THREE.Mesh(glowGeometry, glowMaterial);
    mesh.add(glow);
    
    this.scene.add(mesh);
    this.lagrangePoints.push({ mesh, point, type: point.type });
  }

  // Calculate Roche limit for a planet-moon system
  calculateRocheLimit(primary, satellite) {
    // Roche limit formula: d = 2.456 * R_primary * (ρ_primary / ρ_satellite)^(1/3)
    // For simplicity, we'll use mass as proxy for density (assuming similar composition)
    const R_primary = primary.data.size * 0.6; // Actual rendered radius
    const densityRatio = primary.data.mass / satellite.data.mass;
    const rocheLimit = 2.456 * R_primary * Math.pow(densityRatio, 1/3);
    
    return rocheLimit;
  }

  // Visualize Roche limit zones
  updateRocheZones(planets) {
    // Clear existing zones
    this.rocheZones.forEach(zone => {
      this.scene.remove(zone.mesh);
      zone.mesh.geometry.dispose();
      zone.mesh.material.dispose();
    });
    this.rocheZones = [];
    
    if (!this.showRocheLimit) return;
    
    // Create Roche zones for planets with moons
    planets.forEach(planet => {
      if (planet.data.moons && planet.data.moons.length > 0) {
        // Use average moon properties for visualization
        const avgMoonMass = planet.data.moons.reduce((sum, m) => sum + m.mass, 0) / planet.data.moons.length;
        const avgMoon = { data: { mass: avgMoonMass, size: 0.3 } };
        
        const rocheLimit = this.calculateRocheLimit(planet, avgMoon);
        this.createRocheZone(planet.mesh.position, rocheLimit);
      }
    });
  }

  // Create visual Roche limit zone
  createRocheZone(position, radius) {
    const geometry = new this.THREE.RingGeometry(radius * 0.9, radius * 1.1, 64);
    const material = new this.THREE.MeshBasicMaterial({
      color: 0xff3333,
      transparent: true,
      opacity: 0.2,
      side: this.THREE.DoubleSide
    });
    
    const mesh = new this.THREE.Mesh(geometry, material);
    mesh.position.copy(position);
    mesh.rotation.x = Math.PI / 2;
    
    this.scene.add(mesh);
    this.rocheZones.push({ mesh, radius });
  }

  // Calculate barycenter for binary systems
  calculateBarycenter(body1, body2) {
    const m1 = body1.data.mass;
    const m2 = body2.data.mass;
    const totalMass = m1 + m2;
    
    const pos1 = body1.mesh.position;
    const pos2 = body2.mesh.position;
    
    return {
      x: (pos1.x * m1 + pos2.x * m2) / totalMass,
      y: (pos1.y * m1 + pos2.y * m2) / totalMass,
      z: (pos1.z * m1 + pos2.z * m2) / totalMass
    };
  }

  // Visualize barycenter
  updateBarycenter(planets) {
    if (this.barycenterMarker) {
      this.scene.remove(this.barycenterMarker);
      this.barycenterMarker.geometry.dispose();
      this.barycenterMarker.material.dispose();
    }
    
    if (!this.showBarycenter || planets.length < 2) return;
    
    // Find two most massive objects for binary system visualization
    const sorted = [...planets].sort((a, b) => b.data.mass - a.data.mass);
    if (sorted.length >= 2) {
      const barycenter = this.calculateBarycenter(sorted[0], sorted[1]);
      
      // Create cross marker
      const geometry = new this.THREE.BufferGeometry();
      const positions = new Float32Array([
        -2, 0, 0,  2, 0, 0,
        0, -2, 0,  0, 2, 0,
        0, 0, -2,  0, 0, 2
      ]);
      geometry.setAttribute('position', new this.THREE.BufferAttribute(positions, 3));
      
      const material = new this.THREE.LineBasicMaterial({
        color: 0xff00ff,
        linewidth: 2
      });
      
      this.barycenterMarker = new this.THREE.LineSegments(geometry, material);
      this.barycenterMarker.position.set(barycenter.x, barycenter.y, barycenter.z);
      
      this.scene.add(this.barycenterMarker);
    }
  }

  // Toggle gravity well visibility
  toggleGravityWell(show) {
    this.showGravityWell = show;
    if (this.gravityGrid) {
      if (show) {
        this.scene.add(this.gravityGrid);
      } else {
        this.scene.remove(this.gravityGrid);
      }
    }
  }

  // Toggle Lagrange points visibility
  toggleLagrangePoints(show) {
    this.showLagrangePoints = show;
  }

  // Toggle Roche limit visibility
  toggleRocheLimit(show) {
    this.showRocheLimit = show;
  }

  // Toggle barycenter visibility
  toggleBarycenter(show) {
    this.showBarycenter = show;
  }

  // Update all visualizations
  update(planets, sun) {
    if (this.showGravityWell) {
      this.updateGravityWell(planets, sun);
    }
    if (this.showLagrangePoints) {
      this.updateLagrangePoints(planets);
    }
    if (this.showRocheLimit) {
      this.updateRocheZones(planets);
    }
    if (this.showBarycenter) {
      this.updateBarycenter(planets);
    }
  }

  // Clean up all visualizations
  cleanup() {
    if (this.gravityGrid) {
      this.scene.remove(this.gravityGrid);
      this.gravityGrid.geometry.dispose();
      this.gravityGrid.material.dispose();
    }
    
    this.lagrangePoints.forEach(marker => {
      this.scene.remove(marker.mesh);
      marker.mesh.geometry.dispose();
      marker.mesh.material.dispose();
    });
    
    this.rocheZones.forEach(zone => {
      this.scene.remove(zone.mesh);
      zone.mesh.geometry.dispose();
      zone.mesh.material.dispose();
    });
    
    if (this.barycenterMarker) {
      this.scene.remove(this.barycenterMarker);
      this.barycenterMarker.geometry.dispose();
      this.barycenterMarker.material.dispose();
    }
    
    this.gravityGrid = null;
    this.lagrangePoints = [];
    this.rocheZones = [];
    this.barycenterMarker = null;
  }
}
