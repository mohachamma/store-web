"use client";

import type { ProductSummary } from "./api/types";
import { createPersistedStore } from "./persisted-store";

export type FavoriteItem = Pick<ProductSummary, "id" | "slug" | "name" | "price" | "compareAtPrice" | "image" | "isNew" | "category">;

const store = createPersistedStore<FavoriteItem[]>("store.favorites.v1", []);

export const useFavorites = store.useStore;

export const favorites = {
  toggle(item: FavoriteItem) {
    store.set((items) => (items.some((i) => i.id === item.id) ? items.filter((i) => i.id !== item.id) : [item, ...items]));
  },
};
