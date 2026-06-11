import fs from "node:fs";
import path from "node:path";

/**
 * Reads the placeholder photos in /public/placeholders at build time and
 * returns their URLs sorted numerically (dansk-sommerhus-1, -2, …).
 * Scales automatically: if more files are added, they are included without code changes.
 * Server-/build-use only (uses fs).
 */
function listPlaceholderFiles(): string[] {
  const dir = path.join(process.cwd(), "public", "placeholders");
  return fs
    .readdirSync(dir)
    .filter((f) => /^dansk-sommerhus-\d+\.(jpe?g|png|webp)$/i.test(f))
    .sort((a, b) => fileNumber(a) - fileNumber(b))
    .map((f) => `/placeholders/${f}`);
}

function fileNumber(file: string): number {
  const match = file.match(/(\d+)/);
  return match ? Number(match[1]) : 0;
}

const POOL = listPlaceholderFiles();

/**
 * Assigns an image set to the card at position `index` in the list.
 * Image #1 (hero) is `POOL[index % POOL.length]`, so every card on a page
 * gets its own unique hero image — as long as the number of cards ≤ number of photos.
 * The rest of the carousel's images follow with a staggered offset, and the three
 * images in a single card are always mutually distinct.
 */
export function imagesForCard(index: number, count = 3): string[] {
  const total = POOL.length;
  if (total === 0) return [];
  const n = Math.min(count, total);
  return Array.from({ length: n }, (_, k) => POOL[(index + k) % total]);
}

export const placeholderPoolSize = POOL.length;
