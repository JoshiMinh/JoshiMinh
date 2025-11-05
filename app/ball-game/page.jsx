"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import "../styles/game-page.css";

// Simple utility helpers
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const normalize = (x, y) => {
  const l = Math.hypot(x, y) || 1;
  return [x / l, y / l];
};
const dot = (ax, ay, bx, by) => ax * bx + ay * by;
const reflect = (vx, vy, nx, ny) => {
  const d = 2 * (vx * nx + vy * ny);
  return [vx - d * nx, vy - d * ny];
};

// Hit testing helpers
function pointOnSegment(px, py, x1, y1, x2, y2, tol = 6) {
  const vx = x2 - x1, vy = y2 - y1;
  const wx = px - x1, wy = py - y1;
  const c1 = vx * wx + vy * wy;
  const c2 = vx * vx + vy * vy;
  const t = clamp(c1 / (c2 || 1), 0, 1);
  const cx = x1 + t * vx, cy = y1 + t * vy;
  return Math.hypot(px - cx, py - cy) <= tol;
}

function closestPointOnSegment(px, py, x1, y1, x2, y2) {
  const vx = x2 - x1, vy = y2 - y1;
  const wx = px - x1, wy = py - y1;
  const c1 = vx * wx + vy * wy;
  const c2 = vx * vx + vy * vy;
  const t = clamp(c1 / (c2 || 1), 0, 1);
  return { x: x1 + t * vx, y: y1 + t * vy, t };
}

function circleAABBCollision(ball, rect) {
  const cx = clamp(ball.x, rect.x, rect.x + rect.w);
  const cy = clamp(ball.y, rect.y, rect.y + rect.h);
  const dx = ball.x - cx, dy = ball.y - cy;
  const d2 = dx * dx + dy * dy;
  if (d2 > ball.r * ball.r) return null;
  const [nx, ny] = normalize(dx || (ball.x < rect.x ? -1 : 1), dy || (ball.y < rect.y ? -1 : 1));
  return { nx, ny, px: cx, py: cy };
}

function circleCircleCollision(bx, by, br, cx, cy, cr) {
  const dx = bx - cx, dy = by - cy;
  const d = Math.hypot(dx, dy);
  if (d === 0 || d > br + cr) return null;
  const nx = dx / d, ny = dy / d;
  const px = cx + nx * cr, py = cy + ny * cr;
  return { nx, ny, px, py, penetration: br + cr - d };
}

function edgesOfTriangle(points) {
  return [
    [points[0], points[1]],
    [points[1], points[2]],
    [points[2], points[0]],
  ];
}

function uid() { return Math.random().toString(36).slice(2, 9); }

const STORAGE_KEY = "ball-game-state-v1";

