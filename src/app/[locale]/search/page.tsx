import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { SearchField } from "@/components/SearchField";
import type { Locale } from "@/i18n/routing";
import { api } from "@/lib/api";

type Props = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ q?: string; category?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("search");
  return { title: t("title"), robots: { index: false } };
}

export default async function SearchPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { q = "", category } = await searchParams;
  setRequestLocale(locale);
  const [t, results] = await Promise.all([getTranslations("search"), api.listProducts({ q, category }, locale)]);
  const heading = category ? results[0]?.category.name ?? t("title") : t("title");

  return (
    <>
      <Header />
      <main className="space-y-4 pt-1">
        <SearchField locale={locale} defaultValue={q} />
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="flex items-baseline justify-between py-2">
            <h1 className="label text-[12px]">{heading}</h1>
            <p className="text-[11px] text-muted">{t("results", { count: results.length })}</p>
          </div>
          {results.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted">{t("hint")}</p>
          ) : (
            <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {results.map((p, i) => (
                <ProductCard key={p.id} product={p} size="grid" priority={i < 4} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
