"use client";

import { useId, useState } from "react";
import Image from "next/image";

interface ImageCarouselProps {
  /** Færdige billed-URL'er til karrusellen (tildeles af listevisningen). */
  images: string[];
  /** Beskrivende grundtekst til alt-attributten, fx husets titel + by. */
  altBase: string;
  /** True for det første kort, så hero-billedet prioriteres af next/image. */
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
      {/* Kun det aktive billede er reelt synligt; vi bruger next/image til
          optimering og korrekte dimensioner (undgår layout shift). */}
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

function ChevronIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width={28}
      height={28}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}
