"use server";

import type { Locale } from "@/i18n/routing";
import { api } from "@/lib/api";
import { getSessionToken } from "@/lib/session";
import type { CreateOrderBody, QuoteInput } from "@/lib/api/types";

// Thin server-side wrappers: the browser never talks to the API directly, and prices are always computed by the API.
export async function communesAction(wilayaCode: number, locale: Locale) {
  return api.getCommunes(wilayaCode, locale);
}

export async function quoteAction(input: QuoteInput) {
  return api.quote(input);
}

export async function placeOrderAction(body: CreateOrderBody) {
  // A signed-in customer's order is linked to their account (history); guests order exactly as before.
  return api.createOrder(body, await getSessionToken());
}

/** Name and phone saved in the customer's account, to pre-fill checkout. Null for guests. */
export async function checkoutProfileAction() {
  const token = await getSessionToken();
  const me = token ? await api.getMe(token) : null;
  return me ? { name: me.name ?? "", phone: me.phone ?? "" } : null;
}
