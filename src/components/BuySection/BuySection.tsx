"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./BuySection.module.css";
import { PRODUCT, BUY_COPY } from "@/lib/config";
import { prefersReducedMotion } from "@/lib/motion";
import ProductDetailModal from "@/components/Modal/ProductDetailModal";
import BuyModal from "@/components/Modal/BuyModal";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export default function BuySection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [buyOpen, setBuyOpen] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section) return;

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

    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      if (reduced) return;
      gsap.from("[data-buy-reveal]", {
        opacity: 0,
        y: 40,
        duration: 1.05,
        ease: "expo.out",
        stagger: 0.14,
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      });
    }, section);

    return () => {
      if (io && video) io.unobserve(video);
      ctx.revert();
    };
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className={styles.section}
        data-nav-theme="light"
        aria-label="Buy Owala"
      >
        <div className={styles.inner}>
          <span className={styles.eyebrow} data-buy-reveal>
            {PRODUCT.name}
          </span>

          <div className={styles.visual} data-buy-reveal>
            <video
              ref={videoRef}
              className={styles.video}
              src="/videos/video1.mp4"
              muted
              playsInline
              preload="metadata"
              aria-hidden="true"
              tabIndex={-1}
            />
          </div>

          <h2 className={styles.headline} data-buy-reveal>
            {BUY_COPY.headline}
          </h2>

          <p className={styles.sub} data-buy-reveal>
            {BUY_COPY.supporting}
          </p>

          <div className={styles.price} data-buy-reveal>
            {PRODUCT.currency === "USD" ? `$${PRODUCT.price}` : PRODUCT.price}
          </div>

          <div className={styles.actions} data-buy-reveal>
            <button
              type="button"
              className={styles.primaryCta}
              onClick={() => setBuyOpen(true)}
            >
              <span>{PRODUCT.buyLabel}</span>
              <span className={styles.arrow} aria-hidden="true">
                →
              </span>
            </button>
            <button
              type="button"
              className={styles.secondaryCta}
              onClick={() => setDetailOpen(true)}
            >
              {PRODUCT.secondaryLabel}
            </button>
          </div>
        </div>
      </section>

      <ProductDetailModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
      <BuyModal open={buyOpen} onClose={() => setBuyOpen(false)} />
    </>
  );
}