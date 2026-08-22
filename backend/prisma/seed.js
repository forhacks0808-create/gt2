import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma.js";

const SEED_DESTINATIONS = [
  {
    id: "lisbon",
    name: "Lisbon",
    country: "Portugal",
    region: "Europe",
    population: 545000,
    costIndex: 52,
    popularity: 94,
    avgDailyCost: 85,
    description: "Sun-drenched hills, historic yellow trams, tiled facades, and world-class seafood.",
    tag: "Trending",
  },
  {
    id: "kyoto",
    name: "Kyoto",
    country: "Japan",
    region: "Asia",
    population: 1475000,
    costIndex: 61,
    popularity: 96,
    avgDailyCost: 110,
    description: "Ancient temples, serene bamboo groves, traditional tea houses, and exquisite kaiseki dining.",
    tag: "Cultural Classic",
  },
  {
    id: "mexico-city",
    name: "Mexico City",
    country: "Mexico",
    region: "Americas",
    population: 9200000,
    costIndex: 44,
    popularity: 89,
    avgDailyCost: 65,
    description: "Vibrant art scene, lush parks, Aztec ruins, and an unmatched culinary landscape.",
    tag: "Foodie Mecca",
  },
  {
    id: "reykjavik",
    name: "Reykjavík",
    country: "Iceland",
    region: "Europe",
    population: 133000,
    costIndex: 78,
    popularity: 85,
    avgDailyCost: 160,
    description: "Gateway to dramatic glaciers, geothermal lagoons, black sand beaches, and Northern Lights.",
    tag: "Adventure",
  },
  {
    id: "marrakesh",
    name: "Marrakesh",
    country: "Morocco",
    region: "Africa",
    population: 928000,
    costIndex: 38,
    popularity: 88,
    avgDailyCost: 55,
    description: "Labyrinthine souks, palatial riads, aromatic spices, and desert vistas.",
    tag: "Sensory Haven",
  },
  {
    id: "ho-chi-minh",
    name: "Ho Chi Minh City",
    country: "Vietnam",
    region: "Asia",
    population: 8993000,
    costIndex: 33,
    popularity: 82,
    avgDailyCost: 40,
    description: "High-energy street markets, french-colonial architecture, and unmatched street coffee culture.",
    tag: "Best Value",
  },
  {
    id: "porto",
    name: "Porto",
    country: "Portugal",
    region: "Europe",
    population: 231000,
    costIndex: 48,
    popularity: 87,
    avgDailyCost: 75,
    description: "Riverside wine cellars, dramatic bridges over the Douro, and charming cobblestone alleys.",
    tag: "Wine & Dine",
  },
  {
    id: "cape-town",
    name: "Cape Town",
    country: "South Africa",
    region: "Africa",
    population: 4618000,
    costIndex: 46,
    popularity: 91,
    avgDailyCost: 70,
    description: "Table Mountain silhouette, penguin colonies, Atlantic ocean drives, and historic vineyards.",
    tag: "Coastal Wonder",
  },
  {
    id: "seoul",
    name: "Seoul",
    country: "South Korea",
    region: "Asia",
    population: 9776000,
    costIndex: 63,
    popularity: 93,
    avgDailyCost: 95,
    description: "Futuristic skyscrapers, neon night markets, historic palaces, and unbeatable street snacks.",
    tag: "Modern & Historic",
  },
  {
    id: "buenos-aires",
    name: "Buenos Aires",
    country: "Argentina",
    region: "Americas",
    population: 3075000,
    costIndex: 41,
    popularity: 84,
    avgDailyCost: 50,
    description: "Tango clubs, grand European avenues, steakhouse dining, and bohemian neighborhood vibes.",
    tag: "Nightlife & Art",
  },
  {
    id: "tbilisi",
    name: "Tbilisi",
    country: "Georgia",
    region: "Europe",
    population: 1114000,
    costIndex: 35,
    popularity: 78,
    avgDailyCost: 45,
    description: "Ancient sulfur baths, cliffside fortresses, natural wine bars, and welcoming hospitality.",
    tag: "Hidden Gem",
  },
  {
    id: "chiang-mai",
    name: "Chiang Mai",
    country: "Thailand",
    region: "Asia",
    population: 131000,
    costIndex: 31,
    popularity: 90,
    avgDailyCost: 35,
    description: "Misty mountain temples, ethical elephant reserves, night bazaars, and cozy digital nomad cafes.",
    tag: "Nomad Favorite",
  },
  {
    id: "cairo",
    name: "Cairo",
    country: "Egypt",
    region: "Africa",
    population: 9801000,
    costIndex: 34,
    popularity: 92,
    avgDailyCost: 45,
    description: "The Great Pyramids of Giza, ancient Nile felucca boats, and bustling Khan el-Khalili bazaar.",
    tag: "Ancient Wonders",
  },
  {
    id: "nairobi",
    name: "Nairobi",
    country: "Kenya",
    region: "Africa",
    population: 5545000,
    costIndex: 42,
    popularity: 86,
    avgDailyCost: 60,
    description: "Wildlife sanctuary bordering a modern capital, giraffe manor, and vibrant Maasai markets.",
    tag: "Safari Gateway",
  },
  {
    id: "rome",
    name: "Rome",
    country: "Italy",
    region: "Europe",
    population: 2873000,
    costIndex: 65,
    popularity: 97,
    avgDailyCost: 115,
    description: "The Colosseum, Roman Forum, handmade pasta trattorias, and breathtaking baroque fountains.",
    tag: "Eternal City",
  },
  {
    id: "bangkok",
    name: "Bangkok",
    country: "Thailand",
    region: "Asia",
    population: 10539000,
    costIndex: 40,
    popularity: 95,
    avgDailyCost: 50,
    description: "Ornate golden shrines, lively river transport, and Michelin-starred street food stalls.",
    tag: "Street Food Capital",
  },
];

