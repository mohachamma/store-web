import Image from "next/image";
import type { CategoryCard } from "@/lib/api/types";
import { AppLink } from "./AppLink";

/** Big curated cards (e.g. Men / Women / Casual / Best seller). Titles, images and links come from the dashboard. */
export function CategoryCards({ cards }: { cards: CategoryCard[] }) {
  if (cards.length === 0) return null;
  return (
    <section className="mx-auto max-w-6xl px-4 py-4 md:px-6 md:py-6">
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {cards.map((c, i) => {
          const body = (
            <>
              <Image src={c.image.url} alt={c.image.alt} fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover transition duration-500 group-hover:scale-105" priority={i < 2} />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-12 text-paper">
                <span className="block text-sm font-semibold leading-tight md:text-base">{c.title}</span>
                {c.subtitle ? <span className="mt-0.5 block text-[11px] opacity-80">{c.subtitle}</span> : null}
              </span>
            </>
          );
          const cls = "group relative block aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] bg-mist";
          return (
            <li key={c.id}>
              {c.href ? (
                <AppLink href={c.href} className={cls}>
                  {body}
                </AppLink>
              ) : (
                <div className={cls}>{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
