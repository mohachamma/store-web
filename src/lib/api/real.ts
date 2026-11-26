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

async function send<R>(method: string, path: string, body: unknown, token?: string | null): Promise<{ ok: true; value: R } | { ok: false; code: string; message: string }> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { method, cache: "no-store", headers, body: body === undefined ? undefined : JSON.stringify(body) });
  if (res.ok) return { ok: true, value: (await res.json()) as R };
  const err = (await res.json().catch(() => null)) as { error?: { code?: string; message?: string } } | null;
  return { ok: false, code: err?.error?.code ?? `http_${res.status}`, message: err?.error?.message ?? "Request failed" };
}

const post = <R>(path: string, body: unknown, token?: string | null) => send<R>("POST", path, body, token);

/** Signed-in GET: always fresh; null when the token is not (or no longer) valid. */
async function getAuthed<R>(path: string, token: string, params: Record<string, string> = {}): Promise<R | null> {
  const url = new URL(`${BASE}${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url, { cache: "no-store", headers: { Authorization: `Bearer ${token}` } });
  if (res.status === 401) return null;
  if (!res.ok) throw new Error(`API ${res.status} on ${path}`);
  return (await res.json()) as R;
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
  createOrder: (body, token) => post("/orders", body, token),
  // An order page must always show the current status: never cached.
  getOrder: (n, token, locale) => get<Ret<"getOrder">>(`/orders/${n}`, locale, { token }, { fresh: true }),
  subscribeNewsletter: (email) => post("/newsletter", { email }),
  login: (email, password) => post("/auth/login", { email, password }),
  register: (input) => post("/auth/register", input),
  getMe: (token) => getAuthed<Ret<"getMe">>("/me", token) as Promise<Ret<"getMe">>,
  updateMe: async (token, input) => send("PUT", "/me", input, token),
  getMyOrders: (token) => getAuthed<Ret<"getMyOrders">>("/me/orders", token) as Promise<Ret<"getMyOrders">>,
  getMyFavorites: (token, locale) => getAuthed<Ret<"getMyFavorites">>("/me/favorites", token, { locale }) as Promise<Ret<"getMyFavorites">>,
  mergeFavorites: async (token, productIds, locale) => {
    const r = await send<Ret<"mergeFavorites">>("POST", `/me/favorites/merge?locale=${locale}`, { productIds }, token);
    return r.ok ? r.value : null;
  },
  setFavorite: async (token, productId, on) => void (await send(on ? "PUT" : "DELETE", `/me/favorites/${productId}`, undefined, token)),
};