export default function BallGamePage() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [tool, setTool] = useState("ball");
  const [isPlaying, setIsPlaying] = useState(true);
  const [balls, setBalls] = useState([]);
  const [shapes, setShapes] = useState([]);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [helpOpen, setHelpOpen] = useState(false);

  const drag = useRef({ active: false });
  const rafRef = useRef(0);
  const lastTimeRef = useRef(0);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const parent = containerRef.current;
    if (!canvas || !parent) return;
    const dpr = window.devicePixelRatio || 1;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, []);

  // Persist/restore
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setBalls(parsed.balls || []);
        setShapes(parsed.shapes || []);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const data = JSON.stringify({ balls, shapes });
    try { localStorage.setItem(STORAGE_KEY, data); } catch {}
  }, [balls, shapes]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  // Physics loop
  useEffect(() => {
    const step = (t) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      // Compute dt
      const last = lastTimeRef.current || t;
      let dt = Math.min((t - last) / 1000, 0.033); // cap at ~30 FPS step
      lastTimeRef.current = t;
      if (!isPlaying) dt = 0; // pause movement but still render

      // Update physics
      if (dt > 0) {
        setBalls((prev) => {
          const next = prev.map((b) => ({ ...b }));
          for (const b of next) {
            // Integrate
            b.x += b.vx * dt;
            b.y += b.vy * dt;

            // Collide with bounds
            if (b.x - b.r < 0) { b.x = b.r; b.vx = Math.abs(b.vx); }
            if (b.x + b.r > w) { b.x = w - b.r; b.vx = -Math.abs(b.vx); }
            if (b.y - b.r < 0) { b.y = b.r; b.vy = Math.abs(b.vy); }
            if (b.y + b.r > h) { b.y = h - b.r; b.vy = -Math.abs(b.vy); }

            // Collide with shapes
            for (const s of shapes) {
              handleBallShapeCollision(b, s);
            }
          }
          return next;
        });
      }

      // Render
      ctx.clearRect(0, 0, w, h);
      // Backdrop grid
      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,0.07)";
      ctx.lineWidth = 1;
      for (let gx = 0; gx < w; gx += 40) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
      }
      for (let gy = 0; gy < h; gy += 40) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
      }
      ctx.restore();

      // Draw shapes
      for (const s of shapes) drawShape(ctx, s);

      // Draw balls
      for (const b of balls) drawBall(ctx, b);

      // Draw in-progress creation preview
      drawPreview(ctx, tool, drag.current);

      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [balls, shapes, tool, isPlaying]);

  // Collision handler
  function handleBallShapeCollision(b, s) {
    const restitution = 1.0; // perfectly elastic

    if (s.type === "line") {
      const { x: cx, y: cy } = closestPointOnSegment(b.x, b.y, s.x1, s.y1, s.x2, s.y2);
      const dx = b.x - cx, dy = b.y - cy;
      const d2 = dx * dx + dy * dy;
      const r2 = b.r * b.r;
      if (d2 <= r2) {
        let [nx, ny] = normalize(dx || (s.y2 - s.y1), dy || -(s.x2 - s.x1));
        // Only reflect if approaching the surface
        if (dot(b.vx, b.vy, nx, ny) < 0) {
          const [rvx, rvy] = reflect(b.vx, b.vy, nx, ny);
          b.vx = rvx * restitution;
          b.vy = rvy * restitution;
          // push out slightly to avoid sticking
          const d = Math.sqrt(d2) || 0.0001;
          const pen = b.r - d + 0.5;
          b.x += nx * pen;
          b.y += ny * pen;
        }
      }
    } else if (s.type === "rect") {
      const col = circleAABBCollision(b, s);
      if (col) {
        const { nx, ny } = col;
        if (dot(b.vx, b.vy, nx, ny) < 0) {
          const [rvx, rvy] = reflect(b.vx, b.vy, nx, ny);
          b.vx = rvx * restitution;
          b.vy = rvy * restitution;
          // minimal push out
          b.x += nx * 1;
          b.y += ny * 1;
        }
      }
    } else if (s.type === "circle") {
      const col = circleCircleCollision(b.x, b.y, b.r, s.x, s.y, s.r);
      if (col) {
        const { nx, ny, penetration } = col;
        if (dot(b.vx, b.vy, nx, ny) < 0) {
          const [rvx, rvy] = reflect(b.vx, b.vy, nx, ny);
          b.vx = rvx * restitution;
          b.vy = rvy * restitution;
          b.x += nx * (penetration + 0.5);
          b.y += ny * (penetration + 0.5);
        }
      }
    } else if (s.type === "triangle") {
      const edges = edgesOfTriangle(s.points);
      for (const [a, c] of edges) {
        const { x: cx, y: cy } = closestPointOnSegment(b.x, b.y, a.x, a.y, c.x, c.y);
        const dx = b.x - cx, dy = b.y - cy;
        const d2 = dx * dx + dy * dy;
        if (d2 <= b.r * b.r) {
          let [nx, ny] = normalize(dx || (c.y - a.y), dy || -(c.x - a.x));
          if (dot(b.vx, b.vy, nx, ny) < 0) {
            const [rvx, rvy] = reflect(b.vx, b.vy, nx, ny);
            b.vx = rvx * restitution;
            b.vy = rvy * restitution;
            const d = Math.sqrt(d2) || 0.0001;
            const pen = b.r - d + 0.5;
            b.x += nx * pen;
            b.y += ny * pen;
          }
        }
      }
    }
  }

  // Drawing
  function drawBall(ctx, b) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    const grad = ctx.createRadialGradient(b.x - b.r * 0.4, b.y - b.r * 0.4, b.r * 0.2, b.x, b.y, b.r);
    grad.addColorStop(0, b.color);
    grad.addColorStop(1, "rgba(255,255,255,0.1)");
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.stroke();
    ctx.restore();
  }

  function drawShape(ctx, s) {
    ctx.save();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    if (s.type === "line") {
      ctx.beginPath();
      ctx.moveTo(s.x1, s.y1);
      ctx.lineTo(s.x2, s.y2);
      ctx.stroke();
    } else if (s.type === "rect") {
      ctx.beginPath();
      ctx.rect(s.x, s.y, s.w, s.h);
      ctx.fill();
      ctx.stroke();
    } else if (s.type === "circle") {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (s.type === "triangle") {
      ctx.beginPath();
      ctx.moveTo(s.points[0].x, s.points[0].y);
      ctx.lineTo(s.points[1].x, s.points[1].y);
      ctx.lineTo(s.points[2].x, s.points[2].y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawPreview(ctx, tool, dragState) {
    if (!dragState.active) return;
    ctx.save();
    ctx.setLineDash([6, 6]);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#fff";
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    const { sx, sy, x, y } = dragState;
    if (tool === "line") {
      ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(x, y); ctx.stroke();
    } else if (tool === "rect") {
      const x0 = Math.min(sx, x), y0 = Math.min(sy, y);
      const w = Math.abs(x - sx), h = Math.abs(y - sy);
      ctx.beginPath(); ctx.rect(x0, y0, w, h); ctx.fill(); ctx.stroke();
    } else if (tool === "circle") {
      const r = Math.hypot(x - sx, y - sy);
      ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    } else if (tool === "triangle") {
      const pts = dragState.points || [{ x: sx, y: sy }];
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      if (pts[1]) ctx.lineTo(pts[1].x, pts[1].y);
      if (pts.length === 2) ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === "ball") {
      const r = 12;
      ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(x, y); ctx.stroke();
    }
    ctx.restore();
  }

  // Tool interactions
  const pickEntityAt = useCallback((px, py) => {
    // Prefer balls first, then shapes
    for (let i = balls.length - 1; i >= 0; i--) {
      const b = balls[i];
      if (Math.hypot(px - b.x, py - b.y) <= b.r + 6) return { kind: "ball", index: i, entity: b };
    }
    for (let i = shapes.length - 1; i >= 0; i--) {
      const s = shapes[i];
      if (s.type === "line") {
        if (pointOnSegment(px, py, s.x1, s.y1, s.x2, s.y2)) return { kind: "shape", index: i, entity: s };
      } else if (s.type === "rect") {
        if (px >= s.x && px <= s.x + s.w && py >= s.y && py <= s.y + s.h) return { kind: "shape", index: i, entity: s };
      } else if (s.type === "circle") {
        if (Math.hypot(px - s.x, py - s.y) <= s.r + 6) return { kind: "shape", index: i, entity: s };
      } else if (s.type === "triangle") {
        // Simple barycentric test
        const [a, b, c] = s.points;
        const area = (p, q, r) => Math.abs((p.x * (q.y - r.y) + q.x * (r.y - p.y) + r.x * (p.y - q.y)) / 2);
        const P = { x: px, y: py };
        const A = area(a, b, c);
        const A1 = area(P, b, c), A2 = area(a, P, c), A3 = area(a, b, P);
        if (Math.abs(A - (A1 + A2 + A3)) < 1) return { kind: "shape", index: i, entity: s };
      }
    }
    return null;
  }, [balls, shapes]);

  const onPointerDown = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    drag.current = { active: true, sx: x, sy: y, x, y, points: [] };

    if (tool === "move" || tool === "delete") {
      const hit = pickEntityAt(x, y);
      if (hit) {
        drag.current.hit = hit;
        // For move, use incremental deltas to avoid reference point quirks across types
        drag.current.lastx = x; drag.current.lasty = y;
        if (tool === "delete") {
          if (hit.kind === "ball") setBalls((prev) => prev.filter((_, i) => i !== hit.index));
          else setShapes((prev) => prev.filter((_, i) => i !== hit.index));
          drag.current.active = false;
        }
      }
    } else if (tool === "triangle") {
      // Accumulate points on clicks
      const d = drag.current;
      d.points = d.points?.length ? d.points : [];
      d.points.push({ x, y });
      if (d.points.length === 3) {
        const s = { id: uid(), type: "triangle", points: d.points };
        setShapes((prev) => [...prev, s]);
        drag.current = { active: false };
      }
    }
  }, [tool, pickEntityAt]);

  const onPointerMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (drag.current?.active) {
      drag.current.x = x; drag.current.y = y;
      if (tool === "move" && drag.current.hit) {
        const { hit, lastx, lasty } = drag.current;
        const dx = x - lastx; const dy = y - lasty;
        drag.current.lastx = x; drag.current.lasty = y;
        if (hit.kind === "ball") {
          setBalls((prev) => prev.map((b, i) => i === hit.index ? { ...b, x: b.x + dx, y: b.y + dy } : b));
        } else {
          setShapes((prev) => prev.map((s, i) => {
            if (i !== hit.index) return s;
            if (s.type === "line") {
              return { ...s, x1: s.x1 + dx, y1: s.y1 + dy, x2: s.x2 + dx, y2: s.y2 + dy };
            } else if (s.type === "rect") {
              return { ...s, x: s.x + dx, y: s.y + dy };
            } else if (s.type === "circle") {
              return { ...s, x: s.x + dx, y: s.y + dy };
            } else if (s.type === "triangle") {
              return { ...s, points: s.points.map(p => ({ x: p.x + dx, y: p.y + dy })) };
            }
            return s;
          }));
        }
      }
    } else {
      // hover info
      const hit = pickEntityAt(x, y);
      setHoverInfo(hit);
    }
  }, [tool, pickEntityAt]);

  const onPointerUp = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const d = drag.current;
    if (!d.active) return;

    if (tool === "ball") {
      const dx = (x - d.sx), dy = (y - d.sy);
      const speed = Math.min(400, Math.hypot(dx, dy) * 3);
      const [nx, ny] = normalize(dx, dy);
      const color = `hsl(${Math.floor(Math.random() * 360)}, 80%, 60%)`;
      const ball = {
        id: uid(), x: d.sx, y: d.sy, vx: (speed || 200) * (nx || Math.random()*2-1), vy: (speed || 200) * (ny || Math.random()*2-1), r: 12, color,
      };
      setBalls((prev) => [...prev, ball]);
    } else if (tool === "line") {
      if (Math.hypot(x - d.sx, y - d.sy) > 3) {
        setShapes((prev) => [...prev, { id: uid(), type: "line", x1: d.sx, y1: d.sy, x2: x, y2: y }]);
      }
    } else if (tool === "rect") {
      const x0 = Math.min(d.sx, x), y0 = Math.min(d.sy, y);
      const w = Math.abs(x - d.sx), h = Math.abs(y - d.sy);
      if (w > 4 && h > 4) setShapes((prev) => [...prev, { id: uid(), type: "rect", x: x0, y: y0, w, h }]);
    } else if (tool === "circle") {
      const r = Math.hypot(x - d.sx, y - d.sy);
      if (r > 4) setShapes((prev) => [...prev, { id: uid(), type: "circle", x: d.sx, y: d.sy, r }]);
    }

    drag.current = { active: false };
  }, [tool]);

  const clearAll = useCallback(() => {
    setBalls([]);
    setShapes([]);
  }, []);

  const toolbarButtons = useMemo(() => ([
    { id: "ball", label: "Ball", tip: "Ball: drag to set launch direction" },
    { id: "line", label: "Line", tip: "Line: click-drag to draw wall" },
    { id: "rect", label: "Square", tip: "Square: drag to draw axis-aligned square/rect" },
    { id: "circle", label: "Circle", tip: "Circle: drag to set radius" },
    { id: "triangle", label: "Triangle", tip: "Triangle: click 3 points" },
    { id: "move", label: "Move", tip: "Move: drag to reposition shapes/balls" },
    { id: "delete", label: "Delete", tip: "Delete: click to remove" },
  ]), []);
  return (
    <div className="game-container">
      <div className="topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/" className="back-link">← Home</Link>
          <h1 style={{ fontSize: 24, margin: 0 }}>Ball Game</h1>
        </div>
        <div className="topbar-actions">
          <button className="tool-btn" onClick={() => setHelpOpen(true)}>Game Options</button>
          <button className="tool-btn" onClick={() => setHelpOpen(true)}>Game Menu</button>
          <button className="tool-btn" onClick={() => setHelpOpen(true)}>Items</button>
          <span className="spacer" />
          <button className="tool-btn" onClick={() => setIsPlaying((v) => !v)}>{isPlaying ? "Pause" : "Play"}</button>
          <button className="tool-btn" onClick={clearAll}>Clear</button>
          <button className="tool-btn" onClick={() => setHelpOpen((v) => !v)}>Help</button>
        </div>
      </div>

      <main className="game-content">
        <div className="stage">
          <div className="canvas-wrapper" ref={containerRef}>
            <div className="toolbar">
              <div className="tool-group">
                {toolbarButtons.map((btn) => (
                  <button
                    key={btn.id}
                    title={btn.tip}
                    className={`tool-btn ${tool === btn.id ? "active" : ""}`}
                    onClick={() => setTool(btn.id)}
                  >{btn.label}</button>
                ))}
              </div>
            </div>

            <canvas
              ref={canvasRef}
              className="game-canvas"
              onMouseDown={onPointerDown}
              onMouseMove={onPointerMove}
              onMouseUp={onPointerUp}
            />

            {hoverInfo && (
              <div className="hover-badge" style={{ left: (hoverInfo.entity?.x || hoverInfo.entity?.x1 || 0) + 12, top: (hoverInfo.entity?.y || hoverInfo.entity?.y1 || 0) - 12 }}>
                {hoverInfo.kind === "ball" ? "Ball" : hoverInfo.entity.type}
              </div>
            )}

            {helpOpen && (
              <div className="help-overlay" onClick={() => setHelpOpen(false)}>
                <div className="help-card" onClick={(e) => e.stopPropagation()}>
                  <h3>How to play</h3>
                  <ul>
                    <li>Ball: click-drag to set launch direction and speed; release to spawn.</li>
                    <li>Line: click-drag to draw a wall segment.</li>
                    <li>Square: click-drag to draw an axis-aligned rectangle.</li>
                    <li>Circle: click-drag to set center and radius.</li>
                    <li>Triangle: click three points to create a triangle.</li>
                    <li>Move: drag any item to reposition it. Pause if things are moving too fast.</li>
                    <li>Delete: click any item to remove it.</li>
                    <li>Balls bounce off shapes and canvas edges with elastic collisions.</li>
                  </ul>
                  <button className="tool-btn" onClick={() => setHelpOpen(false)}>Close</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
