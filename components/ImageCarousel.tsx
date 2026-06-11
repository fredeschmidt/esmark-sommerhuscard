"use client";

import { useId, useState } from "react";
import Image from "next/image";
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
  const count = Math.max(images.length, 1);
  const [index, setIndex] = useState(0);
  const groupId = useId();

  const go = (next: number) => setIndex((next + count) % count);

  return (
    <div
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
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={`${altBase} – billede ${i + 1} af ${count}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority && i === 0}
          className={`object-cover transition-opacity duration-300 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i !== index}
        />
      ))}

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
