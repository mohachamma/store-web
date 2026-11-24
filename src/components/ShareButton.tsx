"use client";

import { useState } from "react";
import { ShareIcon } from "./icons";

export function ShareButton({ label, copied, title }: { label: string; copied: string; title: string }) {
  const [done, setDone] = useState(false);
  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title, url });
      else {
        await navigator.clipboard.writeText(url);
        setDone(true);
        setTimeout(() => setDone(false), 1500);
      }
    } catch {
      /* user cancelled */
    }
  };
  return (
    <button type="button" onClick={share} aria-label={done ? copied : label} className="grid h-10 w-10 place-items-center rounded-full text-paper transition hover:bg-white/15">
      <ShareIcon />
    </button>
  );
}
