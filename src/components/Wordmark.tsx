import { brand } from "@/config/brand";
import { Link } from "@/i18n/navigation";

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      dir="ltr"
      className={`font-display text-[22px] font-medium uppercase leading-none tracking-[0.28em] text-ink ${className}`}
      aria-label={brand.name}
    >
      {brand.wordmark}
    </Link>
  );
}
