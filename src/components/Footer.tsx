import { getTranslations } from "next-intl/server";
import { brand } from "@/config/brand";
import { api } from "@/lib/api";
import { getLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";

export async function Footer() {
  const t = await getTranslations("footer");
  const locale = (await getLocale()) as Locale;
  // Page titles come from the dashboard; unpublished pages simply do not appear.
  const pages = await api.getPages(locale).catch(() => []);
  const link = (slug: string) => {
    const p = pages.find((x) => x.slug === slug);
    return p ? { label: p.title, href: `/legal/${slug}` } : null;
  };
  const help = [link("shipping"), link("returns"), link("cod"), { label: t("contact"), href: "/contact" }].filter((x): x is Item => x !== null);
  const legal = [link("terms"), link("privacy")].filter((x): x is Item => x !== null);

  return (
    <footer className="mt-16 border-t border-line bg-mist/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[2fr_1fr_1fr] md:px-6">
        <div className="space-y-3">
          <p dir="ltr" className="font-display text-xl uppercase tracking-[0.28em] rtl:text-end">
            {brand.wordmark}
          </p>
          <p className="max-w-sm text-sm text-muted">{t("about")}</p>
          <LanguageSwitcher />
        </div>
        <FooterCol title={t("help")} items={help} />
        <FooterCol title={t("legal")} items={legal} />
      </div>
      <p className="border-t border-line py-5 text-center text-xs text-muted">
        {t("rights", { year: new Date().getFullYear(), brand: brand.name })}
      </p>
    </footer>
  );
}

type Item = { label: string; href: string };

function FooterCol({ title, items }: { title: string; items: Item[] }) {
  return (
    <div>
      <h2 className="label mb-3">{title}</h2>
      <ul className="space-y-2 text-sm text-muted">
        {items.map((i) => (
          <li key={i.href}>
            <Link href={i.href} className="transition hover:text-ink">{i.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
