// Stand-in dataset for the real geo/cities API (GeoDB Cities via RapidAPI, or
// Teleport). Shape mirrors what those APIs return so swapping in citiesApi.js
// is a drop-in change, not a rewrite. See src/api/citiesApi.js.
export const CITIES = [
  { id: "lisbon", name: "Lisbon", country: "Portugal", region: "Europe", costIndex: 52, popularity: 91, lat: 38.7223, lng: -9.1393 },
  { id: "kyoto", name: "Kyoto", country: "Japan", region: "Asia", costIndex: 61, popularity: 88, lat: 35.0116, lng: 135.7681 },
  { id: "mexico-city", name: "Mexico City", country: "Mexico", region: "North America", costIndex: 44, popularity: 84, lat: 19.4326, lng: -99.1332 },
  { id: "reykjavik", name: "Reykjavík", country: "Iceland", region: "Europe", costIndex: 78, popularity: 79, lat: 64.1466, lng: -21.9426 },
  { id: "marrakesh", name: "Marrakesh", country: "Morocco", region: "Africa", costIndex: 38, popularity: 76, lat: 31.6295, lng: -7.9811 },
  { id: "ho-chi-minh", name: "Ho Chi Minh City", country: "Vietnam", region: "Asia", costIndex: 33, popularity: 74, lat: 10.8231, lng: 106.6297 },
  { id: "porto", name: "Porto", country: "Portugal", region: "Europe", costIndex: 48, popularity: 71, lat: 41.1579, lng: -8.6291 },
  { id: "cape-town", name: "Cape Town", country: "South Africa", region: "Africa", costIndex: 46, popularity: 82, lat: -33.9249, lng: 18.4241 },
  { id: "seoul", name: "Seoul", country: "South Korea", region: "Asia", costIndex: 63, popularity: 85, lat: 37.5665, lng: 126.978 },
  { id: "buenos-aires", name: "Buenos Aires", country: "Argentina", region: "South America", costIndex: 41, popularity: 77, lat: -34.6037, lng: -58.3816 },
  { id: "tbilisi", name: "Tbilisi", country: "Georgia", region: "Asia", costIndex: 35, popularity: 66, lat: 41.7151, lng: 44.8271 },
  { id: "chiang-mai", name: "Chiang Mai", country: "Thailand", region: "Asia", costIndex: 31, popularity: 80, lat: 18.7883, lng: 98.9853 },
  { id: "tokyo", name: "Tokyo", country: "Japan", region: "Asia", costIndex: 72, popularity: 94, lat: 35.6762, lng: 139.6503 },
];

/**
 * Activity categories drive three separate screens, so the list lives here and
 * nowhere else:
 *  - Activity Search filter chips
 *  - Itinerary Builder category picker
 *  - Budget breakdown (each category maps to a budget bucket below)
 */
export const CATEGORIES = [
  { id: "sightseeing", label: "Sightseeing", bucket: "activities" },
  { id: "food", label: "Food & Drink", bucket: "meals" },
  { id: "culture", label: "Culture", bucket: "activities" },
  { id: "outdoors", label: "Outdoors", bucket: "activities" },
  { id: "nightlife", label: "Nightlife", bucket: "activities" },
  { id: "shopping", label: "Shopping", bucket: "activities" },
  { id: "transport", label: "Transport", bucket: "transport" },
  { id: "stay", label: "Stay", bucket: "stay" },
  { id: "other", label: "Other", bucket: "activities" },
];

/** Budget buckets, in the order the spec's cost-breakdown lists them. */
export const BUDGET_BUCKETS = [
  { id: "transport", label: "Transport" },
  { id: "stay", label: "Stay" },
  { id: "meals", label: "Meals" },
  { id: "activities", label: "Activities" },
];

export function categoryLabel(id) {
  return CATEGORIES.find((c) => c.id === id)?.label || "Other";
}

export function categoryBucket(id) {
  return CATEGORIES.find((c) => c.id === id)?.bucket || "activities";
}

export const REGIONS = [...new Set(CITIES.map((c) => c.region))].sort();
export const COUNTRIES = [...new Set(CITIES.map((c) => c.country))].sort();

