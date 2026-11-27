import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/Header";
import { SearchField } from "@/components/SearchField";
import { ShopView, type ShopParams } from "@/components/ShopView";
import type { Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: Locale }>; searchParams: Promise<ShopParams> };

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("search");
  return { title: t("title"), robots: { index: false } };
}

/** The shop: search, category, size, color, price and sort — all in the URL, rendered on the server. */
export default async function SearchPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const raw = await searchParams;
  setRequestLocale(locale);
  return (
    <>
      <Header />
      <main className="space-y-4 pt-1">
        <SearchField locale={locale} defaultValue={raw.q?.trim() ?? ""} />
        <ShopView locale={locale} raw={raw} basePath="/search" />
      </main>
    </>
  );
}
