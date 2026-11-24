import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { ChevronIcon } from "./icons";

/** A titled, horizontally scrolling row (mobile app style); also used on desktop. */
export function Row({
  title,
  href,
  viewAll,
  titleClassName = "",
  children,
}: {
  title: string;
  href?: string;
  viewAll?: string;
  titleClassName?: string;
  children: ReactNode;
}) {
  return (
    <section className="py-4">
      <div className="mx-auto mb-3 flex max-w-6xl items-center justify-between px-4 md:px-6">
        <h2 className={`label text-[12px] ${titleClassName}`}>{title}</h2>
        {href && viewAll ? (
          <Link href={href} className="flex items-center gap-0.5 text-[11px] text-muted hover:text-ink">
            {viewAll}
            <ChevronIcon size={14} />
          </Link>
        ) : null}
      </div>
      <div className="mx-auto max-w-6xl">
        <div className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-1 md:scroll-px-6 md:gap-4 md:px-6">
          {children}
        </div>
      </div>
    </section>
  );
}
