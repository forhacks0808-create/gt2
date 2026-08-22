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
          { id: "act-1", name: "Tram 28 scenic loop", cost: 12, notes: "Catch early at Martim Moniz", category: "sightseeing", startTime: "09:00", duration: 90 },
          { id: "act-2", name: "Pastéis de Belém bakery", cost: 15, notes: "Warm custard tarts", category: "food", startTime: "12:30", duration: 60 },
        ],
      },
      {
        date: "2026-04-11",
        cityId: "lisbon",
        activities: [
          { id: "act-3", name: "Alfama viewpoint crawl", cost: 0, notes: "Miradouro de Santa Luzia sunset", category: "outdoors", startTime: "16:00", duration: 150 },
          { id: "act-4", name: "Fado dinner in Bairro Alto", cost: 45, notes: "Traditional music", category: "nightlife", startTime: "20:00", duration: 180 },
        ],
      },
      {
        date: "2026-04-12",
        cityId: "porto",
        activities: [
          { id: "act-5", name: "Train to Porto", cost: 32, notes: "Alfa Pendular from Santa Apolónia", category: "transport", startTime: "08:00", duration: 170 },
          { id: "act-6", name: "Douro river cruise", cost: 30, notes: "6 bridges boat tour", category: "sightseeing", startTime: "14:00", duration: 60 },
          { id: "act-7", name: "Livraria Lello bookshop", cost: 10, notes: "Historic architecture", category: "culture", startTime: "16:30", duration: 45 },
        ],
      },
      {
        date: "2026-04-13",
        cityId: "porto",
        activities: [
          { id: "act-8", name: "Port wine cellar tasting at Gaia", cost: 25, notes: "Vintage tasting", category: "food", startTime: "11:00", duration: 90 },
          { id: "act-9", name: "Guesthouse in Ribeira", cost: 85, notes: "Two nights", category: "stay", startTime: "21:00", duration: 600 },
        ],
      },
    ],
    budget: 900,
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
          { id: "act-j1", name: "Shinjuku Gyoen National Garden", cost: 5, notes: "", category: "outdoors", startTime: "10:00", duration: 120 },
          { id: "act-j2", name: "Shibuya Crossing & Sky Deck", cost: 20, notes: "", category: "sightseeing", startTime: "17:00", duration: 90 },
        ],
      },
      {
        date: "2026-05-02",
        cityId: "tokyo",
        activities: [
          { id: "act-j3", name: "Tsukiji Outer Market morning food tour", cost: 35, notes: "", category: "food", startTime: "07:00", duration: 180 },
          { id: "act-j4", name: "Akihabara tech & arcade crawl", cost: 15, notes: "", category: "nightlife", startTime: "19:00", duration: 150 },
        ],
      },
      {
        date: "2026-05-03",
        cityId: "kyoto",
        activities: [
          { id: "act-j5", name: "Shinkansen Bullet Train to Kyoto", cost: 110, notes: "", category: "transport", startTime: "08:30", duration: 165 },
          { id: "act-j6", name: "Fushimi Inari-taisha thousands torii gates", cost: 0, notes: "", category: "sightseeing", startTime: "14:00", duration: 180 },
        ],
      },
      {
        date: "2026-05-04",
        cityId: "kyoto",
        activities: [
          { id: "act-j7", name: "Arashiyama Bamboo Grove & Monkey Park", cost: 10, notes: "", category: "outdoors", startTime: "09:00", duration: 120 },
          { id: "act-j8", name: "Kinkaku-ji (Golden Pavilion)", cost: 5, notes: "", category: "sightseeing", startTime: "14:00", duration: 75 },
        ],
      },
      {
        date: "2026-05-05",
        cityId: "kyoto",
        activities: [
          { id: "act-j9", name: "Gion district tea ceremony & dinner", cost: 60, notes: "", category: "culture", startTime: "18:00", duration: 180 },
          { id: "act-j10", name: "Ryokan with onsen", cost: 180, notes: "Two nights", category: "stay", startTime: "21:30", duration: 600 },
        ],
      },
    ],
    budget: 700,
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
    coverImage: data.coverImage || null,
    cities: data.cities || [],
    days: data.days?.length ? data.days : buildDays(data.startDate, data.endDate, data.cities?.[0]),
    budget: data.budget != null ? Number(data.budget) : null,
    visibility: data.visibility || "private",
    shareId: "share-" + Math.random().toString(36).substring(2, 8),
    createdAt: new Date().toISOString(),
  };
  trips.unshift(newTrip);
  saveStoredTrips(trips);
  return newTrip;
}

/**
 * Adds a city to a trip and appends a day for it at the end of the range,
 * extending endDate by one. This is the "Add Stop" action in the builder.
 */
export async function addStop(tripId, cityId) {
  await simulateDelay(200);
  const trips = getStoredTrips();
  const trip = trips.find((t) => t.id === tripId);
  if (!trip) throw new Error("Trip not found");

  const lastDate = trip.days.length
    ? new Date(trip.days[trip.days.length - 1].date)
    : new Date(trip.startDate);
  lastDate.setDate(lastDate.getDate() + 1);
  const nextDate = dateString(lastDate);

  trip.days = [...trip.days, { date: nextDate, cityId, activities: [] }];
  if (!trip.cities.includes(cityId)) trip.cities = [...trip.cities, cityId];
  if (new Date(nextDate) > new Date(trip.endDate)) trip.endDate = nextDate;
  if (!trip.coverCityId) trip.coverCityId = cityId;

  saveStoredTrips(trips);
  return trip;
}

/**
 * Removes a stop (day) entirely, then renumbers the remaining dates so the
 * itinerary stays a contiguous block starting at startDate.
 */
