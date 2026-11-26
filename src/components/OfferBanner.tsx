import Image from "next/image";
import type { Offer } from "@/lib/api/types";
import { AppLink } from "./AppLink";
import { Countdown } from "./Countdown";
import { ChevronIcon } from "./icons";

/** Promotional banner (dark or light), fully driven by the dashboard. */
export function OfferBanner({ offer }: { offer: Offer }) {
  const dark = offer.theme === "dark";
  // Expired offers are already filtered out by the API; the countdown hides itself at zero.

  return (
    <section className="mx-auto max-w-6xl px-4 py-4 md:px-6 md:py-6">
      <div
        className={`grid overflow-hidden rounded-[var(--radius-card)] md:grid-cols-2 ${
          dark ? "bg-ink text-paper" : "border border-line bg-mist text-ink"
        }`}
      >
        {offer.image ? (
          <div className="relative aspect-[4/3] bg-mist md:aspect-auto md:min-h-72">
            <Image src={offer.image.url} alt={offer.image.alt} fill sizes="(min-width: 768px) 560px, 100vw" className="object-cover" />
          </div>
        ) : null}
        <div className={`flex flex-col justify-center gap-4 p-6 md:p-10 ${offer.image ? "" : "md:col-span-2"}`}>
          {offer.label ? <p className="label opacity-70">{offer.label}</p> : null}
          <h2 className="text-2xl font-semibold leading-tight md:text-4xl">
            {offer.title}
            {offer.subtitle ? <span className="block">{offer.subtitle}</span> : null}
          </h2>
          {offer.countdownEndsAt ? <Countdown endsAt={offer.countdownEndsAt} /> : null}
          {offer.href && offer.ctaLabel ? (
            <AppLink
              href={offer.href}
              className={`mt-1 inline-flex w-fit items-center gap-2 rounded-full px-6 py-3 text-xs font-bold transition active:scale-[.98] ${
                dark ? "bg-paper text-ink hover:bg-paper/90" : "bg-ink text-paper hover:bg-ink/85"
              }`}
            >
              {offer.ctaLabel}
              <ChevronIcon size={14} />
            </AppLink>
          ) : null}
        </div>
      </div>
    </section>
  );
}
