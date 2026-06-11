import HouseItem from "@/components/HouseItem";
import type { House } from "@/lib/houses";
import { formatPrice } from "@/lib/format";
import { imagesForCard } from "@/lib/placeholders";

interface HouseListProps {
  heading: string;
  houses: House[];
  /** City name shown in the breadcrumb; omitted on the front page. */
  breadcrumbCity?: string;
  /** Name of the list in schema.org structured data. */
  listName: string;
}

export default function HouseList({
  heading,
  houses,
  breadcrumbCity,
  listName,
}: HouseListProps) {
  const fromPrice = formatPrice(Math.min(...houses.map((h) => h.fromPrice)));

  // Structured data (schema.org) for the list of holiday homes.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    numberOfItems: houses.length,
    itemListElement: houses.map((h, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "LodgingBusiness",
        name: h.title,
        address: {
          "@type": "PostalAddress",
          streetAddress: h.address,
          postalCode: h.postalCode,
          addressLocality: h.city,
          addressCountry: "DK",
        },
        petsAllowed: true,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: h.rating.average.toFixed(1),
          reviewCount: h.rating.count,
        },
      },
    })),
  };

  return (
    <main id="indhold" className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {breadcrumbCity && (
        <nav aria-label="Brødkrumme" className="mb-4 text-sm text-slate-500">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <a href="/" className="hover:text-brand hover:underline">
                Forside
              </a>
            </li>
            <li aria-hidden>/</li>
            <li className="font-medium text-slate-700" aria-current="page">
              {breadcrumbCity}
            </li>
          </ol>
        </nav>
      )}

      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold text-brand sm:text-3xl">{heading}</h1>
        <p className="mt-2 text-slate-600">
          {houses.length} {houses.length === 1 ? "feriehus" : "feriehuse"} med
          plads til mindst 6 personer, hvor hunden er velkommen — fra {fromPrice}{" "}
          DKK pr. uge.
        </p>
      </header>

      <ul
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        aria-label={listName}
      >
        {houses.map((house, i) => (
          <li key={house.id} className="h-full">
            <HouseItem
              house={house}
              images={imagesForCard(i)}
              priority={i === 0}
            />
          </li>
        ))}
      </ul>
    </main>
  );
}
