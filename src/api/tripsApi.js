const TRIPS_KEY = "gt_trips_data";

const INITIAL_TRIPS = [
  {
    id: "trip-portugal-1",
    ownerId: "user-demo-1",
    name: "Portugal in spring",
    description: "4-day road trip exploring Lisbon and Porto.",
    startDate: "2026-04-10",
    endDate: "2026-04-13",
    coverCityId: "lisbon",
    cities: ["lisbon", "porto"],
    days: [
      {
        date: "2026-04-10",
        cityId: "lisbon",
        activities: [
          { id: "act-1", name: "Tram 28 scenic loop", cost: 12, notes: "Catch early at Martim Moniz" },
          { id: "act-2", name: "Pastéis de Belém bakery", cost: 15, notes: "Warm custard tarts" },
        ],
      },
      {
        date: "2026-04-11",
        cityId: "lisbon",
        activities: [
          { id: "act-3", name: "Alfama viewpoint crawl", cost: 0, notes: "Miradouro de Santa Luzia sunset" },
          { id: "act-4", name: "Fado dinner in Bairro Alto", cost: 45, notes: "Traditional music" },
        ],
      },
      {
        date: "2026-04-12",
        cityId: "porto",
        activities: [
          { id: "act-5", name: "Douro river cruise", cost: 30, notes: "6 bridges boat tour" },
          { id: "act-6", name: "Livraria Lello bookshop", cost: 10, notes: "Historic architecture" },
        ],
      },
      {
        date: "2026-04-13",
        cityId: "porto",
        activities: [
          { id: "act-7", name: "Port wine cellar tasting at Gaia", cost: 25, notes: "Vintage tasting" },
        ],
      },
    ],
    visibility: "public",
    shareId: "share-portugal-2026",
  },
  {
    id: "trip-japan-2",
    ownerId: "user-demo-1",
    name: "Tokyo & Kyoto Highlights",
    description: "Cherry blossoms, ramen alleys, and historic shrines.",
    startDate: "2026-05-01",
    endDate: "2026-05-05",
    coverCityId: "tokyo",
    cities: ["tokyo", "kyoto"],
    days: [
      {
        date: "2026-05-01",
        cityId: "tokyo",
        activities: [
          { id: "act-j1", name: "Shinjuku Gyoen National Garden", cost: 5, notes: "" },
          { id: "act-j2", name: "Shibuya Crossing & Sky Deck", cost: 20, notes: "" },
        ],
      },
      {
        date: "2026-05-02",
        cityId: "tokyo",
        activities: [
          { id: "act-j3", name: "Tsukiji Outer Market morning food tour", cost: 35, notes: "" },
          { id: "act-j4", name: "Akihabara tech & arcade crawl", cost: 15, notes: "" },
        ],
      },
      {
        date: "2026-05-03",
        cityId: "kyoto",
        activities: [
          { id: "act-j5", name: "Shinkansen Bullet Train to Kyoto", cost: 110, notes: "" },
          { id: "act-j6", name: "Fushimi Inari-taisha thousands torii gates", cost: 0, notes: "" },
        ],
      },
      {
        date: "2026-05-04",
        cityId: "kyoto",
        activities: [
          { id: "act-j7", name: "Arashiyama Bamboo Grove & Monkey Park", cost: 10, notes: "" },
          { id: "act-j8", name: "Kinkaku-ji (Golden Pavilion)", cost: 5, notes: "" },
        ],
      },
      {
        date: "2026-05-05",
        cityId: "kyoto",
        activities: [
          { id: "act-j9", name: "Gion district tea ceremony & dinner", cost: 60, notes: "" },
        ],
      },
    ],
    visibility: "private",
    shareId: "share-japan-spring",
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

function simulateDelay(ms = 200) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function listTrips(_userId) {
  await simulateDelay(200);
  return getStoredTrips();
}

export async function getTrip(tripId) {
  await simulateDelay(150);
  const trips = getStoredTrips();
  const trip = trips.find((t) => t.id === tripId);
  if (!trip) throw new Error("Trip not found");
  return trip;
}

export async function createTrip(userId, data) {
  await simulateDelay(250);
  const trips = getStoredTrips();
  const newTrip = {
    id: "trip-" + Date.now(),
    ownerId: userId || "user-demo-1",
    name: data.name || data.title || "New Trip",
    description: data.description || "",
    startDate: data.startDate,
    endDate: data.endDate,
    coverCityId: data.coverCityId || data.cities?.[0] || null,
    cities: data.cities || [],
    days: data.days?.length ? data.days : buildDays(data.startDate, data.endDate, data.cities?.[0]),
    visibility: "private",
    shareId: "share-" + Math.random().toString(36).substring(2, 8),
  };
  trips.unshift(newTrip);
  saveStoredTrips(trips);
  return newTrip;
}

export async function updateTrip(tripId, patch) {
  await simulateDelay(150);
  const trips = getStoredTrips();
  const index = trips.findIndex((t) => t.id === tripId);
  if (index === -1) throw new Error("Trip not found");

  const updated = { ...trips[index], ...patch };
  trips[index] = updated;
  saveStoredTrips(trips);
  return updated;
}

export async function deleteTrip(tripId) {
  await simulateDelay(200);
  const trips = getStoredTrips().filter((t) => t.id !== tripId);
  saveStoredTrips(trips);
}

export async function shareTrip(tripId) {
  await simulateDelay(200);
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
  await simulateDelay(200);
  const trips = getStoredTrips();
  const trip = trips.find((t) => t.shareId === shareId);
  if (!trip) throw new Error("This trip isn't available or is no longer shared.");
  return trip;
}

export async function copyTrip(shareId, newOwnerId) {
  await simulateDelay(250);
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
  };
  trips.unshift(copy);
  saveStoredTrips(trips);
  return copy;
}
