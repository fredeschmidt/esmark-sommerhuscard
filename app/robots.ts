import type { MetadataRoute } from "next";

// Served at /robots.txt. Allows full crawl and points to the sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://esmark.de/sitemap.xml",
  };
}