const SEED_ACTIVITIES = [
  // Lisbon
  {
    cityId: "lisbon",
    cityName: "Lisbon",
    name: "Tram 28 Scenic Historic Loop",
    category: "Sightseeing",
    cost: 12,
    duration: "1.5h",
    description: "Climb through steep cobblestone quarters of Graça, Alfama, and Baixa in a vintage 1930s tram.",
  },
  {
    cityId: "lisbon",
    cityName: "Lisbon",
    name: "Alfama Viewpoint Crawl & Fado Night",
    category: "Culture",
    cost: 45,
    duration: "3.5h",
    description: "Catch sunset at Miradouro de Santa Luzia followed by traditional live acoustic fado singing and wine.",
  },
  {
    cityId: "lisbon",
    cityName: "Lisbon",
    name: "Pastéis de Belém & Jerónimos Monastery",
    category: "Food & Dining",
    cost: 18,
    duration: "2h",
    description: "Taste the original warm custard tart recipe dating back to 1837 next to UNESCO gothic architecture.",
  },
  {
    cityId: "lisbon",
    cityName: "Lisbon",
    name: "Sintra Pena Palace & Moorish Castle Day Trip",
    category: "Adventure",
    cost: 35,
    duration: "5h",
    description: "Fairytale colorful palace perched on the misty peaks of the Sintra-Cascais Natural Park.",
  },

  // Kyoto
  {
    cityId: "kyoto",
    cityName: "Kyoto",
    name: "Fushimi Inari at Dawn Torii Hike",
    category: "Adventure",
    cost: 0,
    duration: "2.5h",
    description: "Hike through 10,000 vivid vermilion torii gates winding up the sacred Mount Inari before crowds arrive.",
  },
  {
    cityId: "kyoto",
    cityName: "Kyoto",
    name: "Arashiyama Bamboo Grove & Tenryu-ji",
    category: "Sightseeing",
    cost: 10,
    duration: "2h",
    description: "Soaring green stalks swaying in the wind, accompanied by ancient zen landscaped garden contemplation.",
  },
  {
    cityId: "kyoto",
    cityName: "Kyoto",
    name: "Nishiki Market 7-Course Street Food Walk",
    category: "Food & Dining",
    cost: 32,
    duration: "2h",
    description: "Sample octopus skewers, fresh matcha soft serve, dashi tamagoyaki, and seasonal tempura.",
  },
  {
    cityId: "kyoto",
    cityName: "Kyoto",
    name: "Gion District Evening Geisha Walking Tour",
    category: "Culture",
    cost: 28,
    duration: "1.5h",
    description: "Explore 17th-century wooden machiya merchant houses and preserve tea house traditions.",
  },

  // Mexico City
  {
    cityId: "mexico-city",
    cityName: "Mexico City",
    name: "Frida Kahlo Blue House & Coyoacán Plaza",
    category: "Culture",
    cost: 16,
    duration: "2.5h",
    description: "Walk the intimate studio, personal gardens, and bold art collection of Frida and Diego Rivera.",
  },
  {
    cityId: "mexico-city",
    cityName: "Mexico City",
    name: "Teotihuacán Pyramid Climb & Hot Air Balloon",
    category: "Adventure",
    cost: 85,
    duration: "4h",
    description: "Sunrise aerial view over the ancient Pyramid of the Sun and Moon, followed by traditional breakfast.",
  },
  {
    cityId: "mexico-city",
    cityName: "Mexico City",
    name: "Roma Norte & Condesa Gourmet Taco Crawl",
    category: "Food & Dining",
    cost: 25,
    duration: "2.5h",
    description: "Compare Al Pastor carved from rotating spits, Suadero, craft mezcal cocktails, and churros.",
  },

  // Reykjavik
  {
    cityId: "reykjavik",
    cityName: "Reykjavík",
    name: "Golden Circle Geysir & Gullfoss Waterfall",
    category: "Adventure",
    cost: 65,
    duration: "6h",
    description: "Witness Strokkur geyser spout boiling water 30 meters high and explore the tectonic continental rift.",
  },
  {
    cityId: "reykjavik",
    cityName: "Reykjavík",
    name: "Blue Lagoon Geothermal Spa & Silica Mask",
    category: "Sightseeing",
    cost: 75,
    duration: "3h",
    description: "Soak in milky-blue, mineral-rich warm geothermal waters surrounded by raw black lava fields.",
  },

  // Cape Town
  {
    cityId: "cape-town",
    cityName: "Cape Town",
    name: "Table Mountain Rotating Cable Car & Summit",
    category: "Sightseeing",
    cost: 24,
    duration: "2.5h",
    description: "360-degree panoramic ocean and city views from the flat-topped iconic mountain summit.",
  },
  {
    cityId: "cape-town",
    cityName: "Cape Town",
    name: "Boulders Beach African Penguin Colony",
    category: "Adventure",
    cost: 15,
    duration: "2h",
    description: "Get up-close to free-roaming wild African penguins nesting on white granite boulder beaches.",
  },

  // Cairo
  {
    cityId: "cairo",
    cityName: "Cairo",
    name: "Giza Pyramids & Great Sphinx Guided Trek",
    category: "Sightseeing",
    cost: 30,
    duration: "4h",
    description: "Stand before the last remaining wonder of the ancient world with an Egyptologist guide.",
  },
  {
    cityId: "cairo",
    cityName: "Cairo",
    name: "Nile River Sunset Felucca Sail",
    category: "Culture",
    cost: 20,
    duration: "2h",
    description: "Peaceful traditional wooden sailboat gliding across the historic Nile as the city lights illuminate.",
  },

  // Rome
  {
    cityId: "rome",
    cityName: "Rome",
    name: "Colosseum & Underground Arena Priority Tour",
    category: "Culture",
    cost: 45,
    duration: "3h",
    description: "Walk onto the arena floor where gladiators fought, with full historical narration.",
  },
  {
    cityId: "rome",
    cityName: "Rome",
    name: "Trastevere Evening Pasta & Wine Walk",
    category: "Food & Dining",
    cost: 38,
    duration: "2.5h",
    description: "Taste authentic Cacio e Pepe, crispy Roman pizza, artisanal gelato, and local Lazio wines.",
  },
];

