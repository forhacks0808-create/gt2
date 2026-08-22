import { ACTIVITY_CATALOG, CITIES } from "../data/cities";

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
export async function searchCities(query, filters = {}) {
  await networkDelay();
  const q = (query || "").trim().toLowerCase();
  const { region = "all", country = "all", maxCostIndex, sort = "popularity" } = filters;

  const results = CITIES.filter((c) => {
    if (q && !c.name.toLowerCase().includes(q) && !c.country.toLowerCase().includes(q)) return false;
    if (region !== "all" && c.region !== region) return false;
    if (country !== "all" && c.country !== country) return false;
    if (maxCostIndex != null && c.costIndex > maxCostIndex) return false;
    return true;
  });

  return results.sort((a, b) => {
    if (sort === "cost-asc") return a.costIndex - b.costIndex;
    if (sort === "cost-desc") return b.costIndex - a.costIndex;
    if (sort === "name") return a.name.localeCompare(b.name);
    return b.popularity - a.popularity;
  });
}

export async function getCity(id) {
  await networkDelay();
  const city = CITIES.find((c) => c.id === id);
  if (!city) throw new Error("City not found");
  return city;
}

/** Most-travelled cities, used for the dashboard's popular-destinations rail. */
export async function getPopularCities(limit = 6) {
  await networkDelay(250);
  return [...CITIES].sort((a, b) => b.popularity - a.popularity).slice(0, limit);
}

/**
 * Cheap-and-cheerful recommendation: high traveller match for a low cost
 * index. Stands in for a real recommender keyed on the user's trip history.
 */
export async function getRecommendedCities(excludeIds = [], limit = 4) {
  await networkDelay(250);
  return CITIES.filter((c) => !excludeIds.includes(c.id))
    .map((c) => ({ ...c, score: c.popularity - c.costIndex * 0.6 }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Full activity search for the Activity Search screen.
 * TODO (production): swap for a POI/experiences API (Viator, GetYourGuide, or
 * Google Places nearby-search) — the filter contract below is deliberately
 * close to what those return.
 */
export async function searchActivities(filters = {}) {
  await networkDelay(350);
  const {
    query = "",
    cityId = "all",
    category = "all",
    maxCost,
    maxDuration,
    sort = "rating",
  } = filters;

  const q = query.trim().toLowerCase();

  const results = ACTIVITY_CATALOG.filter((a) => {
    if (q) {
      const city = CITIES.find((c) => c.id === a.cityId);
      const haystack = `${a.name} ${a.description} ${city?.name || ""} ${city?.country || ""}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (cityId !== "all" && a.cityId !== cityId) return false;
    if (category !== "all" && a.category !== category) return false;
    if (maxCost != null && a.cost > maxCost) return false;
    if (maxDuration != null && a.duration > maxDuration) return false;
    return true;
  });

  return results.sort((a, b) => {
    if (sort === "cost-asc") return a.cost - b.cost;
    if (sort === "cost-desc") return b.cost - a.cost;
    if (sort === "duration") return a.duration - b.duration;
    if (sort === "name") return a.name.localeCompare(b.name);
    return b.rating - a.rating;
  });
}

/** Suggestions for the itinerary builder — full objects, not just names. */
export async function getSuggestedActivities(cityId) {
  await networkDelay(250);
  return ACTIVITY_CATALOG.filter((a) => a.cityId === cityId);
}

function networkDelay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
