import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BuyPanel } from "@/components/BuyPanel";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { ProductGallery } from "@/components/ProductGallery";
import { Row } from "@/components/Row";
import { routing, type Locale } from "@/i18n/routing";
import { api } from "@/lib/api";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

// Pre-render product pages so they are ready (and prefetched) when a card is tapped:
// this is what lets the photo morph from the card into the gallery.
export async function generateStaticParams() {
  try {
    const perLocale = await Promise.all(
      routing.locales.map(async (locale) => (await api.listProducts({ limit: 100 }, locale)).map((p) => ({ locale, slug: p.slug }))),
    );
    return perLocale.flat();
  } catch {
    return []; // API not reachable at build time: pages are rendered on demand instead
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const p = await api.getProduct(slug, locale);
  return p ? { title: p.name, description: p.description, openGraph: { images: [p.image.url] } } : {};
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const [t, product, related] = await Promise.all([
    getTranslations("product"),
    api.getProduct(slug, locale),
    api.getRelated(slug, locale),
  ]);
  if (!product) notFound();

  return (
    <>
      <Header variant="detail" />
      <main>
        <div className="mx-auto grid max-w-6xl md:grid-cols-[1.15fr_1fr] md:gap-12 md:px-6 md:pt-4">
          <ProductGallery images={product.images} slug={product.slug} />
          <BuyPanel product={product} />
        </div>
        {related.length ? (
          <div className="mt-6">
            <Row title={t("related")}>
              {related.map((p) => (
                <ProductCard key={p.id} product={p} morph={false} />
              ))}
            </Row>
          </div>
        ) : null}
      </main>
    </>
  );
}
