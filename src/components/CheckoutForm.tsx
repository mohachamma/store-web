"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { checkoutProfileAction, communesAction, placeOrderAction, quoteAction } from "@/app/[locale]/checkout/actions";
import type { Commune, OrderQuote, ShippingRules, Wilaya } from "@/lib/api/types";
import { cart, cartSubtotal, useCart } from "@/lib/cart";
import { formatDZD } from "@/lib/format";
import { BagIcon } from "./icons";

const field = "h-12 w-full rounded-xl bg-mist px-4 text-sm outline-none transition placeholder:text-muted focus:bg-paper focus:ring-2 focus:ring-ink/15";

export function CheckoutForm({ wilayas, rules, cardAvailable }: { wilayas: Wilaya[]; rules: ShippingRules; cardAvailable: boolean }) {
  const t = useTranslations("checkout");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const lines = useCart();
  const [pending, start] = useTransition();

  const [wilayaCode, setWilayaCode] = useState("");
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [communeId, setCommuneId] = useState("");
  const [deliveryType, setDeliveryType] = useState<"home" | "desk">("home");
  const [method, setMethod] = useState<"cod" | "chargily">("cod");
  const [code, setCode] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [quote, setQuote] = useState<OrderQuote | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<{ name: string; phone: string } | null>(null);

  // Signed in: pre-fill name and phone from the account (guests see empty fields).
  useEffect(() => {
    void checkoutProfileAction().then(setProfile).catch(() => undefined);
  }, []);

  const errorText = (c: string) => (t.has(`errors.${c}`) ? t(`errors.${c}`) : t("errors.generic"));
  const items = lines.map((l) => ({ variantId: l.variantId, quantity: l.qty }));

  /** Asks the server to price the cart (shipping, promo code). Called from event handlers, never from an effect. */
  function reprice(next: { wilaya?: string; delivery?: "home" | "desk"; code?: string | null }) {
    const w = Number(next.wilaya ?? wilayaCode);
    if (!w || items.length === 0) return;
    const c = next.code === undefined ? appliedCode : next.code;
    start(async () => {
      const r = await quoteAction({ items, wilayaCode: w, deliveryType: next.delivery ?? deliveryType, discountCode: c });
      if (r.ok) {
        setQuote(r.value);
        setError(null);
        if (next.code !== undefined) {
          setAppliedCode(next.code);
          setCodeError(null);
        }
      } else if (next.code) {
        setCodeError(errorText(r.code)); // the promo code was refused: keep the previous prices
      } else {
        setError(errorText(r.code));
      }
    });
  }

  function onWilaya(v: string) {
    setWilayaCode(v);
    setCommuneId("");
    setCommunes([]);
    if (!v) return setQuote(null);
    start(async () => setCommunes(await communesAction(Number(v), locale)));
    reprice({ wilaya: v });
  }

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setError(null);
    start(async () => {
      const r = await placeOrderAction({
        items,
        wilayaCode: Number(wilayaCode),
        deliveryType,
        discountCode: appliedCode,
        paymentMethod: method,
        locale,
        customer: { name: String(f.get("name")), phone: String(f.get("phone")), communeId: Number(communeId), address: String(f.get("address")) },
      });
      if (!r.ok) return setError(errorText(r.code));
      cart.clear();
      // Card payment: the customer pays on the payment company's page, which sends them back to the order page.
      if (r.value.checkoutUrl) return void window.location.assign(r.value.checkoutUrl);
      router.push(`/order/${r.value.orderNumber}?t=${r.value.token}`);
    });
  }

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-mist">
          <BagIcon size={26} />
        </span>
        <h1 className="sr-only">{t("title")}</h1>
        <p className="text-sm text-muted">{t("emptyCart")}</p>
        <Link href="/" className="rounded-full bg-ink px-6 py-3 text-xs font-bold uppercase text-paper">
          {t("backToCart")}
        </Link>
      </div>
    );
  }

  const w = wilayas.find((x) => String(x.code) === wilayaCode);
  const subtotal = quote?.subtotal ?? cartSubtotal(lines);
  const feeFor = (type: "home" | "desk") => (w ? (rules.freeShippingOver !== null && cartSubtotal(lines) >= rules.freeShippingOver ? 0 : type === "home" ? w.homeFee : w.deskFee) : null);
  const money = (n: number) => formatDZD(n, locale);
  const label = "mb-1.5 block text-[11px] font-semibold";

  return (
    <form onSubmit={submit} className="mx-auto grid max-w-5xl gap-8 px-4 pb-10 md:grid-cols-[1.2fr_1fr] md:px-6">
      <div className="space-y-6">
        <h1 className="label py-2 text-[12px]">{t("title")}</h1>

        <section className="space-y-4" aria-labelledby="c-contact">
          <h2 id="c-contact" className="label">{t("contact")}</h2>
          <div>
            <label className={label} htmlFor="name">{t("name")}</label>
            <input id="name" name="name" key={`n-${profile?.name ?? ""}`} defaultValue={profile?.name ?? ""} required minLength={2} maxLength={80} autoComplete="name" className={field} />
          </div>
          <div>
            <label className={label} htmlFor="phone">{t("phone")}</label>
            <input id="phone" name="phone" key={`p-${profile?.phone ?? ""}`} defaultValue={profile?.phone ?? ""} required type="tel" inputMode="tel" autoComplete="tel" dir="ltr" placeholder="05 50 12 34 56" className={`${field} text-start`} />
            <p className="mt-1 text-[11px] text-muted">{t("phoneHint")}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="wilaya">{t("wilaya")}</label>
              <select id="wilaya" required value={wilayaCode} onChange={(e) => onWilaya(e.target.value)} className={field}>
                <option value="">{t("selectWilaya")}</option>
                {wilayas.map((x) => (
                  <option key={x.code} value={x.code}>
                    {String(x.code).padStart(2, "0")} · {x.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={label} htmlFor="commune">{t("commune")}</label>
              <select id="commune" required value={communeId} onChange={(e) => setCommuneId(e.target.value)} disabled={!communes.length} className={`${field} disabled:opacity-50`}>
                <option value="">{t("selectCommune")}</option>
                {communes.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className={label} htmlFor="address">{t("address")}</label>
            <input id="address" name="address" required minLength={5} maxLength={250} autoComplete="street-address" placeholder={t("addressHint")} className={field} />
          </div>
        </section>

        <fieldset className="space-y-3">
          <legend className="label mb-2">{t("delivery")}</legend>
          {(["home", "desk"] as const).map((type) => {
            const fee = feeFor(type);
            return (
              <label key={type} className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-line p-4 text-sm transition has-[:checked]:border-ink has-[:checked]:bg-mist">
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="delivery"
                    value={type}
                    checked={deliveryType === type}
                    onChange={() => {
                      setDeliveryType(type);
                      reprice({ delivery: type });
                    }}
                    className="size-4 accent-ink"
                  />
                  {t(type)}
                </span>
                <span className="text-xs text-muted">{fee === null ? "—" : fee === 0 ? t("free") : money(fee)}</span>
              </label>
            );
          })}
          {!w ? <p className="text-[11px] text-muted">{t("chooseWilayaFirst")}</p> : null}
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="label mb-2">{t("payment")}</legend>
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-line p-4 transition has-[:checked]:border-ink has-[:checked]:bg-mist">
            <input type="radio" name="method" value="cod" checked={method === "cod"} onChange={() => setMethod("cod")} className="mt-1 size-4 accent-ink" />
            <span>
              <span className="block text-sm font-semibold">{t("cod")}</span>
              <span className="mt-0.5 block text-[11px] text-muted">{t("codHint")}</span>
            </span>
          </label>
          {cardAvailable ? (
            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-line p-4 transition has-[:checked]:border-ink has-[:checked]:bg-mist">
              <input type="radio" name="method" value="chargily" checked={method === "chargily"} onChange={() => setMethod("chargily")} className="mt-1 size-4 accent-ink" />
              <span>
                <span className="block text-sm font-semibold">{t("card")}</span>
                <span className="mt-0.5 block text-[11px] text-muted">{t("cardHint")}</span>
              </span>
            </label>
          ) : null}
        </fieldset>
      </div>

      <aside className="space-y-4 md:sticky md:top-20 md:self-start">
        <div className="space-y-4 rounded-[var(--radius-card)] border border-line p-5">
          <h2 className="label">{t("summary")}</h2>
          <ul className="space-y-3">
            {lines.map((l) => (
              <li key={l.key} className="flex items-center gap-3">
                <span className="relative h-14 w-12 shrink-0 overflow-hidden rounded-xl bg-mist">
                  <Image src={l.image} alt="" fill sizes="48px" className="object-contain p-1" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="label block truncate">{l.name}</span>
                  <span className="text-[11px] text-muted">{t("size", { size: l.size })} · {t("qty", { qty: l.qty })}</span>
                </span>
                <span className="text-xs font-semibold">{money(l.price * l.qty)}</span>
              </li>
            ))}
          </ul>

          <div>
            <label className={label} htmlFor="code">{t("code")}</label>
            <div className="flex gap-2">
              <input id="code" value={code} onChange={(e) => setCode(e.target.value)} placeholder={t("codePlaceholder")} dir="ltr" className={`${field} h-11 uppercase`} />
              <button
                type="button"
                disabled={pending || !code.trim() || !w}
                onClick={() => reprice({ code: code.trim().toUpperCase() })}
                className="shrink-0 rounded-xl border border-ink px-4 text-xs font-bold disabled:opacity-40"
              >
                {t("codeApply")}
              </button>
            </div>
            {codeError ? <p role="alert" className="mt-1 text-[11px] text-danger">{codeError}</p> : null}
            {quote?.discount ? <p className="mt-1 text-[11px] text-emerald-700">{t("codeApplied", { code: quote.discount.code })}</p> : null}
          </div>

          <dl className="space-y-2 border-t border-line pt-4 text-sm">
            <Row label={t("subtotal")} value={money(subtotal)} />
            <Row label={t("shipping")} value={quote ? (quote.shippingFee === 0 ? t("free") : money(quote.shippingFee)) : "—"} />
            {quote && quote.discountTotal > 0 ? <Row label={t("discount")} value={`-${money(quote.discountTotal)}`} /> : null}
            <div className="flex items-center justify-between border-t border-line pt-3 text-base font-semibold">
              <dt>{t("total")}</dt>
              <dd>{quote ? money(quote.total) : "—"}</dd>
            </div>
          </dl>

          {error ? <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p> : null}
          <button
            type="submit"
            disabled={pending || !quote || !communeId}
            className="h-12 w-full rounded-full bg-ink text-xs font-bold uppercase tracking-wide text-paper transition hover:bg-ink/85 active:scale-[.99] disabled:bg-muted"
          >
            {pending ? t("placing") : method === "chargily" ? t("payNow") : t("place")}
          </button>
          <p className="text-center text-[11px] text-muted">{method === "chargily" ? t("cardNote") : t("callNote")}</p>
          <p className="text-center text-[11px] text-muted">
            {t.rich("accept", {
              terms: (c) => <Link href="/legal/terms" className="underline">{c}</Link>,
              privacy: (c) => <Link href="/legal/privacy" className="underline">{c}</Link>,
            })}
          </p>
        </div>
      </aside>
    </form>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-muted">
      <dt>{label}</dt>
      <dd className="text-ink">{value}</dd>
    </div>
  );
}
