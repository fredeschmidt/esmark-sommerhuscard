/**
 * Single source of truth for the holiday-home card images. These are shared by
 * the data layer (lib/houses.ts), the next/image loader (lib/imageLoader.ts),
 * the carousel component (components/ImageCarousel.tsx) and the cache-warming
 * script (scripts/warm-image-cache.mjs) so their URLs stay in lock-step — the
 * CDN caches per exact URL, so any drift between them causes cache misses.
 *
 * NOTE: the next/image loader is registered globally (next.config.mjs), but its
 * crop/quality here are tuned for the card carousel, which is currently the only
 * next/image consumer. Adding images of a different shape means revisiting the
 * loader rather than just this file.
 */

/** Esmark's image CDN. The JSON stores root-relative paths under this host. */
export const IMAGE_CDN = "https://img.svc.esmark.dk";

/**
 * Crop ratio (height / width) requested from the CDN. Must match the carousel's
 * `aspect-[4/5]` box so the cropped image fills it without wasted pixels
 * (4:5 portrait → height is 1.25× the width).
 */
export const CARD_IMAGE_ASPECT = 5 / 4;

/**
 * AVIF quality requested from the CDN. The CDN default is 75 (~330 KB at 828px);
 * 50 roughly halves the bytes with no visible loss at card size.
 */
export const CARD_IMAGE_QUALITY = 50;
