import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { AudiencePage } from "@/components/AudiencePage";
import type { ShopParams } from "@/components/ShopView";
import type { Locale } from "@/i18n/routing";
import { api } from "@/lib/api";

type Props = { params: Promise<{ locale: Locale }>; searchParams: Promise<ShopParams> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await api.getMenPage((await params).locale);
  return { title: page.title, description: page.subtitle ?? undefined };
}

/** The Men's page. Texts and cover come from the dashboard. */
export default async function MenPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AudiencePage page={await api.getMenPage(locale)} audience="men" basePath="/men" locale={locale} raw={await searchParams} />;
}
