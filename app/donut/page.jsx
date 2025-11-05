"use client";

import Link from 'next/link';
import '../styles/game-page.css';

export default function DonutPage() {
  return (
    <div className="game-container">
      <header className="game-header">
        <Link href="/" className="back-link">← Back to Home</Link>
        <h1>Donut</h1>
      </header>
      
      <main className="game-content">
        <div className="game-placeholder">
          <div className="placeholder-icon">🍩</div>
          <h2>Coming Soon!</h2>
          <p>This project is currently being converted into a web experience.</p>
          <p className="game-description">
            A sweet interactive experience awaits!
          </p>
        </div>
      </main>
    </div>
  );
}
