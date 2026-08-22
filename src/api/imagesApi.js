/**
 * TODO (production): replace with a real call to the Unsplash API (or
 * Pexels) keyed by city name:
 *
 *   const res = await fetch(
 *     `https://api.unsplash.com/search/photos?query=${city}&per_page=1`,
 *     { headers: { Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_KEY}` } }
 *   );
 *   return res.results[0]?.urls?.regular;
 *
 * Until then, every "city photo" in the UI renders as the on-brand Ink Black
 * placeholder block (see components/Loader.jsx ImagePlaceholder) — this is
 * intentional per the design spec, not a bug: "a solid Ink Black placeholder
 * (not a skeleton shimmer) while loading."
 */
export async function getCityImageUrl(_cityName) {
  return null; // null tells the UI to render ImagePlaceholder
}
