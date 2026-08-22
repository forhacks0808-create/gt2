const TRIPS_KEY = "gt_trips_data";
const SAVED_DESTINATIONS_KEY = "gt_saved_destinations";
const COMMUNITY_LIKES_KEY = "gt_community_likes";

const INITIAL_TRIPS = [
  {
    id: "trip-portugal-1",
    ownerId: "user-demo-1",
    ownerName: "Demo Traveler",
    name: "Portugal in spring",
    description: "4-day road trip exploring Lisbon and Porto with scenic trams and wine cellars.",
    startDate: "2026-04-10",
    endDate: "2026-04-13",
    coverCityId: "lisbon",
    cities: ["lisbon", "porto"],
    budgetBreakdown: {
      transport: 120,
      stay: 280,
      meals: 160,
      activities: 122,
      misc: 40,
      targetBudget: 800,
    },
    days: [
      {
        date: "2026-04-10",
        cityId: "lisbon",
        activities: [
          { id: "act-1", name: "Tram 28 scenic loop", category: "Sightseeing", time: "09:30", cost: 12, notes: "Catch early at Martim Moniz" },
          { id: "act-2", name: "Pastéis de Belém bakery", category: "Food & Dining", time: "14:00", cost: 15, notes: "Warm custard tarts" },
        ],
      },
      {
        date: "2026-04-11",
        cityId: "lisbon",
        activities: [
          { id: "act-3", name: "Alfama viewpoint crawl", category: "Sightseeing", time: "11:00", cost: 0, notes: "Miradouro de Santa Luzia sunset" },
          { id: "act-4", name: "Fado dinner in Bairro Alto", category: "Culture", time: "20:00", cost: 45, notes: "Traditional folk music" },
        ],
      },
      {
        date: "2026-04-12",
        cityId: "porto",
        activities: [
          { id: "act-5", name: "Douro river cruise", category: "Adventure", time: "10:30", cost: 30, notes: "6 bridges boat tour" },
          { id: "act-6", name: "Livraria Lello bookshop", category: "Culture", time: "15:00", cost: 10, notes: "Historic architecture" },
        ],
      },
      {
        date: "2026-04-13",
        cityId: "porto",
        activities: [
          { id: "act-7", name: "Port wine cellar tasting at Gaia", category: "Food & Dining", time: "16:00", cost: 25, notes: "Vintage tasting" },
        ],
      },
    ],
    visibility: "public",
    shareId: "share-portugal-2026",
    likes: 42,
    vibe: "Cultural & Wine",
  },
  {
    id: "trip-japan-2",
    ownerId: "user-demo-1",
    ownerName: "Demo Traveler",
    name: "Tokyo & Kyoto Highlights",
    description: "Cherry blossoms, ramen alleys, bullet trains, and historic shrines.",
    startDate: "2026-05-01",
    endDate: "2026-05-05",
    coverCityId: "tokyo",
    cities: ["tokyo", "kyoto"],
    budgetBreakdown: {
      transport: 240,
      stay: 450,
      meals: 260,
      activities: 160,
      misc: 90,
      targetBudget: 1300,
    },
    days: [
      {
        date: "2026-05-01",
        cityId: "tokyo",
        activities: [
          { id: "act-j1", name: "Shinjuku Gyoen National Garden", category: "Sightseeing", time: "10:00", cost: 5, notes: "" },
          { id: "act-j2", name: "Shibuya Crossing & Sky Deck", category: "Sightseeing", time: "17:30", cost: 20, notes: "" },
        ],
      },
      {
        date: "2026-05-02",
        cityId: "tokyo",
        activities: [
          { id: "act-j3", name: "Tsukiji Outer Market morning food tour", category: "Food & Dining", time: "08:30", cost: 35, notes: "" },
          { id: "act-j4", name: "Akihabara tech & arcade crawl", category: "Culture", time: "14:00", cost: 15, notes: "" },
        ],
      },
      {
        date: "2026-05-03",
        cityId: "kyoto",
        activities: [
          { id: "act-j5", name: "Shinkansen Bullet Train to Kyoto", category: "Sightseeing", time: "09:00", cost: 110, notes: "" },
          { id: "act-j6", name: "Fushimi Inari-taisha thousands torii gates", category: "Adventure", time: "15:00", cost: 0, notes: "" },
        ],
      },
      {
        date: "2026-05-04",
        cityId: "kyoto",
        activities: [
          { id: "act-j7", name: "Arashiyama Bamboo Grove & Monkey Park", category: "Sightseeing", time: "09:30", cost: 10, notes: "" },
          { id: "act-j8", name: "Kinkaku-ji (Golden Pavilion)", category: "Culture", time: "14:00", cost: 5, notes: "" },
        ],
      },
      {
        date: "2026-05-05",
        cityId: "kyoto",
        activities: [
          { id: "act-j9", name: "Gion district tea ceremony & dinner", category: "Food & Dining", time: "18:00", cost: 60, notes: "" },
        ],
      },
    ],
    visibility: "public",
    shareId: "share-japan-spring",
    likes: 89,
    vibe: "Temples & Food",
  },
  {
    id: "trip-iceland-3",
    ownerId: "user-elena-9",
    ownerName: "Elena Rostova",
    name: "Iceland Ring Road Northern Safari",
    description: "Chasing aurora borealis, glacier hikes, and geothermal hot springs.",
    startDate: "2026-09-15",
    endDate: "2026-09-20",
    coverCityId: "reykjavik",
    cities: ["reykjavik"],
    budgetBreakdown: {
      transport: 310,
      stay: 520,
      meals: 280,
      activities: 240,
      misc: 100,
      targetBudget: 1500,
    },
    days: [
      {
        date: "2026-09-15",
        cityId: "reykjavik",
        activities: [
          { id: "act-ice-1", name: "Golden Circle Geysir & Waterfall", category: "Adventure", time: "09:00", cost: 65, notes: "" },
          { id: "act-ice-2", name: "Blue Lagoon Geothermal Spa", category: "Sightseeing", time: "16:00", cost: 75, notes: "" },
        ],
      },
      {
        date: "2026-09-16",
        cityId: "reykjavik",
        activities: [
          { id: "act-ice-3", name: "Northern Lights Jeep Safari", category: "Adventure", time: "21:00", cost: 90, notes: "" },
        ],
      },
    ],
    visibility: "public",
    shareId: "share-iceland-safari",
    likes: 124,
    vibe: "Adventure & Nature",
  },
  {
    id: "trip-mexico-4",
    ownerId: "user-marcos-4",
    ownerName: "Marcos Diaz",
    name: "Mexico City Art & Taco Pilgrimage",
    description: "Frida Kahlo's legacy, Roma Norte speakeasies, and Teotihuacan pyramids.",
    startDate: "2026-03-01",
    endDate: "2026-03-05",
    coverCityId: "mexico-city",
    cities: ["mexico-city"],
    budgetBreakdown: {
      transport: 60,
      stay: 220,
      meals: 140,
      activities: 95,
      misc: 30,
      targetBudget: 600,
    },
    days: [
      {
        date: "2026-03-01",
        cityId: "mexico-city",
        activities: [
          { id: "act-cdmx-1", name: "Frida Kahlo Blue House", category: "Culture", time: "10:00", cost: 16, notes: "" },
          { id: "act-cdmx-2", name: "Roma Norte Gourmet Taco Crawl", category: "Food & Dining", time: "18:00", cost: 25, notes: "" },
        ],
      },
      {
        date: "2026-03-02",
        cityId: "mexico-city",
        activities: [
          { id: "act-cdmx-3", name: "Teotihuacán Pyramid Climb", category: "Adventure", time: "07:30", cost: 85, notes: "" },
        ],
      },
    ],
    visibility: "public",
    shareId: "share-cdmx-tacos",
    likes: 76,
    vibe: "Foodie & Culture",
  },
];

