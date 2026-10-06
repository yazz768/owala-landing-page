export type Feature = {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  /** Detik frame yang di-seek dari video2.mp4 (untuk still visual). */
  seekTime: number;
  /** object-position untuk meng-crop frame video2 secara berbeda tiap panel. */
  objectPosition: string;
};

export const FEATURES: Feature[] = [
  {
    number: "01",
    eyebrow: "Sip",
    title: "Sip your way.",
    description:
      "Designed for different ways of drinking throughout the day.",
    seekTime: 1.0,
    objectPosition: "50% 20%",
  },
  {
    number: "02",
    eyebrow: "Move",
    title: "Built to move.",
    description: "Made for life outside the kitchen.",
    seekTime: 2.5,
    objectPosition: "50% 50%",
  },
  {
    number: "03",
    eyebrow: "Cold",
    title: "Cold, when it matters.",
    description:
      "Engineered to hold its character through the moments that count.",
    seekTime: 4.0,
    objectPosition: "50% 80%",
  },
  {
    number: "04",
    eyebrow: "Everyday",
    title: "Made for everyday.",
    description: "A quiet companion for the rhythm of daily life.",
    seekTime: 5.5,
    objectPosition: "30% 50%",
  },
];