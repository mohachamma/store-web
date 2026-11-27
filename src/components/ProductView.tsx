"use client";

import { useState } from "react";
import type { Product } from "@/lib/api/types";
import { BuyPanel } from "./BuyPanel";
import { ProductGallery } from "./ProductGallery";

/** Photos to show for a color: its own photos plus the ones that fit every color; everything when none are linked. */
export function imagesForColor(images: Product["images"], color: string | null): Product["images"] {
  if (!color) return images;
  const same = (c: string | null) => c !== null && c.trim().toLowerCase() === color.trim().toLowerCase();
  const own = images.filter((i) => same(i.color));
  if (own.length === 0) return images.filter((i) => i.color === null).length ? images.filter((i) => i.color === null) : images;
  return images.filter((i) => i.color === null || same(i.color));
}

/** Product page body: tapping a color swaps the gallery to that color's photos and picks that color's variants. */
export function ProductView({ product }: { product: Product }) {
  const firstColor = product.variants.find((v) => v.stock > 0 && v.color)?.color ?? product.variants.find((v) => v.color)?.color ?? null;
  const [color, setColor] = useState<string | null>(firstColor);
  const images = imagesForColor(product.images, color);
  return (
    <>
      <ProductGallery key={color ?? "all"} images={images} slug={product.slug} />
      <BuyPanel product={product} color={color} onColor={setColor} />
    </>
  );
}
