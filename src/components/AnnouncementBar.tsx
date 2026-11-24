import { getTranslations } from "next-intl/server";
import { TruckIcon } from "./icons";

export async function AnnouncementBar({ text }: { text?: string | null }) {
  const t = await getTranslations();
  return (
    <div className="flex h-8 items-center justify-center gap-2 bg-ink px-4 text-center text-[11px] font-medium text-paper">
      <TruckIcon size={14} />
      <p className="truncate">{text ?? t("announcement")}</p>
    </div>
  );
}
