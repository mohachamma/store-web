"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRef, useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { CatalogFilters, SortKey } from "@/lib/api/types";
import { formatDZD } from "@/lib/format";

export interface ShopState {
  q?: string;
  category?: string;
  size?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  sort: SortKey;
}

const SORTS: SortKey[] = ["newest", "price_asc", "price_desc", "discount"];
const chip = "shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition";
const on = "border-ink bg-ink text-paper";
const off = "border-line hover:border-ink";

/** Filter bar for the shop page. The whole state lives in the URL, so results are shareable and the server renders them. */
export function ShopFilters({ filters, state }: { filters: CatalogFilters; state: ShopState }) {
  const t = useTranslations("search");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const [pending, start] = useTransition();

  function go(next: Partial<ShopState>) {
    const merged = { ...state, ...next };
    const p = new URLSearchParams();
    if (merged.q) p.set("q", merged.q);
    if (merged.category) p.set("category", merged.category);
    if (merged.size) p.set("size", merged.size);
    if (merged.color) p.set("color", merged.color);
    if (merged.minPrice !== undefined) p.set("minPrice", String(merged.minPrice));
    if (merged.maxPrice !== undefined) p.set("maxPrice", String(merged.maxPrice));
    if (merged.sort !== "newest") p.set("sort", merged.sort);
    const qs = p.toString();
    start(() => router.push(`/search${qs ? `?${qs}` : ""}`));
  }

  const activeCount = [state.size, state.color, state.minPrice, state.maxPrice].filter((v) => v !== undefined && v !== "").length;
  const money = (n: number) => formatDZD(n, locale);
  const numOrUndef = (v: FormDataEntryValue | null) => {
    const n = Number(String(v ?? "").replace(/\D/g, ""));
    return String(v ?? "").trim() === "" || !Number.isFinite(n) ? undefined : n;
  };

  return (
    <div className="space-y-3" aria-busy={pending}>
      {filters.categories.length > 1 || state.category ? (
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0" role="group" aria-label={t("categories")}>
          <button type="button" className={`${chip} ${!state.category ? on : off}`} onClick={() => go({ category: undefined })}>
            {t("all")}
          </button>
          {filters.categories.map((c) => (
            <button key={c.slug} type="button" className={`${chip} ${state.category === c.slug ? on : off}`} onClick={() => go({ category: c.slug })}>
              {c.name} <span className="opacity-60">({c.count})</span>
            </button>
          ))}
        </div>
      ) : null}

      <div className="flex items-center gap-2">
        <button type="button" onClick={() => dialog.current?.showModal()} className={`${chip} ${activeCount ? on : off} flex items-center gap-2`}>
          {t("filters")}
          {activeCount ? <span className="grid size-5 place-items-center rounded-full bg-paper text-[10px] text-ink">{activeCount}</span> : null}
        </button>
        <label className="ms-auto flex items-center gap-2 text-[11px] text-muted">
          <span className="sr-only md:not-sr-only">{t("sortBy")}</span>
          <select value={state.sort} onChange={(e) => go({ sort: e.target.value as SortKey })} className="h-10 rounded-full border border-line bg-paper px-4 text-xs font-semibold text-ink">
            {SORTS.map((s) => (
              <option key={s} value={s}>{t(`sort.${s}`)}</option>
            ))}
          </select>
        </label>
      </div>

      {activeCount ? (
        <div className="flex flex-wrap items-center gap-2">
          {state.size ? <Active label={`${t("size")}: ${state.size}`} onClear={() => go({ size: undefined })} clear={t("clear")} /> : null}
          {state.color ? <Active label={`${t("color")}: ${state.color}`} onClear={() => go({ color: undefined })} clear={t("clear")} /> : null}
          {state.minPrice !== undefined || state.maxPrice !== undefined ? (
            <Active
              label={`${state.minPrice !== undefined ? money(state.minPrice) : "…"} – ${state.maxPrice !== undefined ? money(state.maxPrice) : "…"}`}
              onClear={() => go({ minPrice: undefined, maxPrice: undefined })}
              clear={t("clear")}
            />
          ) : null}
          <button type="button" onClick={() => go({ size: undefined, color: undefined, minPrice: undefined, maxPrice: undefined })} className="text-[11px] font-semibold underline">
            {t("clearAll")}
          </button>
        </div>
      ) : null}

      <dialog
        ref={dialog}
        onClick={(e) => e.target === dialog.current && dialog.current?.close()}
        className="m-auto max-h-[88svh] w-[min(32rem,calc(100vw-1.5rem))] overflow-y-auto rounded-[28px] bg-paper p-0 text-ink backdrop:bg-black/50 max-md:mb-0 max-md:rounded-b-none"
      >
        <form
          method="dialog"
          className="space-y-6 p-6"
          onSubmit={(e) => {
            const f = new FormData(e.currentTarget);
            go({ size: String(f.get("size") ?? "") || undefined, color: String(f.get("color") ?? "") || undefined, minPrice: numOrUndef(f.get("minPrice")), maxPrice: numOrUndef(f.get("maxPrice")) });
          }}
        >
          <div className="flex items-center justify-between">
            <h2 className="label text-[12px]">{t("filters")}</h2>
            <button type="button" onClick={() => dialog.current?.close()} className="grid size-9 place-items-center rounded-full bg-mist text-lg leading-none" aria-label={t("close")}>×</button>
          </div>

          {filters.sizes.length ? (
            <fieldset className="space-y-3">
              <legend className="label mb-2">{t("size")}</legend>
              <div className="flex flex-wrap gap-2">
                <Choice name="size" value="" label={t("any")} checked={!state.size} />
                {filters.sizes.map((s) => (
                  <Choice key={s} name="size" value={s} label={s} checked={state.size === s} />
                ))}
              </div>
            </fieldset>
          ) : null}

          {filters.colors.length ? (
            <fieldset className="space-y-3">
              <legend className="label mb-2">{t("color")}</legend>
              <div className="flex flex-wrap gap-2">
                <Choice name="color" value="" label={t("any")} checked={!state.color} />
                {filters.colors.map((c) => (
                  <Choice key={c} name="color" value={c} label={c} checked={state.color?.toLowerCase() === c.toLowerCase()} />
                ))}
              </div>
            </fieldset>
          ) : null}

          <fieldset className="space-y-3">
            <legend className="label mb-2">{t("price")}</legend>
            <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
              <input name="minPrice" inputMode="numeric" dir="ltr" aria-label={t("min")} placeholder={filters.priceRange ? String(filters.priceRange.min) : t("min")} defaultValue={state.minPrice ?? ""} className="h-12 w-full min-w-0 rounded-xl bg-mist px-4 text-center text-sm outline-none focus:ring-2 focus:ring-ink/15" />
              <span aria-hidden>–</span>
              <input name="maxPrice" inputMode="numeric" dir="ltr" aria-label={t("max")} placeholder={filters.priceRange ? String(filters.priceRange.max) : t("max")} defaultValue={state.maxPrice ?? ""} className="h-12 w-full min-w-0 rounded-xl bg-mist px-4 text-center text-sm outline-none focus:ring-2 focus:ring-ink/15" />
            </div>
            {filters.priceRange ? <p className="text-[11px] text-muted">{money(filters.priceRange.min)} – {money(filters.priceRange.max)}</p> : null}
          </fieldset>

          <div className="flex gap-3">
            <button type="button" onClick={() => { go({ size: undefined, color: undefined, minPrice: undefined, maxPrice: undefined }); dialog.current?.close(); }} className="h-12 flex-1 rounded-full border border-ink text-xs font-bold uppercase">{t("reset")}</button>
            <button type="submit" className="h-12 flex-[2] rounded-full bg-ink text-xs font-bold uppercase tracking-wide text-paper">{t("apply")}</button>
          </div>
        </form>
      </dialog>
    </div>
  );
}

function Choice({ name, value, label, checked }: { name: string; value: string; label: string; checked: boolean }) {
  return (
    <label className="cursor-pointer">
      <input type="radio" name={name} value={value} defaultChecked={checked} className="peer sr-only" />
      <span className="inline-block min-w-11 rounded-full border border-line px-4 py-2 text-center text-xs font-semibold transition peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:ring-2 peer-focus-visible:ring-ink/30">{label}</span>
    </label>
  );
}

function Active({ label, onClear, clear }: { label: string; onClear: () => void; clear: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-mist py-1.5 ps-3 pe-1.5 text-[11px] font-semibold">
      {label}
      <button type="button" onClick={onClear} aria-label={`${clear}: ${label}`} className="grid size-5 place-items-center rounded-full bg-paper leading-none">×</button>
    </span>
  );
}
