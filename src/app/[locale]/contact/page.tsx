import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/Header";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/config/site";
import { api } from "@/lib/api";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return pageMetadata({ locale, path: "/contact", title: t("title"), description: t("intro") });
}

/** Contact details come from the dashboard (Pages & contact). Empty fields are simply not shown. */
export default async function ContactPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, info] = await Promise.all([getTranslations("contact"), api.getStoreInfo(locale)]);
  const rows: { label: string; value: string; href?: string }[] = [
    info.phone ? { label: t("phone"), value: info.phone, href: `tel:${info.phone.replace(/[^\d+]/g, "")}` } : null,
    info.email ? { label: t("email"), value: info.email, href: `mailto:${info.email}` } : null,
    info.address ? { label: t("address"), value: info.address } : null,
    info.hours ? { label: t("hours"), value: info.hours } : null,
  ].filter((r): r is { label: string; value: string; href?: string } => r !== null);

  return (
    <>
      <Header variant="detail" />
      <main className="mx-auto max-w-xl space-y-6 px-4 pb-12 pt-6 md:px-6">
        <div>
          <h1 className="font-display text-2xl uppercase tracking-[0.06em]">{t("title")}</h1>
          <p className="mt-2 text-sm text-muted">{t("intro")}</p>
        </div>
        {rows.length === 0 && !info.whatsappUrl ? (
          <p className="rounded-[var(--radius-card)] border border-dashed border-line py-12 text-center text-sm text-muted">{t("empty")}</p>
        ) : (
          <>
            {info.whatsappUrl ? (
              <a href={info.whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex h-12 items-center justify-center rounded-full bg-[#128c4a] text-xs font-bold uppercase tracking-wide text-white transition hover:opacity-90">
                {t("whatsapp")}
              </a>
            ) : null}
            <dl className="divide-y divide-line rounded-[var(--radius-card)] border border-line">
              {rows.map((r) => (
                <div key={r.label} className="flex items-start justify-between gap-4 p-4 text-sm">
                  <dt className="text-muted">{r.label}</dt>
                  <dd className="text-end font-medium" dir={r.href ? "ltr" : undefined}>
                    {r.href ? <a href={r.href} className="underline-offset-4 hover:underline">{r.value}</a> : r.value}
                  </dd>
                </div>
              ))}
            </dl>
          </>
        )}
        <p className="text-xs text-muted">{t("rights")}</p>
      </main>
    </>
  );
}
