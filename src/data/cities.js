// Stand-in dataset for the real geo/cities API (GeoDB Cities via RapidAPI, or
// Teleport). Shape mirrors what those APIs return so swapping in citiesApi.js
// is a drop-in change, not a rewrite. See src/api/citiesApi.js.
export const CITIES = [
  { id: "lisbon", name: "Lisbon", country: "Portugal", costIndex: 52, popularity: 91, lat: 38.7223, lng: -9.1393 },
  { id: "kyoto", name: "Kyoto", country: "Japan", costIndex: 61, popularity: 88, lat: 35.0116, lng: 135.7681 },
  { id: "mexico-city", name: "Mexico City", country: "Mexico", costIndex: 44, popularity: 84, lat: 19.4326, lng: -99.1332 },
  { id: "reykjavik", name: "Reykjavík", country: "Iceland", costIndex: 78, popularity: 79, lat: 64.1466, lng: -21.9426 },
  { id: "marrakesh", name: "Marrakesh", country: "Morocco", costIndex: 38, popularity: 76, lat: 31.6295, lng: -7.9811 },
  { id: "ho-chi-minh", name: "Ho Chi Minh City", country: "Vietnam", costIndex: 33, popularity: 74, lat: 10.8231, lng: 106.6297 },
  { id: "porto", name: "Porto", country: "Portugal", costIndex: 48, popularity: 71, lat: 41.1579, lng: -8.6291 },
  { id: "cape-town", name: "Cape Town", country: "South Africa", costIndex: 46, popularity: 82, lat: -33.9249, lng: 18.4241 },
  { id: "seoul", name: "Seoul", country: "South Korea", costIndex: 63, popularity: 85, lat: 37.5665, lng: 126.978 },
  { id: "buenos-aires", name: "Buenos Aires", country: "Argentina", costIndex: 41, popularity: 77, lat: -34.6037, lng: -58.3816 },
  { id: "tbilisi", name: "Tbilisi", country: "Georgia", costIndex: 35, popularity: 66, lat: 41.7151, lng: 44.8271 },
  { id: "chiang-mai", name: "Chiang Mai", country: "Thailand", costIndex: 31, popularity: 80, lat: 18.7883, lng: 98.9853 },
];

export const ACTIVITIES_BY_CITY = {
  lisbon: ["Tram 28 loop", "Alfama viewpoint crawl", "LX Factory market", "Sintra day trip"],
  kyoto: ["Fushimi Inari at dawn", "Arashiyama bamboo grove", "Gion evening walk", "Nishiki Market"],
  "mexico-city": ["Frida Kahlo Museum", "Teotihuacán day trip", "Roma Norte food crawl", "Chapultepec Castle"],
  reykjavik: ["Golden Circle tour", "Blue Lagoon", "Northern lights watch", "Old Harbour whale watching"],
  marrakesh: ["Jemaa el-Fnaa at night", "Majorelle Garden", "Atlas Mountains day trip", "Medina souk crawl"],
  "ho-chi-minh": ["Cu Chi Tunnels", "Ben Thanh Market", "War Remnants Museum", "Mekong Delta boat trip"],
  porto: ["Livraria Lello", "Douro Valley wine tasting", "Ribeira riverside walk", "Port cellar tour"],
  "cape-town": ["Table Mountain cable car", "Cape of Good Hope", "Bo-Kaap walk", "Robben Island ferry"],
  seoul: ["Gyeongbokgung Palace", "Bukchon Hanok Village", "Myeongdong night market", "Hongdae street art"],
  "buenos-aires": ["La Boca / Caminito", "Recoleta Cemetery", "Tango show in San Telmo", "Palermo Soho walk"],
  tbilisi: ["Narikala Fortress", "Sulfur bathhouses", "Old Town cable car", "Wine region day trip"],
  "chiang-mai": ["Doi Suthep temple", "Old City moat loop", "Elephant sanctuary visit", "Night bazaar"],
};
