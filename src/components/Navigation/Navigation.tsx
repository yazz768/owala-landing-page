"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type Theme = "light" | "dark";

export default function Navigation() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const NAV_LINE = 60;
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-nav-theme]")
    );
    if (!sections.length) return;

    // initial
    const initial = sections.find((s) => {
      const r = s.getBoundingClientRect();
      return r.top <= NAV_LINE && r.bottom > NAV_LINE;
    });
    if (initial) setTheme((initial.dataset.navTheme as Theme) || "light");

    const triggers = sections.map((sec) => {
      const t = (sec.dataset.navTheme as Theme) || "light";
      return ScrollTrigger.create({
        trigger: sec,
        start: `top ${NAV_LINE}px`,
        end: `bottom ${NAV_LINE}px`,
        onToggle: (self) => {
          if (self.isActive) setTheme(t);
        },
      });
    });

    // one refresh after mount so triggers pick up correct positions
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 200);

    return () => {
      window.clearTimeout(id);
      triggers.forEach((t) => t.kill());
    };
  }, []);

  const isDark = theme === "dark";

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-[6vw] py-6"
      style={{
        color: isDark ? "#ffffff" : "#050505",
        transition: "color 400ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <a
        href="/"
        className="text-xs font-semibold uppercase tracking-[0.35em] no-underline"
        style={{ color: "inherit" }}
      >
        Owala
      </a>
      <button
        type="button"
        aria-label="Open menu"
        className="bg-transparent border-0 p-0 m-0 text-xs font-semibold uppercase tracking-[0.35em] cursor-pointer"
        style={{ color: "inherit" }}
      >
        Menu
      </button>
    </nav>
  );
}