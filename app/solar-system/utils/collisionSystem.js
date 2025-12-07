// Collision detection and effects system
// Handles collision physics, particle effects, and object merging

export class CollisionSystem {
  constructor(scene, THREE) {
    this.scene = scene;
    this.THREE = THREE;
    this.collisionEffects = [];
    this.debrisFields = [];
  }

  // Check for collisions between all planet pairs
  checkCollisions(planets, PHYSICS_CONFIG) {
    const collisions = [];
    
    for (let i = 0; i < planets.length; i++) {
      for (let j = i + 1; j < planets.length; j++) {
        const p1 = planets[i];
        const p2 = planets[j];
        
        // Get world positions
        const pos1 = new this.THREE.Vector3();
        const pos2 = new this.THREE.Vector3();
        p1.mesh.getWorldPosition(pos1);
        p2.mesh.getWorldPosition(pos2);
        
        // Calculate distance
        const distance = pos1.distanceTo(pos2);
        
        // Calculate collision threshold (sum of radii)
        const radius1 = p1.data.size * 0.6; // Match the sphere geometry size
        const radius2 = p2.data.size * 0.6;
        const collisionThreshold = radius1 + radius2;
        
        // Check if objects are colliding
        if (distance < collisionThreshold) {
          collisions.push({
            planet1: p1,
            planet2: p2,
            index1: i,
            index2: j,
            position: pos1.clone().lerp(pos2, 0.5), // Midpoint
            relativeVelocity: Math.sqrt(
              Math.pow((p1.vx || 0) - (p2.vx || 0), 2) +
              Math.pow((p1.vy || 0) - (p2.vy || 0), 2) +
              Math.pow((p1.vz || 0) - (p2.vz || 0), 2)
            )
          });
        }
      }
    }
    
    return collisions;
  }

  // Handle collision physics (momentum conservation)
  handleCollision(collision, planets, orbitLines) {
    const { planet1, planet2, index1, index2, position, relativeVelocity } = collision;
    
    // Calculate momentum conservation
    const m1 = planet1.data.mass;
    const m2 = planet2.data.mass;
    const totalMass = m1 + m2;
    
    // Calculate combined velocity using momentum conservation
    const vx = (m1 * (planet1.vx || 0) + m2 * (planet2.vx || 0)) / totalMass;
    const vy = (m1 * (planet1.vy || 0) + m2 * (planet2.vy || 0)) / totalMass;
    const vz = (m1 * (planet1.vz || 0) + m2 * (planet2.vz || 0)) / totalMass;
    
    // Determine which object "survives" (the more massive one)
    const survivor = m1 >= m2 ? planet1 : planet2;
    const absorbed = m1 >= m2 ? planet2 : planet1;
    const survivorIndex = m1 >= m2 ? index1 : index2;
    const absorbedIndex = m1 >= m2 ? index2 : index1;
    
    // Create visual effects based on relative velocity
    this.createCollisionEffect(position, relativeVelocity, totalMass, survivor.data.color);
    
    // High-speed collision: create debris
    if (relativeVelocity > 2) {
      this.createDebrisField(position, totalMass * 0.1, survivor.data.color);
    }
    
    // Update survivor properties (accretion)
    survivor.data.mass = totalMass;
    survivor.data.size = Math.pow(totalMass, 1/3); // Volume-based size increase
    
    // Update survivor velocity
    survivor.vx = vx;
    survivor.vy = vy;
    survivor.vz = vz;
    
    // Update survivor visual size
    survivor.mesh.scale.setScalar(survivor.data.size * 0.6);
    
    // Remove absorbed object from scene
    this.scene.remove(absorbed.group);
    
    // Clean up absorbed object's orbit line
    if (absorbed.orbitLine) {
      this.scene.remove(absorbed.orbitLine);
    }
    
    // Return the index to remove from planets array
    return absorbedIndex;
  }

