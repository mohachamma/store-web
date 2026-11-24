# Design references

Put reference images here (`ref-nostra-home.png`, `ref-mobile-home.jpg`, `ref-mobile-product.jpg`, `ref-shop-home.png`).

## Mobile app video (owner, Nov 2026) — implemented in phase 1
A screen recording of a minimal fashion app concept. We follow its **layout and interaction patterns only**
(no brand name, logo, photos or copy from it):

| Screen | What we took | Where |
|---|---|---|
| Home | Wide-tracked text wordmark centred, rounded grey search field, rounded hero card with collection title, titled horizontal rows (outerwear, looks, footwear, bottoms), small bold uppercase product names + grey price | `src/app/[locale]/page.tsx` |
| Collection | Full-bleed hero with title + back + share, "looks" cards overlapping the hero, then category rows | `src/app/[locale]/collections/[slug]/page.tsx` |
| Product | Back · wordmark · bag header, vertical snap gallery with vertical dots, rounded bottom sheet: name, price, black pill "Add to cart", round size chips, description | `src/app/[locale]/products/[slug]/page.tsx` |
| Added to cart | Dimmed overlay with a white card: thumbnail, name, size, price | `src/components/BuyPanel.tsx` |
| Cart | "Shopping cart (n)" list, image + name + size + price, subtotal and black "Checkout" pill pinned above the tab bar | `src/components/CartView.tsx` |
| Tab bar | Monogram (home), favorites, cart with badge, account | `src/components/MobileTabBar.tsx` |

Tokens: ink `#111111`, paper `#ffffff`, mist `#f4f4f4`, line `#e8e8e8`, muted `#8a8a8a`, card radius 20px, pill buttons.
Fonts: Jost (Latin), IBM Plex Sans Arabic (Arabic), Oswald (wordmark/display).
