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
// `SCROLL_DURATION`: how long the glide takes (seconds). Higher = smoother
//   and adds trailing inertia (the page keeps drifting after you stop).
const SCROLL_DURATION = 3.2;
// `SCROLL_DELAY`: how long the page "holds still" (seconds) before it starts
//   moving after you scroll. This is the added scroll delay / lag. Higher =
//   more noticeable lag. Keep it under `SCROLL_DURATION * 0.5` for a good feel.
const SCROLL_DELAY = 1.5;
// The delay expressed as the fraction of the total glide that is held still.
const SCROLL_DELAY_RATIO = Math.min(0.5, SCROLL_DELAY / SCROLL_DURATION);
// Smooth easing: a paused start (the delay) followed by a long, gentle
//   ease-out so the scroll settles softly instead of snapping to a stop.
const easeScroll = (t: number) => {
  const p = Math.max(0, (t - SCROLL_DELAY_RATIO) / (1 - SCROLL_DELAY_RATIO));
  return 1 - Math.pow(1 - p, 3);
};
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