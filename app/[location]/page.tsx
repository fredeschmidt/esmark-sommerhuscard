import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HouseList from "@/components/HouseList";
import {
  cityNameFromSlug,
  getListingCitySlugs,
  getListingHouses,
} from "@/lib/houses";

interface PageProps {
  params: Promise<{ location: string }>;
}

// Pre-renders a static page per city with qualifying houses (good for SEO).
export function generateStaticParams() {
  return getListingCitySlugs().map((location) => ({ location }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { location } = await params;
  const city = cityNameFromSlug(location);
  if (!city) return { title: "Kategori ikke fundet" };

  const count = getListingHouses(location).length;
  const title = `Sommerhuse i ${city}`;
  const description = `${count} hundevenlige sommerhuse i ${city} med plads til mindst 6 personer. Book dit feriehus ved Vestkysten hos Esmark.`;

  return {
    title,
    description,
    alternates: { canonical: `/${location}` },
    openGraph: {
      type: "website",
      siteName: "Esmark",
      locale: "da_DK",
      url: `/${location}`,
      title: `${title} | Esmark`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Esmark`,
      description,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { location } = await params;
  const city = cityNameFromSlug(location);
  const houses = getListingHouses(location);

  if (!city || houses.length === 0) notFound();

  return (
    <HouseList
      heading={`Sommerhuse i ${city}`}
      houses={houses}
      breadcrumbCity={city}
      listName={`Sommerhuse i ${city}`}
    />
  );
}
