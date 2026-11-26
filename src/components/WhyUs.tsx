import type { WhyUs as WhyUsData } from "@/lib/api/types";
import { CardIcon, GiftIcon, HeadsetIcon, HeartIcon, RefreshIcon, ShieldIcon, StarIcon, TruckIcon } from "./icons";

const ICONS = { truck: TruckIcon, shield: ShieldIcon, refresh: RefreshIcon, headset: HeadsetIcon, card: CardIcon, gift: GiftIcon, star: StarIcon, heart: HeartIcon } as const;

/** The store's selling points. Everything (title, features, icons) is edited in the dashboard. */
export function WhyUs({ data }: { data: WhyUsData }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-10">
      <h2 className="label mb-4 text-[12px] md:text-center">{data.title}</h2>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {data.items.map((it, i) => {
          const Icon = ICONS[it.icon as keyof typeof ICONS] ?? StarIcon;
          return (
            <li key={i} className="flex flex-col items-start gap-2 rounded-[var(--radius-card)] bg-mist p-4 md:items-center md:p-6 md:text-center">
              <span className="grid size-10 place-items-center rounded-full bg-paper">
                <Icon size={20} />
              </span>
              <h3 className="text-[13px] font-semibold leading-snug">{it.title}</h3>
              {it.text ? <p className="text-[11px] leading-relaxed text-muted">{it.text}</p> : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
