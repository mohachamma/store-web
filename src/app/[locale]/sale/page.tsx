import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/config/site";
import { api } from "@/lib/api";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const sale = await api.getSale(locale);
  return pageMetadata({ locale, path: "/sale", title: sale.title, description: sale.subtitle, image: sale.products[0]?.image.url });
}

/** Sale page: lists products whose price is below their compare-at price. Title/subtitle are edited in the dashboard. */
export default async function SalePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, sale] = await Promise.all([getTranslations("sale"), api.getSale(locale)]);
  if (!sale.enabled) notFound();

  // Biggest discount first.
  const pct = (p: { price: number; compareAtPrice: number | null }) => (p.compareAtPrice ? 1 - p.price / p.compareAtPrice : 0);
  const products = [...sale.products].sort((a, b) => pct(b) - pct(a));

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 pt-6 md:px-6">
        <header className="mb-6 space-y-1">
          <h1 className="font-display text-3xl uppercase tracking-[0.1em] md:text-4xl">{sale.title}</h1>
          {sale.subtitle ? <p className="text-sm text-muted">{sale.subtitle}</p> : null}
          <p className="pt-1 text-[11px] text-muted">{t("count", { count: products.length })}</p>
        </header>
        {products.length === 0 ? (
          <p className="py-20 text-center text-sm text-muted">{t("empty")}</p>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} size="grid" priority={i < 4} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
