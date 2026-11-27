import Image from "next/image";
import { ViewTransition } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { ProductSummary } from "@/lib/api/types";
import { ColorDots } from "./ColorDots";
import { Price } from "./Price";

/** Shared product card: photo on light grey, small bold uppercase name, price. */
export function ProductCard({
  product,
  size = "row",
  priority = false,
  morph = true,
}: {
  product: ProductSummary;
  size?: "row" | "grid";
  priority?: boolean;
  /** Give the photo a shared-element name (off for secondary rows like "related"). */
  morph?: boolean;
}) {
  const t = useTranslations("product");
  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round((1 - product.price / product.compareAtPrice) * 100)
      : 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className={`group block ${size === "row" ? "w-[38vw] max-w-[210px] shrink-0 snap-start md:w-[200px]" : ""}`}
    >
      <MaybeMorph name={morph ? `product-${product.slug}` : null}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] bg-mist transition-transform duration-200 ease-out group-active:scale-[.96]">
        <Image
          src={product.image.url}
          alt={product.image.alt}
          fill
          priority={priority}
          sizes="(min-width: 768px) 210px, 40vw"
          className="object-contain p-3 transition duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute start-2 top-2 flex gap-1">
          {product.isNew ? (
            <span className="rounded-full bg-paper px-2 py-0.5 text-[10px] font-bold uppercase">{t("new")}</span>
          ) : null}
          {discount ? (
            <span className="rounded-full bg-ink px-2 py-0.5 text-[10px] font-bold text-paper" dir="ltr">
              -{discount}%
            </span>
          ) : null}
        </div>
      </div>
      </MaybeMorph>
      <div className="mt-2.5 space-y-1 px-0.5">
        <h3 className="label line-clamp-2">{product.name}</h3>
        <Price value={product.price} compareAt={product.compareAtPrice} className="text-[11px] text-muted" />
        <ColorDots colors={product.colors} />
      </div>
    </Link>
  );
}

function MaybeMorph({ name, children }: { name: string | null; children: React.ReactNode }) {
  return name ? (
    <ViewTransition name={name} share="morph" default="none">
      {children}
    </ViewTransition>
  ) : (
    <>{children}</>
  );
}
