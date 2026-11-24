import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("common");
  return (
    <main className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-28 text-center">
      <p className="font-display text-6xl tracking-[0.2em]" dir="ltr">404</p>
      <h1 className="text-sm text-muted">{t("notFound")}</h1>
      <Link href="/" className="rounded-full bg-ink px-6 py-3 text-xs font-bold uppercase text-paper">
        {t("backHome")}
      </Link>
    </main>
  );
}
