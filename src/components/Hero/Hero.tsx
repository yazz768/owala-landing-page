"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Hero.module.css";
import { HERO_CONFIG } from "@/lib/animations";
import HeroImageSequence, {
  type HeroImageSequenceHandle,
} from "./HeroImageSequence";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** ── Image sequence configuration ────────────────────── */
const FRAME_BASE_PATH = "/convertvideo1";
const FRAME_COUNT = 240;
const FRAME_PADDING = 5;
const FRAME_EXTENSION = "png";
/** ────────────────────────────────────────────────────── */

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const seqRef = useRef<HeroImageSequenceHandle | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const scrollHintRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const scrollHint = scrollHintRef.current;
    const overlay = overlayRef.current;
    if (!section || !headline || !scrollHint || !overlay) return;

    const ctx = gsap.context(() => {
      // INTRO — typography reveal
      gsap.fromTo(
        headline,
        { yPercent: 30, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.4,
          ease: "expo.out",
          delay: 0.15,
        }
      );
    gsap.fromTo(
      headline,
      { yPercent: 30, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 1.4,
        ease: "expo.out",
        delay: 0.15,
        immediateRender: false,
        overwrite: "auto",
      }
    );

      // SCROLL-DRIVEN CINEMATIC (image sequence replaces video)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${HERO_CONFIG.scrollDistanceVh}%`,
          scrub: HERO_CONFIG.scrub,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.round(self.progress * (FRAME_COUNT - 1));
            seqRef.current?.setFrame(idx);
          },
        },
      });

      // Typography fades out early
      tl.to(
        headline,
        { opacity: 0, yPercent: -15, ease: "power2.in", duration: 0.3 },
        0
      );
      tl.to(scrollHint, { opacity: 0, ease: "power2.out", duration: 0.12 }, 0);

      // Transition to black toward the end
      tl.to(overlay, { opacity: 1, ease: "power2.inOut", duration: 0.35 }, 0.65);
    }, section);

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.hero}
      aria-label="Hero"
      data-nav-theme="light"
    >
      <HeroImageSequence
        ref={seqRef}
        basePath={FRAME_BASE_PATH}
        frameCount={FRAME_COUNT}
        padding={FRAME_PADDING}
        extension={FRAME_EXTENSION}
        onProgress={(loaded, total) => setProgress(loaded / total)}
        onReady={() => setIsReady(true)}
      />

      {!isReady && (
        <div className={styles.loading} aria-live="polite" aria-busy="true">
          <span className={styles.loadingBrand}>Owala</span>
          <span className={styles.loadingProgress}>
            {Math.round(progress * 100)
              .toString()
              .padStart(3, "0")}
            %
          </span>
        </div>
      )}

      <div ref={overlayRef} className={styles.overlay} aria-hidden="true" />

      <div className={styles.content}>
        <h1 ref={headlineRef} className={styles.headline}>
          <span>Hydration.</span>
          <span>Redefined.</span>
        </h1>

        <div ref={scrollHintRef} className={styles.scrollHint}>
          <span>Scroll to explore</span>
        </div>
      </div>
    </section>
  );
}