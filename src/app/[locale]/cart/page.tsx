import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CartView } from "@/components/CartView";
import { Header } from "@/components/Header";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("nav");
  return { title: t("cart"), robots: { index: false } };
}

export default async function CartPage({ params }: { params: Promise<{ locale: Locale }> }) {
  setRequestLocale((await params).locale);
  return (
    <>
      <Header />
      <main>
        <CartView />
      </main>
    </>
  );
}
