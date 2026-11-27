/** Translated name for a known color ("black" → "أسود"); any other name the owner typed is shown as written. */
export function colorLabel(t: { has: (key: string) => boolean; (key: string): string }, name: string): string {
  const key = name.trim().toLowerCase();
  return key && t.has(key) ? t(key) : name;
}
