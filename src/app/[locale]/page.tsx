import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BrandsMarquee } from "@/components/BrandsMarquee";
import { CategoryCards } from "@/components/CategoryCards";
import { Header } from "@/components/Header";
import { HeroCard } from "@/components/HeroCard";
import { LookCard } from "@/components/LookCard";
import { NewsletterBlock } from "@/components/NewsletterBlock";
import { OfferBanner } from "@/components/OfferBanner";
import { ProductCard } from "@/components/ProductCard";
import { Row } from "@/components/Row";
import { SearchField } from "@/components/SearchField";
import { WhyUs } from "@/components/WhyUs";
import type { Locale } from "@/i18n/routing";
import { JsonLd } from "@/components/JsonLd";
import { brand } from "@/config/brand";
import { absoluteUrl, pageMetadata } from "@/config/site";
import { api } from "@/lib/api";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const [t, home, info] = await Promise.all([getTranslations({ locale, namespace: "meta" }), api.getHome(locale), api.getStoreInfo(locale).catch(() => null)]);
  // Title and description are edited in the dashboard (Pages & contact); the translated defaults apply until then.
  return pageMetadata({ locale, path: "", title: info?.siteTitle || t("title"), description: info?.siteDescription || t("description"), image: home.hero?.image.url, absoluteTitle: true });
}

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, home, info] = await Promise.all([getTranslations("home"), api.getHome(locale), api.getStoreInfo(locale).catch(() => null)]);
  // The shop itself, for search engines: name, address, contact (all edited in the dashboard) and the search box.
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: brand.name,
      url: absoluteUrl(`/${locale}`),
      ...(info?.phone || info?.email ? { contactPoint: { "@type": "ContactPoint", contactType: "customer service", telephone: info.phone ?? undefined, email: info.email ?? undefined, availableLanguage: ["ar", "fr", "en"] } } : {}),
      ...(info?.address ? { address: { "@type": "PostalAddress", streetAddress: info.address, addressCountry: "DZ" } } : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: brand.name,
      url: absoluteUrl(`/${locale}`),
      inLanguage: locale,
      potentialAction: { "@type": "SearchAction", target: { "@type": "EntryPoint", urlTemplate: absoluteUrl(`/${locale}/search?q={search_term_string}`) }, "query-input": "required name=search_term_string" },
    },
  ];

  return (
    <>
      <JsonLd data={ld} />
      <Header />
      <main className="space-y-3 pt-1">
        <SearchField locale={locale} />
        {home.hero ? (
          <div className="pt-2">
            <HeroCard hero={home.hero} cta={t("shopNow")} />
          </div>
        ) : null}
        <BrandsMarquee brands={home.brands} strip={home.brandsStrip} />
        <CategoryCards cards={home.categoryCards} />
        {home.rows.slice(0, 1).map((row) => (
          <Row key={row.category.slug} title={row.category.name} href={`/search?category=${row.category.slug}`} viewAll={t("viewAll")}>
            {row.products.map((p, i) => (
              <ProductCard key={p.id} product={p} priority={i < 2} />
            ))}
          </Row>
        ))}
        <Row title={t("looks")}>
          {home.looks.map((look) => (
            <LookCard key={look.id} look={look} />
          ))}
        </Row>
        {home.rows.slice(1).map((row) => (
          <Row key={row.category.slug} title={row.category.name} href={`/search?category=${row.category.slug}`} viewAll={t("viewAll")}>
            {row.products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </Row>
        ))}
        {home.offers.map((offer) => (
          <OfferBanner key={offer.id} offer={offer} />
        ))}
        {home.whyUs ? <WhyUs data={home.whyUs} /> : null}
        {home.newsletter ? <NewsletterBlock data={home.newsletter} /> : null}
      </main>
    </>
  );
}
