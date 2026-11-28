import { useTranslations } from "next-intl";
import type { OrderView } from "@/lib/api/types";

const STEPS = ["pending", "confirmed", "shipped", "delivered"] as const;

/** Where the order is: received → confirmed → on its way → delivered. Cancelled / returned orders show a single notice instead. */
export function OrderTimeline({ status }: { status: OrderView["status"] }) {
  const t = useTranslations("order");
  if (status === "cancelled" || status === "returned") {
    return <p role="status" className="rounded-xl bg-mist px-4 py-3 text-center text-sm font-semibold">{t(`status.${status}`)}</p>;
  }
  const current = STEPS.indexOf(status);
  return (
    <ol className="flex items-start" aria-label={t("timeline.label")}>
      {STEPS.map((s, i) => {
        const done = i < current || status === "delivered";
        const active = i === current && status !== "delivered";
        return (
          <li key={s} className="relative flex min-w-0 flex-1 flex-col items-center gap-2 text-center" aria-current={active ? "step" : undefined}>
            {i > 0 ? <span aria-hidden className={`absolute start-[-50%] top-3.5 h-0.5 w-full ${i <= current || status === "delivered" ? "bg-ink" : "bg-line"}`} /> : null}
            <span
              aria-hidden
              className={`relative z-10 grid size-7 place-items-center rounded-full text-[11px] font-bold ${done ? "bg-ink text-paper" : active ? "border-2 border-ink bg-paper text-ink" : "border border-line bg-paper text-muted"}`}
            >
              {done ? "✓" : i + 1}
            </span>
            <span className={`px-1 text-[11px] leading-tight ${done || active ? "font-semibold text-ink" : "text-muted"}`}>{t(`timeline.${s}`)}</span>
          </li>
        );
      })}
    </ol>
  );
}
