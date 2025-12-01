"use client";

import { useEffect } from "react";
import "./styles/home.css";

export default function Home() {
  useEffect(() => {
    // Load Lucide icons
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/lucide@0.379.0/dist/umd/lucide.min.js';
    script.async = true;
    document.body.appendChild(script);

    // Load and execute the old-script.js
    const scriptTag = document.createElement('script');
    scriptTag.src = '/old-script.js';
    scriptTag.async = true;
    scriptTag.onload = () => {
      // The script is loaded, now manually trigger initialization
      // since DOMContentLoaded has already fired
      if (typeof window.initPage === 'function') {
        window.initPage();
      }
    };
    document.body.appendChild(scriptTag);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
      if (scriptTag.parentNode) scriptTag.parentNode.removeChild(scriptTag);
    };
  }, []);

  return (
    <div className="page" id="top">
      <header className="hero" aria-labelledby="intro-heading">
        <div className="hero__background" aria-hidden="true">
          <span className="blur-ball blur-ball--primary"></span>
          <span className="blur-ball blur-ball--secondary"></span>
          <span className="blur-ball blur-ball--accent"></span>
        </div>
        <div className="hero__content">
          <div className="hero__text">
            <div className="status-pill animate-in" style={{ "--delay": "0s" }}>
              <span className="status-pill__dot" aria-hidden="true"></span>
              <span className="status-pill__text">Joshi Minh · Undergraduate cross-platform builder</span>
            </div>
            <h1 id="intro-heading" className="hero__title animate-in" style={{ "--delay": "0.05s" }}>
              Hi, I'm <span className="text-gradient">Joshi Minh</span>.
            </h1>
            <p className="hero__subtitle animate-in" style={{ "--delay": "0.1s" }}>
              Undergraduate software engineer · Product designer · AI tinkerer
            </p>
            <p className="hero__lead animate-in" style={{ "--delay": "0.15s" }}>
              I love building apps and software across Android, web, and Windows—blending AI and design to vibe-code
              cross-platform experiences that feel alive.
            </p>
            <div className="hero__actions animate-in" style={{ "--delay": "0.22s" }}>
              <a className="button button--primary" href="https://www.linkedin.com/in/nguyen-binh-minh-jm" target="_blank" rel="noopener noreferrer">
                <i data-lucide="rocket" aria-hidden="true"></i>
                <span>Get in touch</span>
              </a>
              <a className="button button--outline" href="#projects">
                <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path
                    fill="currentColor"
                    d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.111.82-.261.82-.577 0-.287-.01-1.244-.015-2.444-3.338.724-4.043-1.61-4.043-1.61-.546-1.385-1.333-1.754-1.333-1.754-1.089-.745.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.807 1.305 3.492.998.108-.775.418-1.305.76-1.605-2.665-.303-5.466-1.335-5.466-5.93 0-1.31.469-2.381 1.236-3.221-.124-.304-.536-1.524.117-3.176 0 0 1.008-.322 3.3 1.23a11.52 11.52 0 0 1 3.003-.404c1.02.005 2.044.138 3.003.404 2.29-1.552 3.295-1.23 3.295-1.23.653 1.653.241 2.873.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.807 5.624-5.479 5.921.43.372.823 1.105.823 2.226 0 1.606-.014 2.898-.014 3.293 0 .319.216.694.825.576C20.565 22.092 24 17.592 24 12.297 24 5.373 18.627 0 12 .297Z"
                  />
                </svg>
                <span>View projects</span>
              </a>
            </div>
            <div className="hero__highlights" id="hero-highlights"></div>
            <div className="hero__social animate-in" style={{ "--delay": "0.32s" }}>
              <span className="hero__social-label">Connect</span>
              <div className="hero__social-buttons" id="social-buttons"></div>
            </div>
            <div className="hero__support animate-in" style={{ "--delay": "0.38s" }}>
              <span className="hero__support-label">Support</span>
              <div className="hero__support-buttons" id="donation-buttons"></div>
            </div>
          </div>
          <div className="hero__profile animate-in" style={{ "--delay": "0.25s" }} aria-labelledby="identity-heading">
            <div className="hero__profile-glow" aria-hidden="true"></div>
            <header className="hero__profile-header">
              <h2 id="identity-heading">Identity snapshot</h2>
              <p>
                Undergraduate maker mixing craft, play, and technology. I chase the edges of cross-platform products while
                keeping people at the center.
              </p>
            </header>
            <ul className="hero__profile-list" id="identity-list"></ul>
            <div className="hero__profile-tags" id="identity-tags"></div>
          </div>
        </div>
      </header>

      <main>
        <section className="section" aria-labelledby="expertise-heading">
          <div className="section__intro">
            <h2 id="expertise-heading">What I do</h2>
            <p>
              I bounce between code, pixels, and AI—shipping reliable software while shaping playful experiences that travel
              across platforms.
            </p>
          </div>
          <div className="card-grid" id="expertise-grid"></div>
        </section>

        <section className="section section--projects" id="projects" aria-labelledby="projects-heading">
          <div className="section__intro">
            <span className="pill">Projects</span>
            <h2 id="projects-heading">Featured builds &amp; explorations</h2>
            <p>
              Each project is a playground for new ideas—ranging from indie SaaS products to delightful experiments that push my
              understanding of what's possible.
            </p>
          </div>
          <div className="card-grid card-grid--projects" id="project-grid"></div>
          <p className="section__note">Links open in a new tab.</p>
        </section>

        <section className="section section--games" id="games" aria-labelledby="games-heading">
          <div className="section__intro">
            <span className="pill pill--games">Games</span>
            <h2 id="games-heading">Interactive playgrounds</h2>
            <p>
              Fun experiments and games built to explore creative coding, physics simulations, and interactive experiences.
            </p>
          </div>
          <div className="card-grid card-grid--games" id="games-grid"></div>
          <div className="section__actions">
            <a className="button button--outline" href="/games">
              <span>Show all games</span>
              <i data-lucide="arrow-right" aria-hidden="true"></i>
            </a>
          </div>
        </section>

        <section className="section section--about" aria-labelledby="about-heading">
          <div className="about">
            <div className="about__text">
              <h2 id="about-heading">About me</h2>
              <p>
                Hey! I'm Joshi Minh—an undergraduate, multi-disciplinary maker blending software engineering, product design,
                and AI experimentation. I live for turning fuzzy ideas into cross-platform systems that feel intentional and
                joyful.
              </p>
              <p>
                From Android apps and responsive web builds to Windows tools and creative experiments, I care about the energy
                the work carries as much as the features it ships.
              </p>
              <ul className="about__values" id="core-values"></ul>
              <a className="button button--primary" href="https://www.linkedin.com/in/nguyen-binh-minh-jm" target="_blank" rel="noopener noreferrer">
                Let's collaborate
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="site-footer__content">
          <div>
            <p>Thanks for visiting my little corner of the internet. Let's build something incredible together.</p>
            <p className="site-footer__meta">© 2025 Joshi Minh. Built with ❤️ and plenty of ☕.</p>
          </div>
          <a className="site-footer__return animate-in" style={{ "--delay": "0.1s" }} href="#top">Back to top</a>
        </div>
      </footer>
    </div>
  );
}
