export const PRODUCT_DETAIL = {
  name: "Owala FreeSip®",
  tagline: "Award-winning. Leak-proof. 24 hours cold.",
  description:
    "Two ways to drink in one bottle. Hold it upright and sip through the built-in straw, or tilt it back to swig from the wide-mouth opening. One push of the button and the lid pops open; push again and it locks tight — leak-proof, always.",
  highlights: [
    {
      title: "FreeSip® Spout",
      body: "Patented dual-mouth design: sip through a built-in straw or swig from the wide opening.",
    },
    {
      title: "24 Hours Cold",
      body: "Triple-layered, vacuum-insulated stainless steel keeps your drink cold all day.",
    },
    {
      title: "Leak-Proof Lock",
      body: "Push-button lid with locking mechanism. Carry loop doubles as a secure lock.",
    },
    {
      title: "Clean by Design",
      body: "Wide-mouth opening fits ice cubes. Lid and straw are dishwasher-safe.",
    },
    {
      title: "Made Safe",
      body: "BPA-, lead-, and phthalate-free. Stainless steel body, Tritan plastic lid.",
    },
    {
      title: "Cup-Holder Friendly",
      body: "Base fits standard car cup holders — built for life on the move.",
    },
  ],
  specs: [
    { label: "Material", value: "Stainless steel (18/8)" },
    { label: "Insulation", value: "Triple-layer vacuum" },
    { label: "Cold Retention", value: "Up to 24 hours" },
    { label: "Lid", value: "Push-button, locking" },
    { label: "Spout", value: "FreeSip® (sip or swig)" },
    { label: "BPA / Lead / Phthalate", value: "Free" },
  ],
  sizes: [
    { label: "24 oz", height: '10.68"', diameter: '3.12"' },
    { label: "32 oz", height: '10.66"', diameter: '3.43"' },
    { label: "40 oz", height: '11.64"', diameter: '3.60"' },
  ],
  disclaimer:
    "Specifications based on publicly available product information. Not for use with hot, carbonated, or perishable liquids.",
} as const;