"use client";

import { useTranslations } from "next-intl";
import { brand } from "@/config/brand";
import { Link, usePathname } from "@/i18n/navigation";
import { CartBadge } from "./CartBadge";
import { BagIcon, HeartIcon, UserIcon } from "./icons";

/** App-like bottom navigation, mobile only. */
export function MobileTabBar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const is = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const item = (href: string, label: string, icon: React.ReactNode) => (
    <Link
      href={href}
      aria-label={label}
      aria-current={is(href) ? "page" : undefined}
      className={`relative grid h-full flex-1 place-items-center transition ${is(href) ? "text-ink" : "text-muted"}`}
    >
      {icon}
    </Link>
  );

  return (
    <nav
      aria-label={t("menu")}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <div className="flex h-[var(--tabbar-h)] items-stretch">
        {item(
          "/",
          t("home"),
          <span dir="ltr" className="font-display text-[15px] font-semibold tracking-[0.12em]">
            {brand.monogram}
          </span>,
        )}
        {item("/favorites", t("favorites"), <HeartIcon filled={is("/favorites")} />)}
        {item(
          "/cart",
          t("cart"),
          <span className="relative">
            <BagIcon />
            <CartBadge />
          </span>,
        )}
        {item("/account", t("account"), <UserIcon />)}
      </div>
    </nav>
  );
}
