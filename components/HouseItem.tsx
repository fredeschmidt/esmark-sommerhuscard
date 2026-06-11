import Link from "next/link";
import type { House } from "@/lib/houses";
import { citySlug } from "@/lib/houses";
import { formatDistance, formatPrice } from "@/lib/format";
import ImageCarousel from "@/components/ImageCarousel";
import {
  BeachIcon,
  GuestsIcon,
  PetIcon,
  RoomsIcon,
  ShieldCheckIcon,
  StarIcon,
} from "@/components/icons";
import Facility from "./Facility";

interface HouseItemProps {
  house: House;
  /** Image URLs for the card's carousel (assigned uniquely per card in the list). */
  images: string[];
  /** Set for the first card, so the hero image is prioritized (LCP). */
  priority?: boolean;
}

export default function HouseItem({
  house,
  images,
  priority = false,
}: HouseItemProps) {
  const altBase = `${house.title}, ${house.city}`;
  const href = `/${citySlug(house.city)}/${house.lodgingId}`;
  const ratingValue = new Intl.NumberFormat("da-DK", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(house.rating.average);

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-white">
      <header className="flex items-center justify-between gap-3 px-4 py-3">
        <p className="flex items-center gap-1.5 text-sm font-medium text-brand">
          <ShieldCheckIcon className="h-5 w-5 shrink-0 text-brand" />
          <span>{house.city}</span>
        </p>
        <p className="shrink-0 text-right">
          <span className="text-lg font-bold text-brand">
            {formatPrice(house.fromPrice)} DKK
          </span>
          <span className="text-sm font-medium text-slate-500">
            {" "}
            / uge
          </span>
        </p>
      </header>

      <ImageCarousel images={images} altBase={altBase} priority={priority} />

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-base font-semibold leading-snug text-slate-900">
            <Link
              href={href}
              className="rounded-sm outline-none hover:text-brand focus-visible:underline focus-visible:ring-2 focus-visible:ring-brand"
            >
              {house.title}
            </Link>
          </h2>
          <p
            className="flex shrink-0 items-center gap-1 text-sm font-light text-slate-700"
            aria-label={`Bedømmelse ${ratingValue} ud af 5 baseret på ${house.rating.count} anmeldelser`}
          >
            <StarIcon className="h-4 w-4 text-amber-500" />
            <span aria-hidden>
              {ratingValue}{" "}
              <span className="font-normal text-slate-400">
                ({house.rating.count})
              </span>
            </span>
          </p>
        </div>

        <p className="text-sm text-slate-500">
          {house.address}, {house.postalCode} {house.city}
        </p>

        <ul className="mt-auto grid grid-cols-2 gap-x-4 gap-y-2 border-t border-slate-100 pt-3 text-sm font-light text-slate-700 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
          <Facility icon={<GuestsIcon />} value={`${house.persons} gæster`} srText="Plads til" />
          <Facility icon={<RoomsIcon />} value={`${house.bedrooms} værelser`} />
          <Facility
            icon={<BeachIcon />}
            value={formatDistance(house.distanceToSeaMeters)}
            srText="Afstand til stranden:"
          />
          <Facility icon={<PetIcon />} value="Tilladt" srText="Husdyr:" />
        </ul>
      </div>
    </article>
  );
}

