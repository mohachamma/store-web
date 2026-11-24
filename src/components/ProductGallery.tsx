"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import type { Image as Img } from "@/lib/api/types";

/** Vertical, snap-scrolling gallery with vertical dots (as in the reference video). */
export function ProductGallery({ images }: { images: Img[] }) {
  const t = useTranslations("product");
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = scroller.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }
      },
      { root, threshold: 0.6 },
    );
    root.querySelectorAll("[data-index]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [images.length]);

  const go = (i: number) =>
    scroller.current?.querySelector<HTMLElement>(`[data-index="${i}"]`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });

  return (
    <div className="relative bg-paper md:overflow-hidden md:rounded-[var(--radius-card)] md:bg-mist">
      <div
        ref={scroller}
        className="no-scrollbar h-[58svh] snap-y snap-mandatory overflow-y-auto overscroll-contain md:h-[72vh]"
        tabIndex={0}
        aria-roledescription="carousel"
      >
        {images.map((img, i) => (
          <div key={img.url} data-index={i} className="relative h-full snap-start" aria-label={t("image", { index: i + 1, total: images.length })}>
            <Image
              src={img.url}
              alt={img.alt}
              fill
              priority={i === 0}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-contain p-8"
            />
          </div>
        ))}
      </div>
      {images.length > 1 ? (
        <div className="absolute end-4 top-1/2 flex -translate-y-1/2 flex-col items-center gap-1.5">
          {images.map((img, i) => (
            <button
              key={img.url}
              type="button"
              onClick={() => go(i)}
              aria-label={t("image", { index: i + 1, total: images.length })}
              aria-current={i === active}
              className={`w-1 rounded-full transition-all ${i === active ? "h-5 bg-ink" : "h-1 bg-ink/30"}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
