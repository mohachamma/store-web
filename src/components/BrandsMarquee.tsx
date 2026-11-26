import Image from "next/image";
import type { Brand, BrandsStrip } from "@/lib/api/types";
import { AppLink } from "./AppLink";

/**
 * Brands strip. Everything is controlled from the dashboard: which brands, their order,
 * whether the strip moves, how fast, and whether it pauses on hover.
 */
export function BrandsMarquee({ brands, strip }: { brands: Brand[]; strip: BrandsStrip }) {
  if (!strip.enabled || brands.length === 0) return null;

  const logo = (b: Brand) => {
    const img = (
      <Image
        src={b.logo.url}
        alt={b.name}
        width={140}
        height={52}
        className="h-10 w-auto max-w-[140px] object-contain opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0 md:h-12"
      />
    );
    return b.href ? (
      <AppLink href={b.href} className="block" aria-label={b.name}>
        {img}
      </AppLink>
    ) : (
      img
    );
  };

  return (
    <section aria-label={strip.title} className="py-6 md:py-8">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="mb-4 text-lg font-semibold md:text-xl">{strip.title}</h2>
      </div>

      {strip.animated ? (
        <Moving brands={brands} strip={strip} logo={logo} />
      ) : (
        <ul className="no-scrollbar mx-auto flex max-w-6xl items-center gap-10 overflow-x-auto px-4 md:justify-between md:px-6">
          {brands.map((b) => (
            <li key={b.id} className="shrink-0">
              {logo(b)}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Moving({ brands, strip, logo }: { brands: Brand[]; strip: BrandsStrip; logo: (b: Brand) => React.ReactNode }) {
  // Repeat the list so each half is wider than the screen, then render two identical halves for a seamless loop.
  const repeats = Math.max(1, Math.ceil(10 / brands.length));
  const half = Array.from({ length: repeats }, () => brands).flat();
  const list = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center gap-12 pe-12 md:gap-16 md:pe-16" aria-hidden={hidden || undefined}>
      {half.map((b, i) => (
        <li key={`${b.id}-${i}`} className="shrink-0">
          {hidden ? <span className="pointer-events-none block">{logo({ ...b, href: null })}</span> : logo(b)}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="marquee-viewport group overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
      <div
        className={`marquee-track flex w-max ${strip.pauseOnHover ? "group-hover:[animation-play-state:paused]" : ""}`}
        style={{ animationDuration: `${Math.max(5, strip.speed)}s` }}
      >
        {list(false)}
        {list(true)}
      </div>
    </div>
  );
}