  // Create particle explosion effect
  createCollisionEffect(position, velocity, mass, color) {
    const particleCount = Math.min(Math.floor(velocity * 50), 500);
    const geometry = new this.THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const lifetimes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      // Start at collision position
      positions[i * 3] = position.x;
      positions[i * 3 + 1] = position.y;
      positions[i * 3 + 2] = position.z;
      
      // Random explosion direction
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const speed = (Math.random() * 0.5 + 0.5) * velocity * 2;
      
      velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
      velocities[i * 3 + 2] = Math.cos(phi) * speed;
      
      lifetimes[i] = Math.random() * 2 + 1; // 1-3 seconds
    }
    
    geometry.setAttribute('position', new this.THREE.BufferAttribute(positions, 3));
    
    const material = new this.THREE.PointsMaterial({
      color: color,
      size: Math.min(mass * 0.05, 1),
      transparent: true,
      opacity: 0.8,
      blending: this.THREE.AdditiveBlending
    });
    
    const particles = new this.THREE.Points(geometry, material);
    this.scene.add(particles);
    
    // Store effect for animation
    this.collisionEffects.push({
      particles,
      velocities,
      lifetimes,
      age: 0,
      maxAge: 3
    });
    
    // Create flash effect
    this.createFlashEffect(position, mass, color);
    
