"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { loginAction, mergeFavoritesAction, registerAction } from "@/app/[locale]/account/actions";
import { useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { favorites } from "@/lib/favorites";

const field = "h-12 w-full rounded-xl bg-mist px-4 text-sm outline-none transition placeholder:text-muted focus:bg-paper focus:ring-2 focus:ring-ink/15";

/** Sign in / create account. Afterwards the guest's favorites are copied to the account. */
export function AuthForms() {
  const t = useTranslations("account");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const errorText = (c: string) => (t.has(`errors.${c}`) ? t(`errors.${c}`) : t("errors.generic"));

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email"));
    const password = String(f.get("password"));
    setError(null);
    setNotice(null);
    start(async () => {
      const r = mode === "login" ? await loginAction({ email, password }) : await registerAction({ email, password, name: String(f.get("name") ?? "") });
      if (!r.ok) return setError(errorText(r.code));
      if (r.confirmationRequired) return setNotice(t("confirmEmail"));
      const merged = await mergeFavoritesAction(favorites.ids(), locale).catch(() => null);
      if (merged) favorites.replace(merged.products);
      router.refresh();
    });
  }

  const tab = (m: "login" | "register") =>
    `flex-1 rounded-full py-2.5 text-xs font-bold uppercase tracking-wide transition ${mode === m ? "bg-ink text-paper" : "text-muted"}`;

  return (
    <div className="mx-auto w-full max-w-sm space-y-5 px-4 py-10">
      <h1 className="sr-only">{t("title")}</h1>
      <div className="flex gap-1 rounded-full bg-mist p-1" role="tablist">
        <button type="button" role="tab" aria-selected={mode === "login"} className={tab("login")} onClick={() => setMode("login")}>{t("login")}</button>
        <button type="button" role="tab" aria-selected={mode === "register"} className={tab("register")} onClick={() => setMode("register")}>{t("register")}</button>
      </div>
      <form onSubmit={submit} className="space-y-4">
        {mode === "register" ? (
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold" htmlFor="a-name">{t("name")}</label>
            <input id="a-name" name="name" minLength={2} maxLength={80} autoComplete="name" className={field} />
          </div>
        ) : null}
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold" htmlFor="a-email">{t("email")}</label>
          <input id="a-email" name="email" type="email" required autoComplete="email" dir="ltr" className={`${field} text-start`} />
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold" htmlFor="a-password">{t("password")}</label>
          <input id="a-password" name="password" type="password" required minLength={mode === "register" ? 8 : 1} autoComplete={mode === "login" ? "current-password" : "new-password"} dir="ltr" className={`${field} text-start`} />
          {mode === "register" ? <p className="mt-1 text-[11px] text-muted">{t("passwordHint")}</p> : null}
        </div>
        {error ? <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p> : null}
        {notice ? <p role="status" className="rounded-xl bg-mist px-4 py-3 text-sm">{notice}</p> : null}
        <button type="submit" disabled={pending} className="h-12 w-full rounded-full bg-ink text-xs font-bold uppercase tracking-wide text-paper disabled:bg-muted">
          {pending ? t("wait") : mode === "login" ? t("login") : t("register")}
        </button>
      </form>
      <p className="text-center text-[11px] text-muted">{t("optional")}</p>
    </div>
  );
}
