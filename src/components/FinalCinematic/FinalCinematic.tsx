"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./FinalCinematic.module.css";
import { FINAL_CONFIG } from "@/lib/animations";
import { prefersReducedMotion } from "@/lib/motion";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export default function FinalCinematic() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const headlineRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    const headline = headlineRef.current;
    const overlay = overlayRef.current;
    if (!section || !video || !headline || !overlay) return;

    let ctx: gsap.Context | null = null;
    let disposed = false;
    const reduced = prefersReducedMotion();

    // Lazy-upgrade preload when section is near the viewport.
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            if (video.preload !== "auto") {
              video.preload = "auto";
              try {
                video.load();
              } catch {
                /* noop */
              }
            }
            io.disconnect();
          }
        });
      },
      { rootMargin: "150% 0px" }
    );
    io.observe(section);

    const build = () => {
      if (disposed) return;
      const duration = video.duration;
      if (!duration || !isFinite(duration) || duration <= 0) return;

      try {
        video.pause();
        video.currentTime = 0;
      } catch {
        /* noop */
      }

      ctx = gsap.context(() => {
        if (reduced) {
          gsap.fromTo(
            headline,
            { opacity: 0 },
            { opacity: 1, duration: 1, ease: "power2.out" }
          );
          try {
            video.currentTime = Math.max(0, duration - 0.05);
            video.pause();
          } catch {
            /* noop */
          }
          return;
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: `+=${FINAL_CONFIG.scrollDistanceVh}%`,
            scrub: FINAL_CONFIG.scrub,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Intro reveal of headline (before scrub begins)
        gsap.fromTo(
          headline,
          { opacity: 0, yPercent: 25 },
          { opacity: 1, yPercent: 0, duration: 1.4, ease: "expo.out", delay: 0.2 }
        );

        const proxy = { time: 0 };
        tl.to(
          proxy,
          {
            time: duration,
            ease: "none",
            duration: 1,
            onUpdate: () => {
              const d = video.duration;
              if (!d || !isFinite(d) || d <= 0) return;
              const t = Math.min(Math.max(proxy.time, 0), d - 0.001);
              if (isFinite(t)) {
                try {
                  video.currentTime = t;
                } catch {
                  /* noop */
                }
              }
            },
          },
          0
        );

        tl.to(
          headline,
          { opacity: 0, yPercent: -10, ease: "power2.in", duration: 0.28 },
          0
        );

        tl.to(
          overlay,
          { opacity: 1, ease: "power2.inOut", duration: 0.22 },
          0.78
        );
      }, section);

      requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    const onLoadedMetadata = () => build();
    if (video.readyState >= 1 && video.duration && isFinite(video.duration)) {
      build();
    } else {
      video.addEventListener("loadedmetadata", onLoadedMetadata, { once: true });
    }

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      io.disconnect();
      window.removeEventListener("resize", onResize);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      data-nav-theme="dark"
      aria-label="Final cinematic"
    >
      <video
        ref={videoRef}
        className={styles.video}
        src="/videos/video3.mp4"
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
      />

      <div className={styles.copy}>
        <span className={styles.eyebrow}>Owala</span>
        <h2 ref={headlineRef} className={styles.headline}>
          <span>Hydration,</span>
          <span>reimagined.</span>
        </h2>
      </div>

      <div ref={overlayRef} className={styles.overlay} aria-hidden="true" />
    </section>
  );
}