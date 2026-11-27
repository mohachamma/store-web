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
export type PaymentMethods = S["PaymentMethods"];
export type LoginResult = S["LoginResult"];
export type RegisterResult = S["RegisterResult"];
export type MeProfile = S["MeProfile"];
export type WhyUs = S["WhyUs"];
export type CategoryCard = S["CategoryCard"];
export type NewsletterBlock = S["NewsletterBlock"];
export type FavoriteList = S["FavoriteList"];
export type MyOrder = S["MyOrder"];
export type WomenPage = S["WomenPage"];
export type MenPage = S["MenPage"];
export type CollectionLink = S["CollectionLinks"][number];
export type PageLink = S["PageLinks"][number];
export type InfoPage = S["InfoPage"];
export type StoreInfo = S["StoreInfo"];
export type CatalogFilters = S["CatalogFilters"];
export type OrderQuote = S["OrderQuote"];
export type OrderCreated = S["OrderCreated"];
export type OrderView = S["OrderView"];
export type CreateOrderBody = S["CreateOrderBody"];

/** What the cart sends: only variant ids and quantities — the server prices everything. */
export type QuoteInput = Pick<CreateOrderBody, "items" | "wilayaCode" | "deliveryType" | "discountCode">;

/** API refusals (out of stock, invalid code, …) are results, not exceptions, so the UI can explain them. */
export type Result<T> = { ok: true; value: T } | { ok: false; code: string; message: string };

export type SortKey = "newest" | "price_asc" | "price_desc" | "discount";

export interface ProductQuery {
  q?: string;
  category?: string;
  /** Women\'s (or men\'s) products; unisex ones are included. */
  audience?: "women" | "men";
  size?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: SortKey;
  limit?: number;
  offset?: number;
}

/** What the storefront needs from the data layer. Implemented by `mock.ts` and `real.ts` with identical signatures. */
export interface StoreApi {
  getHome(locale: Locale): Promise<HomeContent>;
  getCollection(slug: string, locale: Locale): Promise<CollectionPage | null>;
  getProduct(slug: string, locale: Locale): Promise<Product | null>;
  listProducts(query: ProductQuery, locale: Locale): Promise<ProductSummary[]>;
  /** Filter options for a search + how many products match (sort / paging are ignored). */
  getFilters(query: ProductQuery, locale: Locale): Promise<CatalogFilters>;
  getRelated(slug: string, locale: Locale): Promise<ProductSummary[]>;
  getSale(locale: Locale): Promise<SalePage>;
  getSite(locale: Locale): Promise<SiteSettings>;
  getWilayas(locale: Locale): Promise<Wilaya[]>;
  getCommunes(wilayaCode: number, locale: Locale): Promise<Commune[]>;
  getShippingRules(): Promise<ShippingRules>;
  getPaymentMethods(): Promise<PaymentMethods>;
  quote(input: QuoteInput): Promise<Result<OrderQuote>>;
  /** `token`: the signed-in customer's access token, so the order shows up in their history. */
  createOrder(body: CreateOrderBody, token?: string | null): Promise<Result<OrderCreated>>;
  getOrder(orderNumber: number, token: string, locale: Locale): Promise<OrderView | null>;
  // Customer accounts (the token is the access token kept in the httpOnly cookie).
  login(email: string, password: string): Promise<Result<LoginResult>>;
  register(input: { email: string; password: string; name?: string }): Promise<Result<RegisterResult>>;
  getCollections(locale: Locale): Promise<CollectionLink[]>;
  getWomenPage(locale: Locale): Promise<WomenPage>;
  getMenPage(locale: Locale): Promise<MenPage>;
  getPages(locale: Locale): Promise<PageLink[]>;
  getPage(slug: string, locale: Locale): Promise<InfoPage | null>;
  getStoreInfo(locale: Locale): Promise<StoreInfo>;
  subscribeNewsletter(email: string): Promise<Result<{ ok: true }>>;
  getMe(token: string): Promise<MeProfile | null>;
  updateMe(token: string, input: { name: string | null; phone: string | null }): Promise<Result<MeProfile>>;
  getMyOrders(token: string): Promise<MyOrder[] | null>;
  getMyFavorites(token: string, locale: Locale): Promise<FavoriteList | null>;
  mergeFavorites(token: string, productIds: string[], locale: Locale): Promise<FavoriteList | null>;
  setFavorite(token: string, productId: string, on: boolean): Promise<void>;
}
