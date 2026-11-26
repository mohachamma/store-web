import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/Header";
import { Link } from "@/i18n/navigation";
import { ProductCard } from "@/components/ProductCard";
import { SearchField } from "@/components/SearchField";
import { ShopFilters } from "@/components/ShopFilters";
import type { Locale } from "@/i18n/routing";
import { api } from "@/lib/api";
import type { ProductQuery, SortKey } from "@/lib/api/types";

const PAGE_SIZE = 24;
const SORTS: SortKey[] = ["newest", "price_asc", "price_desc", "discount"];

type Raw = { q?: string; category?: string; size?: string; color?: string; minPrice?: string; maxPrice?: string; sort?: string; page?: string };
type Props = { params: Promise<{ locale: Locale }>; searchParams: Promise<Raw> };

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("search");
  return { title: t("title"), robots: { index: false } };
}

const int = (v?: string) => (v && /^\d{1,9}$/.test(v) ? Number(v) : undefined);

/** The shop: search, category, size, color, price and sort — all in the URL, rendered on the server. */
export default async function SearchPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const raw = await searchParams;
  setRequestLocale(locale);

  const sort = SORTS.includes(raw.sort as SortKey) ? (raw.sort as SortKey) : "newest";
  const page = Math.max(1, int(raw.page) ?? 1);
  const query: ProductQuery = { q: raw.q?.trim() || undefined, category: raw.category || undefined, size: raw.size || undefined, color: raw.color || undefined, minPrice: int(raw.minPrice), maxPrice: int(raw.maxPrice) };

  const [t, results, filters] = await Promise.all([
    getTranslations("search"),
    api.listProducts({ ...query, sort, limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE }, locale),
    api.getFilters(query, locale),
  ]);
  const pages = Math.max(1, Math.ceil(filters.total / PAGE_SIZE));
  const heading = query.category ? (filters.categories.find((c) => c.slug === query.category)?.name ?? t("title")) : t("title");

  const href = (p: number) => {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...raw, page: p > 1 ? String(p) : undefined })) if (v) sp.set(k, v);
    return `/search?${sp.toString()}`;
  };

  return (
    <>
      <Header />
      <main className="space-y-4 pt-1">
        <SearchField locale={locale} defaultValue={query.q ?? ""} />
        <div className="mx-auto max-w-6xl space-y-4 px-4 md:px-6">
          <div className="flex items-baseline justify-between pt-2">
            <h1 className="label text-[12px]">{heading}</h1>
            <p className="text-[11px] text-muted" aria-live="polite">{t("results", { count: filters.total })}</p>
          </div>
          <ShopFilters filters={filters} state={{ ...query, sort }} />
          {results.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted">{filters.total === 0 && (query.size || query.color || query.minPrice !== undefined || query.maxPrice !== undefined) ? t("noMatch") : t("hint")}</p>
          ) : (
            <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {results.map((p, i) => (
                <ProductCard key={p.id} product={p} size="grid" priority={i < 4} />
              ))}
            </div>
          )}
          {pages > 1 ? (
            <nav className="flex items-center justify-center gap-4 py-6 text-xs font-semibold" aria-label={t("pagination")}>
              {page > 1 ? <Link href={href(page - 1)} className="rounded-full border border-ink px-5 py-2.5">{t("previous")}</Link> : <span className="w-24" />}
              <span className="text-muted">{t("page", { page, pages })}</span>
              {page < pages ? <Link href={href(page + 1)} className="rounded-full border border-ink px-5 py-2.5">{t("next")}</Link> : <span className="w-24" />}
            </nav>
          ) : null}
        </div>
      </main>
    </>
  );
}
