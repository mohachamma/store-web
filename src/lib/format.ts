import type { Locale } from "@/i18n/routing";

/**
 * Formats an integer DZD amount: "8 900 دج" (ar) / "8 900 DA" (fr, en). Latin digits, as used in Algeria.
 * Groups are separated by a narrow no-break space (bidi class CS), so the number stays in one piece in RTL text.
 */
export function formatDZD(amount: number, locale: Locale): string {
  const n = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return locale === "ar" ? `${n} دج` : `${n} DA`;
}
