import Link from "next/link";

// Fallback for requests outside any locale (rare: the proxy adds a locale).
export default function GlobalNotFound() {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ fontFamily: "system-ui", display: "grid", placeItems: "center", minHeight: "100vh", margin: 0 }}>
        <Link href="/" style={{ color: "#111" }}>
          404
        </Link>
      </body>
    </html>
  );
}
