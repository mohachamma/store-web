"use client";

import { createPersistedStore } from "./persisted-store";

export interface CartLine {
  /** productId + size */
  key: string;
  productId: string;
  variantId: string;
  slug: string;
  name: string;
  image: string;
  size: string;
  /** Display price only — the API recomputes totals at checkout. */
  price: number;
  qty: number;
}

const store = createPersistedStore<CartLine[]>("store.cart.v1", []);

export const useCart = store.useStore;

export const cart = {
  add(line: Omit<CartLine, "key" | "qty">, qty = 1) {
    const key = `${line.productId}:${line.size}`;
    store.set((lines) => {
      const found = lines.find((l) => l.key === key);
      return found
        ? lines.map((l) => (l.key === key ? { ...l, qty: Math.min(l.qty + qty, 10) } : l))
        : [...lines, { ...line, key, qty }];
    });
  },
  setQty(key: string, qty: number) {
    store.set((lines) =>
      qty <= 0 ? lines.filter((l) => l.key !== key) : lines.map((l) => (l.key === key ? { ...l, qty: Math.min(qty, 10) } : l)),
    );
  },
  remove(key: string) {
    store.set((lines) => lines.filter((l) => l.key !== key));
  },
  clear() {
    store.set([]);
  },
};

export const cartCount = (lines: CartLine[]) => lines.reduce((n, l) => n + l.qty, 0);
export const cartSubtotal = (lines: CartLine[]) => lines.reduce((n, l) => n + l.qty * l.price, 0);
