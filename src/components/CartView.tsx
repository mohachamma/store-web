"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { cart, cartCount, cartSubtotal, useCart } from "@/lib/cart";
import { colorLabel } from "@/lib/colors";
import { formatDZD } from "@/lib/format";
import { BagIcon, MinusIcon, PlusIcon } from "./icons";

export function CartView() {
  const t = useTranslations("cart");
  const tc = useTranslations("colors");
  const locale = useLocale() as Locale;
  const lines = useCart();
  const count = cartCount(lines);

  return (
    <div className="mx-auto max-w-3xl px-4 md:px-6">
      <h1 className="label py-4 text-[12px]">{t("title", { count })}</h1>

      {lines.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-mist">
            <BagIcon size={26} />
          </span>
          <p className="text-sm text-muted">{t("empty")}</p>
          <Link href="/" className="rounded-full bg-ink px-6 py-3 text-xs font-bold uppercase text-paper">
            {t("continue")}
          </Link>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-line/70">
            {lines.map((l) => (
              <li key={l.key} className="flex gap-4 py-4">
                <Link href={`/products/${l.slug}`} className="relative h-28 w-24 shrink-0 overflow-hidden rounded-2xl bg-mist">
                  <Image src={l.image} alt={l.name} fill sizes="96px" className="object-contain p-2" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
                  <Link href={`/products/${l.slug}`} className="label">
                    {l.name}
                  </Link>
                  <p className="text-[11px] text-muted">{t("size", { size: l.size })}{l.color ? ` · ${colorLabel(tc, l.color)}` : ""}</p>
                  <p className="text-[12px] font-semibold">{formatDZD(l.price * l.qty, locale)}</p>
                  <div className="mt-1 flex items-center gap-3">
                    <div className="flex items-center rounded-full border border-line">
                      <button type="button" aria-label={t("decrease")} onClick={() => cart.setQty(l.key, l.qty - 1)} className="grid h-8 w-8 place-items-center">
                        <MinusIcon size={14} />
                      </button>
                      <span className="w-5 text-center text-xs tabular-nums" aria-live="polite">{l.qty}</span>
                      <button type="button" aria-label={t("increase")} onClick={() => cart.setQty(l.key, l.qty + 1)} className="grid h-8 w-8 place-items-center">
                        <PlusIcon size={14} />
                      </button>
                    </div>
                    <button type="button" onClick={() => cart.remove(l.key)} className="text-[11px] text-muted underline-offset-2 hover:text-ink hover:underline">
                      {t("remove")}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Sticky summary sits above the mobile tab bar. */}
          <div className="sticky bottom-[calc(var(--tabbar-h)+env(safe-area-inset-bottom))] -mx-4 mt-4 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur md:bottom-0 md:mx-0 md:rounded-2xl md:border md:px-5">
            <div className="flex items-center justify-between gap-4">
              <p className="text-[11px] uppercase">
                {t("subtotal")}: <strong className="text-[13px]">{formatDZD(cartSubtotal(lines), locale)}</strong>
              </p>
              <Link href="/checkout" className="rounded-full bg-ink px-7 py-3 text-[11px] font-bold uppercase tracking-wide text-paper transition hover:bg-ink/85">
                {t("checkout")}
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
