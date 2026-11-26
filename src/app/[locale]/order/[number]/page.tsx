import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/Header";
import { Price } from "@/components/Price";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { api } from "@/lib/api";

type Props = { params: Promise<{ locale: Locale; number: string }>; searchParams: Promise<{ t?: string }> };

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getTranslations("order"))("title"), robots: { index: false, follow: false } };
}

/** The customer's own order: opened with the secret token returned when the order was placed. Never shows personal data. */
export default async function OrderPage({ params, searchParams }: Props) {
  const { locale, number } = await params;
  const { t: token } = await searchParams;
  setRequestLocale(locale);
  const n = Number(number);
  if (!Number.isInteger(n) || n <= 0 || !token) notFound();
  const [t, order] = await Promise.all([getTranslations("order"), api.getOrder(n, token, locale)]);
  if (!order) notFound();

  return (
    <>
      <Header variant="detail" />
      <main className="mx-auto max-w-2xl space-y-6 px-4 pb-12 pt-6 md:px-6">
        <div className="space-y-2 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-ink text-paper" aria-hidden>
            ✓
          </span>
          <h1 className="font-display text-2xl uppercase tracking-[0.06em]">{t("title")}</h1>
          <p className="text-sm text-muted">
            {t("number")} <strong className="text-ink" dir="ltr">#{order.orderNumber}</strong> · {t("keep")}
          </p>
          <p className="mx-auto max-w-md text-sm">{t("callNote")}</p>
        </div>

        <div className="space-y-4 rounded-[var(--radius-card)] border border-line p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <span className="rounded-full bg-mist px-3 py-1 text-xs font-semibold">{t(`status.${order.status}`)}</span>
            <span className="text-muted">{t("deliveryTo", { wilaya: order.wilaya })} · {t(order.deliveryType)}</span>
          </div>
          {order.trackingNumber ? (
            <p className="text-sm">
              {t("tracking")}: <strong dir="ltr">{order.trackingNumber}</strong>
            </p>
          ) : null}

          <h2 className="label pt-2">{t("items")}</h2>
          <ul className="divide-y divide-line">
            {order.items.map((i, k) => (
              <li key={k} className="flex items-center justify-between gap-3 py-3 text-sm">
                <span className="min-w-0">
                  <span className="label block truncate">{i.name}</span>
                  <span className="text-[11px] text-muted">{i.size} × {i.quantity}</span>
                </span>
                <Price value={i.lineTotal} className="text-xs font-semibold" />
              </li>
            ))}
          </ul>

          <dl className="space-y-2 border-t border-line pt-4 text-sm text-muted">
            <div className="flex justify-between"><dt>{t("subtotal")}</dt><dd className="text-ink"><Price value={order.subtotal} /></dd></div>
            <div className="flex justify-between"><dt>{t("shipping")}</dt><dd className="text-ink">{order.shippingFee === 0 ? t("free") : <Price value={order.shippingFee} />}</dd></div>
            {order.discountTotal > 0 ? <div className="flex justify-between"><dt>{t("discount")}</dt><dd className="text-ink">-<Price value={order.discountTotal} /></dd></div> : null}
            <div className="flex justify-between border-t border-line pt-3 text-base font-semibold text-ink"><dt>{t("total")}</dt><dd><Price value={order.total} /></dd></div>
          </dl>
          <p className="text-[11px] text-muted">{t("payment")}</p>
        </div>

        <div className="text-center">
          <Link href="/" className="inline-block rounded-full bg-ink px-6 py-3 text-xs font-bold uppercase text-paper">
            {t("continue")}
          </Link>
        </div>
      </main>
    </>
  );
}
