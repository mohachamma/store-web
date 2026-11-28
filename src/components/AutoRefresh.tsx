"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Re-reads the server data of the page every minute (the order page follows the parcel by itself). */
export function AutoRefresh({ seconds = 60 }: { seconds?: number }) {
  const router = useRouter();
  useEffect(() => {
    const id = setInterval(() => router.refresh(), seconds * 1000);
    return () => clearInterval(id);
  }, [router, seconds]);
  return null;
}
