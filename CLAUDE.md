# store-web — Customer storefront of the clothing store

Online clothing store for the Algerian market. The system is split into **three independent repositories**, all in **TypeScript**:

| Repo | Role |
|---|---|
| `store-api` | Server: database, business rules, payments, delivery company |
| `store-web` (this one) | Customer storefront (Next.js) |
| `store-admin` | Admin dashboard (Next.js) |

The owner speaks Arabic — reply to him in Arabic. Code, comments and commit messages in English.

## How the repos are connected
- This app **never touches the database**. It talks only to `store-api` over HTTPS (`NEXT_PUBLIC_API_URL`).
- API types are **generated** from the API's `/openapi.json` (`npm run gen:api`, using `openapi-typescript`). Never hand-write API types.
- **While `store-api` is not ready**, build against a typed mock adapter (`src/lib/api/mock.ts`, same function signatures, sample data) and switch with an env flag (`NEXT_PUBLIC_USE_MOCK=true`). Swap to the real API when the API repo publishes its endpoints.
- Customer login uses Supabase Auth through the API; keep the token in a secure cookie.

## Stack
- **Next.js** (App Router, TypeScript strict), **Tailwind CSS** with logical properties (`ms-`, `me-`, `ps-`, `pe-`) so RTL and LTR both work.
- **next-intl**: `ar` (default, RTL), `fr`, `en`. Routes `/[locale]/...`. No hard-coded UI strings — everything in `messages/{ar,fr,en}.json`.
- Currency **DZD (دج)**, formatted per locale.
- Deploy on **Vercel**, auto-deploy from GitHub `main`. No GitHub Actions needed.

## Design direction (see `docs/design/`)
- `ref-nostra-home.png` — **main reference** for the desktop home page: thin announcement bar, clean header (logo, nav, search, cart, account), full-width hero slider with one CTA, brands row, "why us" 4-feature row, curated category cards (Men / Women / Casual / Best seller), featured products carousel with quick add-to-cart, limited-offer banner, newsletter, footer.
- `ref-mobile-home.jpg`, `ref-mobile-product.jpg` — **mobile reference** (app-like): horizontal scrolling rows per category, bottom tab bar on mobile (Home, Favorites, Cart with badge, Account), product page with large gallery + vertical dots, bottom sheet with name, price, black pill "Add to cart", round size chips (XS–XL), description.
- `ref-shop-home.png` — secondary: filter tabs, "New" / "-50%" badges, color swatches.
- Style: modern, minimal, lots of white space, neutral greys + black, rounded corners, large product photos on light grey. **Mobile-first.**
- Brand is a placeholder: temporary name **"Store"** and a text logo. Keep name, logo and colors in ONE place (`src/config/brand.ts` + CSS variables). Default palette: black `#111111`, white, light greys.

## Features
- Home (sections above), category / collection pages with filters (category, size, color, price) and sort.
- Product page: gallery, sizes, colors, stock per variant, description, related products.
- Search, favorites, persisted cart, language switcher (ar/fr/en).
- Checkout: name, phone, **wilaya (58) + commune**, address, delivery type (home / desk), shipping fee per wilaya from the API.
- Payment: **cash on delivery** (default) and **CIB / Edahabia via Chargily** (redirect to the checkout URL the API returns, then a result page). No Stripe.
- Optional customer account: order history and order status.
- **Legal pages** (write first versions yourself in ar / fr / en): terms, privacy policy (Algerian law 18-07; say honestly that name/phone/address are sent to the delivery company and removed from our DB after confirmation), returns & exchange, shipping & delivery, cash-on-delivery terms, contact. Start each with: "Draft — have it reviewed by a lawyer before launch." Link them from footer and checkout.
- Sample products with placeholder images until the owner gives real content.
- SEO: metadata per locale, `hreflang`, sitemap, Open Graph.

## Build order (commit after each phase)
1. Setup: Next.js + Tailwind + next-intl (RTL), brand config, layout, header, footer, mobile tab bar, mock API adapter, `gen:api` script.
2. Home page (all sections) and shared product card.
3. Category/collection page with filters + product page.
4. Cart, favorites, search.
5. Checkout + cash on delivery + order confirmation page (connect to the real API when ready).
6. Chargily payment flow, customer account.
7. Legal pages, SEO, performance, accessibility, empty/error states.

## Things the owner must do himself (ask step by step)
- Connect this repo to **Vercel** once and set `NEXT_PUBLIC_API_URL`.
- Provide real brand name, logo, products and photos.

## Everything editable (owner's rule)
Any content shown in the storefront must be editable from the dashboard. For every new storefront element: add the field/endpoint in `store-api` (write it under `## Needs from API`), read it from the API here (never hard-code editable text, images, lists or numbers), and make sure `store-admin` gets a screen for it. Static UI chrome (buttons, labels like "Add to cart") stays in `messages/*.json`.

