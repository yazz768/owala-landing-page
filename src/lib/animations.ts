export const HERO_CONFIG = {
  scrollDistanceVh: 400,
  scrub: 1.6,
} as const;

export type HeroConfig = typeof HERO_CONFIG;

export const FEATURE_CONFIG = {
  desktopBreakpoint: "(min-width: 1024px)",
  scrub: 2.2,
  distanceMultiplier: 1.6,
  revealStart: "left 90%",
  revealEnd: "left 40%",
  exitStartProgress: 0.85,
} as const;

export type FeatureConfig = typeof FEATURE_CONFIG;

export const FINAL_CONFIG = {
  scrollDistanceVh: 260,
  scrub: 1.6,
} as const;

export type FinalConfig = typeof FINAL_CONFIG;