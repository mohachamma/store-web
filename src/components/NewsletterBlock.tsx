"use client";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { subscribeAction } from "@/app/[locale]/newsletter-actions";
import type { NewsletterBlock as NewsletterData } from "@/lib/api/types";

/** Email sign-up. Title, text and button label come from the dashboard; the emails are kept by the API. */
export function NewsletterBlock({ data }: { data: NewsletterData }) {
  const t = useTranslations("newsletter");
  const [state, setState] = useState<"idle" | "done" | "error">("idle");
  const [pending, start] = useTransition();
  return (
    <section className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-10">
      <div className="rounded-[var(--radius-card)] bg-ink px-6 py-8 text-paper md:px-12 md:py-12 md:text-center">
        <h2 className="text-xl font-semibold md:text-3xl">{data.title}</h2>
        {data.subtitle ? <p className="mt-2 text-sm opacity-75">{data.subtitle}</p> : null}
        {state === "done" ? (
          <p role="status" className="mt-5 text-sm font-semibold">{t("thanks")}</p>
        ) : (
          <form
            className="mx-auto mt-5 flex max-w-md flex-col gap-2 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              const email = String(new FormData(e.currentTarget).get("email") ?? "");
              start(async () => setState((await subscribeAction(email)) ? "done" : "error"));
            }}
          >
            <label htmlFor="nl-email" className="sr-only">{t("email")}</label>
            <input id="nl-email" name="email" type="email" required autoComplete="email" dir="ltr" placeholder={t("email")} className="h-12 min-w-0 flex-1 rounded-full bg-paper px-5 text-start text-sm text-ink outline-none placeholder:text-muted" />
            <button type="submit" disabled={pending} className="h-12 shrink-0 rounded-full border border-paper px-6 text-xs font-bold uppercase tracking-wide transition hover:bg-paper hover:text-ink disabled:opacity-60">
              {data.button}
            </button>
          </form>
        )}
        {state === "error" ? <p role="alert" className="mt-3 text-xs text-red-300">{t("error")}</p> : null}
        <p className="mt-4 text-[11px] opacity-60">{t("privacy")}</p>
      </div>
    </section>
  );
}