function getStoredTrips() {
  try {
    const raw = localStorage.getItem(TRIPS_KEY);
    if (!raw) {
      localStorage.setItem(TRIPS_KEY, JSON.stringify(INITIAL_TRIPS));
      return INITIAL_TRIPS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_TRIPS;
  }
}

function saveStoredTrips(trips) {
  try {
    localStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
  } catch (err) {
    console.error("Failed to save trips", err);
  }
}

function dateString(d) {
  return new Date(d).toISOString().slice(0, 10);
}

function buildDays(startDate, endDate, cityId) {
  const days = [];
  const current = new Date(startDate);
  const end = new Date(endDate);
  while (current <= end) {
    days.push({ date: dateString(current), cityId: cityId || "custom", activities: [] });
    current.setDate(current.getDate() + 1);
  }
  return days;
}

function simulateDelay(ms = 150) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function listTrips(userId) {
  await simulateDelay(150);
  const trips = getStoredTrips();
  if (!userId) return trips;
  return trips.filter((t) => t.ownerId === userId || t.ownerId === "user-demo-1");
}

export async function getTrip(tripId) {
  await simulateDelay(100);
  const trips = getStoredTrips();
  const trip = trips.find((t) => t.id === tripId);
  if (!trip) throw new Error("Trip not found");
  return trip;
}

export async function createTrip(userId, data) {
  await simulateDelay(200);
  const trips = getStoredTrips();
  const newTrip = {
    id: "trip-" + Date.now(),
    ownerId: userId || "user-demo-1",
    ownerName: "Traveler",
    name: data.name || data.title || "New Trip",
    description: data.description || "",
    startDate: data.startDate,
    endDate: data.endDate,
    coverCityId: data.coverCityId || data.cities?.[0] || null,
    cities: data.cities || [],
    budgetBreakdown: {
      transport: 100,
      stay: 250,
      meals: 150,
      activities: 50,
      misc: 30,
      targetBudget: 700,
    },
    days: data.days?.length ? data.days : buildDays(data.startDate, data.endDate, data.cities?.[0]),
    visibility: "private",
    shareId: "share-" + Math.random().toString(36).substring(2, 8),
    likes: 0,
    vibe: "Custom Journey",
  };
  trips.unshift(newTrip);
  saveStoredTrips(trips);
  return newTrip;
}

export async function updateTrip(tripId, patch) {
  await simulateDelay(100);
  const trips = getStoredTrips();
  const index = trips.findIndex((t) => t.id === tripId);
  if (index === -1) throw new Error("Trip not found");

  const updated = { ...trips[index], ...patch };
  trips[index] = updated;
  saveStoredTrips(trips);
  return updated;
}

export async function deleteTrip(tripId) {
  await simulateDelay(150);
  const trips = getStoredTrips().filter((t) => t.id !== tripId);
  saveStoredTrips(trips);
}

export async function shareTrip(tripId) {
  await simulateDelay(150);
  const trips = getStoredTrips();
  const trip = trips.find((t) => t.id === tripId);
  if (!trip) throw new Error("Trip not found");

  trip.visibility = "public";
  if (!trip.shareId) {
    trip.shareId = "share-" + Math.random().toString(36).substring(2, 8);
  }
  saveStoredTrips(trips);
  return trip;
}

export async function getPublicTrip(shareId) {
  await simulateDelay(150);
  const trips = getStoredTrips();
  const trip = trips.find((t) => t.shareId === shareId);
  if (!trip) throw new Error("This trip isn't available or is no longer shared.");
  return trip;
}

export async function copyTrip(shareId, newOwnerId) {
  await simulateDelay(200);
  const trips = getStoredTrips();
  const source = trips.find((t) => t.shareId === shareId);
  if (!source) throw new Error("Source trip not found");

  const copy = {
    ...source,
    id: "trip-" + Date.now(),
    ownerId: newOwnerId || "user-demo-1",
    name: `${source.name} (copy)`,
    visibility: "private",
    shareId: "share-" + Math.random().toString(36).substring(2, 8),
    likes: 0,
  };
  trips.unshift(copy);
  saveStoredTrips(trips);
  return copy;
}

// Community Itineraries
export async function listCommunityTrips(filterVibe = "all") {
  await simulateDelay(150);
  const trips = getStoredTrips().filter((t) => t.visibility === "public");
  if (filterVibe === "all") return trips;
  return trips.filter((t) => t.vibe?.toLowerCase().includes(filterVibe.toLowerCase()));
}

export async function likeCommunityTrip(tripId) {
  const trips = getStoredTrips();
  const trip = trips.find((t) => t.id === tripId);
  if (trip) {
    trip.likes = (trip.likes || 0) + 1;
    saveStoredTrips(trips);
    return trip.likes;
  }
  return 0;
}

// Saved Destinations Bookmarks
export function getSavedDestinations() {
  try {
    const raw = localStorage.getItem(SAVED_DESTINATIONS_KEY);
    return raw ? JSON.parse(raw) : ["lisbon", "kyoto", "reykjavik"];
  } catch {
    return ["lisbon", "kyoto", "reykjavik"];
  }
}

export function toggleSaveDestination(cityId) {
  const list = getSavedDestinations();
  const exists = list.includes(cityId);
  const next = exists ? list.filter((id) => id !== cityId) : [...list, cityId];
  localStorage.setItem(SAVED_DESTINATIONS_KEY, JSON.stringify(next));
  return next;
}
