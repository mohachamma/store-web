import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/Header";
import { RichText } from "@/components/RichText";
import type { Locale } from "@/i18n/routing";
import { api } from "@/lib/api";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = await api.getPage(slug, locale);
  return { title: page?.title ?? "—" };
}

/** Terms, privacy, returns, shipping, cash on delivery: text, title and the "draft" notice all come from the dashboard. */
export default async function LegalPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const page = await api.getPage(slug, locale);
  if (!page) notFound();
  return (
    <>
      <Header variant="detail" />
      <main className="mx-auto max-w-2xl space-y-6 px-4 pb-12 pt-6 md:px-6">
        <h1 className="font-display text-2xl uppercase tracking-[0.06em]">{page.title}</h1>
        {page.draftNotice ? (
          <p role="note" className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">{page.draftNotice}</p>
        ) : null}
        <RichText text={page.body} />
      </main>
    </>
  );
}
