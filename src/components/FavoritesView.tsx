"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";
import { pullFavoritesAction } from "@/app/[locale]/account/actions";
import type { Locale } from "@/i18n/routing";
import { favorites, useFavorites } from "@/lib/favorites";
import { ProductCard } from "./ProductCard";

export function FavoritesView() {
  const t = useTranslations("favorites");
  const items = useFavorites();
  const locale = useLocale() as Locale;
  // Signed in: show the account's list (changes made on another device included). Guests keep the device list.
  useEffect(() => {
    void pullFavoritesAction(locale).then((r) => r && favorites.replace(r.products)).catch(() => undefined);
  }, [locale]);
  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6">
      <h1 className="label py-4 text-[12px]">{t("title")}</h1>
      {items.length === 0 ? (
        <p className="py-20 text-center text-sm text-muted">{t("empty")}</p>
      ) : (
        <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} size="grid" />
          ))}
        </div>
      )}
    </div>
  );
}
