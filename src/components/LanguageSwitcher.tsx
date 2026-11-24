"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { GlobeIcon } from "./icons";

const names: Record<Locale, string> = { ar: "العربية", fr: "Français", en: "English" };

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const t = useTranslations("footer");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [pending, start] = useTransition();

  return (
    <label className={`relative flex items-center gap-1.5 ${pending ? "opacity-50" : ""}`}>
      <GlobeIcon size={compact ? 18 : 20} />
      <span className="sr-only">{t("language")}</span>
      <select
        value={locale}
        onChange={(e) => start(() => router.replace(pathname, { locale: e.target.value as Locale }))}
        className={`cursor-pointer appearance-none bg-transparent pe-1 outline-none ${compact ? "label" : "text-sm"}`}
      >
        {routing.locales.map((l) => (
          <option key={l} value={l}>
            {compact ? l.toUpperCase() : names[l]}
          </option>
        ))}
      </select>
    </label>
  );
}
