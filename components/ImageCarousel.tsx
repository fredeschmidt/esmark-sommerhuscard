"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { CARD_IMAGE_QUALITY } from "@/lib/imageConfig";
import { ChevronIcon } from "./icons";

interface ImageCarouselProps {
  /** Final image URLs for the carousel (assigned by the list view). */
  images: string[];
  /** Descriptive base text for the alt attribute, e.g. the house's title + city. */
  altBase: string;
  /** True for the first card, so the hero image is prioritized by next/image. */
  priority?: boolean;
}

export default function ImageCarousel({
  images,
  altBase,
  priority = false,
}: ImageCarouselProps) {
  // A house with no usable images would otherwise render an empty grey box; show
  // an explicit, labelled placeholder instead. (The old placeholder pool used to
  // guarantee every card had images; the real CDN data carries no such promise.)
  if (images.length === 0) {
    return (
      <div
        className="flex aspect-[4/5] w-full items-center justify-center bg-slate-100"
        role="img"
        aria-label={`Intet billede tilgængeligt for ${altBase}`}
      >
        <span className="text-sm text-slate-400">Billede mangler</span>
      </div>
    );
  }

  // images.length is guaranteed ≥ 1 here (the empty case returned above).
  const count = images.length;
  const [index, setIndex] = useState(0);
  // Only render slides the user has actually reached, so each card fetches just
  // its first image up front instead of all of them when it scrolls into view.
  const [seen, setSeen] = useState<Set<number>>(() => new Set([0]));
  const groupId = useId();

  const go = (next: number) => {
    const target = (next + count) % count;
    setIndex(target);
    setSeen((prev) => (prev.has(target) ? prev : new Set([...prev, target])));
  };

  return (
    <div
      // aspect-[4/5] must match CARD_IMAGE_ASPECT (lib/imageConfig.ts), the crop
      // ratio the image loader requests from the CDN.
      className="group relative aspect-[4/5] w-full overflow-hidden bg-slate-200"
      role="group"
      aria-roledescription="billedkarrusel"
      aria-label={`Billeder af ${altBase}`}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          go(index - 1);
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          go(index + 1);
        }
      }}
    >
      {/* Only the active image is actually visible; we use next/image for
          optimization and correct dimensions (avoids layout shift). */}
      {images.map((src, i) =>
        seen.has(i) ? (
          <Image
            key={src}
            src={src}
            alt={`${altBase} – billede ${i + 1} af ${count}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            quality={CARD_IMAGE_QUALITY}
            priority={priority && i === 0}
            className={`object-cover transition-opacity duration-300 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={i !== index}
          />
        ) : null,
      )}

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Forrige billede"
            aria-controls={groupId}
            className="absolute left-2 top-1/2 hidden -translate-y-1/2 p-1.5 text-white/90 drop-shadow transition hover:scale-110 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white group-hover:flex sm:flex"
          >
            <ChevronIcon className="rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Næste billede"
            aria-controls={groupId}
            className="absolute right-2 top-1/2 hidden -translate-y-1/2 p-1.5 text-white/90 drop-shadow transition hover:scale-110 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white group-hover:flex sm:flex"
          >
            <ChevronIcon />
          </button>

          <div
            id={groupId}
            className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5"
          >
            {Array.from({ length: count }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={`Gå til billede ${i + 1}`}
                aria-current={i === index}
                className={`h-2 w-2 rounded-full transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                  i === index ? "bg-white" : "bg-white/55 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
