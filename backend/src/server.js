import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { prisma } from "./lib/prisma.js";

const app = express();
const port = Number(process.env.PORT || 5000);
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) throw new Error("JWT_SECRET is required");

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ name: "GlobeTrotter API", status: "ok", frontend: "http://localhost:5173" });
});

function publicUser(user) {
  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
}

function signToken(userId) {
  return jwt.sign({ userId }, jwtSecret, { expiresIn: "7d" });
}

function dateOnly(value) {
  return new Date(`${value}T00:00:00.000Z`);
}

function dateString(value) {
  return new Date(value).toISOString().slice(0, 10);
}

function buildDays(startDate, endDate, cityId) {
  const days = [];
  const current = new Date(startDate);
  const end = new Date(endDate);
  while (current <= end) {
    days.push({ date: dateString(current), cityId, activities: [] });
    current.setUTCDate(current.getUTCDate() + 1);
  }
  return days;
}

const tripInclude = {
  user: { select: { name: true } },
  stops: { include: { activities: true }, orderBy: { orderIndex: "asc" } },
  budget: true,
};

function serializeTrip(trip) {
  return {
    id: trip.id,
    ownerId: trip.userId,
    ownerName: trip.user?.name || "Traveler",
    name: trip.title,
    description: trip.description || "",
    startDate: dateString(trip.startDate),
    endDate: dateString(trip.endDate),
    coverImage: trip.coverImage,
    coverCityId: trip.coverCityId,
    cities: trip.stops.map((stop) => stop.cityId || stop.cityName),
    budgetBreakdown: trip.budget
      ? {
          transport: trip.budget.transportCost,
          stay: trip.budget.stayCost,
          meals: trip.budget.mealCost,
          activities: trip.budget.activityCost,
          misc: trip.budget.miscellaneousCost,
          targetBudget: trip.budget.totalCost || 800,
        }
      : {
          transport: 100,
          stay: 250,
          meals: 150,
          activities: 50,
          misc: 30,
          targetBudget: 800,
        },
    days: trip.stops.sort((a, b) => a.orderIndex - b.orderIndex).map((stop) => ({
      date: dateString(stop.arrivalDate),
      cityId: stop.cityId || stop.cityName,
      activities: stop.activities.map((activity) => ({
        id: activity.id,
        name: activity.title,
        category: activity.category || "Sightseeing",
        time: activity.startTime || "09:00",
        cost: activity.cost,
        notes: activity.notes || "",
      })),
    })),
    visibility: trip.isPublic ? "public" : "private",
    shareId: trip.shareToken,
    isPublic: trip.isPublic,
    createdAt: trip.createdAt,
    likes: 0,
    vibe: "Adventure",
  };
}

async function createStops(tx, tripId, days = [], cities = []) {
  await tx.tripStop.createMany({
    data: days.map((day, index) => ({
      tripId,
      cityId: day.cityId || cities[index] || cities[0] || null,
      cityName: day.cityId || cities[index] || cities[0] || "Unassigned",
      arrivalDate: dateOnly(day.date),
      departureDate: dateOnly(day.date),
      orderIndex: index,
    })),
  });
  const stops = await tx.tripStop.findMany({ where: { tripId }, orderBy: { orderIndex: "asc" } });
  for (let index = 0; index < stops.length; index += 1) {
    const activities = days[index]?.activities || [];
    if (activities.length) {
      await tx.activity.createMany({
        data: activities.map((activity) => ({
          stopId: stops[index].id,
          title: activity.name || activity.title || "Activity",
          category: activity.category || "Sightseeing",
          cost: Number(activity.cost) || 0,
          startTime: activity.time || activity.startTime || null,
          notes: activity.notes || null,
        })),
      });
    }
  }
}

async function authRequired(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Authentication required." });
    const payload = jwt.verify(token, jwtSecret);
    req.userId = payload.userId;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

// Auth endpoints
app.post("/api/auth/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Name, email, and password are required." });
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({ data: { name, email: email.toLowerCase(), passwordHash } });
    return res.status(201).json({ token: signToken(user.id), user: publicUser(user) });
  } catch (error) {
    if (error.code === "P2002") return res.status(409).json({ message: "An account with this email already exists." });
    return next(error);
  }
});

app.post("/api/auth/login", async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { email: req.body.email?.toLowerCase() } });
    if (!user || !(await bcrypt.compare(req.body.password || "", user.passwordHash))) return res.status(401).json({ message: "Incorrect email or password." });
    return res.json({ token: signToken(user.id), user: publicUser(user) });
  } catch (error) { return next(error); }
});

app.get("/api/users/me", authRequired, async (req, res, next) => {
  try { return res.json(publicUser(await prisma.user.findUniqueOrThrow({ where: { id: req.userId } }))); }
  catch (error) { return next(error); }
});

app.patch("/api/users/me", authRequired, async (req, res, next) => {
  try { return res.json(publicUser(await prisma.user.update({ where: { id: req.userId }, data: req.body }))); }
  catch (error) { return next(error); }
});

