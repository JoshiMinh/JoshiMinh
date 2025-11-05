"use client";

import './styles.css';
import BootstrapClient from './BootstrapClient';

export default function IPongXPage() {
  return (
    <>
      <BootstrapClient />
      <header className="site-header">
        <nav className="navbar navbar-expand-lg navbar-light bg-white" aria-label="Primary navigation">
          <div className="container">
            <a className="navbar-brand d-flex align-items-center" href="/ipong-x">
              <img
                src="/ipong-x/pear-logo.png"
                alt="iPong logo"
                width="28"
                height="28"
                loading="lazy"
                decoding="async"
              />
              iPong X
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item"><a className="nav-link" href="#capabilities">Capabilities</a></li>
                <li className="nav-item"><a className="nav-link" href="#why-better">Why It's Better</a></li>
                <li className="nav-item"><a className="nav-link" href="#more-colors">More Colors</a></li>
                <li className="nav-item"><a className="nav-link" href="#purchase-now">Purchase Now</a></li>
                <li className="nav-item"><a className="nav-link" href="/">Back to Home</a></li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <main>
        <section id="latest-model" className="hero">
          <div className="container">
            <div className="row align-items-center g-5">
              <div className="col-lg-5 mx-auto mx-lg-0 text-center text-lg-start">
                <header className="hero__header">
                  <p className="eyebrow mb-2">New Release*</p>
                  <h1 className="section-title">Introducing the iPong X</h1>
                </header>
                <p className="hero__lead">Absolutely not the suspiciously familiar rectangle you're picturing.</p>
              </div>
              <div className="col-lg-7">
                <figure className="hero__video" aria-label="Promotional video">
                  <div className="video-container">
                    <iframe
                      src="https://www.youtube.com/embed/2-EjP2ctzDI"
                      title="iPong X launch video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                    ></iframe>
                  </div>
                </figure>
              </div>
            </div>
          </div>
        </section>

        <section id="capabilities" className="capabilities">
          <div className="container">
            <header className="section-header text-center">
              <h2 className="section-title">Capabilities</h2>
              <p className="section-intro">A parody powerhouse with ridiculous reach and a questionable sense of restraint.</p>
            </header>
            <div className="row align-items-stretch gy-4">
              <div className="col-lg-5">
                <div className="capabilities__summary">
                  <p>
                    iPong X stuffs absurd tech into a chassis sized for courtroom exhibits. Every subsystem is tuned for
                    overkill performance, cinematic flair, and the kind of bravado that keeps competitors awake.
                  </p>
                  <ul className="capabilities__summary-list">
                    <li>Dual-orbit optics so rivals look like they filmed on security cameras.</li>
                    <li>Quantum Pong Core with enough muscle to fry benchmarks and egos alike.</li>
                    <li>Failsafe eco-mode that composts itself before the lawsuit paperwork arrives.</li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-7">
                <div className="capability-grid">
                  <article className="capability-card capability-card--camera">
                    <div className="capability-card__icon" aria-hidden="true">📸</div>
                    <h3>Cinematic Telescope</h3>
                    <p>
                      Stack twelve periscope lenses for intergalactic close-ups while everyone else begs for digital zoom
                      forgiveness.
                    </p>
                  </article>
                  <article className="capability-card capability-card--performance">
                    <div className="capability-card__icon" aria-hidden="true">🚀</div>
                    <h3>Quantum Pong Core</h3>
                    <p>
                      A neural overclock engine that raids, streams, and renders while politely mocking "Pro" chips in the
                      background.
                    </p>
                  </article>
                  <article className="capability-card capability-card--battery">
                    <div className="capability-card__icon" aria-hidden="true">🔋</div>
                    <h3>Epoch Battery</h3>
                    <p>
                      Ten million milliamp-hours of endurance keeps the hype alive for weeks and reverse-charges that other
                      phone that keeps "optimizing" itself.
                    </p>
                  </article>
                  <article className="capability-card capability-card--eco">
                    <div className="capability-card__icon" aria-hidden="true">🌱</div>
                    <h3>Eco-Drama Mode</h3>
                    <p>
                      Smart biodegrading polymers self-compost on command, ensuring the planet survives your upgrade cycle
                      and the PR fallout.
                    </p>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="why-better">
          <div className="container">
            <header className="section-header text-center">
              <h2 className="section-title">Why It's Better</h2>
              <p className="section-intro">Because comparisons are funniest when they're wildly lopsided.</p>
            </header>
            <div className="comparison-table">
              <div className="table-responsive">
                <table className="comparison-table__table">
                  <caption className="visually-hidden">Specification comparison between the iPong X and leading smartphones</caption>
                  <thead>
                    <tr>
                      <th scope="col" className="comparison-table__spec visually-hidden">Specification</th>
                      <th scope="col">
                        <div className="device-card device-card--highlight">
                          <img
                            src="/ipong-x/phones/ipong-x-black.png"
                            alt="iPong X"
                            width="120"
                            height="240"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="device-card__name">iPong X</div>
                          <span className="device-card__tagline">Lawsuit Bait Deluxe</span>
                        </div>
                      </th>
                      <th scope="col">
                        <div className="device-card">
                          <img
                            src="/ipong-x/phones/iphone-15-pro-max.png"
                            alt="iPhone 15 Pro Max"
                            width="120"
                            height="240"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="device-card__name">iPhone 15 Pro Max</div>
                          <span className="device-card__tagline">Apple (Actual Lawyers)</span>
                        </div>
                      </th>
                      <th scope="col">
                        <div className="device-card">
                          <img
                            src="/ipong-x/phones/galaxy-s24-ultra.png"
                            alt="Samsung Galaxy S24 Ultra"
                            width="120"
                            height="240"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="device-card__name">Samsung Galaxy S24 Ultra</div>
                          <span className="device-card__tagline">Samsung (Respectable Adults)</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">
                        <div className="spec-label">
                          <img
                            src="/ipong-x/icons/cpu.png"
                            width="40"
                            height="40"
                            alt=""
                            aria-hidden="true"
                            loading="lazy"
                            decoding="async"
                          />
                          <div>
                            <span className="spec-label__name">Processor</span>
                            <span className="spec-label__hint">Chipset</span>
                          </div>
                        </div>
                      </th>
                      <td>
                        <div className="spec-value">Pong Chip X100 (runs everything)</div>
                      </td>
                      <td>
                        <div className="spec-value">Apple A17 Pro (runs hot)</div>
                      </td>
                      <td>
                        <div className="spec-value">Snapdragon 8 Gen 3 (runs meetings)</div>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">
                        <div className="spec-label">
                          <img
                            src="/ipong-x/icons/ram.png"
                            width="40"
                            height="40"
                            alt=""
                            aria-hidden="true"
                            loading="lazy"
                            decoding="async"
                          />
                          <div>
                            <span className="spec-label__name">Memory</span>
                            <span className="spec-label__hint">RAM</span>
                          </div>
                        </div>
                      </th>
                      <td>
                        <div className="spec-value">512GB (because why not)</div>
                      </td>
                      <td>
                        <div className="spec-value">6GB (courage!)</div>
                      </td>
                      <td>
                        <div className="spec-value">12GB (corporate approved)</div>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">
                        <div className="spec-label">
                          <img
                            src="/ipong-x/icons/gpu.png"
                            width="40"
                            height="40"
                            alt=""
                            aria-hidden="true"
                            loading="lazy"
                            decoding="async"
                          />
                          <div>
                            <span className="spec-label__name">Graphics</span>
                            <span className="spec-label__hint">GPU</span>
                          </div>
                        </div>
                      </th>
                      <td>
                        <div className="spec-value">RTX 4090Ti (portable-ish)</div>
                      </td>
                      <td>
                        <div className="spec-value">Apple GPU (closed garden)</div>
                      </td>
                      <td>
                        <div className="spec-value">Adreno 750 (boardroom safe)</div>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">
                        <div className="spec-label">
                          <img
                            src="/ipong-x/icons/screen.png"
                            width="40"
                            height="40"
                            alt=""
                            aria-hidden="true"
                            loading="lazy"
                            decoding="async"
                          />
                          <div>
                            <span className="spec-label__name">Display</span>
                            <span className="spec-label__hint">Panel</span>
                          </div>
                        </div>
                      </th>
                      <td>
                        <div className="spec-value">6.7&quot; Super XDR (retina-searing)</div>
                      </td>
                      <td>
                        <div className="spec-value">6.7&quot; OLED (very serious)</div>
                      </td>
                      <td>
                        <div className="spec-value">6.8&quot; Dynamic AMOLED (committee approved)</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section id="more-colors">
          <div className="container">
            <header className="section-header text-center">
              <h2 className="section-title">More <span className="rainbow-text">Colors</span></h2>
              <p className="section-intro">
                Choose a finish that matches your vibe. No matter the shade, it still out-brags phones with actual
                reputations.
              </p>
            </header>
            <div className="color-variations">
              <figure className="color-card color-card--black">
                <img
                  src="/ipong-x/phones/ipong-x-black.png"
                  alt="iPong X in black"
                  width="220"
                  height="440"
                  loading="lazy"
                  decoding="async"
                />
                <figcaption>
                  <h3>Black</h3>
                  <p>For agents of chaos cosplaying minimalists.</p>
                </figcaption>
              </figure>
              <figure className="color-card color-card--white">
                <img
                  src="/ipong-x/phones/ipong-x-white.png"
                  alt="iPong X in white"
                  width="220"
                  height="440"
                  loading="lazy"
                  decoding="async"
                />
                <figcaption>
                  <h3>White</h3>
                  <p>For people who call it "bespoke" while side-eyeing fruit logos.</p>
                </figcaption>
              </figure>
              <figure className="color-card color-card--purple">
                <img
                  src="/ipong-x/phones/ipong-x-purple.png"
                  alt="iPong X in purple"
                  width="220"
                  height="440"
                  loading="lazy"
                  decoding="async"
                />
                <figcaption>
                  <h3>Purple</h3>
                  <p>For drama lovers who narrate unboxings like true crime.</p>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section id="purchase-now" className="py-0">
          <div className="container">
            <div className="cta text-center">
              <h2 className="section-title text-white">What are you waiting for?</h2>
              <p className="section-intro text-white">
                Reserve your iPong X before someone from legal notices the resemblance.
              </p>
              <a className="btn btn-lg" href="#">Purchase Now*</a>
              <p className="mt-3 mb-0">Starting at <strong>$9999</strong> (because nines feel cheaper)</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <div className="row gy-4 align-items-center">
            <div className="col-md-6 text-md-start text-center">
              <a className="footer-brand d-inline-flex align-items-center" href="#latest-model">
                <img
                  src="/ipong-x/pear-logo.png"
                  alt="iPong logo"
                  width="28"
                  height="28"
                  loading="lazy"
                  decoding="async"
                />
                iPong X
              </a>
              <p className="site-footer__tagline mb-0">
                Ridiculously overbuilt, unapologetically pretend. Stream the keynote, then practice your courtroom face.
              </p>
            </div>
            <div className="col-md-6 text-md-end text-center">
              <nav className="site-footer__nav" aria-label="Footer">
                <a href="#capabilities">Capabilities</a>
                <a href="#why-better">Specs</a>
                <a href="#more-colors">Colors</a>
                <a href="#purchase-now">Buy</a>
              </nav>
              <p className="site-footer__legal mb-0">&copy; 2024 iPong &amp; JoshiMinh. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
