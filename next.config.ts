import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    // Placeholder art is SVG; real product photos will come from Supabase Storage.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Uploaded images live on Cloudflare R2: set NEXT_PUBLIC_IMAGE_HOST to its public host (e.g. images.yourstore.dz).
    remotePatterns: process.env.NEXT_PUBLIC_IMAGE_HOST ? [{ protocol: "https", hostname: process.env.NEXT_PUBLIC_IMAGE_HOST }] : [],
    // Image URLs are immutable (random keys), so optimised copies can be cached for a month.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default createNextIntlPlugin()(nextConfig);
