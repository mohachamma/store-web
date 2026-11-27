"use client";

import { useTranslations } from "next-intl";
import { useRef } from "react";
import { Link } from "@/i18n/navigation";
import { CartBadge } from "./CartBadge";
import { BagIcon, CloseIcon, HeartIcon, MenuIcon, UserIcon } from "./icons";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Wordmark } from "./Wordmark";

export interface MenuData {
  /** Women's page link (null while the page is switched off in the dashboard). */
  women: { title: string } | null;
  /** Men's page link (null while the page is switched off). */
  men: { title: string } | null;
  categories: { slug: string; name: string; count: number }[];
  collections: { slug: string; title: string }[];
  /** Legal / information pages, in the dashboard's order. */
  pages: { slug: string; title: string }[];
}

/** Hamburger button + side drawer with every page of the shop, so the visitor never has to go back. Content comes from the API. */
export function MenuDrawer({ data }: { data: MenuData }) {
  const t = useTranslations("menu");
  const dialog = useRef<HTMLDialogElement>(null);
  const close = () => dialog.current?.close();
  const row = "flex items-center justify-between gap-3 rounded-xl px-3 py-3 text-[15px] font-medium transition hover:bg-mist active:bg-mist";
  const head = "label px-3 pb-1 pt-5 text-[11px] text-muted";

  return (
    <>
      <button type="button" onClick={() => dialog.current?.showModal()} aria-label={t("open")} aria-haspopup="dialog" className="relative grid h-10 w-10 place-items-center rounded-full text-ink transition hover:bg-mist">
        <MenuIcon />
      </button>
      <dialog
        ref={dialog}
        aria-label={t("title")}
        onClick={(e) => e.target === dialog.current && close()}
        className="drawer m-0 h-svh max-h-svh w-[min(88vw,22rem)] overflow-y-auto bg-paper p-0 text-ink shadow-2xl backdrop:bg-black/50 me-auto"
      >
        <div className="flex min-h-full flex-col px-3 pb-8 pt-3">
          <div className="flex items-center justify-between px-1">
            <button type="button" onClick={close} aria-label={t("close")} className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-mist">
              <CloseIcon />
            </button>
            <span onClick={close}><Wordmark /></span>
            <span className="size-10" aria-hidden />
          </div>

          {/* Pressing any link closes the menu (the page changes underneath). */}
          <nav aria-label={t("title")} onClick={(e) => (e.target as HTMLElement).closest("a") && close()}>
            <ul className="mt-4 space-y-0.5">
              <li><Link href="/" className={row}>{t("home")}</Link></li>
              {data.women ? <li><Link href="/women" className={row}>{data.women.title}</Link></li> : null}
              {data.men ? <li><Link href="/men" className={row}>{data.men.title}</Link></li> : null}
              <li><Link href="/search" className={row}>{t("shop")}</Link></li>
              <li><Link href="/sale" className={`${row} text-danger`}>{t("sale")}</Link></li>
            </ul>

            {data.categories.length ? (
              <>
                <h2 className={head}>{t("categories")}</h2>
                <ul className="space-y-0.5">
                  {data.categories.map((c) => (
                    <li key={c.slug}>
                      <Link href={`/search?category=${encodeURIComponent(c.slug)}`} className={row}>
                        {c.name}
                        <span className="text-xs text-muted">{c.count}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            {data.collections.length ? (
              <>
                <h2 className={head}>{t("collections")}</h2>
                <ul className="space-y-0.5">
                  {data.collections.map((c) => (
                    <li key={c.slug}><Link href={`/collections/${encodeURIComponent(c.slug)}`} className={row}>{c.title}</Link></li>
                  ))}
                </ul>
              </>
            ) : null}

            <h2 className={head}>{t("myspace")}</h2>
            <ul className="space-y-0.5">
              <li><Link href="/favorites" className={row}><span className="flex items-center gap-3"><HeartIcon size={18} />{t("favorites")}</span></Link></li>
              <li><Link href="/cart" className={row}><span className="flex items-center gap-3"><BagIcon size={18} />{t("cart")}</span><CartBadge className="static! end-auto! top-auto!" /></Link></li>
              <li><Link href="/account" className={row}><span className="flex items-center gap-3"><UserIcon size={18} />{t("account")}</span></Link></li>
            </ul>

            <h2 className={head}>{t("info")}</h2>
            <ul className="space-y-0.5">
              {data.pages.map((p) => (
                <li key={p.slug}><Link href={`/legal/${p.slug}`} className={`${row} text-[14px] font-normal text-muted`}>{p.title}</Link></li>
              ))}
              <li><Link href="/contact" className={`${row} text-[14px] font-normal text-muted`}>{t("contact")}</Link></li>
            </ul>
          </nav>

          <div className="mt-auto px-3 pt-8">
            <LanguageSwitcher />
          </div>
        </div>
      </dialog>
    </>
  );
}
