import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BackLink } from "./BackLink";
import { CartBadge } from "./CartBadge";
import { BagIcon, HeartIcon, SearchIcon, UserIcon } from "./icons";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Wordmark } from "./Wordmark";

/**
 * "home": centred wordmark (desktop adds nav + icons).
 * "detail": back · wordmark · bag — like the product screen in the reference video.
 */
export async function Header({ variant = "home" }: { variant?: "home" | "detail" }) {
  const t = await getTranslations("nav");
  const iconBtn = "relative grid h-10 w-10 place-items-center rounded-full text-ink transition hover:bg-mist";

  return (
    <header className="sticky top-0 z-30 border-b border-transparent bg-paper/90 backdrop-blur supports-[backdrop-filter]:bg-paper/75">
      <div className="mx-auto grid h-14 max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-4 md:h-16 md:px-6">
        <div className="flex items-center gap-1">
          {variant === "detail" ? (
            <BackLink label={t("home")} />
          ) : (
            <nav className="hidden items-center gap-6 md:flex" aria-label={t("menu")}>
              <Link href="/" className="label hover:opacity-60">{t("shop")}</Link>
              <Link href="/collections/winter" className="label hover:opacity-60">{t("collections")}</Link>
            </nav>
          )}
        </div>

        <Wordmark />

        <div className="flex items-center justify-end gap-0.5">
          <div className="hidden md:block">
            <LanguageSwitcher compact />
          </div>
          <Link href="/search" className={`${iconBtn} hidden md:grid`} aria-label={t("search")}>
            <SearchIcon />
          </Link>
          <Link href="/favorites" className={`${iconBtn} hidden md:grid`} aria-label={t("favorites")}>
            <HeartIcon />
          </Link>
          <Link href="/account" className={`${iconBtn} hidden md:grid`} aria-label={t("account")}>
            <UserIcon />
          </Link>
          <Link
            href="/cart"
            className={`${iconBtn} ${variant === "detail" ? "" : "hidden md:grid"}`}
            aria-label={t("cart")}
          >
            <BagIcon />
            <CartBadge className="end-0.5 top-0.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