    // Create shockwave
    this.createShockwave(position, velocity, color);
  }

  // Create flash of light at impact
  createFlashEffect(position, mass, color) {
    const flashGeometry = new this.THREE.SphereGeometry(mass * 0.5, 16, 16);
    const flashMaterial = new this.THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
      transparent: true,
      opacity: 1
    });
    const flash = new this.THREE.Mesh(flashGeometry, flashMaterial);
    flash.position.copy(position);
    this.scene.add(flash);
    
    // Animate flash
    this.collisionEffects.push({
      flash,
      type: 'flash',
      age: 0,
      maxAge: 0.3
    });
  }

  // Create expanding shockwave ring
  createShockwave(position, velocity, color) {
    const ringGeometry = new this.THREE.RingGeometry(0.5, 1, 32);
    const ringMaterial = new this.THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.8,
      side: this.THREE.DoubleSide
    });
    const ring = new this.THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.copy(position);
    ring.rotation.x = Math.PI / 2; // Horizontal ring
    this.scene.add(ring);
    
    // Store for animation
    this.collisionEffects.push({
      ring,
      type: 'shockwave',
      age: 0,
      maxAge: 2,
      initialScale: 1,
      expansionRate: velocity * 2
    });
  }

  // Create debris field for high-speed impacts
  createDebrisField(position, totalMass, color) {
    const debrisCount = Math.floor(totalMass * 10);
    const geometry = new this.THREE.BufferGeometry();
    const positions = new Float32Array(debrisCount * 3);
    const velocities = new Float32Array(debrisCount * 3);
    
    for (let i = 0; i < debrisCount; i++) {
      positions[i * 3] = position.x + (Math.random() - 0.5) * 5;
      positions[i * 3 + 1] = position.y + (Math.random() - 0.5) * 5;
      positions[i * 3 + 2] = position.z + (Math.random() - 0.5) * 5;
      
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const speed = Math.random() * 0.2;
      
      velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
      velocities[i * 3 + 2] = Math.cos(phi) * speed;
    }
    
    geometry.setAttribute('position', new this.THREE.BufferAttribute(positions, 3));
    
    const material = new this.THREE.PointsMaterial({
      color: color,
      size: 0.2,
      transparent: true,
      opacity: 0.6
    });
    
    const debris = new this.THREE.Points(geometry, material);
    this.scene.add(debris);
    
    this.debrisFields.push({
      debris,
      velocities,
      age: 0,
      maxAge: 10
    });
  }

  // Update all active effects
  updateEffects(delta) {
    // Update particle explosions
    for (let i = this.collisionEffects.length - 1; i >= 0; i--) {
      const effect = this.collisionEffects[i];
      effect.age += delta;
      
      if (effect.type === 'flash') {
        // Fade out flash
        const progress = effect.age / effect.maxAge;
        effect.flash.material.opacity = 1 - progress;
        effect.flash.scale.setScalar(1 + progress * 5);
        
        if (effect.age >= effect.maxAge) {
          this.scene.remove(effect.flash);
          effect.flash.geometry.dispose();
          effect.flash.material.dispose();
          this.collisionEffects.splice(i, 1);
        }
      } else if (effect.type === 'shockwave') {
        // Expand and fade shockwave
        const progress = effect.age / effect.maxAge;
        const scale = effect.initialScale + effect.expansionRate * progress;
        effect.ring.scale.setScalar(scale);
        effect.ring.material.opacity = 0.8 * (1 - progress);
        
        if (effect.age >= effect.maxAge) {
          this.scene.remove(effect.ring);
          effect.ring.geometry.dispose();
          effect.ring.material.dispose();
          this.collisionEffects.splice(i, 1);
        }
      } else {
        // Update particle positions
        const positions = effect.particles.geometry.attributes.position.array;
        for (let j = 0; j < effect.velocities.length / 3; j++) {
          positions[j * 3] += effect.velocities[j * 3] * delta;
          positions[j * 3 + 1] += effect.velocities[j * 3 + 1] * delta;
          positions[j * 3 + 2] += effect.velocities[j * 3 + 2] * delta;
          
          // Apply gravity (fall toward origin)
          const dist = Math.sqrt(
            positions[j * 3] * positions[j * 3] +
            positions[j * 3 + 1] * positions[j * 3 + 1] +
            positions[j * 3 + 2] * positions[j * 3 + 2]
          );
          if (dist > 0.1) {
            const gravity = 0.1;
            effect.velocities[j * 3] -= (positions[j * 3] / dist) * gravity * delta;
            effect.velocities[j * 3 + 1] -= (positions[j * 3 + 1] / dist) * gravity * delta;
            effect.velocities[j * 3 + 2] -= (positions[j * 3 + 2] / dist) * gravity * delta;
          }
        }
        effect.particles.geometry.attributes.position.needsUpdate = true;
        
        // Fade out
        const progress = effect.age / effect.maxAge;
        effect.particles.material.opacity = 0.8 * (1 - progress);
        
        if (effect.age >= effect.maxAge) {
          this.scene.remove(effect.particles);
          effect.particles.geometry.dispose();
          effect.particles.material.dispose();
          this.collisionEffects.splice(i, 1);
        }
      }
    }
    
    // Update debris fields
    for (let i = this.debrisFields.length - 1; i >= 0; i--) {
      const field = this.debrisFields[i];
      field.age += delta;
      
      const positions = field.debris.geometry.attributes.position.array;
      for (let j = 0; j < field.velocities.length / 3; j++) {
        positions[j * 3] += field.velocities[j * 3] * delta;
        positions[j * 3 + 1] += field.velocities[j * 3 + 1] * delta;
        positions[j * 3 + 2] += field.velocities[j * 3 + 2] * delta;
      }
      field.debris.geometry.attributes.position.needsUpdate = true;
      
      // Fade out over time
      const progress = field.age / field.maxAge;
      field.debris.material.opacity = 0.6 * (1 - progress);
      
      if (field.age >= field.maxAge) {
        this.scene.remove(field.debris);
        field.debris.geometry.dispose();
        field.debris.material.dispose();
        this.debrisFields.splice(i, 1);
      }
    }
  }

  // Clean up all effects
  cleanup() {
    this.collisionEffects.forEach(effect => {
      if (effect.particles) {
        this.scene.remove(effect.particles);
        effect.particles.geometry.dispose();
        effect.particles.material.dispose();
      }
      if (effect.flash) {
        this.scene.remove(effect.flash);
        effect.flash.geometry.dispose();
        effect.flash.material.dispose();
      }
      if (effect.ring) {
        this.scene.remove(effect.ring);
        effect.ring.geometry.dispose();
        effect.ring.material.dispose();
      }
    });
    
    this.debrisFields.forEach(field => {
      this.scene.remove(field.debris);
      field.debris.geometry.dispose();
      field.debris.material.dispose();
    });
    
    this.collisionEffects = [];
    this.debrisFields = [];
  }
}
