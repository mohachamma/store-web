"use client";

import { useTranslations } from "next-intl";
import { colorLabel } from "@/lib/colors";

/** Small round color dots under a product card's price (up to `max`, then "+n"). Colors are chosen in the dashboard. */
export function ColorDots({ colors, max = 5 }: { colors: { name: string; hex: string | null }[]; max?: number }) {
  const t = useTranslations("colors");
  if (!colors || colors.length === 0) return null;
  const shown = colors.slice(0, max);
  return (
    <ul className="flex items-center gap-1.5 pt-1" aria-label={colors.map((c) => colorLabel(t, c.name)).join(", ")}>
      {shown.map((c) => (
        <li key={c.name} title={colorLabel(t, c.name)} className="size-3.5 rounded-full border border-black/15" style={{ background: c.hex ?? "#d4d4d4" }} />
      ))}
      {colors.length > max ? <li className="text-[10px] text-muted">+{colors.length - max}</li> : null}
    </ul>
  );
}
