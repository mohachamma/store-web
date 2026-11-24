import Image from "next/image";
import type { Look } from "@/lib/api/types";
import { Link } from "@/i18n/navigation";

export function LookCard({ look, priority = false, enterIndex }: { look: Look; priority?: boolean; enterIndex?: number }) {
  const first = look.productSlugs[0];
  return (
    <Link
      href={first ? `/products/${first}` : "/"}
      style={enterIndex === undefined ? undefined : { animationDelay: `${120 + enterIndex * 90}ms` }}
      className={`${enterIndex === undefined ? "" : "[animation:look-rise_.6s_cubic-bezier(.2,.8,.2,1)_both]"} relative block aspect-[3/4] w-[44vw] max-w-[240px] shrink-0 snap-start overflow-hidden rounded-[var(--radius-card)] bg-mist shadow-[0_10px_30px_-12px_rgba(0,0,0,.35)] transition-transform duration-200 ease-out active:scale-[.96] md:w-[230px]`}
    >
      <Image src={look.image.url} alt={look.image.alt} fill priority={priority} sizes="240px" className="object-cover transition duration-500 hover:scale-[1.03]" />
    </Link>
  );
}
