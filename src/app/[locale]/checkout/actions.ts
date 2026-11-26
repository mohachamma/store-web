"use server";

import type { Locale } from "@/i18n/routing";
import { api } from "@/lib/api";
import type { CreateOrderBody, QuoteInput } from "@/lib/api/types";

// Thin server-side wrappers: the browser never talks to the API directly, and prices are always computed by the API.
export async function communesAction(wilayaCode: number, locale: Locale) {
  return api.getCommunes(wilayaCode, locale);
}

export async function quoteAction(input: QuoteInput) {
  return api.quote(input);
}

export async function placeOrderAction(body: CreateOrderBody) {
  return api.createOrder(body);
}
