"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import type { Locale } from "@/i18n/routing";
import type { Product } from "@/lib/api/types";
import { cart } from "@/lib/cart";
import { favorites, useFavorites } from "@/lib/favorites";
import { formatDZD } from "@/lib/format";
import { HeartIcon } from "./icons";
import { Price } from "./Price";

/** Name, price, black pill "Add to cart", round size chips and description. */
export function BuyPanel({ product }: { product: Product }) {
  const t = useTranslations("product");
  const locale = useLocale() as Locale;
  const favs = useFavorites();
  const isFav = favs.some((f) => f.id === product.id);

  const firstAvailable = product.variants.find((v) => v.stock > 0)?.size ?? null;
  const [size, setSize] = useState<string | null>(firstAvailable);
  const [needSize, setNeedSize] = useState(false);
  const [toast, setToast] = useState<"in" | "out" | null>(null);
  const variant = product.variants.find((v) => v.size === size);

  useEffect(() => {
    if (toast === "in") {
      const id = setTimeout(() => setToast("out"), 1700);
      return () => clearTimeout(id);
    }
    if (toast === "out") {
      const id = setTimeout(() => setToast(null), 450);
      return () => clearTimeout(id);
    }
  }, [toast]);

  const add = () => {
    if (!variant || variant.stock <= 0) {
      setNeedSize(true);
      return;
    }
    cart.add({
      productId: product.id,
      variantId: variant.id,
      slug: product.slug,
      name: product.name,
      image: product.image.url,
      size: variant.size,
      price: variant.price,
    });
    setToast("in");
  };

  const soldOut = !firstAvailable;

  return (
    <div className="relative z-10 -mt-6 rounded-t-[28px] bg-paper px-5 pb-6 pt-6 shadow-[0_-12px_30px_-20px_rgba(0,0,0,.25)] md:mt-0 md:rounded-none md:px-0 md:pt-2 md:shadow-none">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <h1 className="label text-[13px]">{product.name}</h1>
          <Price value={variant?.price ?? product.price} compareAt={variant?.compareAtPrice ?? product.compareAtPrice} className="text-xs text-muted" />
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => favorites.toggle(product)}
            aria-pressed={isFav}
            aria-label={isFav ? t("unfavorite") : t("favorite")}
            className="grid h-10 w-10 place-items-center rounded-full border border-line transition hover:border-ink"
          >
            <HeartIcon size={18} filled={isFav} />
          </button>
          <button
            type="button"
            onClick={add}
            disabled={soldOut}
            className="h-10 rounded-full bg-ink px-5 text-[11px] font-bold uppercase tracking-wide text-paper transition hover:bg-ink/85 active:scale-[.98] disabled:bg-muted"
          >
            {soldOut ? t("soldOut") : t("addToCart")}
          </button>
        </div>
      </div>

      <fieldset className="mt-5">
        <legend className={`mb-2 text-[11px] ${needSize ? "text-danger" : "text-muted"}`}>
          {needSize ? t("selectSize") : t("size")}
        </legend>
        <div className="flex flex-wrap gap-2.5">
          {product.variants.map((v) => {
            const selected = v.size === size;
            const out = v.stock <= 0;
            return (
              <button
                key={v.id}
                type="button"
                disabled={out}
                onClick={() => {
                  setSize(v.size);
                  setNeedSize(false);
                }}
                aria-pressed={selected}
                className={`relative grid h-11 w-11 place-items-center rounded-full text-[11px] font-semibold transition ${
                  selected ? "border-[1.5px] border-ink" : "border border-transparent hover:border-line"
                } ${out ? "text-muted/60 line-through" : ""}`}
              >
                {v.size}
              </button>
            );
          })}
        </div>
        {variant && variant.stock > 0 && variant.stock <= 3 ? (
          <p className="mt-2 text-[11px] text-danger">{t("onlyLeft", { count: variant.stock })}</p>
        ) : null}
      </fieldset>

      <div className="mt-6 space-y-2">
        <h2 className="sr-only">{t("description")}</h2>
        <p className="text-[13px] leading-relaxed text-ink/75">{product.description}</p>
      </div>

      {toast && variant ? (
        <div
          role="status"
          className={`fixed inset-0 z-50 grid place-items-center overflow-hidden bg-black/55 px-8 ${
            toast === "out" ? "[animation:fade-out_.4s_ease_both]" : "[animation:fade-in_.2s_ease]"
          }`}
          onClick={() => setToast("out")}
        >
          <div
            className={`flex w-full max-w-sm items-center gap-4 bg-paper p-4 shadow-2xl ${
              toast === "out" ? "[animation:toast-out_.4s_ease-in_both]" : "[animation:toast-slide_.4s_cubic-bezier(.2,.8,.2,1)_both]"
            }`}
          >
            <div className="relative h-20 w-20 shrink-0 bg-mist">
              <Image src={product.image.url} alt="" fill sizes="80px" className="object-contain p-1.5" />
            </div>
            <div className="min-w-0 space-y-1">
              <p className="text-[10px] text-muted">{t("added")}</p>
              <p className="label">{product.name}</p>
              <p className="text-[11px] text-muted">
                {t("size")}: {variant.size}
              </p>
              <p className="text-[12px] font-semibold">{formatDZD(variant.price, locale)}</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
