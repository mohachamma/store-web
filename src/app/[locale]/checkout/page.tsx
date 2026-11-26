import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CheckoutForm } from "@/components/CheckoutForm";
import { Header } from "@/components/Header";
import type { Locale } from "@/i18n/routing";
import { api } from "@/lib/api";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getTranslations("checkout"))("title"), robots: { index: false } };
}

export default async function CheckoutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [wilayas, rules] = await Promise.all([api.getWilayas(locale), api.getShippingRules()]);
  return (
    <>
      <Header variant="detail" />
      <main>
        <CheckoutForm wilayas={wilayas} rules={rules} />
      </main>
    </>
  );
}
