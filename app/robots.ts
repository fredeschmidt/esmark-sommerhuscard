import type { MetadataRoute } from "next";

// Serveres på /robots.txt. Tillader fuld crawl og peger på sitemap'et.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://esmark.de/sitemap.xml",
  };
}
