"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./BlackProductStory.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function BlackProductStory() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      tl.from("[data-bps-eyebrow]", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "expo.out",
      })
        .from(
          "[data-bps-title] > span",
          {
            opacity: 0,
            y: 60,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.12,
          },
          "-=0.4"
        )
        .from(
          "[data-bps-sub]",
          { opacity: 0, y: 24, duration: 0.9, ease: "power3.out" },
          "-=0.7"
        );

      gsap.fromTo(
        "[data-bps-video-wrap]",
        { scale: 0.94, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "[data-bps-video-wrap]",
            start: "top 92%",
            end: "top 45%",
            scrub: 1,
          },
        }
      );
    }, section);

    // Controlled video2 playback: play when in view, pause when out. No loop.
    let io: IntersectionObserver | null = null;
    if (video) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.intersectionRatio >= 0.4) {
              if (video.ended) video.currentTime = 0;
              video.play().catch(() => {});
            } else {
              video.pause();
            }
          });
        },
        { threshold: [0, 0.4, 0.75] }
      );
      io.observe(video);
    }

    return () => {
      ctx.revert();
      if (io && video) io.unobserve(video);
    };
  }, []);

  return (
    <section
    ref={sectionRef}
    className={styles.section}
    aria-label="More than a bottle"
    data-nav-theme="dark"
    >
      <div className={styles.inner}>
        <span data-bps-eyebrow className={styles.eyebrow}>
          Owala
        </span>

        <h2 data-bps-title className={styles.title}>
          <span>More than</span>
          <span>a bottle.</span>
        </h2>

        <div data-bps-video-wrap className={styles.videoWrap}>
          <video
            ref={videoRef}
            className={styles.video}
            src="/videos/video2.mp4"
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
            tabIndex={-1}
          />
        </div>

        <p data-bps-sub className={styles.sub}>
          Designed around how you move.
        </p>
      </div>
    </section>
  );
}