import { ACTIVITIES_BY_CITY } from "../data/cities";

/**
 * Dynamic City Search API powered 100% by RapidAPI GeoDB Cities
 */

const GEODB_KEY = import.meta.env.VITE_GEODB_KEY || "490e6448bfmshaf22b2ed119de49p1d530ajsn5f5ae0305f23";

const REGION_COUNTRY_CODES = {
  Europe: "FR,IT,ES,DE,GB,PT,GR,NL,CH,AT,NO,SE,IE,IS,HR",
  Asia: "JP,CN,IN,TH,KR,VN,ID,SG,MY,AE,TR,SA,PH",
  Americas: "US,CA,MX,BR,AR,CO,PE,CL,CR,PA,CU",
  Africa: "MA,ZA,EG,KE,TZ,NG,GH,SN,ET,MU,TN,RW",
};

export async function searchCities(query = "", region = "All") {
  const q = (query || "").trim();

  // Build RapidAPI GeoDB URL dynamically
  const params = new URLSearchParams({
    limit: "18",
    sort: "-population",
  });

  if (q.length > 0) {
    params.set("namePrefix", q);
  }

  if (region && region !== "All" && REGION_COUNTRY_CODES[region]) {
    params.set("countryIds", REGION_COUNTRY_CODES[region]);
  }

  try {
    const res = await fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?${params.toString()}`, {
      headers: {
        "x-rapidapi-key": GEODB_KEY,
        "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
      },
    });

    if (!res.ok) {
      throw new Error(`GeoDB API responded with status ${res.status}`);
    }

    const json = await res.json();
    const list = json.data || [];

    return list.map((c) => {
      const pop = c.population || 0;
      const popFormatted = pop > 1000000 ? `${(pop / 1000000).toFixed(1)}M` : pop.toLocaleString();
      const costIndex = Math.min(95, Math.max(30, Math.round(pop ? Math.log10(pop) * 14 : 50)));
      const avgCost = Math.min(190, Math.max(45, Math.round(costIndex * 1.6)));
      const matchScore = Math.min(99, Math.max(78, 90 + ((c.id % 9) - 4)));

      return {
        id: (c.city || c.name || `city-${c.id}`).toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        name: c.city || c.name,
        country: c.country || "Global",
        region: region !== "All" ? region : c.region || c.countryCode || "Global",
        population: pop,
        costIndex,
        popularity: matchScore,
        avgDailyCost: avgCost,
        description: `Metropolitan destination in ${c.country} (Population: ${popFormatted}). Ideal for cultural immersion and urban discovery.`,
        lat: c.latitude,
        lng: c.longitude,
      };
    });
  } catch (err) {
    console.error("RapidAPI GeoDB fetch error:", err);
    return [];
  }
}

export async function getCity(id) {
  try {
    const res = await fetch(
      `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${encodeURIComponent(id)}&limit=1`,
      {
        headers: {
          "x-rapidapi-key": GEODB_KEY,
          "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
        },
      }
    );
    if (res.ok) {
      const json = await res.json();
      if (json.data && json.data.length > 0) {
        const c = json.data[0];
        return {
          id,
          name: c.city || c.name,
          country: c.country,
          region: c.region || c.countryCode,
          costIndex: 55,
          popularity: 88,
          avgDailyCost: 75,
          description: `Destination in ${c.country}.`,
          lat: c.latitude,
          lng: c.longitude,
        };
      }
    }
  } catch (err) {
    console.warn("getCity fetch error:", err);
  }

  return {
    id,
    name: id.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    country: "Global Destination",
    region: "World",
    costIndex: 50,
    popularity: 85,
    avgDailyCost: 70,
    description: "Custom journey destination.",
  };
}

export async function getSuggestedActivities(cityId) {
  return (
    ACTIVITIES_BY_CITY[cityId] || [
      "Historic Old Town Walking Tour",
      "Local Culinary & Street Food Tasting",
      "Scenic City Viewpoint at Sunset",
      "Central Market & Heritage Crawl",
    ]
  );
}