/**
 * Searchable activity catalog. Stands in for a real POI/experiences API
 * (Viator, GetYourGuide, or Google Places "nearby"). `duration` is minutes,
 * `cost` is USD per person, `rating` is out of 5.
 */
export const ACTIVITY_CATALOG = [
  // Lisbon
  { id: "a-lis-1", cityId: "lisbon", name: "Tram 28 scenic loop", category: "sightseeing", cost: 12, duration: 90, rating: 4.4, description: "The classic yellow tram climb through Graça and Alfama." },
  { id: "a-lis-2", cityId: "lisbon", name: "Alfama viewpoint crawl", category: "outdoors", cost: 0, duration: 150, rating: 4.7, description: "Walk between four miradouros ending at Santa Luzia for sunset." },
  { id: "a-lis-3", cityId: "lisbon", name: "Pastéis de Belém tasting", category: "food", cost: 15, duration: 60, rating: 4.8, description: "Warm custard tarts straight from the original 1837 bakery." },
  { id: "a-lis-4", cityId: "lisbon", name: "LX Factory market", category: "shopping", cost: 10, duration: 120, rating: 4.2, description: "Design studios and bookshops inside a converted textile plant." },
  { id: "a-lis-5", cityId: "lisbon", name: "Fado dinner in Bairro Alto", category: "nightlife", cost: 45, duration: 180, rating: 4.6, description: "Traditional guitar-and-voice performance over a long dinner." },
  { id: "a-lis-6", cityId: "lisbon", name: "Sintra day trip by train", category: "transport", cost: 22, duration: 480, rating: 4.5, description: "Pena Palace and Quinta da Regaleira in a single long day." },

  // Porto
  { id: "a-por-1", cityId: "porto", name: "Livraria Lello bookshop", category: "culture", cost: 10, duration: 45, rating: 4.1, description: "Neo-gothic staircase and stained glass in a working bookshop." },
  { id: "a-por-2", cityId: "porto", name: "Douro river six-bridges cruise", category: "sightseeing", cost: 30, duration: 60, rating: 4.5, description: "Low-angle views of Ponte Luís I from the water." },
  { id: "a-por-3", cityId: "porto", name: "Port cellar tasting in Gaia", category: "food", cost: 25, duration: 90, rating: 4.7, description: "Vintage and tawny flight in a riverside lodge." },
  { id: "a-por-4", cityId: "porto", name: "Ribeira riverside walk", category: "outdoors", cost: 0, duration: 90, rating: 4.6, description: "Tiled facades and terrace cafés along the Cais da Ribeira." },
  { id: "a-por-5", cityId: "porto", name: "Douro Valley wine day trip", category: "food", cost: 95, duration: 540, rating: 4.9, description: "Terraced vineyards, two quintas, and lunch with a view." },

  // Kyoto
  { id: "a-kyo-1", cityId: "kyoto", name: "Fushimi Inari at dawn", category: "sightseeing", cost: 0, duration: 180, rating: 4.9, description: "Thousands of torii gates, empty if you start before 7am." },
  { id: "a-kyo-2", cityId: "kyoto", name: "Arashiyama bamboo grove", category: "outdoors", cost: 0, duration: 120, rating: 4.4, description: "Groves plus the Iwatayama monkey park on the hill above." },
  { id: "a-kyo-3", cityId: "kyoto", name: "Gion evening walk", category: "culture", cost: 0, duration: 90, rating: 4.5, description: "Wooden machiya teahouses on Hanamikoji at lantern hour." },
  { id: "a-kyo-4", cityId: "kyoto", name: "Nishiki Market food crawl", category: "food", cost: 30, duration: 120, rating: 4.6, description: "Five covered blocks of pickles, tamagoyaki, and knife shops." },
  { id: "a-kyo-5", cityId: "kyoto", name: "Kinkaku-ji Golden Pavilion", category: "sightseeing", cost: 5, duration: 75, rating: 4.5, description: "Gold-leaf temple reflected in the mirror pond." },
  { id: "a-kyo-6", cityId: "kyoto", name: "Tea ceremony in a machiya", category: "culture", cost: 55, duration: 90, rating: 4.8, description: "Full matcha ceremony in a restored townhouse." },

  // Tokyo
  { id: "a-tok-1", cityId: "tokyo", name: "Tsukiji outer market food tour", category: "food", cost: 35, duration: 180, rating: 4.7, description: "Tamagoyaki, uni, and knife stalls with an early start." },
  { id: "a-tok-2", cityId: "tokyo", name: "Shibuya Sky observation deck", category: "sightseeing", cost: 20, duration: 90, rating: 4.6, description: "Open-air rooftop over the world's busiest crossing." },
  { id: "a-tok-3", cityId: "tokyo", name: "Akihabara arcade crawl", category: "nightlife", cost: 15, duration: 150, rating: 4.3, description: "Six floors of rhythm games and retro cabinets." },
  { id: "a-tok-4", cityId: "tokyo", name: "Shinjuku Gyoen garden", category: "outdoors", cost: 5, duration: 120, rating: 4.5, description: "Three garden styles and the best hanami in the city." },
  { id: "a-tok-5", cityId: "tokyo", name: "Shinkansen to Kyoto", category: "transport", cost: 110, duration: 165, rating: 4.8, description: "Nozomi service from Tokyo Station, right side for Mt Fuji." },
  { id: "a-tok-6", cityId: "tokyo", name: "Capsule hotel night", category: "stay", cost: 40, duration: 600, rating: 4.0, description: "A night in a pod hotel with a proper sento bath downstairs." },

  // Mexico City
  { id: "a-mex-1", cityId: "mexico-city", name: "Frida Kahlo Museum", category: "culture", cost: 15, duration: 120, rating: 4.6, description: "Casa Azul in Coyoacán — book the timed slot well ahead." },
  { id: "a-mex-2", cityId: "mexico-city", name: "Teotihuacán pyramids day trip", category: "sightseeing", cost: 45, duration: 420, rating: 4.8, description: "Avenue of the Dead and the Pyramid of the Sun." },
  { id: "a-mex-3", cityId: "mexico-city", name: "Roma Norte taco crawl", category: "food", cost: 25, duration: 180, rating: 4.9, description: "Al pastor, suadero, and a mezcal stop to finish." },
  { id: "a-mex-4", cityId: "mexico-city", name: "Chapultepec Castle", category: "sightseeing", cost: 8, duration: 150, rating: 4.4, description: "Hilltop castle with city views and the anthropology park below." },
  { id: "a-mex-5", cityId: "mexico-city", name: "Lucha libre at Arena México", category: "nightlife", cost: 20, duration: 180, rating: 4.7, description: "Masked wrestling with a very committed crowd." },

  // Reykjavík
  { id: "a-rey-1", cityId: "reykjavik", name: "Golden Circle self-drive", category: "outdoors", cost: 85, duration: 480, rating: 4.7, description: "Þingvellir rift, Geysir, and Gullfoss in one loop." },
  { id: "a-rey-2", cityId: "reykjavik", name: "Blue Lagoon soak", category: "outdoors", cost: 75, duration: 180, rating: 4.3, description: "Silica-milky geothermal water, pre-booked entry only." },
  { id: "a-rey-3", cityId: "reykjavik", name: "Northern lights hunt", category: "sightseeing", cost: 60, duration: 240, rating: 4.2, description: "Guided drive out of the city's light dome, Sept–Mar." },
  { id: "a-rey-4", cityId: "reykjavik", name: "Old Harbour whale watching", category: "outdoors", cost: 95, duration: 210, rating: 4.4, description: "Minke and humpback sightings from a converted oak boat." },
  { id: "a-rey-5", cityId: "reykjavik", name: "Guesthouse in 101", category: "stay", cost: 130, duration: 600, rating: 4.1, description: "Central room within walking distance of Hallgrímskirkja." },

  // Marrakesh
  { id: "a-mar-1", cityId: "marrakesh", name: "Jemaa el-Fnaa after dark", category: "nightlife", cost: 10, duration: 150, rating: 4.5, description: "Food stalls, storytellers, and gnawa drums until late." },
  { id: "a-mar-2", cityId: "marrakesh", name: "Majorelle Garden", category: "culture", cost: 14, duration: 90, rating: 4.6, description: "Cobalt-blue villa and cactus garden, plus the YSL museum." },
  { id: "a-mar-3", cityId: "marrakesh", name: "Medina souk navigation", category: "shopping", cost: 20, duration: 180, rating: 4.3, description: "Leather, lanterns, and spice alleys — haggling expected." },
  { id: "a-mar-4", cityId: "marrakesh", name: "Atlas Mountains & Berber village", category: "outdoors", cost: 55, duration: 480, rating: 4.8, description: "Imlil valley walk with lunch in a family home." },
  { id: "a-mar-5", cityId: "marrakesh", name: "Riad courtyard stay", category: "stay", cost: 70, duration: 600, rating: 4.7, description: "Tiled courtyard, plunge pool, rooftop breakfast." },

  // Ho Chi Minh City
  { id: "a-hcm-1", cityId: "ho-chi-minh", name: "Cu Chi Tunnels", category: "culture", cost: 25, duration: 300, rating: 4.4, description: "Crawl a preserved section of the Viet Cong tunnel network." },
  { id: "a-hcm-2", cityId: "ho-chi-minh", name: "Ben Thanh Market", category: "shopping", cost: 12, duration: 120, rating: 4.0, description: "Textiles and coffee beans; the food court is the real draw." },
  { id: "a-hcm-3", cityId: "ho-chi-minh", name: "War Remnants Museum", category: "culture", cost: 5, duration: 120, rating: 4.6, description: "Unflinching photojournalism across three floors." },
  { id: "a-hcm-4", cityId: "ho-chi-minh", name: "Mekong Delta boat day", category: "outdoors", cost: 40, duration: 480, rating: 4.5, description: "Sampan channels, coconut candy, and a floating market." },
  { id: "a-hcm-5", cityId: "ho-chi-minh", name: "Street food scooter tour", category: "food", cost: 45, duration: 240, rating: 4.9, description: "Six stops across District 4 riding pillion." },

  // Cape Town
  { id: "a-cpt-1", cityId: "cape-town", name: "Table Mountain cable car", category: "outdoors", cost: 25, duration: 180, rating: 4.8, description: "Rotating car to the plateau; go early for clear air." },
  { id: "a-cpt-2", cityId: "cape-town", name: "Cape of Good Hope drive", category: "sightseeing", cost: 40, duration: 420, rating: 4.7, description: "Chapman's Peak, Boulders penguins, and the cape point." },
  { id: "a-cpt-3", cityId: "cape-town", name: "Bo-Kaap walking tour", category: "culture", cost: 18, duration: 120, rating: 4.5, description: "Painted terraces and Cape Malay cooking history." },
  { id: "a-cpt-4", cityId: "cape-town", name: "Robben Island ferry", category: "culture", cost: 32, duration: 240, rating: 4.6, description: "Ex-prisoner guided tour of the island cell blocks." },
  { id: "a-cpt-5", cityId: "cape-town", name: "Constantia wine tasting", category: "food", cost: 35, duration: 180, rating: 4.6, description: "Oldest wine region in the southern hemisphere." },

  // Seoul
  { id: "a-seo-1", cityId: "seoul", name: "Gyeongbokgung Palace", category: "sightseeing", cost: 3, duration: 150, rating: 4.6, description: "Free entry in hanbok; catch the guard-changing ceremony." },
  { id: "a-seo-2", cityId: "seoul", name: "Bukchon Hanok Village", category: "culture", cost: 0, duration: 120, rating: 4.3, description: "Hillside lanes of restored courtyard houses." },
  { id: "a-seo-3", cityId: "seoul", name: "Myeongdong night market", category: "food", cost: 20, duration: 120, rating: 4.2, description: "Tteokbokki, egg bread, and skewered scallops." },
  { id: "a-seo-4", cityId: "seoul", name: "Hongdae live music crawl", category: "nightlife", cost: 30, duration: 210, rating: 4.4, description: "Indie venues and busking squares until the trains stop." },
  { id: "a-seo-5", cityId: "seoul", name: "Jjimjilbang bathhouse", category: "other", cost: 12, duration: 180, rating: 4.5, description: "Hot pools, kiln saunas, and a nap on a heated floor." },

  // Buenos Aires
  { id: "a-bue-1", cityId: "buenos-aires", name: "La Boca & Caminito", category: "culture", cost: 8, duration: 120, rating: 4.1, description: "Corrugated colour and street tango on the old port lane." },
  { id: "a-bue-2", cityId: "buenos-aires", name: "Recoleta Cemetery", category: "sightseeing", cost: 7, duration: 90, rating: 4.6, description: "Marble mausoleum streets, including Evita's family vault." },
  { id: "a-bue-3", cityId: "buenos-aires", name: "Tango show in San Telmo", category: "nightlife", cost: 55, duration: 180, rating: 4.5, description: "Milonga with a live orquesta típica and a dinner seating." },
  { id: "a-bue-4", cityId: "buenos-aires", name: "Parrilla steak dinner", category: "food", cost: 35, duration: 150, rating: 4.8, description: "Bife de chorizo over wood coals with a Malbec." },
  { id: "a-bue-5", cityId: "buenos-aires", name: "Palermo Soho walk", category: "shopping", cost: 15, duration: 150, rating: 4.3, description: "Independent labels, bookshops, and jacaranda streets." },

  // Tbilisi
  { id: "a-tbi-1", cityId: "tbilisi", name: "Narikala Fortress ridge", category: "outdoors", cost: 4, duration: 120, rating: 4.5, description: "Cable car up, walk the wall, descend through the botanical garden." },
  { id: "a-tbi-2", cityId: "tbilisi", name: "Abanotubani sulfur baths", category: "other", cost: 25, duration: 90, rating: 4.6, description: "Private domed bath room with an optional scrub." },
  { id: "a-tbi-3", cityId: "tbilisi", name: "Old Town wine bar crawl", category: "food", cost: 30, duration: 180, rating: 4.7, description: "Qvevri amber wines poured by the producers." },
  { id: "a-tbi-4", cityId: "tbilisi", name: "Kakheti wine region day trip", category: "transport", cost: 60, duration: 540, rating: 4.8, description: "Signagi hill town plus two family marani cellars." },
  { id: "a-tbi-5", cityId: "tbilisi", name: "Dry Bridge flea market", category: "shopping", cost: 10, duration: 90, rating: 4.0, description: "Soviet cameras, medals, and hand-painted enamel." },

  // Chiang Mai
  { id: "a-chi-1", cityId: "chiang-mai", name: "Doi Suthep temple", category: "sightseeing", cost: 6, duration: 180, rating: 4.7, description: "Naga staircase to a gilded chedi above the valley." },
  { id: "a-chi-2", cityId: "chiang-mai", name: "Old City moat temple loop", category: "culture", cost: 5, duration: 210, rating: 4.4, description: "Wat Chedi Luang, Wat Phra Singh, and the teak Wat Phan Tao." },
  { id: "a-chi-3", cityId: "chiang-mai", name: "Ethical elephant sanctuary", category: "outdoors", cost: 70, duration: 420, rating: 4.8, description: "No-riding reserve; feeding and river walk only." },
  { id: "a-chi-4", cityId: "chiang-mai", name: "Northern Thai cooking class", category: "food", cost: 35, duration: 300, rating: 4.9, description: "Market shop, then khao soi and larb from scratch." },
  { id: "a-chi-5", cityId: "chiang-mai", name: "Sunday walking street market", category: "shopping", cost: 15, duration: 150, rating: 4.5, description: "A kilometre of crafts and grilled skewers through the Old City." },
];

/** Back-compat: the old shape (city id -> array of activity name strings). */
export const ACTIVITIES_BY_CITY = ACTIVITY_CATALOG.reduce((acc, a) => {
  acc[a.cityId] = acc[a.cityId] || [];
  acc[a.cityId].push(a.name);
  return acc;
}, {});

export function cityName(id) {
  return CITIES.find((c) => c.id === id)?.name || "Unassigned";
}

export function formatDuration(minutes) {
  if (!minutes) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}
