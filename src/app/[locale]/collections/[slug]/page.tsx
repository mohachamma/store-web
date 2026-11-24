import type { Metadata } from "next";
import Image from "next/image";
import { ViewTransition } from "react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BackLink } from "@/components/BackLink";
import { LookCard } from "@/components/LookCard";
import { ProductCard } from "@/components/ProductCard";
import { Row } from "@/components/Row";
import { ShareButton } from "@/components/ShareButton";
import { routing, type Locale } from "@/i18n/routing";
import { api } from "@/lib/api";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

// Pre-render so the hero morph (home card → collection header) has a ready destination.
export async function generateStaticParams() {
  const perLocale = await Promise.all(
    routing.locales.map(async (locale) => [{ locale, slug: (await api.getHome(locale)).hero.collectionSlug }]),
  );
  return perLocale.flat();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const c = await api.getCollection(slug, locale);
  return c ? { title: c.title } : {};
}

export default async function CollectionPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const [t, tn, nav, collection] = await Promise.all([
    getTranslations("collection"),
    getTranslations("home"),
    getTranslations("nav"),
    api.getCollection(slug, locale),
  ]);
  if (!collection) notFound();

  return (
    <main>
      {/* Full-bleed hero with title, back and share — looks overlap its bottom edge. */}
      <div className="relative h-[52svh] min-h-80 overflow-hidden bg-mist md:h-[60vh]">
        <ViewTransition name="collection-hero" share="morph" default="none">
          <Image src={collection.heroImage.url} alt={collection.heroImage.alt} fill priority sizes="100vw" className="object-cover" />
        </ViewTransition>
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/10" />
        <div className="relative mx-auto grid max-w-6xl grid-cols-[auto_1fr_auto] items-center px-2 pt-2 text-paper md:px-6">
          <div className="text-paper [&_button:hover]:bg-white/15">
            <BackLink label={nav("home")} />
          </div>
          <ViewTransition name="collection-title" share="morph" default="none">
            <h1 className="label text-center text-[12px]">{collection.title}</h1>
          </ViewTransition>
          <ShareButton label={t("share")} copied={t("copied")} title={collection.title} />
        </div>
      </div>

      {/* Own named layer: stays in front of the morphing hero and slides in from the right. */}
      <div className="relative z-10 -mt-36 md:-mt-44" style={{ viewTransitionName: "collection-looks" }}>
        <Row title={t("looks")} titleClassName="text-paper drop-shadow-[0_1px_6px_rgba(0,0,0,.45)]">
          {collection.looks.map((look, i) => (
            <LookCard key={look.id} look={look} priority={i < 2} />
          ))}
        </Row>
      </div>

      {collection.rows.map((row) => (
        <Row key={row.category.slug} title={row.category.name} href={`/search?category=${row.category.slug}`} viewAll={tn("viewAll")}>
          {row.products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </Row>
      ))}
    </main>
  );
}
