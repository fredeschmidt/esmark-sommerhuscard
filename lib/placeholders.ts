import fs from "node:fs";
import path from "node:path";

/**
 * Læser placeholder-fotoene i /public/placeholders ved build-tid og
 * returnerer deres URL'er sorteret numerisk (dansk-sommerhus-1, -2, …).
 * Skalerer automatisk: tilføjes flere filer, indgår de uden kodeændringer.
 * Kun til server-/build-brug (bruger fs).
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
 * Tildeler et billedsæt til kortet på position `index` i listen.
 * Billede #1 (hero) er `POOL[index % POOL.length]`, så alle kort på en side
 * får hvert sit unikke hero-billede — så længe antallet af kort ≤ antal fotos.
 * Resten af karrusellens billeder følger efter med forskudt offset, og de tre
 * billeder i ét kort er altid indbyrdes forskellige.
 */
export function imagesForCard(index: number, count = 3): string[] {
  const total = POOL.length;
  if (total === 0) return [];
  const n = Math.min(count, total);
  return Array.from({ length: n }, (_, k) => POOL[(index + k) % total]);
}

export const placeholderPoolSize = POOL.length;
