import { getTranslations } from "next-intl/server";
import { brand } from "@/config/brand";
import { LanguageSwitcher } from "./LanguageSwitcher";

export async function Footer() {
  const t = await getTranslations("footer");
  // Legal pages arrive in phase 7; links are placeholders until then.
  const help = [t("shipping"), t("returns"), t("cod"), t("contact")];
  const legal = [t("terms"), t("privacy")];

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

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h2 className="label mb-3">{title}</h2>
      <ul className="space-y-2 text-sm text-muted">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}
