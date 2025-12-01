"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./styles.css";

export default function GamesPage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/game-sources.json")
      .then((res) => res.json())
      .then((data) => {
        setGames(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load games:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="games-page">
      <header className="games-header">
        <div className="games-header__content">
          <Link href="/" className="back-link">
            ← Back to Home
          </Link>
          <h1 className="games-title">
            <span className="games-title__icon">🎮</span>
            Games & Experiments
          </h1>
          <p className="games-subtitle">
            Interactive playgrounds, simulations, and creative experiments built for fun and learning.
          </p>
        </div>
      </header>

      <main className="games-main">
        {loading ? (
          <div className="games-loading">Loading games...</div>
        ) : (
          <div className="games-grid">
            {games.map((game, index) => (
              <Link
                key={game.url}
                href={game.url}
                className="game-card"
                style={{ "--delay": `${index * 0.1}s` }}
              >
                <div className="game-card__icon">{game.icon}</div>
                <div className="game-card__content">
                  <h2 className="game-card__title">{game.title}</h2>
                  <p className="game-card__description">{game.description}</p>
                </div>
                <div className="game-card__arrow">→</div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <footer className="games-footer">
        <p>Built with ❤️ by Joshi Minh</p>
      </footer>
    </div>
  );
}
