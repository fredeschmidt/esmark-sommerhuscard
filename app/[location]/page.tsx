import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HouseListing from "@/components/HouseListing";
import {
  cityNameFromSlug,
  getListingCitySlugs,
  getListingHouses,
} from "@/lib/houses";

interface PageProps {
  params: Promise<{ location: string }>;
}

// Pre-renderer en statisk side pr. by med kvalificerede huse (god for SEO).
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
    openGraph: { title: `${title} | Esmark`, description, locale: "da_DK" },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { location } = await params;
  const city = cityNameFromSlug(location);
  const houses = getListingHouses(location);

  if (!city || houses.length === 0) notFound();

  return (
    <HouseListing
      heading={`Sommerhuse i ${city}`}
      houses={houses}
      breadcrumbCity={city}
      listName={`Sommerhuse i ${city}`}
    />
  );
}
