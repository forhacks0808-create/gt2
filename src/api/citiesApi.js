import { CITIES, ACTIVITIES_CATALOG, ACTIVITIES_BY_CITY } from "../data/cities";

/**
 * Dynamic City & Experience Search API:
 * Connects to RapidAPI GeoDB Cities with the provided key.
 */

const GEODB_KEY = import.meta.env.VITE_GEODB_KEY || "490e6448bfmshaf22b2ed119de49p1d530ajsn5f5ae0305f23";

export async function searchCities(query) {
  const q = (query || "").trim();

  // If search query is provided, fetch dynamic cities from RapidAPI GeoDB
  if (q.length >= 2) {
    try {
      const res = await fetch(
        `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${encodeURIComponent(q)}&limit=10&sort=-population`,
        {
          headers: {
            "x-rapidapi-key": GEODB_KEY,
            "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
          },
        }
      );
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          return json.data.map((c) => ({
            id: (c.city || c.name || "").toLowerCase().replace(/\s+/g, "-"),
            name: c.city || c.name,
            country: c.country || "Global",
            region: c.countryCode || "World",
            costIndex: Math.round(c.population ? Math.min(95, Math.max(35, Math.log10(c.population) * 15)) : 50),
            popularity: Math.min(98, Math.max(70, Math.round(Math.random() * 15 + 85))),
            avgDailyCost: Math.round(c.population ? Math.min(180, Math.max(45, Math.log10(c.population) * 22)) : 65),
            description: `Dynamic destination in ${c.country} (Pop. ${(c.population || 0).toLocaleString()}).`,
            lat: c.latitude,
            lng: c.longitude,
          }));
        }
      }
    } catch (err) {
      console.warn("RapidAPI GeoDB fetch error, using local catalog:", err);
    }
  }

  // If query is empty or 1 letter, search the curated base catalog
  await new Promise((r) => setTimeout(r, 60));
  if (!q) return CITIES;

  return CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(q.toLowerCase()) ||
      c.country.toLowerCase().includes(q.toLowerCase()) ||
      c.region.toLowerCase().includes(q.toLowerCase())
  );
}

export async function getCity(id) {
  const city = CITIES.find((c) => c.id === id);
  if (!city) {
    return {
      id,
      name: id.charAt(0).toUpperCase() + id.slice(1),
      country: "Global Destination",
      region: "World",
      costIndex: 50,
      popularity: 85,
      avgDailyCost: 70,
      description: "Custom journey destination.",
    };
  }
  return city;
}

export async function getSuggestedActivities(cityId) {
  await new Promise((r) => setTimeout(r, 80));
  return ACTIVITIES_BY_CITY[cityId] || [
    "Historic Walking Tour",
    "Local Street Food Exploration",
    "Scenic Viewpoint & Sunset",
    "Central Market Crawl",
  ];
}
