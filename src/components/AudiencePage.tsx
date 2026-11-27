import Image from "next/image";
import { notFound } from "next/navigation";
import type { Locale } from "@/i18n/routing";
import type { WomenPage } from "@/lib/api/types";
import { Header } from "./Header";
import { ShopView, type ShopParams } from "./ShopView";

/** Women's / Men's page: cover (title, subtitle, image from the dashboard) + the matching products with the shop's filters. */
export function AudiencePage({ page, audience, basePath, locale, raw }: { page: WomenPage; audience: "women" | "men"; basePath: string; locale: Locale; raw: ShopParams }) {
  if (!page.enabled) notFound();
  return (
    <>
      <Header />
      <main className="space-y-4 pt-1">
        <section className="mx-auto max-w-6xl px-4 pt-2 md:px-6">
          <div className="relative overflow-hidden rounded-[var(--radius-card)] bg-mist">
            {page.heroImage ? <Image src={page.heroImage.url} alt={page.heroImage.alt} fill priority sizes="(min-width: 1152px) 1100px, 100vw" className="object-cover" /> : null}
            <div className={`relative flex min-h-40 flex-col justify-end gap-1 p-6 md:min-h-60 md:p-10 ${page.heroImage ? "bg-gradient-to-t from-black/55 to-transparent text-paper" : ""}`}>
              <h1 className="font-display text-3xl uppercase tracking-[0.08em] md:text-5xl">{page.title}</h1>
              {page.subtitle ? <p className="max-w-xl text-sm opacity-80 md:text-base">{page.subtitle}</p> : null}
            </div>
          </div>
        </section>
        <ShopView locale={locale} raw={raw} basePath={basePath} audience={audience} heading={page.title} />
      </main>
    </>
  );
}
