"use client";

import Link from 'next/link';
import './styles.css';

export default function LivingRPSPage() {
  return (
    <div className="game-container">
      <header className="game-header">
        <Link href="/" className="back-link">← Back to Home</Link>
        <h1>Living RPS</h1>
      </header>
      
      <main className="game-content">
        <div className="game-placeholder">
          <div className="placeholder-icon">✊✋✌️</div>
          <h2>Coming Soon!</h2>
          <p>This project is currently being converted into a web experience.</p>
          <p className="game-description">
            Rock, Paper, Scissors like you've never seen before!
          </p>
        </div>
      </main>
    </div>
  );
}