// Trips endpoints
app.get("/api/trips", authRequired, async (req, res, next) => {
  try {
    const trips = await prisma.trip.findMany({ where: { userId: req.userId }, include: tripInclude, orderBy: { startDate: "asc" } });
    return res.json(trips.map(serializeTrip));
  } catch (error) { return next(error); }
});

app.post("/api/trips", authRequired, async (req, res, next) => {
  try {
    const { name, title, startDate, endDate, cities = [], coverCityId, description, budgetBreakdown } = req.body;
    const days = req.body.days?.length ? req.body.days : buildDays(startDate, endDate, cities[0]);
    const trip = await prisma.$transaction(async (tx) => {
      const created = await tx.trip.create({
        data: {
          userId: req.userId,
          title: name || title,
          description,
          startDate: dateOnly(startDate),
          endDate: dateOnly(endDate),
          coverCityId,
        },
      });
      await createStops(tx, created.id, days, cities);

      if (budgetBreakdown) {
        await tx.budget.create({
          data: {
            tripId: created.id,
            transportCost: Number(budgetBreakdown.transport) || 0,
            stayCost: Number(budgetBreakdown.stay) || 0,
            mealCost: Number(budgetBreakdown.meals) || 0,
            activityCost: Number(budgetBreakdown.activities) || 0,
            miscellaneousCost: Number(budgetBreakdown.misc) || 0,
            totalCost: Number(budgetBreakdown.targetBudget) || 800,
          },
        });
      }

      return tx.trip.findUniqueOrThrow({ where: { id: created.id }, include: tripInclude });
    });
    return res.status(201).json(serializeTrip(trip));
  } catch (error) { return next(error); }
});

app.get("/api/trips/:id", authRequired, async (req, res, next) => {
  try {
    const trip = await prisma.trip.findFirstOrThrow({ where: { id: req.params.id, userId: req.userId }, include: tripInclude });
    return res.json(serializeTrip(trip));
  } catch (error) { return next(error); }
});

app.patch("/api/trips/:id", authRequired, async (req, res, next) => {
  try {
    const current = await prisma.trip.findFirstOrThrow({ where: { id: req.params.id, userId: req.userId }, include: tripInclude });
    const { days, cities, name, title, startDate, endDate, budgetBreakdown, isPublic, ...rest } = req.body;
    const trip = await prisma.$transaction(async (tx) => {
      await tx.trip.update({
        where: { id: current.id },
        data: {
          ...rest,
          ...(name || title ? { title: name || title } : {}),
          ...(startDate ? { startDate: dateOnly(startDate) } : {}),
          ...(endDate ? { endDate: dateOnly(endDate) } : {}),
          ...(typeof isPublic === "boolean" ? { isPublic } : {}),
        },
      });

      if (budgetBreakdown) {
        await tx.budget.upsert({
          where: { tripId: current.id },
          create: {
            tripId: current.id,
            transportCost: Number(budgetBreakdown.transport) || 0,
            stayCost: Number(budgetBreakdown.stay) || 0,
            mealCost: Number(budgetBreakdown.meals) || 0,
            activityCost: Number(budgetBreakdown.activities) || 0,
            miscellaneousCost: Number(budgetBreakdown.misc) || 0,
            totalCost: Number(budgetBreakdown.targetBudget) || 800,
          },
          update: {
            transportCost: Number(budgetBreakdown.transport) || 0,
            stayCost: Number(budgetBreakdown.stay) || 0,
            mealCost: Number(budgetBreakdown.meals) || 0,
            activityCost: Number(budgetBreakdown.activities) || 0,
            miscellaneousCost: Number(budgetBreakdown.misc) || 0,
            totalCost: Number(budgetBreakdown.targetBudget) || 800,
          },
        });
      }

      if (days) {
        await tx.tripStop.deleteMany({ where: { tripId: current.id } });
        await createStops(tx, current.id, days, cities || current.stops.map((stop) => stop.cityId));
      }
      return tx.trip.findUniqueOrThrow({ where: { id: current.id }, include: tripInclude });
    });
    return res.json(serializeTrip(trip));
  } catch (error) { return next(error); }
});

app.delete("/api/trips/:id", authRequired, async (req, res, next) => {
  try {
    const trip = await prisma.trip.findFirstOrThrow({ where: { id: req.params.id, userId: req.userId } });
    await prisma.trip.delete({ where: { id: trip.id } });
    return res.status(204).end();
  }
  catch (error) { return next(error); }
});

// Community publish toggle
app.post("/api/trips/:id/toggle-community", authRequired, async (req, res, next) => {
  try {
    const current = await prisma.trip.findFirstOrThrow({ where: { id: req.params.id, userId: req.userId } });
    const nextPublic = !current.isPublic;
    const shareToken = nextPublic && !current.shareToken ? crypto.randomBytes(6).toString("hex") : current.shareToken;
    const updated = await prisma.trip.update({
      where: { id: current.id },
      data: { isPublic: nextPublic, shareToken },
      include: tripInclude,
    });
    return res.json(serializeTrip(updated));
  } catch (error) { return next(error); }
});

