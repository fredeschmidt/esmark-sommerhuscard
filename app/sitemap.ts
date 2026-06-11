import type { MetadataRoute } from "next";
import { getListingCitySlugs } from "@/lib/houses";

const baseUrl = "https://esmark.de";

// Generated statically at build and served at /sitemap.xml. The front page plus
// one entry per city page, so search engines find all category pages.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...getListingCitySlugs().map((slug) => ({
      url: `${baseUrl}/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