## Rules
- Run `npm run build` and `npm run lint` before every push; fix all errors.
- Small, clear commits on `main` unless the owner asks for branches.
- Keep `## Progress` up to date. If the API is missing something the storefront needs, write it under `## Needs from API` so the owner can pass it to the `store-api` session.

## Progress
- [x] Phase 1 — setup: Next.js 16 + Tailwind 4 + next-intl (ar RTL / fr / en, `src/proxy.ts`), brand config, header, footer, announcement bar, mobile tab bar, mock API adapter (`src/lib/api`), `gen:api` script
- [x] Mobile UI from the owner's reference video (see `docs/design/README.md`): home (hero card, looks + category rows), collection page, product page (vertical gallery, size chips, add-to-cart overlay), cart, favorites, search — on mock data
- [x] Brands strip (auto-scrolling marquee, pause on hover, RTL-aware, reduced-motion safe) and offer banners (dark/light, countdown) on the home page; `/sale` page; "Sale" link in the header; announcement bar text now comes from the API — all driven by data from the dashboard (mock for now)
- [x] **Connected to the real API** (2026-11-26): types are generated (`npm run gen:api` → `src/lib/api/schema.d.ts`, re-exported in `src/lib/api/types.ts`); `real.ts` implements the same `StoreApi` as `mock.ts`. Set `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_USE_MOCK=false` to use it (leave unset to stay on mock data). Pages revalidate every 60 s. Local full stack: `npm run dev:local` in store-api.
- [x] Checkout + cash on delivery (2026-11-26): `/checkout` (name, phone, wilaya + commune, address, home/desk, promo code, server-priced summary), `/order/{number}?t=token` confirmation page (no personal data). Only variant ids and quantities are sent; the API computes every price. Card payment (Chargily) comes later.
- [x] Card payment (2026-11-28): checkout offers CIB / Edahabia when `GET /payments/methods` says `card: true`; the API returns `checkoutUrl` and the customer is redirected to Chargily, then back to `/order/{number}?t=…` which shows the payment status (paid / waiting / failed). Cash on delivery unchanged.
- [x] Customer accounts (2026-11-29): `/account` (sign in / register, profile, order history), session in an httpOnly cookie (`src/lib/session.ts`), favorites copied to the account on sign-in and synced from it on the favorites page, checkout pre-filled and the order linked to the account when signed in. Guests unchanged.
- [x] Home sections (2026-11-29): category cards, "why us" and newsletter on the home page, all from `GET /catalog/home` (`categoryCards`, `whyUs`, `newsletter`) and edited in the dashboard; sign-up via `POST /newsletter`.
- [x] Shop page filters (2026-11-29): `/search` is the shop — category chips, filter panel (size, color, price range), sort, active-filter chips, paging (24 per page); state in the URL, options from `GET /catalog/filters`. Collection pages stay curated (no filters).
- [x] Legal pages + contact (2026-11-30): `/legal/{terms,privacy,returns,shipping,cod}` and `/contact`, text from `GET /catalog/pages/{slug}` / `GET /catalog/store-info` (edited in the dashboard), draft notice while `isDraft`, footer links from `GET /catalog/pages`, consent line with links at checkout. `RichText` renders `## heading`, `- item`, `**bold**` safely.

## Needs from API
(Checkout endpoints `POST /orders/quote`, `POST /orders`, `GET /orders/{n}?token=`, `GET /shipping/wilayas`, `GET /shipping/wilayas/{code}/communes`, `GET /shipping/rules` exist since API 0.3.0.)
Catalog endpoints, all with `?locale=ar|fr|en` returning localized names/descriptions; money as integer DZD.
Shapes the storefront uses today are in `src/lib/api/types.ts` (temporary until generated types exist).
- `GET /catalog/home` → `{ announcement, hero: { title, subtitle, image, collectionSlug }, looks: Look[], rows: { category, products: ProductSummary[] }[] }`
- `GET /catalog/collections/{slug}` → `{ slug, title, heroImage, looks, rows }` (404 if unknown)
- `GET /catalog/products?q=&category=` → `ProductSummary[]` (`id, slug, name, price, compareAtPrice, image{url,alt}, category{slug,name}, isNew`)
- `GET /catalog/products/{slug}` → `Product` = summary + `description, images[], sizes[], variants[{ id, size, color, stock, price, compareAtPrice }]`
- `GET /catalog/products/{slug}/related` → `ProductSummary[]`
- `GET /catalog/site` → `{ announcement: string | null }`
- `GET /catalog/sale` → `{ enabled, title, subtitle, products: ProductSummary[] }` (products having a variant with compare-at price > price)
- `GET /catalog/home` also returns `brands: [{ id, slug, name, logo{url,alt}, href }]`, `brandsStrip: { enabled, animated, speed, pauseOnHover, title }` and `offers: [{ id, label, title, subtitle, ctaLabel, href, image, theme: "dark"|"light", countdownEndsAt }]` (already stored in the DB: `brands`, `offers`, settings `brands_strip` / `sale_page`)
