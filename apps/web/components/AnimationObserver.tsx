"use client";

import { useEffect } from "react";

export function AnimationObserver() {
  useEffect(() => {
    const animatedElements = document.querySelectorAll(".animate-in");
    
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      // Fallback for browsers without IntersectionObserver
      animatedElements.forEach((element) => {
        element.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -10%",
      }
    );

    animatedElements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
