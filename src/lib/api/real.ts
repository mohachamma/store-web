/** Real adapter: calls store-api over HTTPS. Types come from the generated OpenAPI schema. */
import type { Locale } from "@/i18n/routing";
import type { StoreApi } from "./types";

const BASE = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

async function get<R>(path: string, locale: Locale, params: Record<string, string | undefined> = {}): Promise<R | null> {
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set("locale", locale);
  for (const [k, v] of Object.entries(params)) if (v) url.searchParams.set(k, v);
  // Pages are cached for a minute; changes made in the dashboard show up shortly after.
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API ${res.status} on ${path}`);
  return (await res.json()) as R;
}

async function must<R>(p: Promise<R | null>): Promise<R> {
  const v = await p;
  if (v === null) throw new Error("Unexpected 404 from the API");
  return v;
}

type Ret<K extends keyof StoreApi> = Awaited<ReturnType<StoreApi[K]>>;

export const realApi: StoreApi = {
  getHome: (locale) => must(get<Ret<"getHome">>("/catalog/home", locale)),
  getCollection: (slug, locale) => get<Ret<"getCollection">>(`/catalog/collections/${encodeURIComponent(slug)}`, locale),
  getProduct: (slug, locale) => get<Ret<"getProduct">>(`/catalog/products/${encodeURIComponent(slug)}`, locale),
  listProducts: (query, locale) => must(get<Ret<"listProducts">>("/catalog/products", locale, { q: query.q, category: query.category })),
  getRelated: (slug, locale) => must(get<Ret<"getRelated">>(`/catalog/products/${encodeURIComponent(slug)}/related`, locale)),
  getSale: (locale) => must(get<Ret<"getSale">>("/catalog/sale", locale)),
  getSite: (locale) => must(get<Ret<"getSite">>("/catalog/site", locale)),
};
