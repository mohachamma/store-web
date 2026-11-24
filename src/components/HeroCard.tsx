import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { HomeContent } from "@/lib/api/types";

export function HeroCard({ hero, cta }: { hero: HomeContent["hero"]; cta: string }) {
  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6">
      <Link
        href={`/collections/${hero.collectionSlug}`}
        className="group relative block aspect-[16/11] overflow-hidden rounded-[var(--radius-card)] bg-mist md:aspect-[21/9]"
      >
        <Image
          src={hero.image.url}
          alt={hero.image.alt}
          fill
          priority
          sizes="(min-width: 1152px) 1104px, 100vw"
          className="object-cover transition duration-700 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 p-5 text-center text-paper md:items-start md:p-10 md:text-start">
          <p className="text-[11px] opacity-90">{hero.subtitle}</p>
          <h1 className="font-display text-2xl uppercase tracking-[0.12em] md:text-5xl">{hero.title}</h1>
          <span className="mt-2 hidden rounded-full bg-paper px-6 py-2.5 text-xs font-semibold text-ink md:inline-block">
            {cta}
          </span>
        </div>
      </Link>
    </div>
  );
}
