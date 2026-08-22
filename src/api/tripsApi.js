/**
 * TODO (production): replace this localStorage layer with real REST calls:
 *
 *   GET    /api/trips                 -> Trip[]
 *   POST   /api/trips                 -> Trip
 *   GET    /api/trips/:id             -> Trip
 *   PATCH  /api/trips/:id             -> Trip
 *   DELETE /api/trips/:id             -> void
 *   POST   /api/trips/:id/share       -> { shareId }
 *   GET    /api/public/trips/:shareId -> Trip (unauthenticated, read-only)
 *   POST   /api/trips/copy/:shareId   -> Trip
 *
 * Trip shape:
 *   { id, ownerId, name, startDate, endDate, coverCityId, cities: [cityId],
 *     days: [{ date, cityId, activities: [{ id, name, cost, notes }] }],
 *     visibility: "private" | "public", shareId }
 */

import { request } from "./apiClient";

export async function listTrips(_userId) {
  return request("/api/trips");
}

export async function getTrip(tripId) {
  return request(`/api/trips/${tripId}`);
}

export async function createTrip(userId, data) {
  return request("/api/trips", { method: "POST", body: JSON.stringify(data) });
}

export async function updateTrip(tripId, patch) {
  return request(`/api/trips/${tripId}`, { method: "PATCH", body: JSON.stringify(patch) });
}

export async function deleteTrip(tripId) {
  return request(`/api/trips/${tripId}`, { method: "DELETE" });
}

export async function shareTrip(tripId) {
  return request(`/api/trips/${tripId}/share`, { method: "POST" });
}

export async function getPublicTrip(shareId) {
  return request(`/api/public/trips/${shareId}`);
}

export async function copyTrip(shareId, _newOwnerId) {
  return request(`/api/trips/copy/${shareId}`, { method: "POST" });
}
