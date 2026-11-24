/**
 * TEMPORARY domain types for the mock adapter.
 *
 * The real API (store-api) has not published catalog endpoints yet. When it
 * does, run `npm run gen:api` and replace these with aliases to the generated
 * types in `./schema.d.ts` (e.g. `components["schemas"]["Product"]`).
 * The shapes below are what the storefront needs — they are listed under
 * "Needs from API" in CLAUDE.md so the API session can match them.
 */
import type { Locale } from "@/i18n/routing";

export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "39" | "40" | "41" | "42" | "43" | "44";

export interface Image {
  url: string;
  alt: string;
}

export interface Category {
  slug: string;
  name: string;
}

export interface Variant {
  id: string;
  size: Size;
  color: string;
  stock: number;
  /** Integer DZD. */
  price: number;
  compareAtPrice: number | null;
}

export interface ProductSummary {
  id: string;
  slug: string;
  name: string;
  /** Lowest variant price, integer DZD. */
  price: number;
  compareAtPrice: number | null;
  image: Image;
  category: Category;
  isNew: boolean;
}

export interface Product extends ProductSummary {
  description: string;
  images: Image[];
  variants: Variant[];
  sizes: Size[];
}

export interface Look {
  id: string;
  image: Image;
  productSlugs: string[];
}

export interface CategoryRow {
  category: Category;
  products: ProductSummary[];
}

export interface HomeContent {
  announcement: string | null;
  hero: { title: string; subtitle: string; image: Image; collectionSlug: string };
  looks: Look[];
  rows: CategoryRow[];
}

export interface CollectionPage {
  slug: string;
  title: string;
  heroImage: Image;
  looks: Look[];
  rows: CategoryRow[];
}

export interface ProductQuery {
  q?: string;
  category?: string;
}

/** Function signatures shared by the mock and the real adapter. */
export interface StoreApi {
  getHome(locale: Locale): Promise<HomeContent>;
  getCollection(slug: string, locale: Locale): Promise<CollectionPage | null>;
  getProduct(slug: string, locale: Locale): Promise<Product | null>;
  listProducts(query: ProductQuery, locale: Locale): Promise<ProductSummary[]>;
  getRelated(slug: string, locale: Locale): Promise<ProductSummary[]>;
}
