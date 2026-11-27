import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { AudiencePage } from "@/components/AudiencePage";
import type { ShopParams } from "@/components/ShopView";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/config/site";
import { api } from "@/lib/api";

type Props = { params: Promise<{ locale: Locale }>; searchParams: Promise<ShopParams> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const page = await api.getWomenPage(locale);
  return pageMetadata({ locale, path: "/women", title: page.title, description: page.subtitle, image: page.heroImage?.url });
}

/** The Women's page. Texts and cover come from the dashboard. */
export default async function WomenPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AudiencePage page={await api.getWomenPage(locale)} audience="women" basePath="/women" locale={locale} raw={await searchParams} />;
}
