import { getTranslations, setRequestLocale } from "next-intl/server";
import { BrandsMarquee } from "@/components/BrandsMarquee";
import { Header } from "@/components/Header";
import { HeroCard } from "@/components/HeroCard";
import { LookCard } from "@/components/LookCard";
import { OfferBanner } from "@/components/OfferBanner";
import { ProductCard } from "@/components/ProductCard";
import { Row } from "@/components/Row";
import { SearchField } from "@/components/SearchField";
import type { Locale } from "@/i18n/routing";
import { api } from "@/lib/api";

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, home] = await Promise.all([getTranslations("home"), api.getHome(locale)]);

  return (
    <>
      <Header />
      <main className="space-y-3 pt-1">
        <SearchField locale={locale} />
        <div className="pt-2">
          <HeroCard hero={home.hero} cta={t("shopNow")} />
        </div>
        <BrandsMarquee brands={home.brands} strip={home.brandsStrip} />
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
      </main>
    </>
  );
}
