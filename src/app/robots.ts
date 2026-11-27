import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";

/** Everything public can be crawled; private or useless-to-search pages (cart, checkout, accounts, orders, search results) cannot. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/*/cart", "/*/checkout", "/*/account", "/*/order/", "/*/favorites", "/*/search"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
