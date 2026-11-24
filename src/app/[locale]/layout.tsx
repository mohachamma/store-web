import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic, Jost, Oswald } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Footer } from "@/components/Footer";
import { MobileTabBar } from "@/components/MobileTabBar";
import { brand } from "@/config/brand";
import { dirOf, routing } from "@/i18n/routing";
import { api } from "@/lib/api";

const latin = Jost({ subsets: ["latin"], variable: "--font-latin", display: "swap" });
const wordmark = Oswald({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-wordmark", display: "swap" });
const arabic = IBM_Plex_Sans_Arabic({ subsets: ["arabic"], weight: ["400", "500", "600", "700"], variable: "--font-arabic", display: "swap" });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: brand.colors.paper,
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: { default: t("title"), template: `%s · ${brand.name}` },
    description: t("description"),
  };
}

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const site = await api.getSite(locale);

  return (
    <html lang={locale} dir={dirOf(locale)} className={`${latin.variable} ${wordmark.variable} ${arabic.variable}`}>
      <body className="min-h-svh pb-safe-tabbar md:pb-0">
        <NextIntlClientProvider>
          <AnnouncementBar text={site.announcement} />
          {children}
          <Footer />
          <MobileTabBar />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
