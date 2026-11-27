"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { CartBadge } from "./CartBadge";
import { BagIcon, HeartIcon, HomeIcon, UserIcon } from "./icons";

/** App-like bottom navigation, mobile only: a floating glass pill with an icon and a label per tab. */
export function MobileTabBar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const is = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const item = (href: string, label: string, icon: React.ReactNode) => (
    <Link
      href={href}
      aria-current={is(href) ? "page" : undefined}
      className={`relative flex h-full flex-1 flex-col items-center justify-center gap-1 rounded-full transition ${is(href) ? "text-white" : "text-white/70"}`}
    >
      {icon}
      <span className={`text-[10px] leading-none ${is(href) ? "font-bold" : "font-medium"}`}>{label}</span>
    </Link>
  );

  return (
    <nav aria-label={t("menu")} className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-5 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:hidden">
      <div className="pointer-events-auto mx-auto flex h-16 max-w-sm items-stretch rounded-full bg-black/40 px-2 shadow-[0_8px_30px_-8px_rgba(0,0,0,.45)] ring-1 ring-white/25 backdrop-blur-xl backdrop-saturate-150">
        {item("/", t("home"), <HomeIcon size={22} filled={is("/")} />)}
        {item(
          "/cart",
          t("cart"),
          <span className="relative">
            <BagIcon size={22} />
            <CartBadge className="bg-white! text-ink!" />
          </span>,
        )}
        {item("/favorites", t("favorites"), <HeartIcon size={22} filled={is("/favorites")} />)}
        {item("/account", t("account"), <UserIcon size={22} />)}
      </div>
    </nav>
  );
}
