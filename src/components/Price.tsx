import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { formatDZD } from "@/lib/format";

export function Price({ value, compareAt, className = "" }: { value: number; compareAt?: number | null; className?: string }) {
  const locale = useLocale() as Locale;
  return (
    <span className={`inline-flex flex-wrap items-baseline gap-x-2 ${className}`}>
      <span>{formatDZD(value, locale)}</span>
      {compareAt && compareAt > value ? (
        <s className="text-muted">{formatDZD(compareAt, locale)}</s>
      ) : null}
    </span>
  );
}
