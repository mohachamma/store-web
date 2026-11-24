"use client";

import { useRouter } from "@/i18n/navigation";
import { BackIcon } from "./icons";

/** Goes back in history when possible, otherwise to the home page. */
export function BackLink({ label }: { label: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => (window.history.length > 1 ? router.back() : router.push("/"))}
      className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-mist"
    >
      <BackIcon />
    </button>
  );
}
