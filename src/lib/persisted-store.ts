"use client";

import { useSyncExternalStore } from "react";

/** Tiny localStorage-backed store usable with useSyncExternalStore (no extra dependency). */
export function createPersistedStore<S>(key: string, initial: S) {
  let state = initial;
  let hydrated = false;
  const listeners = new Set<() => void>();

  const hydrate = () => {
    if (hydrated || typeof window === "undefined") return;
    hydrated = true;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) state = JSON.parse(raw) as S;
    } catch {
      /* storage unavailable or corrupt: keep initial state */
    }
  };

  const set = (next: S | ((prev: S) => S)) => {
    hydrate();
    state = typeof next === "function" ? (next as (prev: S) => S)(state) : next;
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      /* ignore quota / private mode */
    }
    listeners.forEach((l) => l());
  };

  const subscribe = (l: () => void) => {
    listeners.add(l);
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) {
        hydrated = false;
        hydrate();
        l();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(l);
      window.removeEventListener("storage", onStorage);
    };
  };

  const getSnapshot = () => {
    hydrate();
    return state;
  };

  const useStore = () => useSyncExternalStore(subscribe, getSnapshot, () => initial);

  return { useStore, set, get: getSnapshot };
}
