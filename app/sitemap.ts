import type { MetadataRoute } from "next";
import { getListingCitySlugs } from "@/lib/houses";

const baseUrl = "https://esmark.de";

// Genereres statisk ved build og serveres på /sitemap.xml. Forsiden plus én
// indgang pr. by-side, så søgemaskiner finder alle kategorisider.
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
