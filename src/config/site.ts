import type { Metadata } from "next";
import { brand } from "@/config/brand";
import { routing, type Locale } from "@/i18n/routing";

/**
 * Public address of the storefront, used for canonical links, hreflang, the sitemap and social cards.
 * Set `NEXT_PUBLIC_SITE_URL` (e.g. https://www.yourstore.dz) once the domain is connected; until then Vercel's own
 * address (or localhost) is used.
 */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "").replace(/\/$/, "")}`;
  return "http://localhost:3000";
}

/** Absolute URL for a path ("/ar/women") or an image that may already be absolute. */
export const absoluteUrl = (path: string) => (/^https?:\/\//.test(path) ? path : `${siteUrl()}${path.startsWith("/") ? path : `/${path}`}`);

const OG_LOCALE: Record<Locale, string> = { ar: "ar_DZ", fr: "fr_DZ", en: "en_US" };

/** hreflang links: the same page in every language, plus x-default (the Arabic default). `path` has no locale ("/women", "" for home). */
export function alternatesFor(path: string, locale: Locale): NonNullable<Metadata["alternates"]> {
  const url = (l: Locale) => `/${l}${path}`;
  return {
    canonical: url(locale),
    languages: { ...Object.fromEntries(routing.locales.map((l) => [l, url(l)])), "x-default": url(routing.defaultLocale) },
  };
}

/** Title, description, canonical + hreflang, Open Graph and Twitter card for one page. Everything comes from the page's own data. */
export function pageMetadata(opts: { locale: Locale; path: string; title: string; description?: string | null; image?: string | null; type?: "website" | "article"; absoluteTitle?: boolean }): Metadata {
  const { locale, path, title, image } = opts;
  const description = opts.description?.trim().slice(0, 300) || undefined;
  const images = image ? [{ url: absoluteUrl(image) }] : undefined;
  return {
    title: opts.absoluteTitle ? { absolute: title } : title,
    description,
    alternates: alternatesFor(path, locale),
    openGraph: {
      title,
      description,
      url: `/${locale}${path}`,
      siteName: brand.name,
      locale: OG_LOCALE[locale],
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      type: opts.type ?? "website",
      images,
    },
    twitter: { card: images ? "summary_large_image" : "summary", title, description, images: images?.map((i) => i.url) },
  };
}
