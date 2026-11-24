import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FavoritesView } from "@/components/FavoritesView";
import { Header } from "@/components/Header";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("nav");
  return { title: t("favorites"), robots: { index: false } };
}

export default async function FavoritesPage({ params }: { params: Promise<{ locale: Locale }> }) {
  setRequestLocale((await params).locale);
  return (
    <>
      <Header />
      <main>
        <FavoritesView />
      </main>
    </>
  );
}
