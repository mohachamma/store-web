"use client";

import { setFavoriteAction } from "@/app/[locale]/account/actions";
import type { ProductSummary } from "./api/types";
import { createPersistedStore } from "./persisted-store";

export type FavoriteItem = Pick<ProductSummary, "id" | "slug" | "name" | "price" | "compareAtPrice" | "image" | "isNew" | "category">;

const store = createPersistedStore<FavoriteItem[]>("store.favorites.v1", []);

export const useFavorites = store.useStore;

export const favorites = {
  toggle(item: FavoriteItem) {
    const on = !store.get().some((i) => i.id === item.id);
    store.set((items) => (on ? [item, ...items] : items.filter((i) => i.id !== item.id)));
    // Signed-in customers keep their favorites on the account too (the action does nothing for guests).
    void setFavoriteAction(item.id, on).catch(() => undefined);
  },
  /** Replaces the device's list (after signing in, or when opening the favorites page on another device). */
  replace(items: FavoriteItem[]) {
    store.set(items);
  },
  ids() {
    return store.get().map((i) => i.id);
  },
  clear() {
    store.set([]);
  },
};
