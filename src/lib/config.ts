export const PRODUCT = {
  name: "Owala",
  /** Ganti dengan harga asli bila sudah tersedia. Sementara placeholder. */
  price: "PRICE",
  currency: "USD",
  /** Ganti dengan URL halaman produk / toko. */
  buyUrl: "#",
  buyLabel: "Buy now",
  secondaryLabel: "Explore details",
  secondaryUrl: "#",
} as const;

export const FINAL_STATEMENT = {
  lines: ["Move.", "Drink.", "Repeat."] as const,
  supporting:
    "A bottle designed to move with your everyday life.",
} as const;

export const BUY_COPY = {
  headline: "Make it yours.",
  supporting: "Designed for everyday movement.",
} as const;

export const FOOTER = {
  brand: "Owala",
  tagline: "Hydration, reimagined.",
  links: [
    { label: "Shop", href: "#" },
    { label: "About", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Instagram", href: "#" },
  ] as const,
  copyright: "© 2026 Owala Experience",
} as const;