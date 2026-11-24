/**
 * Real adapter: calls store-api over HTTPS. The catalog endpoints below are
 * the ones requested from the API (see "Needs from API" in CLAUDE.md).
 */
import type { Locale } from "@/i18n/routing";
import type { StoreApi } from "./types";

const BASE = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

async function get<R>(path: string, locale: Locale, params: Record<string, string | undefined> = {}) {
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set("locale", locale);
  for (const [k, v] of Object.entries(params)) if (v) url.searchParams.set(k, v);
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API ${res.status} on ${path}`);
  return (await res.json()) as R;
}

async function must<R>(p: Promise<R | null>): Promise<R> {
  const v = await p;
  if (v === null) throw new Error("Unexpected 404");
  return v;
}

export const realApi: StoreApi = {
  getHome: (locale) => must(get("/catalog/home", locale)),
  getCollection: (slug, locale) => get(`/catalog/collections/${encodeURIComponent(slug)}`, locale),
  getProduct: (slug, locale) => get(`/catalog/products/${encodeURIComponent(slug)}`, locale),
  listProducts: (query, locale) => must(get("/catalog/products", locale, { q: query.q, category: query.category })),
  getRelated: (slug, locale) => must(get(`/catalog/products/${encodeURIComponent(slug)}/related`, locale)),
  getSale: (locale) => must(get("/catalog/sale", locale)),
  getSite: (locale) => must(get("/catalog/site", locale)),
};