app.post("/api/trips/:id/share", authRequired, async (req, res, next) => {
  try {
    const trip = await prisma.trip.updateMany({ where: { id: req.params.id, userId: req.userId }, data: { isPublic: true, shareToken: crypto.randomBytes(6).toString("hex") } });
    if (!trip.count) return res.status(404).json({ message: "Trip not found." });
    return res.json(serializeTrip(await prisma.trip.findUniqueOrThrow({ where: { id: req.params.id }, include: tripInclude })));
  } catch (error) { return next(error); }
});

app.get("/api/public/trips/:shareId", async (req, res) => {
  try { return res.json(serializeTrip(await prisma.trip.findFirstOrThrow({ where: { shareToken: req.params.shareId, isPublic: true }, include: tripInclude }))); }
  catch { return res.status(404).json({ message: "This trip isn't available or is no longer shared." }); }
});

// Real-time Community Hub feed
app.get("/api/public/community", async (_req, res, next) => {
  try {
    const trips = await prisma.trip.findMany({
      where: { isPublic: true },
      include: tripInclude,
      orderBy: { createdAt: "desc" },
    });
    return res.json(trips.map(serializeTrip));
  } catch (error) { return next(error); }
});

app.post("/api/trips/copy/:shareId", authRequired, async (req, res, next) => {
  try {
    const source = await prisma.trip.findFirstOrThrow({ where: { shareToken: req.params.shareId, isPublic: true }, include: tripInclude });
    const copy = await prisma.$transaction(async (tx) => {
      const created = await tx.trip.create({ data: { userId: req.userId, title: `${source.title} (copy)`, description: source.description, startDate: source.startDate, endDate: source.endDate, coverImage: source.coverImage, coverCityId: source.coverCityId } });
      await createStops(tx, created.id, serializeTrip(source).days, serializeTrip(source).cities);
      return tx.trip.findUniqueOrThrow({ where: { id: created.id }, include: tripInclude });
    });
    return res.status(201).json(serializeTrip(copy));
  } catch (error) { return next(error); }
});

// Dynamic Real-time Database Analytics
app.get("/api/admin/analytics", async (_req, res, next) => {
  try {
    const totalTrips = await prisma.trip.count();
    const totalUsers = await prisma.user.count();
    const totalActivities = await prisma.activity.count();
    const publicTripsCount = await prisma.trip.count({ where: { isPublic: true } });

    // Calculate real average trip duration in days
    const allTrips = await prisma.trip.findMany({ select: { startDate: true, endDate: true, createdAt: true } });
    let avgDuration = 0;
    if (allTrips.length > 0) {
      const totalDays = allTrips.reduce((acc, t) => {
        const diff = Math.max(1, Math.round((new Date(t.endDate) - new Date(t.startDate)) / (1000 * 60 * 60 * 24)));
        return acc + diff;
      }, 0);
      avgDuration = Number((totalDays / allTrips.length).toFixed(1));
    }

    // Top cities from real trip stops
    const topCitiesRaw = await prisma.tripStop.groupBy({
      by: ["cityName", "country"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 8,
    });
    const topCities = topCitiesRaw.map((c, idx) => ({
      rank: String(idx + 1).padStart(2, "0"),
      name: c.cityName,
      country: c.country || "Global",
      tripsCount: c._count.id,
    }));

    // Top activities planned by users
    const topActsRaw = await prisma.activity.groupBy({
      by: ["title", "category"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 8,
    });
    const topActivities = topActsRaw.map((a, idx) => ({
      rank: String(idx + 1).padStart(2, "0"),
      name: a.title,
      category: a.category || "Sightseeing",
      plannedCount: a._count.id,
    }));

    return res.json({
      totalTrips,
      totalUsers,
      totalActivities,
      publicTripsCount,
      avgDuration,
      topCities,
      topActivities,
    });
  } catch (error) { return next(error); }
});

// Saved Destinations
app.get("/api/users/me/saved-destinations", authRequired, async (req, res, next) => {
  try {
    const saved = await prisma.savedDestination.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
    });
    return res.json(saved.map((s) => s.city));
  } catch (error) { return next(error); }
});

app.post("/api/users/me/saved-destinations", authRequired, async (req, res, next) => {
  try {
    const { city, country } = req.body;
    const item = await prisma.savedDestination.upsert({
      where: { userId_city_country: { userId: req.userId, city, country: country || "" } },
      create: { userId: req.userId, city, country: country || "" },
      update: {},
    });
    return res.status(201).json(item);
  } catch (error) { return next(error); }
});

app.delete("/api/users/me/saved-destinations/:city", authRequired, async (req, res, next) => {
  try {
    await prisma.savedDestination.deleteMany({
      where: { userId: req.userId, city: req.params.city },
    });
    return res.status(204).end();
  } catch (error) { return next(error); }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  if (error.code === "P2025") return res.status(404).json({ message: "Resource not found." });
  if (error.code === "P1000" || error.code === "P1001") {
    return res.status(503).json({ message: "Database unavailable. Check PostgreSQL connection." });
  }
  return res.status(500).json({ message: "Internal server error." });
});

app.listen(port, () => console.log(`GlobeTrotter API listening on http://localhost:${port}`));
