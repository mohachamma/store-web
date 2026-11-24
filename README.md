# store-web

Customer storefront — Next.js 16 (App Router), Tailwind CSS 4, next-intl (`ar` default RTL, `fr`, `en`).

```bash
cp .env.example .env.local
npm install
npm run dev        # http://localhost:3000 → redirects to /ar
```

| Script | |
|---|---|
| `npm run build` / `npm run lint` | Run both before every push |
| `npm run gen:api` | Regenerate `src/lib/api/schema.d.ts` from `${NEXT_PUBLIC_API_URL}/openapi.json` (or `OPENAPI_URL=…`) |
| `npm run gen:placeholders` | Regenerate the sample product SVGs in `public/placeholders/` |

- Brand (name, wordmark, colours): `src/config/brand.ts` + CSS variables in `src/app/globals.css`.
- Data: `src/lib/api` — `mock.ts` (sample data) or `real.ts` (store-api), chosen by `NEXT_PUBLIC_USE_MOCK` / `NEXT_PUBLIC_API_URL`.
- Design notes: `docs/design/README.md`.
