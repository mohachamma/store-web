import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/Header";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export const metadata: Metadata = { robots: { index: false } };

// Placeholder — the real checkout (wilaya/commune, COD, Chargily) is phase 5–6.
export default async function CheckoutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  setRequestLocale((await params).locale);
  const [t, tc, nav] = await Promise.all([getTranslations("common"), getTranslations("cart"), getTranslations("nav")]);
  return (
    <>
      <Header variant="detail" />
      <main className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-20 text-center">
        <h1 className="label text-[12px]">{tc("checkout")}</h1>
        <p className="text-sm text-muted">{t("comingSoon")}</p>
        <Link href="/cart" className="rounded-full border border-ink px-6 py-3 text-xs font-bold uppercase">
          {nav("cart")}
        </Link>
      </main>
    </>
  );
}
