"use server";

import type { Locale } from "@/i18n/routing";
import { api } from "@/lib/api";
import type { FavoriteList } from "@/lib/api/types";
import { clearSessionToken, getSessionToken, setSessionToken } from "@/lib/session";

type Out = { ok: true; confirmationRequired?: boolean } | { ok: false; code: string };

export async function loginAction(input: { email: string; password: string }): Promise<Out> {
  const r = await api.login(input.email.trim(), input.password);
  if (!r.ok) return { ok: false, code: r.code };
  await setSessionToken(r.value.accessToken, r.value.expiresIn);
  return { ok: true };
}

export async function registerAction(input: { email: string; password: string; name: string }): Promise<Out> {
  const r = await api.register({ email: input.email.trim(), password: input.password, name: input.name.trim() || undefined });
  if (!r.ok) return { ok: false, code: r.code };
  if (r.value.session) await setSessionToken(r.value.session.accessToken, r.value.session.expiresIn);
  return { ok: true, confirmationRequired: r.value.confirmationRequired };
}

export async function logoutAction(): Promise<void> {
  await clearSessionToken();
}

export async function updateProfileAction(input: { name: string; phone: string }): Promise<boolean> {
  const token = await getSessionToken();
  if (!token) return false;
  const r = await api.updateMe(token, { name: input.name.trim() || null, phone: input.phone.trim() || null });
  return r.ok;
}

/** Copies the guest's favorites to the account right after signing in; returns the account's full list. */
export async function mergeFavoritesAction(productIds: string[], locale: Locale): Promise<FavoriteList | null> {
  const token = await getSessionToken();
  return token ? api.mergeFavorites(token, productIds.slice(0, 200), locale) : null;
}

/** The account's favorites, or null for guests (their favorites stay on the device). */
export async function pullFavoritesAction(locale: Locale): Promise<FavoriteList | null> {
  const token = await getSessionToken();
  return token ? api.getMyFavorites(token, locale) : null;
}

/** Mirrors a heart tap to the account. Does nothing for guests. */
export async function setFavoriteAction(productId: string, on: boolean): Promise<void> {
  const token = await getSessionToken();
  if (token) await api.setFavorite(token, productId, on);
}
