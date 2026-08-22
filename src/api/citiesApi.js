import { CITIES, ACTIVITIES_BY_CITY } from "../data/cities";

/**
 * TODO (production): replace this in-memory search with a real call to the
 * GeoDB Cities API (via RapidAPI) or the Teleport API, debounced 300ms as the
 * spec requires:
 *
 *   const res = await fetch(
 *     `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${query}`,
 *     { headers: { "X-RapidAPI-Key": import.meta.env.VITE_GEODB_KEY } }
 *   );
 *
 * The debounce hook (useDebouncedValue, in src/hooks) already wraps whatever
 * you call here, so only this file needs to change.
 */
export async function searchCities(query) {
  await networkDelay();
  const q = query.trim().toLowerCase();
  if (!q) return CITIES;
  return CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q)
  );
}

export async function getCity(id) {
  await networkDelay();
  const city = CITIES.find((c) => c.id === id);
  if (!city) throw new Error("City not found");
  return city;
}

export async function getSuggestedActivities(cityId) {
  await networkDelay(250);
  return ACTIVITIES_BY_CITY[cityId] || [];
}

function networkDelay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
