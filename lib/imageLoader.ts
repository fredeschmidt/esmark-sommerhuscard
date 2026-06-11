import type { ImageLoaderProps } from "next/image";
// Explicit .ts extension: this module is also run directly by Node (without a
// bundler) via scripts/warm-image-cache.mjs, which needs the full specifier.
import { CARD_IMAGE_ASPECT, CARD_IMAGE_QUALITY } from "./imageConfig.ts";

/**
 * Custom next/image loader that delegates resizing and encoding to Esmark's
 * image CDN instead of routing through Next.js's /_next/image proxy.
 *
 * This avoids a double optimization (the CDN already produces AVIF) and an
 * extra server round-trip, so the browser fetches the right-sized image
 * directly from the CDN edge cache. `width` is supplied by next/image based on
 * the element's `sizes` attribute and the device pixel ratio; we derive the
 * matching height from the card crop ratio (see lib/imageConfig.ts).
 */
export default function esmarkImageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps): string {
  const height = Math.round(width * CARD_IMAGE_ASPECT);
  const params = new URLSearchParams({
    format: "avif",
    fit: "crop",
    w: String(width),
    h: String(height),
    // Honors a per-image `quality` prop, falling back to the card default.
    q: String(quality ?? CARD_IMAGE_QUALITY),
  });
  return `${src}?${params.toString()}`;
}
