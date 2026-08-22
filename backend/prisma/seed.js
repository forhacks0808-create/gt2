import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma.js";

const user = await prisma.user.upsert({
  where: { email: "demo@globetrotter.app" },
  update: {},
  create: {
    name: "Demo Traveler",
    email: "demo@globetrotter.app",
    passwordHash: await bcrypt.hash("demo1234", 12),
  },
});

const trip = await prisma.trip.create({
  data: {
    userId: user.id,
    title: "Portugal in spring",
    startDate: new Date("2026-04-10T00:00:00.000Z"),
    endDate: new Date("2026-04-13T00:00:00.000Z"),
    coverCityId: "lisbon",
    stops: {
      create: [
        { cityId: "lisbon", cityName: "lisbon", country: "Portugal", arrivalDate: new Date("2026-04-10T00:00:00.000Z"), departureDate: new Date("2026-04-10T00:00:00.000Z"), orderIndex: 0, activities: { create: [{ title: "Tram 28 loop", cost: 12 }] } },
        { cityId: "lisbon", cityName: "lisbon", country: "Portugal", arrivalDate: new Date("2026-04-11T00:00:00.000Z"), departureDate: new Date("2026-04-11T00:00:00.000Z"), orderIndex: 1, activities: { create: [{ title: "Alfama viewpoint crawl", cost: 0 }] } },
        { cityId: "porto", cityName: "porto", country: "Portugal", arrivalDate: new Date("2026-04-12T00:00:00.000Z"), departureDate: new Date("2026-04-12T00:00:00.000Z"), orderIndex: 2, activities: { create: [{ title: "Douro river cruise", cost: 30 }] } },
      ],
    },
    budget: { create: { transportCost: 80, stayCost: 240, mealCost: 120, activityCost: 42, totalCost: 482 } },
  },
});

console.log(`Seeded ${user.email} and trip ${trip.id}`);
await prisma.$disconnect();
