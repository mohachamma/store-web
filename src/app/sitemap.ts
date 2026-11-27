import type { MetadataRoute } from "next";
import { absoluteUrl, alternatesFor } from "@/config/site";
import { routing } from "@/i18n/routing";
import { api } from "@/lib/api";

// Rebuilt at most once an hour from the live catalog: new products, collections and pages appear by themselves.
export const revalidate = 3600;

async function allProductSlugs(): Promise<string[]> {
  const slugs: string[] = [];
  for (let offset = 0; offset < 5000; offset += 100) {
    const page = await api.listProducts({ limit: 100, offset }, "ar");
    slugs.push(...page.map((p) => p.slug));
    if (page.length < 100) break;
  }
  return slugs;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const loc = routing.defaultLocale;
  const safe = async <T,>(p: Promise<T>, fallback: T) => p.catch(() => fallback);
  const [women, men, collections, pages, products] = await Promise.all([
    safe(api.getWomenPage(loc), null),
    safe(api.getMenPage(loc), null),
    safe(api.getCollections(loc), []),
    safe(api.getPages(loc), []),
    safe(allProductSlugs(), []),
  ]);

  const paths: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" }[] = [
    { path: "", priority: 1, changeFrequency: "daily" },
    ...(women?.enabled ? [{ path: "/women", priority: 0.9, changeFrequency: "daily" as const }] : []),
    ...(men?.enabled ? [{ path: "/men", priority: 0.9, changeFrequency: "daily" as const }] : []),
    { path: "/sale", priority: 0.8, changeFrequency: "daily" },
    ...collections.map((c) => ({ path: `/collections/${c.slug}`, priority: 0.8, changeFrequency: "weekly" as const })),
    ...products.map((slug) => ({ path: `/products/${slug}`, priority: 0.7, changeFrequency: "weekly" as const })),
    { path: "/contact", priority: 0.4, changeFrequency: "monthly" },
    ...pages.map((p) => ({ path: `/legal/${p.slug}`, priority: 0.3, changeFrequency: "monthly" as const })),
  ];

  // One entry per language, each pointing to its translations (hreflang).
  return paths.flatMap(({ path, priority, changeFrequency }) =>
    routing.locales.map((locale) => ({
      url: absoluteUrl(`/${locale}${path}`),
      changeFrequency,
      priority,
      alternates: { languages: Object.fromEntries(Object.entries(alternatesFor(path, locale).languages ?? {}).map(([l, href]) => [l, absoluteUrl(String(href))])) },
    })),
  );
}
