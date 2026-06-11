import rawData from "@/data/sommerhuse.json";

/**
 * Datakilden ("sommerhuse.json") er dobbelt-kodet: UTF-8-bytes er gemt som
 * Latin-1, så fx "Blåvand" optræder som "BlÃ¥vand". Vi normaliserer teksten
 * én gang ved indlæsning, så resten af appen kun ser ren dansk tekst.
 */
function fixMojibake(value: string): string {
  if (!/[ÃÂ]/.test(value)) return value;
  const decoded = Buffer.from(value, "latin1").toString("utf8");
  // Hvis re-dekodningen gav et ugyldigt tegn, beholder vi originalen.
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

/** Normaliseret husmodel, som komponenterne arbejder med. */
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

/** Kriterier for listevisningen: min. 6 personer og hund tilladt. */
export function meetsListingCriteria(house: House): boolean {
  return house.persons >= 6 && house.petsAllowed;
}

/** Slug til URL'er, fx "Blåvand" -> "blaavand". */
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
 * Huse til en given kategoriside. Uden `slug` returneres alle huse, der
 * opfylder kriterierne; med `slug` filtreres yderligere på by.
 */
export function getListingHouses(slug?: string): House[] {
  return allHouses
    .filter(meetsListingCriteria)
    .filter((h) => !slug || citySlug(h.city) === slug);
}

/** Alle by-slugs der har mindst ét hus i listevisningen (til statiske ruter). */
export function getListingCitySlugs(): string[] {
  const slugs = new Set(
    allHouses.filter(meetsListingCriteria).map((h) => citySlug(h.city)),
  );
  return [...slugs];
}

/** Find det viste bynavn ud fra en slug (til overskrift/metadata). */
export function cityNameFromSlug(slug: string): string | undefined {
  return allHouses.find((h) => citySlug(h.city) === slug)?.city;
}
