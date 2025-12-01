"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import './styles.css';

// Configuration - Auto-calculate grid to fill screen
const DEFAULT_CELL_SIZE = 14;
const DEFAULT_SPEED = 100;

// Neighbor offsets for Moore neighborhood
const NEIGHBOR_OFFSETS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1]
];

// Predefined patterns
const PATTERNS = {
  glider: {
    name: "Glider",
    category: "Spaceships",
    cells: [[0,1], [1,2], [2,0], [2,1], [2,2]]
  },
  lwss: {
    name: "Lightweight Spaceship",
    category: "Spaceships",
    cells: [[0,1], [0,4], [1,0], [2,0], [2,4], [3,0], [3,1], [3,2], [3,3]]
  },
  gliderGun: {
    name: "Gosper Glider Gun",
    category: "Guns",
    cells: [
      [0,24], [1,22], [1,24], [2,12], [2,13], [2,20], [2,21], [2,34], [2,35],
      [3,11], [3,15], [3,20], [3,21], [3,34], [3,35], [4,0], [4,1], [4,10],
      [4,16], [4,20], [4,21], [5,0], [5,1], [5,10], [5,14], [5,16], [5,17],
      [5,22], [5,24], [6,10], [6,16], [6,24], [7,11], [7,15], [8,12], [8,13]
    ]
  },
  blinker: {
    name: "Blinker",
    category: "Oscillators",
    cells: [[0,0], [0,1], [0,2]]
  },
  toad: {
    name: "Toad",
    category: "Oscillators",
    cells: [[0,1], [0,2], [0,3], [1,0], [1,1], [1,2]]
  },
  beacon: {
    name: "Beacon",
    category: "Oscillators",
    cells: [[0,0], [0,1], [1,0], [1,1], [2,2], [2,3], [3,2], [3,3]]
  },
  pulsar: {
    name: "Pulsar",
    category: "Oscillators",
    cells: [
      [0,2], [0,3], [0,4], [0,8], [0,9], [0,10],
      [2,0], [2,5], [2,7], [2,12],
      [3,0], [3,5], [3,7], [3,12],
      [4,0], [4,5], [4,7], [4,12],
      [5,2], [5,3], [5,4], [5,8], [5,9], [5,10],
      [7,2], [7,3], [7,4], [7,8], [7,9], [7,10],
      [8,0], [8,5], [8,7], [8,12],
      [9,0], [9,5], [9,7], [9,12],
      [10,0], [10,5], [10,7], [10,12],
      [12,2], [12,3], [12,4], [12,8], [12,9], [12,10]
    ]
  },
  pentadecathlon: {
    name: "Pentadecathlon",
    category: "Oscillators",
    cells: [
      [0,1], [1,1], [2,0], [2,2], [3,1], [4,1], [5,1], [6,1], [7,0], [7,2], [8,1], [9,1]
    ]
  },
  block: {
    name: "Block",
    category: "Still Lifes",
    cells: [[0,0], [0,1], [1,0], [1,1]]
  },
  beehive: {
    name: "Beehive",
    category: "Still Lifes",
    cells: [[0,1], [0,2], [1,0], [1,3], [2,1], [2,2]]
  },
  loaf: {
    name: "Loaf",
    category: "Still Lifes",
    cells: [[0,1], [0,2], [1,0], [1,3], [2,1], [2,3], [3,2]]
  },
  boat: {
    name: "Boat",
    category: "Still Lifes",
    cells: [[0,0], [0,1], [1,0], [1,2], [2,1]]
  },
  rPentomino: {
    name: "R-Pentomino",
    category: "Methuselahs",
    cells: [[0,1], [0,2], [1,0], [1,1], [2,1]]
  },
  diehard: {
    name: "Diehard",
    category: "Methuselahs",
    cells: [[0,6], [1,0], [1,1], [2,1], [2,5], [2,6], [2,7]]
  },
  acorn: {
    name: "Acorn",
    category: "Methuselahs",
    cells: [[0,1], [1,3], [2,0], [2,1], [2,4], [2,5], [2,6]]
  }
};

