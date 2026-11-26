import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AccountView } from "@/components/AccountView";
import { AuthForms } from "@/components/AuthForms";
import { Header } from "@/components/Header";
import type { Locale } from "@/i18n/routing";
import { api } from "@/lib/api";
import { getSessionToken } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("account");
  return { title: t("title"), robots: { index: false } };
}

/** Signed in → profile and order history; otherwise the sign-in / registration forms. Reads the cookie, so never cached. */
export default async function AccountPage({ params }: { params: Promise<{ locale: Locale }> }) {
  setRequestLocale((await params).locale);
  const token = await getSessionToken();
  const me = token ? await api.getMe(token) : null;
  const orders = token && me ? ((await api.getMyOrders(token)) ?? []) : [];
  return (
    <>
      <Header />
      <main>{me ? <AccountView me={me} orders={orders} /> : <AuthForms />}</main>
    </>
  );
}
