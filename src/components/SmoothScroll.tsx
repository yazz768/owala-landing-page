"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SCROLL_KEY = "__owala_scroll_y__";

// ----- Scroll feel tuning ---------------------------------------------------
const SCROLL_DURATION = 1.1;
const easeScroll = (t: number) => 1 - Math.pow(1 - t, 3);
// ---------------------------------------------------------------------------

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const lenis = new Lenis({
      duration: SCROLL_DURATION,
      easing: easeScroll,
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.2,
    });

    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    const saved = sessionStorage.getItem(SCROLL_KEY);
    if (saved) {
      const y = parseInt(saved, 10);
      if (Number.isFinite(y) && y > 0) {
        requestAnimationFrame(() => lenis.scrollTo(y, { immediate: true }));
      }
    }

    let saveRaf: number | null = null;
    const onScroll = () => {
      if (saveRaf !== null) return;
      saveRaf = window.requestAnimationFrame(() => {
        saveRaf = null;
        sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
      });
    };
    lenis.on("scroll", onScroll);

    const onLenisScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onLenisScroll);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 300);

    return () => {
      window.clearTimeout(refreshId);
      if (saveRaf !== null) window.cancelAnimationFrame(saveRaf);
      lenis.off("scroll", onScroll);
      lenis.off("scroll", onLenisScroll);
      gsap.ticker.remove(raf);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return <>{children}</>;
}