// Color themes
const THEMES = {
  classic: { name: "Classic", alive: "#2ecc71", dead: "#1a1a2e", grid: "#2a2a4a", bg: "#0f0f23" },
  neon: { name: "Neon", alive: "#ff00ff", dead: "#0a0a1a", grid: "#1a1a3a", bg: "#050510" },
  ocean: { name: "Ocean", alive: "#00d4ff", dead: "#0a1628", grid: "#1a2a3a", bg: "#051015" },
  fire: { name: "Fire", alive: "#ff6b35", dead: "#1a0a0a", grid: "#2a1a1a", bg: "#100505" },
  matrix: { name: "Matrix", alive: "#00ff00", dead: "#000a00", grid: "#002a00", bg: "#000500" },
  sunset: { name: "Sunset", alive: "#ff9a56", dead: "#1a1020", grid: "#2a1a30", bg: "#0a0510" },
  cyber: { name: "Cyber", alive: "#00ffff", dead: "#0a0a20", grid: "#1a1a40", bg: "#050515" },
  plasma: { name: "Plasma", alive: "#ff6ec7", dead: "#150a15", grid: "#251a25", bg: "#0a050a" }
};

// Utility functions
const createEmptyGrid = (rows, cols) => 
  Array.from({ length: rows }, () => Array(cols).fill(0));

const countNeighbors = (grid, row, col, rows, cols, wrapEdges) => {
  let count = 0;
  for (const [dr, dc] of NEIGHBOR_OFFSETS) {
    let newRow = row + dr;
    let newCol = col + dc;
    
    if (wrapEdges) {
      newRow = (newRow + rows) % rows;
      newCol = (newCol + cols) % cols;
    }
    
    if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
      count += grid[newRow][newCol];
    }
  }
  return count;
};

const countLiveCells = (grid) => 
  grid.reduce((sum, row) => sum + row.reduce((s, cell) => s + cell, 0), 0);

// Calculate initial grid size based on window
const calculateGridSize = (cellSize) => {
  if (typeof window === 'undefined') return { rows: 50, cols: 80 };
  const width = window.innerWidth;
  const height = window.innerHeight;
  // Leave space for minimal UI
  const gridHeight = height - 60; // Just top bar
  const gridWidth = width;
  const cols = Math.floor(gridWidth / cellSize);
  const rows = Math.floor(gridHeight / cellSize);
  return { rows: Math.max(20, rows), cols: Math.max(30, cols) };
};

