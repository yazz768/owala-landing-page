"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FeaturePanel from "./FeaturePanel";
import { FEATURES } from "@/lib/features";
import { FEATURE_CONFIG } from "@/lib/animations";
import styles from "./FeatureExperience.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function FeatureExperience() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const exitRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const exit = exitRef.current;
    if (!section || !track || !exit) return;

    const mm = gsap.matchMedia();

    mm.add(FEATURE_CONFIG.desktopBreakpoint, () => {
      const getScrollAmount = () =>
        Math.max(0, track.scrollWidth - window.innerWidth);

      const xTween = gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => "+=" + getScrollAmount(),
          pin: true,
          scrub: FEATURE_CONFIG.scrub,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const start = FEATURE_CONFIG.exitStartProgress;
            const p = Math.max(0, (self.progress - start) / (1 - start));
            exit.style.opacity = String(Math.min(1, p));
          },
        },
      });

      // Per-panel micro reveals tied to the horizontal container animation
      const panels = Array.from(
        section.querySelectorAll<HTMLElement>("[data-panel]")
      );

      panels.forEach((panel) => {
        const reveals = Array.from(
          panel.querySelectorAll<HTMLElement>("[data-reveal]")
        );
        if (!reveals.length) return;

        gsap.fromTo(
          reveals,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            stagger: 0.14,
            scrollTrigger: {
              trigger: panel,
              containerAnimation: xTween,
              start: FEATURE_CONFIG.revealStart,
              end: FEATURE_CONFIG.revealEnd,
              scrub: true,
            },
          }
        );
      });
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section
    ref={sectionRef}
    className={styles.experience}
    aria-label="Feature experience"
    data-nav-theme="dark"
    >
      <div ref={trackRef} className={styles.track}>
        {FEATURES.map((feature) => (
          <FeaturePanel key={feature.number} feature={feature} />
        ))}
      </div>

      <div ref={exitRef} className={styles.exit} aria-hidden="true" />
    </section>
  );
}