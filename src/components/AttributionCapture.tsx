"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

/** Invisible: keeps the ad tags of the link the visitor arrived with. */
export function AttributionCapture() {
  useEffect(() => captureAttribution(), []);
  return null;
}
