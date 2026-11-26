import "server-only";
import { cookies } from "next/headers";

const NAME = "store_session";

/** The customer's access token lives in an httpOnly cookie: the browser's JavaScript never sees it. */
export async function getSessionToken(): Promise<string | null> {
  return (await cookies()).get(NAME)?.value ?? null;
}

export async function setSessionToken(token: string, maxAgeSeconds: number): Promise<void> {
  (await cookies()).set(NAME, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: Math.max(60, maxAgeSeconds) });
}

export async function clearSessionToken(): Promise<void> {
  (await cookies()).delete(NAME);
}
