import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import * as tripsApi from "../api/tripsApi";
import { searchCities } from "../api/citiesApi";
import { CITIES } from "../data/cities";
import NavBar from "../components/NavBar";
import Button from "../components/Button";
import AnimatedCounter from "../components/AnimatedCounter";
import { BoardingBar, ImagePlaceholder } from "../components/Loader";
import EmptyState from "../components/EmptyState";
import "./Dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();
  const [trips, setTrips] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState("All");

  useEffect(() => {
    if (user?.id) {
      tripsApi
        .listTrips(user.id)
        .then((t) => setTrips(Array.isArray(t) ? t : []))
        .catch(() => setTrips([]));
    }
  }, [user?.id]);

  const now = new Date();
  const upcomingTrips = trips?.filter((t) => new Date(t.endDate) >= now) || [];
  const completedTrips = trips?.filter((t) => new Date(t.endDate) < now) || [];
  const nextTrip = upcomingTrips[0];

  const totalCitiesPlanned = new Set(trips?.flatMap((t) => t.cities) || []).size;
  const totalDaysPlanned = trips?.reduce((s, t) => s + (t.days?.length || 0), 0) || 0;

  const regions = ["All", "Europe", "Asia", "Americas", "Africa"];
  const [recommendedCities, setRecommendedCities] = useState([]);

  useEffect(() => {
    let active = true;
    searchCities("", selectedRegion).then((cities) => {
      if (active) setRecommendedCities(Array.isArray(cities) ? cities.slice(0, 6) : []);
    });
    return () => {
      active = false;
    };
  }, [selectedRegion]);

  return (
    <div>
      <NavBar />

      {/* Hero Banner with Editorial Brutalist Typography */}
      <section className="dash-hero shell">
        <div className="container dash-hero__inner">
          <div className="dash-hero__content">
            <p className="eyebrow on-orange">{formatToday()}</p>
            <h1 className="h-display h1 dash-hero__title">
              WHERE TO NEXT, {user?.name ? user.name.split(" ")[0].toUpperCase() : "TRAVELER"}?
            </h1>
            <p className="body-text" style={{ color: "#d8d6d0", maxWidth: 520, margin: "1rem 0 2rem" }}>
              Design multi-city itineraries, estimate daily travel budgets, and share interactive journeys with friends and fellow adventurers.
            </p>
            <div className="dash-hero__actions">
              <Button as={Link} to="/trips/new" variant="orange">
                + Plan New Trip
              </Button>
              <Button as={Link} to="/cities" variant="white">
                Explore Destinations
              </Button>
              <Button as={Link} to="/community" variant="ghost">
                Community Hub →
              </Button>
            </div>
          </div>

          <div className="dash-hero__stats ticket">
            <div className="dash-hero__stats-main">
              <div className="dash-hero__stat-item">
                <span className="eyebrow">TRIPS IN PLAY</span>
                <span className="numeral h-display h1" style={{ color: "var(--orange)", fontSize: "2.75rem", marginTop: "0.25rem" }}>
                  <AnimatedCounter end={trips?.length || 0} duration={800} />
                </span>
              </div>

              <div className="dash-hero__stat-item">
                <span className="eyebrow">DESTINATIONS</span>
                <span className="numeral h-display h1" style={{ color: "var(--orange)", fontSize: "2.75rem", marginTop: "0.25rem" }}>
                  <AnimatedCounter end={totalCitiesPlanned} duration={900} />
                </span>
              </div>

              <div className="dash-hero__stat-item">
                <span className="eyebrow">DAYS PLANNED</span>
                <span className="numeral h-display h1" style={{ color: "var(--orange)", fontSize: "2.75rem", marginTop: "0.25rem" }}>
                  <AnimatedCounter end={totalDaysPlanned} duration={1000} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Next Up Highlight */}
      <section className="shell container dash-section">
        <div className="dash-section__head">
          <div>
            <p className="eyebrow">Priority Journey</p>
            <h2 className="h-display h3">NEXT EXPEDITION</h2>
          </div>
          {nextTrip && (
            <Link to={`/trips/${nextTrip.id}`} className="kicker grey-text">
              View full itinerary →
            </Link>
          )}
        </div>

        {trips === null && <BoardingBar label="Loading your upcoming itineraries" />}

        {trips !== null && !nextTrip && (
          <EmptyState
            title="NO UPCOMING TRIPS"
            body="Your passport is currently idle. Select a destination or build a fresh multi-stop route."
            action={
              <Button as={Link} to="/trips/new" variant="black">
                Plan your first trip
              </Button>
            }
          />
        )}

        {nextTrip && (
          <div className="dash-highlight ticket">
            <div className="dash-highlight__image">
              <ImagePlaceholder label={cityName(nextTrip.coverCityId)} />
            </div>
            <div className="dash-highlight__body">
              <div className="dash-highlight__tags">
                <span className="kicker">
                  {nextTrip.startDate} — {nextTrip.endDate}
                </span>
                <span className="dash-badge--active">CONFIRMED</span>
              </div>
              <h3 className="h-display h2">{nextTrip.name}</h3>
              <p className="body-text grey-text" style={{ margin: "0.5rem 0 1.25rem" }}>
                {nextTrip.cities?.length || 0} {nextTrip.cities?.length === 1 ? "city" : "cities"} · {nextTrip.days?.length || 0} days on the road
              </p>
              <div className="dash-highlight__btn-row">
                <Button as={Link} to={`/trips/${nextTrip.id}`} variant="orange">
                  Open Itinerary
                </Button>
                <Button as={Link} to={`/trips/${nextTrip.id}/calendar`} variant="outline">
                  📅 Calendar
                </Button>
                <Button as={Link} to={`/trips/${nextTrip.id}/budget`} variant="outline">
                  💰 Budget
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>

      <hr className="hairline" />

      {/* Recommended Regional Destinations (Wireframe Screen 3) */}
      <section className="shell container dash-section">
        <div className="dash-section__head">
          <div>
            <p className="eyebrow on-orange">Destination Catalog</p>
            <h2 className="h-display h3">RECOMMENDED DESTINATIONS</h2>
          </div>
          <div className="dash-region-pills">
            {regions.map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRegion(r)}
                className={`dash-region-pill ${selectedRegion === r ? "is-active" : ""}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="dash-dest-grid">
          {recommendedCities.map((city) => (
            <div key={city.id} className="dash-dest-card ticket">
              <div className="dash-dest-card__img">
                <ImagePlaceholder label={city.name} />
                {city.tag && <span className="dash-dest-card__tag">{city.tag}</span>}
              </div>
              <div className="dash-dest-card__content">
                <div className="dash-dest-card__meta">
                  <span className="kicker grey-text">{city.country}</span>
                  <span className="numeral" style={{ color: "var(--orange)", fontWeight: 800 }}>
                    {city.popularity}% MATCH
                  </span>
                </div>
                <h4 className="h-display h3" style={{ fontSize: "1.3rem", margin: "0.25rem 0 0.5rem" }}>
                  {city.name}
                </h4>
                <p className="body-text grey-text" style={{ fontSize: "0.85rem", margin: "0 0 1rem", flex: 1 }}>
                  {city.description}
                </p>
                <div className="dash-dest-card__footer">
                  <span className="kicker">~${city.avgDailyCost}/DAY</span>
                  <Button as={Link} to={`/trips/new?city=${city.id}`} variant="black" style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
                    + Plan Trip
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function cityName(id) {
  return CITIES.find((c) => c.id === id)?.name || "Trip";
}

function formatToday() {
  return new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}
