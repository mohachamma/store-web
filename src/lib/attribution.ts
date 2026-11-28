/**
 * Remembers which ad brought the visitor, so the order can say so.
 * The ad link carries tags (?utm_source=facebook&utm_campaign=eid_sale); we keep the latest ones for 30 days in this browser only.
 * No personal data is involved: just the labels the owner put in his own ad links.
 */
const KEY = "store.attribution";
const MAX_AGE_MS = 30 * 24 * 3600 * 1000;

export interface Attribution {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
}

/** Reads the tags of the current URL; the platforms' own click ids are a fallback when the link has no utm tags. */
export function fromSearch(search: string): Attribution | null {
  const p = new URLSearchParams(search);
  const a: Attribution = {
    source: p.get("utm_source") ?? undefined,
    medium: p.get("utm_medium") ?? undefined,
    campaign: p.get("utm_campaign") ?? undefined,
    content: p.get("utm_content") ?? undefined,
  };
  if (!a.source) {
    if (p.has("fbclid")) Object.assign(a, { source: "facebook", medium: a.medium ?? "paid" });
    else if (p.has("ttclid")) Object.assign(a, { source: "tiktok", medium: a.medium ?? "paid" });
    else if (p.has("gclid")) Object.assign(a, { source: "google", medium: a.medium ?? "paid" });
  }
  return a.source || a.medium || a.campaign || a.content ? a : null;
}

export function captureAttribution(search: string = window.location.search) {
  const a = fromSearch(search);
  if (!a) return; // a visit without tags never erases a previous ad
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...a, at: Date.now() }));
  } catch {
    /* storage blocked: the order simply has no ad */
  }
}

export function readAttribution(): Attribution | undefined {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return undefined;
    const { at, ...a } = JSON.parse(raw) as Attribution & { at: number };
    if (!at || Date.now() - at > MAX_AGE_MS) {
      localStorage.removeItem(KEY);
      return undefined;
    }
    return a;
  } catch {
    return undefined;
  }
}