async function seed() {
  console.log("Seeding GlobeTrotter PostgreSQL database...");

  // 1. Seed Demo User
  const user = await prisma.user.upsert({
    where: { email: "demo@globetrotter.app" },
    update: {},
    create: {
      name: "Demo Traveler",
      email: "demo@globetrotter.app",
      passwordHash: await bcrypt.hash("demo1234", 12),
    },
  });

  // 2. Seed Sample Trip
  const existingTrip = await prisma.trip.findFirst({ where: { userId: user.id } });
  if (!existingTrip) {
    const trip = await prisma.trip.create({
      data: {
        userId: user.id,
        title: "Portugal in spring",
        description: "A 4-day scenic journey through Lisbon and Porto with wine tastings and tram rides.",
        startDate: new Date("2026-04-10T00:00:00.000Z"),
        endDate: new Date("2026-04-13T00:00:00.000Z"),
        coverCityId: "lisbon",
        isPublic: true,
        shareToken: "pt-spring-2026",
        stops: {
          create: [
            { cityId: "lisbon", cityName: "Lisbon", country: "Portugal", arrivalDate: new Date("2026-04-10T00:00:00.000Z"), departureDate: new Date("2026-04-10T00:00:00.000Z"), orderIndex: 0, activities: { create: [{ title: "Tram 28 scenic loop", category: "Sightseeing", cost: 12 }] } },
            { cityId: "lisbon", cityName: "Lisbon", country: "Portugal", arrivalDate: new Date("2026-04-11T00:00:00.000Z"), departureDate: new Date("2026-04-11T00:00:00.000Z"), orderIndex: 1, activities: { create: [{ title: "Alfama viewpoint crawl", category: "Culture", cost: 0 }] } },
            { cityId: "porto", cityName: "Porto", country: "Portugal", arrivalDate: new Date("2026-04-12T00:00:00.000Z"), departureDate: new Date("2026-04-12T00:00:00.000Z"), orderIndex: 2, activities: { create: [{ title: "Douro river cruise", category: "Adventure", cost: 30 }] } },
          ],
        },
        budget: { create: { transportCost: 80, stayCost: 240, mealCost: 120, activityCost: 42, miscellaneousCost: 20, totalCost: 502 } },
      },
    });
    console.log(`Seeded trip: ${trip.title}`);
  }

  // 3. Seed Destinations into PostgreSQL
  for (const d of SEED_DESTINATIONS) {
    await prisma.destination.upsert({
      where: { id: d.id },
      update: d,
      create: d,
    });
  }
  console.log(`Seeded ${SEED_DESTINATIONS.length} destinations into 'Destination' table.`);

  // 4. Seed Catalog Activities into PostgreSQL
  for (const act of SEED_ACTIVITIES) {
    const existing = await prisma.catalogActivity.findFirst({
      where: { cityId: act.cityId, name: act.name },
    });
    if (!existing) {
      await prisma.catalogActivity.create({ data: act });
    }
  }
  console.log(`Seeded ${SEED_ACTIVITIES.length} activities into 'CatalogActivity' table.`);

  console.log("Database seed completed successfully!");
  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error("Seed error:", e);
  process.exit(1);
});
