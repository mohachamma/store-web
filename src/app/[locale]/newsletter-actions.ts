"use server";

import { api } from "@/lib/api";

export async function subscribeAction(email: string): Promise<boolean> {
  return (await api.subscribeNewsletter(email.trim())).ok;
}
