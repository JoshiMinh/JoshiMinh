"use client";

import '../styles/globals.css';

import React, { useEffect } from 'react';

const Page = () => {
  // Hardcoded JSON data
  const coreValues = [
    "I build with heart—software should feel like a conversation, not a chore.",
    "Learning in public keeps the craft honest and the vibe collaborative.",
    "Great systems elevate the humans who rely on them every day."
  ];

  const expertiseAreas = [
    {
      title: "Cross-platform Engineering",
      description: "Shipping resilient apps that travel seamlessly between Android, web, and desktop.",
      icon: "app-window",
      gradient: "linear-gradient(90deg, rgba(56,189,248,0.9), rgba(99,102,241,0.9))",
      tags: ["Android", "Web", "Windows", "APIs"]
    },
    {
      title: "AI-powered Experiences",
      description: "Weaving intelligent features into products so builders and communities move faster.",
      icon: "bot",
      gradient: "linear-gradient(90deg, rgba(217,70,239,0.9), rgba(129,140,248,0.9))",
      tags: ["AI SDK", "LLMs", "Automation", "Agents"]
    },
    {
      title: "Design Direction",
      description: "Crafting clear interfaces, motion, and systems that keep the vibe intentional.",
      icon: "palette",
      gradient: "linear-gradient(90deg, rgba(244,114,182,0.95), rgba(251,191,36,0.95))",
      tags: ["Design Systems", "Motion", "Accessibility"]
    }
  ];

  const heroHighlights = [
    {
      title: "Cross-platform builds",
      description: "Crafting native-feeling apps for Android, web, and Windows from a single creative spine.",
      icon: "app-window"
    },
    {
      title: "Playful AI energy",
      description: "Designing features where machine intelligence amplifies vibe, creativity, and speed.",
      icon: "sparkles"
    },
    {
      title: "Design-led systems",
      description: "Pairing interaction design with robust systems thinking to keep products intentional.",
      icon: "layers"
    }
  ];

  const identityPoints = [
    {
      label: "Home base",
      value: "Ho Chi Minh City, Vietnam"
    },
    {
      label: "Undergraduate focus",
      value: "Computer science, product thinking, and immersive storytelling"
    },
    {
      label: "Currently crafting",
      value: "Indie cross-platform products, creative tooling, and community jams"
    },
    {
      label: "Energy",
      value: "Curious, collaborative, and always down to vibe-code new ideas"
    }
  ];

  const identityTags = [
    "Cross-platform apps",
    "AI + creativity",
    "Experience design",
    "Undergraduate life"
  ];

  useEffect(() => {
    // JavaScript logic from OLD/script.js
    let animationObserver = null;
    const pendingAnimationQueue = [];

    function setupAnimationObserver() {
      if (animationObserver) {
        animationObserver.disconnect();
        animationObserver = null;
      }

      const animatedElements = document.querySelectorAll(".animate-in");
      const supportsObserver = typeof window !== "undefined" && "IntersectionObserver" in window;

      if (supportsObserver) {
        animationObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                animationObserver.unobserve(entry.target);
              }
            });
          },
          {
            threshold: 0.15,
            rootMargin: "0px 0px -10%",
          }
        );

        animatedElements.forEach((element) => {
          animationObserver.observe(element);
        });

        if (pendingAnimationQueue.length > 0) {
          const queuedElements = pendingAnimationQueue.splice(0);
          queuedElements.forEach((element) => {
            if (element instanceof Element) {
              animationObserver.observe(element);
            }
          });
        }
      } else {
        animatedElements.forEach((element) => {
          element.classList.add("is-visible");
        });

        if (pendingAnimationQueue.length > 0) {
          const queuedElements = pendingAnimationQueue.splice(0);
          queuedElements.forEach((element) => {
            if (element instanceof Element) {
              element.classList.add("is-visible");
            }
          });
        }
      }
    }

    setupAnimationObserver();
  }, []);

  return (
    <div className="page">
      <header className="hero">
        <h1>Hi, I'm Joshi Minh</h1>
        <p>Undergraduate software engineer · Product designer · AI tinkerer</p>
        <ul>
          {coreValues.map((value, index) => (
            <li key={index}>{value}</li>
          ))}
        </ul>
      </header>
      <main>
        <section>
          <h2>Expertise Areas</h2>
          <ul>
            {expertiseAreas.map((area, index) => (
              <li key={index}>
                <h3>{area.title}</h3>
                <p>{area.description}</p>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2>Hero Highlights</h2>
          <ul>
            {heroHighlights.map((highlight, index) => (
              <li key={index}>
                <h3>{highlight.title}</h3>
                <p>{highlight.description}</p>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2>Identity Snapshot</h2>
          <ul>
            {identityPoints.map((point, index) => (
              <li key={index}>
                <strong>{point.label}:</strong> {point.value}
              </li>
            ))}
          </ul>
          <div>
            {identityTags.map((tag, index) => (
              <span key={index}>{tag}</span>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Page;
