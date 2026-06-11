import rawData from "@/data/sommerhuse.json";

/**
 * The data source ("sommerhuse.json") is double-encoded: UTF-8 bytes are stored
 * as Latin-1, so e.g. "Blåvand" appears as "BlÃ¥vand". We normalize the text
 * once at load time, so the rest of the app only sees clean Danish text.
 */
function fixMojibake(value: string): string {
  if (!/[ÃÂ]/.test(value)) return value;
  const decoded = Buffer.from(value, "latin1").toString("utf8");
  // If the re-decoding produced an invalid character, we keep the original.
  return decoded.includes("�") ? value : decoded;
}

export interface Facilities {
  NumberOfPersons: number;
  Bedrooms: number;
  NumberOfBathrooms: number;
  HouseAreaSquareMeters: number;
  DistanceToSeaMeters: number;
  DistanceToShoppingMeters: number;
  PetsAllowed: boolean;
  PetsMaxCount?: number;
  StarRating: number | string;
}

interface RawHouse {
  id: string;
  name: string;
  city: string;
  address1: string;
  address2: string;
  title: string;
  postalCode: string;
  lodgingId: number;
  fromPrice: number;
  fromFeePrice: number;
  userRating: { average: number; best: number; count: number; worst: number };
  images: { url: string; sortOrder: number }[];
  facilities: Facilities;
}

/** Normalized house model that the components work with. */
export interface House {
  id: string;
  name: string;
  city: string;
  address: string;
  title: string;
  postalCode: string;
  lodgingId: number;
  fromPrice: number;
  rating: { average: number; count: number };
  imageCount: number;
  persons: number;
  bedrooms: number;
  bathrooms: number;
  areaSquareMeters: number;
  distanceToSeaMeters: number;
  petsAllowed: boolean;
  petsMaxCount: number;
  starRating: number | string;
}

function normalize(raw: RawHouse): House {
  return {
    id: raw.id,
    name: raw.name,
    city: fixMojibake(raw.city),
    address: fixMojibake(raw.address1),
    title: fixMojibake(raw.title),
    postalCode: raw.postalCode,
    lodgingId: raw.lodgingId,
    fromPrice: raw.fromPrice,
    rating: { average: raw.userRating.average, count: raw.userRating.count },
    imageCount: raw.images.length,
    persons: raw.facilities.NumberOfPersons,
    bedrooms: raw.facilities.Bedrooms,
    bathrooms: raw.facilities.NumberOfBathrooms,
    areaSquareMeters: raw.facilities.HouseAreaSquareMeters,
    distanceToSeaMeters: raw.facilities.DistanceToSeaMeters,
    petsAllowed: raw.facilities.PetsAllowed === true,
    petsMaxCount: raw.facilities.PetsMaxCount ?? 0,
    starRating: raw.facilities.StarRating,
  };
}

const allHouses: House[] = (rawData.hits as RawHouse[]).map(normalize);

/** Criteria for the list view: min. 6 persons and pets allowed. */
export function meetsListingCriteria(house: House): boolean {
  return house.persons >= 6 && house.petsAllowed;
}

/** Slug for URLs, e.g. "Blåvand" -> "blaavand". */
export function citySlug(city: string): string {
  return city
    .toLowerCase()
    .replace(/å/g, "aa")
    .replace(/æ/g, "ae")
    .replace(/ø/g, "oe")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Houses for a given category page. Without `slug`, all houses that meet the
 * criteria are returned; with `slug`, they are further filtered by city.
 */
export function getListingHouses(slug?: string): House[] {
  return allHouses
    .filter(meetsListingCriteria)
    .filter((h) => !slug || citySlug(h.city) === slug);
}

/** All city slugs that have at least one house in the list view (for static routes). */
export function getListingCitySlugs(): string[] {
  const slugs = new Set(
    allHouses.filter(meetsListingCriteria).map((h) => citySlug(h.city)),
  );
  return [...slugs];
}

/** Find the displayed city name from a slug (for heading/metadata). */
export function cityNameFromSlug(slug: string): string | undefined {
  return allHouses.find((h) => citySlug(h.city) === slug)?.city;
}
