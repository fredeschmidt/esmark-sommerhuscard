/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Holiday-home photos are resized and encoded by Esmark's image CDN, which
    // next/image calls directly via a custom loader (see lib/imageLoader.ts).
    // This skips the /_next/image proxy and its redundant re-encoding.
    loader: "custom",
    loaderFile: "./lib/imageLoader.ts",
    // The cards never render wider than ~400 CSS px (so ~1200px at high DPR).
    // Capping the candidate widths keeps the largest variants — which the CDN
    // cold-encodes slowly (up to ~8 s / 2 MB at 3840px) — out of the srcset, and
    // concentrates traffic on fewer URLs so the edge cache stays warm.
    deviceSizes: [640, 750, 828, 1080, 1200],
  },
};

export default nextConfig;
