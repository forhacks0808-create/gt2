import { request } from "./apiClient";

export async function listTrips(_userId) {
  try {
    const res = await request("/api/trips");
    return Array.isArray(res) ? res : [];
  } catch (err) {
    console.error("listTrips error:", err);
    return [];
  }
}

export async function getTrip(tripId) {
  return request(`/api/trips/${tripId}`);
}

export async function createTrip(userId, data) {
  return request("/api/trips", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateTrip(tripId, patch) {
  return request(`/api/trips/${tripId}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export async function deleteTrip(tripId) {
  return request(`/api/trips/${tripId}`, {
    method: "DELETE",
  });
}

export async function shareTrip(tripId) {
  return request(`/api/trips/${tripId}/share`, {
    method: "POST",
  });
}

export async function getPublicTrip(shareId) {
  return request(`/api/public/trips/${shareId}`);
}

export async function copyTrip(shareId, _newOwnerId) {
  return request(`/api/trips/copy/${shareId}`, {
    method: "POST",
  });
}

// Community Itineraries
export async function listCommunityTrips(filterVibe = "all") {
  try {
    const trips = await request("/api/public/community");
    if (!Array.isArray(trips)) return [];
    if (filterVibe === "all") return trips;
    return trips.filter((t) => t.vibe?.toLowerCase().includes(filterVibe.toLowerCase()));
  } catch {
    return [];
  }
}

export async function likeCommunityTrip(_tripId) {
  return true;
}

// Saved Destinations Bookmarks
export async function getSavedDestinations() {
  try {
    const res = await request("/api/users/me/saved-destinations");
    return Array.isArray(res) ? res : [];
  } catch {
    return [];
  }
}

export async function toggleSaveDestination(cityId, isSaved = false) {
  try {
    if (isSaved) {
      await request(`/api/users/me/saved-destinations/${cityId}`, { method: "DELETE" });
    } else {
      await request("/api/users/me/saved-destinations", {
        method: "POST",
        body: JSON.stringify({ city: cityId }),
      });
    }
  } catch (e) {
    console.error(e);
  }
}
