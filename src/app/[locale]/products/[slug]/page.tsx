import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProductView } from "@/components/ProductView";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { Row } from "@/components/Row";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl, pageMetadata } from "@/config/site";
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
  return p ? pageMetadata({ locale, path: `/products/${slug}`, title: p.name, description: p.description, image: p.image.url }) : {};
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

  // Structured data (price, availability, category) so search results can show the product with its price.
  const prices = product.variants.map((v) => v.price);
  const inStock = product.variants.some((v) => v.stock > 0);
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description || undefined,
      image: product.images.map((i) => absoluteUrl(i.url)),
      sku: product.slug,
      category: product.category.name,
      url: absoluteUrl(`/${locale}/products/${product.slug}`),
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "DZD",
        lowPrice: prices.length ? Math.min(...prices) : product.price,
        highPrice: prices.length ? Math.max(...prices) : product.price,
        offerCount: product.variants.length || 1,
        availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: product.category.name, item: absoluteUrl(`/${locale}/search?category=${product.category.slug}`) },
        { "@type": "ListItem", position: 2, name: product.name, item: absoluteUrl(`/${locale}/products/${product.slug}`) },
      ],
    },
  ];

  return (
    <>
      <JsonLd data={ld} />
      <Header variant="detail" />
      <main>
        <div className="mx-auto grid max-w-6xl md:grid-cols-[1.15fr_1fr] md:gap-12 md:px-6 md:pt-4">
          <ProductView product={product} />
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
