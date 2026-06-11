// Pre-warms the CDN's image cache so real visitors don't pay the slow first-hit
// encode cost. Esmark's CDN (Cloudflare-backed) resizes and re-encodes each
// unique image URL on first request — measured at ~1.5–3 s cold — then serves
// it from the edge cache (~0.3 s, cf-cache-status: HIT) for a year.
//
// This script requests every image the cards can show, at every candidate
// width, using the SAME loader and deviceSizes as the app — so the warmed URLs
// match what browsers request byte-for-byte. Run it after a deploy (the CDN is
// independent of the app, so it can also run anytime):
//
//   npm run warm-images            # warm the cache
//   npm run warm-images -- --dry   # just print the URLs, fetch nothing
//
// Node 24 strips the loader's TypeScript types on import; no build step needed.

import { readFileSync } from "node:fs";
import esmarkImageLoader from "../lib/imageLoader.ts";
import { IMAGE_CDN, CARD_IMAGE_QUALITY } from "../lib/imageConfig.ts";
import nextConfig from "../next.config.mjs";

// Cold encodes are CPU-heavy; too many at once makes the CDN return 503. Keep
// concurrency low and retry transient failures with backoff.
const CONCURRENCY = 4;
const REQUEST_TIMEOUT_MS = 30_000;
const MAX_RETRIES = 5;
const RETRYABLE = new Set([429, 500, 502, 503, 504]);

const widths = nextConfig.images.deviceSizes;
const dryRun = process.argv.includes("--dry");

const data = JSON.parse(
  readFileSync(new URL("../data/sommerhuse.json", import.meta.url)),
);

// Every image, at every candidate width, deduped. We warm all houses (not just
// the listing-eligible ones) — it's a tiny superset and avoids duplicating the
// listing criteria from lib/houses.ts.
const urls = [
  ...new Set(
    data.hits.flatMap((house) =>
      house.images.flatMap((img) =>
        widths.map((width) =>
          esmarkImageLoader({
            src: `${IMAGE_CDN}${img.url}`,
            width,
            quality: CARD_IMAGE_QUALITY,
          }),
        ),
      ),
    ),
  ),
];

if (dryRun) {
  for (const url of urls) console.log(url);
  console.log(`\n${urls.length} URLs (dry run — nothing fetched).`);
  process.exit(0);
}

/** Runs `worker` over `items` with at most `limit` in flight. */
async function pool(items, limit, worker) {
  const results = new Array(items.length);
  let next = 0;
  const runner = async () => {
    while (next < items.length) {
      const i = next++;
      results[i] = await worker(items[i]);
    }
  };
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, runner),
  );
  return results;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchOnce(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    // Drain the body so the edge fully fetches and caches the object.
    await res.arrayBuffer();
    return { ok: res.ok, status: res.status, cache: res.headers.get("cf-cache-status") };
  } catch (err) {
    return { ok: false, status: 0, cache: null, error: err.name };
  } finally {
    clearTimeout(timer);
  }
}

async function warm(url) {
  let result;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    result = await fetchOnce(url);
    if (result.ok || !RETRYABLE.has(result.status)) return result;
    if (attempt === MAX_RETRIES) break;
    // Exponential backoff with jitter: ~1s, 2s, 4s, 8s, 16s.
    await sleep(1000 * 2 ** attempt + Math.random() * 500);
  }
  return result;
}

console.log(
  `Warming ${urls.length} image URLs (${data.hits.length} houses × widths [${widths.join(", ")}], q=${CARD_IMAGE_QUALITY})…`,
);

const start = process.hrtime.bigint();
let done = 0;
const results = await pool(urls, CONCURRENCY, async (url) => {
  const r = await warm(url);
  r.url = url;
  done++;
  if (done % 25 === 0 || done === urls.length) {
    process.stdout.write(`  ${done}/${urls.length}\r`);
  }
  return r;
});
const elapsedS = Number(process.hrtime.bigint() - start) / 1e9;

const failed = results.filter((r) => !r.ok);
const hits = results.filter((r) => r.cache === "HIT").length;
const misses = results.filter((r) => r.cache && r.cache !== "HIT").length;

console.log(`\n\nDone in ${elapsedS.toFixed(1)}s`);
console.log(`  ${results.length - failed.length} ok, ${failed.length} failed`);
console.log(`  cache: ${hits} already warm (HIT), ${misses} freshly encoded (MISS/etc.)`);

if (failed.length) {
  console.log("\nFailures:");
  for (const f of failed) {
    console.log(`  [${f.status || f.error}] ${f.url}`);
  }
  process.exitCode = 1;
}