export async function removeStop(tripId, dayIndex) {
  await simulateDelay(200);
  const trips = getStoredTrips();
  const trip = trips.find((t) => t.id === tripId);
  if (!trip) throw new Error("Trip not found");

  trip.days = resequenceDays(
    trip.days.filter((_, i) => i !== dayIndex),
    trip.startDate
  );
  trip.cities = [...new Set(trip.days.map((d) => d.cityId))].filter((c) => c && c !== "custom");
  if (trip.days.length) trip.endDate = trip.days[trip.days.length - 1].date;

  saveStoredTrips(trips);
  return trip;
}

/**
 * Moves a stop up or down the itinerary. Dates stay anchored to their slot —
 * the city and its activities move, which is what travellers expect when
 * they reorder legs of a route.
 */
export async function reorderStops(tripId, fromIndex, toIndex) {
  await simulateDelay(150);
  const trips = getStoredTrips();
  const trip = trips.find((t) => t.id === tripId);
  if (!trip) throw new Error("Trip not found");
  if (toIndex < 0 || toIndex >= trip.days.length) return trip;

  const days = [...trip.days];
  const [moved] = days.splice(fromIndex, 1);
  days.splice(toIndex, 0, moved);
  trip.days = resequenceDays(days, trip.startDate);
  trip.cities = [...new Set(trip.days.map((d) => d.cityId))].filter((c) => c && c !== "custom");

  saveStoredTrips(trips);
  return trip;
}

/** Reorders activities inside a single day. */
export async function reorderActivities(tripId, dayIndex, fromIndex, toIndex) {
  await simulateDelay(120);
  const trips = getStoredTrips();
  const trip = trips.find((t) => t.id === tripId);
  if (!trip) throw new Error("Trip not found");

  const day = trip.days[dayIndex];
  if (!day || toIndex < 0 || toIndex >= day.activities.length) return trip;

  const activities = [...day.activities];
  const [moved] = activities.splice(fromIndex, 1);
  activities.splice(toIndex, 0, moved);
  trip.days = trip.days.map((d, i) => (i === dayIndex ? { ...d, activities } : d));

  saveStoredTrips(trips);
  return trip;
}

/** Moves one activity to a different day — powers the calendar reassignment. */
export async function moveActivity(tripId, fromDayIndex, activityId, toDayIndex) {
  await simulateDelay(150);
  const trips = getStoredTrips();
  const trip = trips.find((t) => t.id === tripId);
  if (!trip) throw new Error("Trip not found");

  const source = trip.days[fromDayIndex];
  const target = trip.days[toDayIndex];
  if (!source || !target) return trip;

  const activity = source.activities.find((a) => a.id === activityId);
  if (!activity) return trip;

  trip.days = trip.days.map((d, i) => {
    if (i === fromDayIndex) return { ...d, activities: d.activities.filter((a) => a.id !== activityId) };
    if (i === toDayIndex) return { ...d, activities: [...d.activities, activity] };
    return d;
  });

  saveStoredTrips(trips);
  return trip;
}

/** Rebuilds the date sequence from startDate so no gaps or duplicates remain. */
function resequenceDays(days, startDate) {
  const cursor = new Date(startDate);
  return days.map((day) => {
    const date = dateString(cursor);
    cursor.setDate(cursor.getDate() + 1);
    return { ...day, date };
  });
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

/**
 * Aggregates platform-wide numbers for the admin dashboard. In production this
 * would be a single `GET /admin/stats` served by an aggregate SQL query rather
 * than reduced on the client.
 */
export async function getAdminStats() {
  await simulateDelay(300);
  const trips = getStoredTrips();

  let users = [];
  try {
    users = JSON.parse(localStorage.getItem("gt_registered_users") || "[]");
  } catch {
    users = [];
  }

  const activities = trips.flatMap((t) => t.days.flatMap((d) => d.activities));
  const totalSpend = activities.reduce((s, a) => s + (Number(a.cost) || 0), 0);

  // Popular cities by how many trips include them.
  const cityCounts = {};
  trips.forEach((t) => {
    [...new Set(t.cities)].forEach((c) => {
      cityCounts[c] = (cityCounts[c] || 0) + 1;
    });
  });

  // Popular activities by name across all itineraries.
  const activityCounts = {};
  activities.forEach((a) => {
    activityCounts[a.name] = (activityCounts[a.name] || 0) + 1;
  });

  const categoryCounts = {};
  activities.forEach((a) => {
    const key = a.category || "other";
    categoryCounts[key] = (categoryCounts[key] || 0) + 1;
  });

  // Trips grouped by calendar month of their start date.
  const monthCounts = {};
  trips.forEach((t) => {
    const key = (t.startDate || "").slice(0, 7);
    if (key) monthCounts[key] = (monthCounts[key] || 0) + 1;
  });

  const totalDays = trips.reduce((s, t) => s + t.days.length, 0);

  return {
    totals: {
      users: Math.max(users.length, 1),
      trips: trips.length,
      activities: activities.length,
      cities: new Set(trips.flatMap((t) => t.cities)).size,
      totalSpend,
      avgTripLength: trips.length ? totalDays / trips.length : 0,
      avgTripCost: trips.length ? totalSpend / trips.length : 0,
      publicTrips: trips.filter((t) => t.visibility === "public").length,
    },
    popularCities: Object.entries(cityCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6),
    popularActivities: Object.entries(activityCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6),
    categoryCounts: Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]),
    tripsByMonth: Object.entries(monthCounts).sort((a, b) => a[0].localeCompare(b[0])),
    users: users.slice(0, 8).map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      tripCount: trips.filter((t) => t.ownerId === u.id).length,
    })),
  };
}
