import { TruckIcon } from "./icons";

/** Thin top bar. The text is edited in the dashboard; no text = no bar. */
export function AnnouncementBar({ text }: { text: string | null }) {
  if (!text) return null;
  return (
    <div className="flex h-8 items-center justify-center gap-2 bg-ink px-4 text-center text-[11px] font-medium text-paper">
      <TruckIcon size={14} />
      <p className="truncate">{text}</p>
    </div>
  );
}
