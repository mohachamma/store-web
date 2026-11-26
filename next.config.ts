import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

/** "images.shop.dz" (https) or a full origin such as "http://localhost:54321" for local development. */
function imagePatterns(value?: string) {
  if (!value) return [];
  const u = new URL(value.includes("://") ? value : `https://${value}`);
  return [{ protocol: u.protocol.replace(":", "") as "http" | "https", hostname: u.hostname, ...(u.port ? { port: u.port } : {}) }];
}

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
    remotePatterns: imagePatterns(process.env.NEXT_PUBLIC_IMAGE_HOST),
    // Image URLs are immutable (random keys), so optimised copies can be cached for a month.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default createNextIntlPlugin()(nextConfig);
