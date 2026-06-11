/** Price in whole kroner with Danish thousands separator, e.g. 2300 -> "2.300". */
export function formatPrice(value: number): string {
  return new Intl.NumberFormat("da-DK", { maximumFractionDigits: 0 }).format(
    value,
  );
}

/** Distance in meters -> readable text, e.g. 300 -> "300 m", 2600 -> "2,6 km". */
export function formatDistance(meters: number): string {
  if (meters < 1000) return `${meters} m`;
  const km = meters / 1000;
  return `${new Intl.NumberFormat("da-DK", { maximumFractionDigits: 1 }).format(km)} km`;
}