export default function ConwayGameOfLife() {
  // Calculate initial grid size
  const [dimensions, setDimensions] = useState({ rows: 50, cols: 80 });
  const [cellSize, setCellSize] = useState(DEFAULT_CELL_SIZE);
  
  // Grid configuration
  const rows = dimensions.rows;
  const cols = dimensions.cols;
  
  // Game state
  const [grid, setGrid] = useState(() => createEmptyGrid(50, 80));
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [generation, setGeneration] = useState(0);
  const [liveCells, setLiveCells] = useState(0);
  
  // Settings
  const [wrapEdges, setWrapEdges] = useState(true);
  const [theme, setTheme] = useState('classic');
  const [showGrid, setShowGrid] = useState(true);
  
  // UI state
  const [showSettings, setShowSettings] = useState(false);
  const [showPatterns, setShowPatterns] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [drawMode, setDrawMode] = useState(1); // 1 = draw, 0 = erase
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Refs
  const runningRef = useRef(running);
  const speedRef = useRef(speed);
  const gridRef = useRef(grid);
  const wrapEdgesRef = useRef(wrapEdges);
  const containerRef = useRef(null);
  
  // Keep refs in sync
  useEffect(() => { runningRef.current = running; }, [running]);
  useEffect(() => { speedRef.current = speed; }, [speed]);
  useEffect(() => { gridRef.current = grid; }, [grid]);
  useEffect(() => { wrapEdgesRef.current = wrapEdges; }, [wrapEdges]);
  
  // Initialize grid to fill screen (debounced resize handler)
  useEffect(() => {
    let resizeTimeout;
    
    const updateGridSize = () => {
      const { rows: newRows, cols: newCols } = calculateGridSize(cellSize);
      setDimensions({ rows: newRows, cols: newCols });
      setGrid(createEmptyGrid(newRows, newCols));
    };
    
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateGridSize, 150);
    };
    
    updateGridSize();
    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(resizeTimeout);
    };
  }, [cellSize]);

  // Track fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT') return;
      
      switch(e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          setRunning(r => !r);
          break;
        case 'r':
          if (!e.ctrlKey && !e.metaKey) {
            randomize();
          }
          break;
        case 'c':
          if (!e.ctrlKey && !e.metaKey) {
            clear();
          }
          break;
        case 's':
          if (!e.ctrlKey && !e.metaKey) {
            step();
          }
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'p':
          setShowPatterns(p => !p);
          break;
        case 'escape':
          setShowSettings(false);
          setShowPatterns(false);
          setShowHelp(false);
          setShowControls(false);
          break;
        case '?':
        case 'h':
          setShowHelp(h => !h);
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Update live cell count
  useEffect(() => {
    setLiveCells(countLiveCells(grid));
  }, [grid]);

  // Toggle fullscreen with error handling
  const toggleFullscreen = () => {
    try {
      if (!document.fullscreenElement) {
        containerRef.current?.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
    } catch {
      // Fullscreen not supported or blocked
    }
  };

  // Simulation loop
  const runSimulation = useCallback(() => {
    if (!runningRef.current) return;

    setGrid(currentGrid => {
      const newGrid = currentGrid.map((row, i) =>
        row.map((cell, j) => {
          const neighbors = countNeighbors(currentGrid, i, j, currentGrid.length, row.length, wrapEdgesRef.current);
          
          // Conway's rules
          if (cell === 1 && (neighbors < 2 || neighbors > 3)) return 0;
          if (cell === 0 && neighbors === 3) return 1;
          return cell;
        })
      );
      return newGrid;
    });

    setGeneration(gen => gen + 1);
    setTimeout(runSimulation, speedRef.current);
  }, []);

  useEffect(() => {
    if (running) runSimulation();
  }, [running, runSimulation]);

  // Grid interaction handlers
  const handleCellInteraction = (i, j) => {
    if (running) return;
    setGrid(currentGrid => {
      const newGrid = currentGrid.map((row, ri) =>
        row.map((cell, ci) => (ri === i && ci === j ? drawMode : cell))
      );
      return newGrid;
    });
  };

  const handleMouseDown = (i, j, e) => {
    e.preventDefault();
    const currentValue = grid[i][j];
    setDrawMode(currentValue === 1 ? 0 : 1);
    setDrawing(true);
    handleCellInteraction(i, j);
  };

  const handleMouseEnter = (i, j) => {
    if (drawing) handleCellInteraction(i, j);
  };

  const handleMouseUp = () => setDrawing(false);

  // Actions
  const clear = () => {
    setGrid(createEmptyGrid(rows, cols));
    setGeneration(0);
    setRunning(false);
  };

  const randomize = (density = 0.3) => {
    setGrid(Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => (Math.random() < density ? 1 : 0))
    ));
    setGeneration(0);
  };

  const step = () => {
    setGrid(currentGrid => {
      const newGrid = currentGrid.map((row, i) =>
        row.map((cell, j) => {
          const neighbors = countNeighbors(currentGrid, i, j, rows, cols, wrapEdges);
          if (cell === 1 && (neighbors < 2 || neighbors > 3)) return 0;
          if (cell === 0 && neighbors === 3) return 1;
          return cell;
        })
      );
      return newGrid;
    });
    setGeneration(gen => gen + 1);
  };

  const loadPattern = (patternKey) => {
    const pattern = PATTERNS[patternKey];
    if (!pattern) return;
    
    const newGrid = createEmptyGrid(rows, cols);
    const startRow = Math.floor(rows / 2) - 5;
    const startCol = Math.floor(cols / 2) - 5;
    
    pattern.cells.forEach(([r, c]) => {
      const newR = startRow + r;
      const newC = startCol + c;
      if (newR >= 0 && newR < rows && newC >= 0 && newC < cols) {
        newGrid[newR][newC] = 1;
      }
    });
    
    setGrid(newGrid);
    setGeneration(0);
    setShowPatterns(false);
  };

  const resizeGrid = (newCellSize) => {
    setCellSize(newCellSize);
    // Grid will auto-resize via the useEffect
  };

  const currentTheme = THEMES[theme];

  // Group patterns by category
  const patternsByCategory = Object.entries(PATTERNS).reduce((acc, [key, pattern]) => {
    if (!acc[pattern.category]) acc[pattern.category] = [];
    acc[pattern.category].push({ key, ...pattern });
    return acc;
  }, {});

  return (
    <div 
      ref={containerRef}
      className="conway-container fullscreen-mode" 
      style={{ '--alive-color': currentTheme.alive, '--dead-color': currentTheme.dead, '--grid-color': currentTheme.grid, '--bg-color': currentTheme.bg }}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Fullscreen Grid - Takes up entire background */}
      <div className="fullscreen-grid-container">
        <div 
          className={`grid fullscreen-grid ${showGrid ? 'with-grid' : ''}`}
          style={{
            gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
          }}
        >
          {grid.map((row, i) =>
            row.map((cell, j) => (
              <div
                key={`${i}-${j}`}
                className={`cell ${cell ? 'alive' : ''}`}
                style={{ width: cellSize, height: cellSize }}
                onMouseDown={(e) => handleMouseDown(i, j, e)}
                onMouseEnter={() => handleMouseEnter(i, j)}
              />
            ))
          )}
        </div>
      </div>

      {/* Floating Top Bar */}
      <div className="floating-topbar">
        <div className="topbar-left">
          <Link href="/" className="back-link" title="Back to Home">←</Link>
          <h1>Conway's Game of Life</h1>
        </div>
        
        <div className="topbar-center">
          <div className="stat-pill">
            <span className="stat-icon">🧬</span>
            <span className="stat-value">{generation.toLocaleString()}</span>
          </div>
          <div className="stat-pill">
            <span className="stat-icon">👥</span>
            <span className="stat-value">{liveCells.toLocaleString()}</span>
          </div>
          <div className="stat-pill">
            <span className="stat-icon">📐</span>
            <span className="stat-value">{rows}×{cols}</span>
          </div>
        </div>

        <div className="topbar-right">
          <button 
            className={`icon-btn ${running ? 'active pulse' : ''}`}
            onClick={() => setRunning(!running)}
            title={running ? 'Pause (Space)' : 'Play (Space)'}
          >
            {running ? '⏸' : '▶️'}
          </button>
          <button className="icon-btn" onClick={step} disabled={running} title="Step (S)">
            ⏭️
          </button>
          <button className="icon-btn" onClick={() => randomize()} title="Random (R)">
            🎲
          </button>
          <button className="icon-btn" onClick={clear} title="Clear (C)">
            🗑️
          </button>
          <div className="divider" />
          <div className="speed-control">
            <button 
              className="speed-btn" 
              onClick={() => setSpeed(s => Math.max(10, s - 20))}
              title="Speed Up (decrease delay)"
            >
              −
            </button>
            <span className="speed-display">{speed}ms</span>
            <button 
              className="speed-btn" 
              onClick={() => setSpeed(s => Math.min(500, s + 20))}
              title="Slow Down (increase delay)"
            >
              +
            </button>
          </div>
          <div className="divider" />
          <button className="icon-btn" onClick={() => setShowPatterns(true)} title="Patterns (P)">
            🧬
          </button>
          <button className="icon-btn" onClick={() => setShowSettings(true)} title="Settings">
            ⚙️
          </button>
          <button 
            className="icon-btn" 
            onClick={toggleFullscreen} 
            title={isFullscreen ? "Exit Fullscreen (F)" : "Fullscreen (F)"}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? '🗗' : '⛶'}
          </button>
          <button className="icon-btn" onClick={() => setShowHelp(true)} title="Help (H)">
            ❓
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>⚙️ Settings</h2>
            
            <div className="setting-group">
              <h3>Cell Size</h3>
              <div className="setting-row">
                <label>Cell Size: {cellSize}px (Grid auto-fills screen)</label>
                <input
                  type="range"
                  min="6"
                  max="24"
                  value={cellSize}
                  onChange={(e) => resizeGrid(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="setting-group">
              <h3>Theme</h3>
              <div className="theme-buttons">
                {Object.entries(THEMES).map(([key, t]) => (
                  <button
                    key={key}
                    className={`theme-btn ${theme === key ? 'active' : ''}`}
                    style={{ '--preview-color': t.alive }}
                    onClick={() => setTheme(key)}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="setting-group">
              <h3>Options</h3>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={wrapEdges}
                  onChange={(e) => setWrapEdges(e.target.checked)}
                />
                Wrap edges (toroidal universe)
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={showGrid}
                  onChange={(e) => setShowGrid(e.target.checked)}
                />
                Show grid lines
              </label>
            </div>

            <button className="btn-primary" onClick={() => setShowSettings(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Patterns Modal */}
      {showPatterns && (
        <div className="modal-overlay" onClick={() => setShowPatterns(false)}>
          <div className="modal patterns-modal" onClick={(e) => e.stopPropagation()}>
            <h2>🧬 Pattern Library</h2>
            
            {Object.entries(patternsByCategory).map(([category, patterns]) => (
              <div key={category} className="pattern-category">
                <h3>{category}</h3>
                <div className="pattern-grid">
                  {patterns.map(({ key, name }) => (
                    <button
                      key={key}
                      className="pattern-btn"
                      onClick={() => loadPattern(key)}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="pattern-category">
              <h3>Random Fill</h3>
              <div className="pattern-grid">
                <button className="pattern-btn" onClick={() => { randomize(0.1); setShowPatterns(false); }}>Sparse (10%)</button>
                <button className="pattern-btn" onClick={() => { randomize(0.3); setShowPatterns(false); }}>Normal (30%)</button>
                <button className="pattern-btn" onClick={() => { randomize(0.5); setShowPatterns(false); }}>Dense (50%)</button>
              </div>
            </div>

            <button className="btn-primary" onClick={() => setShowPatterns(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div className="modal-overlay" onClick={() => setShowHelp(false)}>
          <div className="modal help-modal" onClick={(e) => e.stopPropagation()}>
            <h2>❓ How to Play</h2>
            
            <div className="help-section">
              <h3>🎮 Controls</h3>
              <ul>
                <li><strong>Click/Drag</strong> - Draw or erase cells</li>
                <li><strong>Play/Pause</strong> - Start or stop simulation</li>
                <li><strong>Step</strong> - Advance one generation</li>
                <li><strong>Random</strong> - Fill grid randomly</li>
                <li><strong>Clear</strong> - Remove all cells</li>
              </ul>
            </div>

            <div className="help-section">
              <h3>📜 Rules</h3>
              <p>Each cell follows simple rules based on its 8 neighbors:</p>
              <ul>
                <li><strong>Underpopulation:</strong> A live cell with &lt;2 neighbors dies</li>
                <li><strong>Survival:</strong> A live cell with 2-3 neighbors lives</li>
                <li><strong>Overpopulation:</strong> A live cell with &gt;3 neighbors dies</li>
                <li><strong>Reproduction:</strong> A dead cell with exactly 3 neighbors becomes alive</li>
              </ul>
            </div>

            <div className="help-section">
              <h3>🧬 Pattern Types</h3>
              <ul>
                <li><strong>Still Lifes:</strong> Stable patterns that don't change</li>
                <li><strong>Oscillators:</strong> Patterns that repeat in a cycle</li>
                <li><strong>Spaceships:</strong> Patterns that move across the grid</li>
                <li><strong>Guns:</strong> Patterns that emit spaceships</li>
                <li><strong>Methuselahs:</strong> Small patterns with long evolution</li>
              </ul>
            </div>

            <button className="btn-primary" onClick={() => setShowHelp(false)}>
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
