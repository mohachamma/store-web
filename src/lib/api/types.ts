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
}
