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

function serializeTrip(trip) {
  return {
    id: trip.id,
    ownerId: trip.userId,
    name: trip.title,
    description: trip.description || "",
    startDate: dateString(trip.startDate),
    endDate: dateString(trip.endDate),
    coverImage: trip.coverImage,
    coverCityId: trip.coverCityId,
    cities: trip.stops.map((stop) => stop.cityId || stop.cityName),
    days: trip.stops.sort((a, b) => a.orderIndex - b.orderIndex).map((stop) => ({
      date: dateString(stop.arrivalDate),
      cityId: stop.cityId || stop.cityName,
      activities: stop.activities.map((activity) => ({
        id: activity.id,
        name: activity.title,
        cost: activity.cost,
        notes: activity.notes || "",
      })),
    })),
    visibility: trip.isPublic ? "public" : "private",
    shareId: trip.shareToken,
  };
}

const tripInclude = {
  stops: { include: { activities: true }, orderBy: { orderIndex: "asc" } },
};

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
          cost: Number(activity.cost) || 0,
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

app.get("/api/trips", authRequired, async (req, res, next) => {
  try {
    const trips = await prisma.trip.findMany({ where: { userId: req.userId }, include: tripInclude, orderBy: { startDate: "asc" } });
    return res.json(trips.map(serializeTrip));
  } catch (error) { return next(error); }
});

app.post("/api/trips", authRequired, async (req, res, next) => {
  try {
    const { name, title, startDate, endDate, cities = [], coverCityId, description } = req.body;
    const days = req.body.days?.length ? req.body.days : buildDays(startDate, endDate, cities[0]);
    const trip = await prisma.$transaction(async (tx) => {
      const created = await tx.trip.create({ data: { userId: req.userId, title: name || title, description, startDate: dateOnly(startDate), endDate: dateOnly(endDate), coverCityId } });
      await createStops(tx, created.id, days, cities);
      return tx.trip.findUniqueOrThrow({ where: { id: created.id }, include: tripInclude });
    });
    return res.status(201).json(serializeTrip(trip));
  } catch (error) { return next(error); }
});

app.get("/api/trips/:id/budget", authRequired, async (req, res, next) => {
  try {
    const trip = await prisma.trip.findFirstOrThrow({ where: { id: req.params.id, userId: req.userId } });
    return res.json(await prisma.budget.findUnique({ where: { tripId: trip.id } }) || {});
  } catch (error) { return next(error); }
});

app.put("/api/trips/:id/budget", authRequired, async (req, res, next) => {
  try {
    const trip = await prisma.trip.findFirstOrThrow({ where: { id: req.params.id, userId: req.userId } });
    const fields = ["transportCost", "stayCost", "mealCost", "activityCost", "miscellaneousCost"];
    const data = Object.fromEntries(fields.map((field) => [field, Number(req.body[field]) || 0]));
    data.totalCost = fields.reduce((sum, field) => sum + data[field], 0);
    return res.json(await prisma.budget.upsert({ where: { tripId: trip.id }, create: { tripId: trip.id, ...data }, update: data }));
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
    const { days, cities, name, title, startDate, endDate, ...rest } = req.body;
    const trip = await prisma.$transaction(async (tx) => {
      await tx.trip.update({ where: { id: current.id }, data: { ...rest, ...(name || title ? { title: name || title } : {}), ...(startDate ? { startDate: dateOnly(startDate) } : {}), ...(endDate ? { endDate: dateOnly(endDate) } : {}) } });
      if (days) { await tx.tripStop.deleteMany({ where: { tripId: current.id } }); await createStops(tx, current.id, days, cities || current.stops.map((stop) => stop.cityId)); }
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

app.use((error, _req, res, _next) => {
  console.error(error);
  if (error.code === "P2025") return res.status(404).json({ message: "Resource not found." });
  if (error.code === "P1000" || error.code === "P1001") {
    return res.status(503).json({ message: "Database unavailable. Check backend/.env PostgreSQL credentials and make sure PostgreSQL is running." });
  }
  return res.status(500).json({ message: "Internal server error." });
});

app.listen(port, () => console.log(`GlobeTrotter API listening on http://localhost:${port}`));
