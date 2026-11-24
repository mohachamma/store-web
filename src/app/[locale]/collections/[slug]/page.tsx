import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BackLink } from "@/components/BackLink";
import { LookCard } from "@/components/LookCard";
import { ProductCard } from "@/components/ProductCard";
import { Row } from "@/components/Row";
import { ShareButton } from "@/components/ShareButton";
import type { Locale } from "@/i18n/routing";
import { api } from "@/lib/api";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

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
        <Image src={collection.heroImage.url} alt={collection.heroImage.alt} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/10" />
        <div className="relative mx-auto grid max-w-6xl grid-cols-[auto_1fr_auto] items-center px-2 pt-2 text-paper md:px-6">
          <div className="text-paper [&_button:hover]:bg-white/15">
            <BackLink label={nav("home")} />
          </div>
          <h1 className="label text-center text-[12px]">{collection.title}</h1>
          <ShareButton label={t("share")} copied={t("copied")} title={collection.title} />
        </div>
      </div>

      <div className="relative -mt-36 md:-mt-44">
        <Row title="">
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
