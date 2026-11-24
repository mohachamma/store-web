"use client";

import { cartCount, useCart } from "@/lib/cart";

export function CartBadge({ className = "" }: { className?: string }) {
  const count = cartCount(useCart());
  if (!count) return null;
  return (
    <span
      className={`absolute -end-1.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-ink px-1 text-[10px] font-bold leading-none text-paper ${className}`}
    >
      {count > 9 ? "9+" : count}
    </span>
  );
}
