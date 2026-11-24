import { getTranslations } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { SearchIcon } from "./icons";

/** Rounded grey search field (plain GET form: works without JavaScript). */
export async function SearchField({ locale, defaultValue = "" }: { locale: Locale; defaultValue?: string }) {
  const t = await getTranslations("search");
  return (
    <form action={getPathname({ href: "/search", locale })} role="search" className="mx-auto max-w-6xl px-4 md:px-6">
      <label className="flex h-10 items-center gap-2 rounded-full bg-mist px-4 text-muted focus-within:ring-2 focus-within:ring-ink/10">
        <SearchIcon size={18} className="text-ink" />
        <span className="sr-only">{t("placeholder")}</span>
        <input
          name="q"
          type="search"
          defaultValue={defaultValue}
          placeholder={t("placeholder")}
          className="h-full w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
        />
      </label>
    </form>
  );
}
