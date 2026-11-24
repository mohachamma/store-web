"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

/** Live countdown to an end date; disappears when it reaches zero. */
export function Countdown({ endsAt }: { endsAt: string }) {
  const t = useTranslations("offer");
  const end = new Date(endsAt).getTime();
  const [left, setLeft] = useState<number | null>(null); // null until mounted (avoids a hydration mismatch)

  useEffect(() => {
    const tick = () => setLeft(Math.max(0, end - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [end]);

  if (left === null || left <= 0) return null;
  const s = Math.floor(left / 1000);
  const parts: [number, string][] = [
    [Math.floor(s / 86400), t("days")],
    [Math.floor((s % 86400) / 3600), t("hours")],
    [Math.floor((s % 3600) / 60), t("minutes")],
    [s % 60, t("seconds")],
  ];

  return (
    <dl className="flex gap-2" aria-label={t("endsIn")} dir="ltr">
      {parts.map(([n, label]) => (
        <div key={label} className="min-w-12 rounded-xl bg-white/10 px-2.5 py-1.5 text-center">
          <dt className="sr-only">{label}</dt>
          <dd className="text-lg font-semibold tabular-nums leading-none">{String(n).padStart(2, "0")}</dd>
          <p aria-hidden className="mt-1 text-[9px] uppercase opacity-70">{label}</p>
        </div>
      ))}
    </dl>
  );
}
