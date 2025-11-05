"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import '../styles/game-page.css';
import './styles.css';

const numRows = 30;
const numCols = 50;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
];

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }
  return rows;
};

export default function ConwayGameOfLife() {
  const [grid, setGrid] = useState(() => generateEmptyGrid());
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(100);
  const [generation, setGeneration] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showItems, setShowItems] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const speedRef = useRef(speed);
  speedRef.current = speed;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid(g => {
      const newGrid = g.map((row, i) =>
        row.map((cell, j) => {
          let neighbors = 0;
          operations.forEach(([x, y]) => {
            const newI = i + x;
            const newJ = j + y;
            if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
              neighbors += g[newI][newJ];
            }
          });

          if (neighbors < 2 || neighbors > 3) {
            return 0;
          } else if (cell === 0 && neighbors === 3) {
            return 1;
          } else {
            return cell;
          }
        })
      );
      return newGrid;
    });

    setGeneration(gen => gen + 1);

    setTimeout(runSimulation, speedRef.current);
  }, []);

  useEffect(() => {
    if (running) {
      runSimulation();
    }
  }, [running, runSimulation]);

  const handleCellClick = (i, j) => {
    const newGrid = grid.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        if (rowIndex === i && colIndex === j) {
          return cell ? 0 : 1;
        }
        return cell;
      })
    );
    setGrid(newGrid);
  };

  const randomize = () => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 : 0)));
    }
    setGrid(rows);
    setGeneration(0);
  };

  const clear = () => {
    setGrid(generateEmptyGrid());
    setGeneration(0);
    setRunning(false);
  };

  const loadPattern = (pattern) => {
    const newGrid = generateEmptyGrid();
    const startRow = Math.floor(numRows / 2) - Math.floor(pattern.length / 2);
    const startCol = Math.floor(numCols / 2) - Math.floor(pattern[0].length / 2);

    pattern.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (startRow + i >= 0 && startRow + i < numRows && 
            startCol + j >= 0 && startCol + j < numCols) {
          newGrid[startRow + i][startCol + j] = cell;
        }
      });
    });

    setGrid(newGrid);
    setGeneration(0);
  };

  // Patterns
  const glider = [
    [0, 1, 0],
    [0, 0, 1],
    [1, 1, 1]
  ];

  const blinker = [
    [1, 1, 1]
  ];

  const toad = [
    [0, 1, 1, 1],
    [1, 1, 1, 0]
  ];

  const beacon = [
    [1, 1, 0, 0],
    [1, 1, 0, 0],
    [0, 0, 1, 1],
    [0, 0, 1, 1]
  ];

  const pulsar = [
    [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
    [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
    [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0]
  ];

  return (
    <div className="game-container">
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/" className="back-link">← Home</Link>
          <h1 style={{ fontSize: 24, margin: 0 }}>Conway's Game of Life</h1>
        </div>
        <div className="topbar-actions">
          <button className="tool-btn" onClick={() => setShowOptions(true)}>Game Options</button>
          <button className="tool-btn" onClick={() => setShowMenu(true)}>Game Menu</button>
          <button className="tool-btn" onClick={() => setShowItems(true)}>Items</button>
        </div>
      </div>

      <main className="game-content">
        <div className="stage">
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="grid"
              style={{
                gridTemplateColumns: `repeat(${numCols}, 15px)`
              }}
            >
              {grid.map((rows, i) =>
                rows.map((col, j) => (
                  <div
                    key={`${i}-${j}`}
                    onClick={() => handleCellClick(i, j)}
                    className={`cell ${col ? 'alive' : ''}`}
                  />
                ))
              )}
            </div>
          </div>

          {showOptions && (
            <div className="help-overlay" onClick={() => setShowOptions(false)}>
              <div className="help-card" onClick={(e) => e.stopPropagation()}>
                <h3>Options</h3>
                <div className="control-group" style={{ marginBottom: 12 }}>
                  <button
                    className={`btn ${running ? 'btn-danger' : 'btn-success'}`}
                    onClick={() => setRunning(!running)}
                  >
                    {running ? '⏸ Pause' : '▶ Start'}
                  </button>
                  <button className="btn btn-secondary" onClick={() => { setRunning(false); runSimulation(); }}>⏭ Step</button>
                  <button className="btn btn-warning" onClick={clear}>🗑 Clear</button>
                  <button className="btn btn-primary" onClick={randomize}>🎲 Random</button>
                </div>
                <div className="control-group" style={{ marginBottom: 12 }}>
                  <label htmlFor="speed">Speed: {speed}ms</label>
                  <input id="speed" type="range" min="50" max="1000" step="50" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="speed-slider" />
                </div>
                <div className="stats" style={{ marginBottom: 12 }}>
                  <span className="generation-counter">Generation: {generation}</span>
                </div>
                <button className="tool-btn" onClick={() => setShowOptions(false)}>Close</button>
              </div>
            </div>
          )}

          {showMenu && (
            <div className="help-overlay" onClick={() => setShowMenu(false)}>
              <div className="help-card" onClick={(e) => e.stopPropagation()}>
                <h3>Patterns</h3>
                <div className="pattern-buttons" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                  <button className="btn-pattern" onClick={() => loadPattern(glider)}>Glider</button>
                  <button className="btn-pattern" onClick={() => loadPattern(blinker)}>Blinker</button>
                  <button className="btn-pattern" onClick={() => loadPattern(toad)}>Toad</button>
                  <button className="btn-pattern" onClick={() => loadPattern(beacon)}>Beacon</button>
                  <button className="btn-pattern" onClick={() => loadPattern(pulsar)}>Pulsar</button>
                </div>
                <button className="tool-btn" onClick={() => setShowMenu(false)}>Close</button>
              </div>
            </div>
          )}

          {showItems && (
            <div className="help-overlay" onClick={() => setShowItems(false)}>
              <div className="help-card" onClick={(e) => e.stopPropagation()}>
                <h3>Items</h3>
                <p>No additional items yet. Use Patterns in Game Menu.</p>
                <button className="tool-btn" onClick={() => setShowItems(false)}>Close</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
