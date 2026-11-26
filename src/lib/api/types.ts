/**
 * API types come from store-api's OpenAPI document (`npm run gen:api` → ./schema.d.ts).
 * Never hand-write API shapes here: re-export the generated ones under friendly names.
 */
import type { Locale } from "@/i18n/routing";
import type { components } from "./schema";

type S = components["schemas"];

export type Image = S["Image"];
export type Category = S["CategoryRef"];
export type Variant = S["Variant"];
export type ProductSummary = S["ProductSummary"];
export type Product = S["Product"];
export type Look = S["Look"];
export type CategoryRow = S["CategoryRow"];
export type Brand = S["Brand"];
export type BrandsStrip = S["BrandsStrip"];
export type Offer = S["Offer"];
export type Hero = S["Hero"];
export type HomeContent = S["Home"];
export type CollectionPage = S["Collection"];
export type SalePage = S["Sale"];
export type SiteSettings = S["Site"];
export type Wilaya = S["Wilaya"];
export type Commune = S["Commune"];
export type ShippingRules = S["ShippingRules"];
export type OrderQuote = S["OrderQuote"];
export type OrderCreated = S["OrderCreated"];
export type OrderView = S["OrderView"];
export type CreateOrderBody = S["CreateOrderBody"];

/** What the cart sends: only variant ids and quantities — the server prices everything. */
export type QuoteInput = Pick<CreateOrderBody, "items" | "wilayaCode" | "deliveryType" | "discountCode">;

/** API refusals (out of stock, invalid code, …) are results, not exceptions, so the UI can explain them. */
export type Result<T> = { ok: true; value: T } | { ok: false; code: string; message: string };

export interface ProductQuery {
  q?: string;
  category?: string;
}

/** What the storefront needs from the data layer. Implemented by `mock.ts` and `real.ts` with identical signatures. */
export interface StoreApi {
  getHome(locale: Locale): Promise<HomeContent>;
  getCollection(slug: string, locale: Locale): Promise<CollectionPage | null>;
  getProduct(slug: string, locale: Locale): Promise<Product | null>;
  listProducts(query: ProductQuery, locale: Locale): Promise<ProductSummary[]>;
  getRelated(slug: string, locale: Locale): Promise<ProductSummary[]>;
  getSale(locale: Locale): Promise<SalePage>;
  getSite(locale: Locale): Promise<SiteSettings>;
  getWilayas(locale: Locale): Promise<Wilaya[]>;
  getCommunes(wilayaCode: number, locale: Locale): Promise<Commune[]>;
  getShippingRules(): Promise<ShippingRules>;
  quote(input: QuoteInput): Promise<Result<OrderQuote>>;
  createOrder(body: CreateOrderBody): Promise<Result<OrderCreated>>;
  getOrder(orderNumber: number, token: string, locale: Locale): Promise<OrderView | null>;
}
