"use client";

import { useEffect } from 'react';
import { PLANETS_DATA, DWARF_PLANETS_DATA } from '../data';

export function useKeyboardControls({
  showKeyboardHelp,
  setShowKeyboardHelp,
  showInfo,
  setShowInfo,
  cameraMode,
  setCameraMode,
  selectedPlanet,
  setSelectedPlanet,
  setIsPaused,
  setShowOrbits,
  setShowMoons,
  setShowComets,
  setShowStats,
  setTimeSpeed,
  sceneRef
}) {
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

      // Number keys 1-9 for quick planet selection
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

      // Camera movement with WASD, Arrow keys, Q/E
      if (!sceneRef.current?.camera || !sceneRef.current?.controls || !sceneRef.current?.THREE) return;
      
      const { camera, controls, THREE } = sceneRef.current;
      
      // Calculate move speed with modifiers
      let moveSpeed = 5;
      if (event.shiftKey) moveSpeed *= 3;
      if (event.altKey) moveSpeed *= 0.3;
      
      // Get camera direction vectors
      const forward = new THREE.Vector3();
      const right = new THREE.Vector3();
      const up = new THREE.Vector3(0, 1, 0);
      
      camera.getWorldDirection(forward);
      forward.y = 0;
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
        setCameraMode('free');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showKeyboardHelp, showInfo, cameraMode, selectedPlanet, setShowKeyboardHelp, setShowInfo, setCameraMode, setSelectedPlanet, setIsPaused, setShowOrbits, setShowMoons, setShowComets, setShowStats, setTimeSpeed, sceneRef]);
}
