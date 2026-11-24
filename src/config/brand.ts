/**
 * Single source of truth for the brand. Placeholder until the owner provides
 * the real name, logo and colours. Colours are mirrored as CSS variables in
 * `src/app/globals.css` (keep both in sync).
 */
export const brand = {
  name: "Store",
  /** Text wordmark shown in the header (uppercase, wide tracking). */
  wordmark: "STORE",
  /** Short mark used in the mobile tab bar (like an app icon). */
  monogram: "ST",
  colors: {
    ink: "#111111",
    paper: "#ffffff",
    mist: "#f4f4f4",
    line: "#e6e6e6",
    muted: "#8a8a8a",
    accent: "#111111",
  },
  currency: "DZD",
  social: {
    instagram: "",
    facebook: "",
    whatsapp: "",
  },
} as const;
