/** Real adapter: calls store-api over HTTPS. Types come from the generated OpenAPI schema. */
import type { Locale } from "@/i18n/routing";
import type { StoreApi } from "./types";

const BASE = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

async function get<R>(path: string, locale: Locale, params: Record<string, string | undefined> = {}, opts: { fresh?: boolean } = {}): Promise<R | null> {
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set("locale", locale);
  for (const [k, v] of Object.entries(params)) if (v) url.searchParams.set(k, v);
  // Pages are cached for a minute; changes made in the dashboard show up shortly after.
  const res = await fetch(url, opts.fresh ? { cache: "no-store" } : { next: { revalidate: 60 } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API ${res.status} on ${path}`);
  return (await res.json()) as R;
}

async function must<R>(p: Promise<R | null>): Promise<R> {
  const v = await p;
  if (v === null) throw new Error("Unexpected 404 from the API");
  return v;
}

async function post<R>(path: string, body: unknown): Promise<{ ok: true; value: R } | { ok: false; code: string; message: string }> {
  const res = await fetch(`${BASE}${path}`, { method: "POST", cache: "no-store", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (res.ok) return { ok: true, value: (await res.json()) as R };
  const err = (await res.json().catch(() => null)) as { error?: { code?: string; message?: string } } | null;
  return { ok: false, code: err?.error?.code ?? `http_${res.status}`, message: err?.error?.message ?? "Request failed" };
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
  getWilayas: (locale) => must(get<Ret<"getWilayas">>("/shipping/wilayas", locale)),
  getCommunes: (code, locale) => must(get<Ret<"getCommunes">>(`/shipping/wilayas/${code}/communes`, locale)),
  getShippingRules: async () => (await get<Ret<"getShippingRules">>("/shipping/rules", "ar")) ?? { freeShippingOver: null },
  getPaymentMethods: async () => (await get<Ret<"getPaymentMethods">>("/payments/methods", "ar")) ?? { cod: true, card: false },
  quote: (input) => post("/orders/quote", input),
  createOrder: (body) => post("/orders", body),
  // An order page must always show the current status: never cached.
  getOrder: (n, token, locale) => get<Ret<"getOrder">>(`/orders/${n}`, locale, { token }, { fresh: true }),
};
