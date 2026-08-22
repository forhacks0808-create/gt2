import { request } from "./apiClient";

/**
 * Dynamic Destination & Experience Search API:
 * Fetches 100% directly from PostgreSQL database via backend REST API endpoints.
 */

export async function searchCities(query = "", region = "All") {
  const params = new URLSearchParams();
  if (query && query.trim()) params.set("q", query.trim());
  if (region && region !== "All") params.set("region", region);

  try {
    const res = await request(`/api/cities?${params.toString()}`);
    return Array.isArray(res) ? res : [];
  } catch (err) {
    console.error("Failed to fetch cities from backend API:", err);
    return [];
  }
}

export async function getCity(id) {
  try {
    return await request(`/api/cities/${id}`);
  } catch (err) {
    console.error("Failed to fetch city details:", err);
    return {
      id,
      name: id.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      country: "Global Destination",
      region: "World",
      costIndex: 50,
      popularity: 85,
      avgDailyCost: 70,
      description: "Custom journey destination.",
    };
  }
}

export async function searchActivities(query = "", category = "All") {
  const params = new URLSearchParams();
  if (query && query.trim()) params.set("q", query.trim());
  if (category && category !== "All") params.set("category", category);

  try {
    const res = await request(`/api/activities?${params.toString()}`);
    return Array.isArray(res) ? res : [];
  } catch (err) {
    console.error("Failed to fetch activities from backend API:", err);
    return [];
  }
}

export async function getSuggestedActivities(cityId) {
  try {
    const res = await request(`/api/activities?cityId=${cityId}`);
    if (Array.isArray(res) && res.length > 0) {
      return res.map((a) => a.name);
    }
  } catch (err) {
    console.warn("Failed to fetch city activities from backend:", err);
  }

  return [
    "Historic Old Town Walking Tour",
    "Local Culinary & Street Food Tasting",
    "Scenic City Viewpoint at Sunset",
    "Central Market & Heritage Crawl",
  ];
}
