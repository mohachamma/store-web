import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/Header";
import { UserIcon } from "@/components/icons";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("account");
  return { title: t("title"), robots: { index: false } };
}

export default async function AccountPage({ params }: { params: Promise<{ locale: Locale }> }) {
  setRequestLocale((await params).locale);
  const t = await getTranslations("account");
  return (
    <>
      <Header />
      <main className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-20 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-mist">
          <UserIcon size={26} />
        </span>
        <h1 className="label text-[12px]">{t("title")}</h1>
        <p className="text-sm text-muted">{t("soon")}</p>
      </main>
    </>
  );
}
