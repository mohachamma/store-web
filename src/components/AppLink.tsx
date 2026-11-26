import type { ComponentProps, ReactNode } from "react";
import { Link } from "@/i18n/navigation";

/** Dashboard-managed links can be a storefront path ("/sale") or an external https URL. */
export function AppLink({ href, children, ...rest }: { href: string; children: ReactNode } & Omit<ComponentProps<"a">, "href">) {
  if (/^https?:\/\//.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}
