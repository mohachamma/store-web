"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { logoutAction, updateProfileAction } from "@/app/[locale]/account/actions";
import { Link, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { MeProfile, MyOrder } from "@/lib/api/types";
import { favorites } from "@/lib/favorites";
import { formatDZD } from "@/lib/format";

const field = "h-12 w-full rounded-xl bg-mist px-4 text-sm outline-none transition placeholder:text-muted focus:bg-paper focus:ring-2 focus:ring-ink/15";

export function AccountView({ me, orders }: { me: MeProfile; orders: MyOrder[] }) {
  const t = useTranslations("account");
  const to = useTranslations("order");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState<boolean | null>(null);
  const date = (iso: string) => new Intl.DateTimeFormat(locale === "ar" ? "ar-DZ-u-nu-latn" : locale, { dateStyle: "medium" }).format(new Date(iso));

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-8 md:px-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="label text-[12px]">{t("title")}</h1>
          <p className="mt-1 truncate text-sm text-muted" dir="ltr">{me.email}</p>
        </div>
        <button
          type="button"
          disabled={pending}
          onClick={() => start(async () => { await logoutAction(); favorites.clear(); router.refresh(); })}
          className="shrink-0 rounded-full border border-ink px-4 py-2 text-xs font-bold"
        >
          {t("logout")}
        </button>
      </div>

      <form
        className="space-y-4 rounded-[var(--radius-card)] border border-line p-5"
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          setSaved(null);
          start(async () => setSaved(await updateProfileAction({ name: String(f.get("name")), phone: String(f.get("phone")) })));
        }}
      >
        <h2 className="label">{t("profile")}</h2>
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold" htmlFor="p-name">{t("name")}</label>
          <input id="p-name" name="name" defaultValue={me.name ?? ""} minLength={2} maxLength={80} className={field} />
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold" htmlFor="p-phone">{t("phone")}</label>
          <input id="p-phone" name="phone" defaultValue={me.phone ?? ""} type="tel" dir="ltr" maxLength={20} className={`${field} text-start`} />
        </div>
        <div className="flex items-center gap-3">
          <button type="submit" disabled={pending} className="h-11 rounded-full bg-ink px-6 text-xs font-bold uppercase text-paper disabled:bg-muted">{t("save")}</button>
          {saved === true ? <span role="status" className="text-xs text-emerald-700">{t("saved")}</span> : null}
          {saved === false ? <span role="alert" className="text-xs text-danger">{t("errors.generic")}</span> : null}
        </div>
      </form>

      <section className="space-y-3">
        <h2 className="label">{t("orders")}</h2>
        {orders.length === 0 ? (
          <p className="rounded-[var(--radius-card)] border border-dashed border-line py-10 text-center text-sm text-muted">{t("noOrders")}</p>
        ) : (
          <ul className="divide-y divide-line rounded-[var(--radius-card)] border border-line">
            {orders.map((o) => (
              <li key={o.orderNumber}>
                <Link href={`/order/${o.orderNumber}?t=${o.token}`} className="flex items-center justify-between gap-3 p-4 text-sm transition hover:bg-mist">
                  <span className="min-w-0">
                    <strong dir="ltr">#{o.orderNumber}</strong>
                    <span className="block text-[11px] text-muted">{date(o.createdAt)} · {t("items", { n: o.itemCount })}</span>
                  </span>
                  <span className="shrink-0 text-end">
                    <span className="block text-xs font-semibold">{formatDZD(o.total, locale)}</span>
                    <span className="mt-1 inline-block rounded-full bg-mist px-2.5 py-0.5 text-[11px] font-semibold">{to(`status.${o.status}`)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
