"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./FinalStatement.module.css";
import { FINAL_STATEMENT } from "@/lib/config";
import { prefersReducedMotion } from "@/lib/motion";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export default function FinalStatement() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      if (reduced) return;

      gsap.from("[data-statement-line] > span", {
        opacity: 0,
        y: 60,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.16,
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from("[data-statement-sub]", {
        opacity: 0,
        y: 24,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 55%",
          toggleActions: "play none none reverse",
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      data-nav-theme="dark"
      aria-label="Final statement"
    >
      <div className={styles.inner}>
        <h2 data-statement-line className={styles.headline}>
          {FINAL_STATEMENT.lines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        <p data-statement-sub className={styles.sub}>
          {FINAL_STATEMENT.supporting}
        </p>
      </div>
    </section>
  );
}