import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import Field from "../components/Field";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import { ImagePlaceholder, BoardingBar } from "../components/Loader";
import { searchCities } from "../api/citiesApi";
import { CITIES, ACTIVITIES_CATALOG } from "../data/cities";
import * as tripsApi from "../api/tripsApi";
import { useAuth } from "../context/AuthContext";
import { useStamp } from "../components/Stamp";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import "./CitySearch.css";

const REGIONS = ["All", "Europe", "Asia", "Americas", "Africa"];
const CATEGORIES = ["All", "Sightseeing", "Food & Dining", "Adventure", "Culture"];

export default function CitySearch() {
  const { user } = useAuth();
  const stamp = useStamp();

  const [mode, setMode] = useState("cities"); // "cities" | "activities"
  const [query, setQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [savedCities, setSavedCities] = useState([]);
  const [userTrips, setUserTrips] = useState([]);

  // Add to trip modal state
  const [addToTripTarget, setAddToTripTarget] = useState(null); // { type: "city" | "activity", item }
  const [selectedTripId, setSelectedTripId] = useState("");
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [addingToTrip, setAddingToTrip] = useState(false);

  const debounced = useDebouncedValue(query, 250);
  const [cityResults, setCityResults] = useState(null);

  useEffect(() => {
    tripsApi
      .getSavedDestinations()
      .then((d) => setSavedCities(Array.isArray(d) ? d : []))
      .catch(() => setSavedCities([]));

    if (user?.id) {
      tripsApi
        .listTrips(user.id)
        .then((trips) => {
          const arr = Array.isArray(trips) ? trips : [];
          setUserTrips(arr);
          if (arr.length > 0) setSelectedTripId(arr[0].id);
        })
        .catch(() => setUserTrips([]));
    }
  }, [user?.id]);

  useEffect(() => {
    let active = true;
    setCityResults(null);
    searchCities(debounced).then((r) => {
      if (active) {
        let filtered = r;
        if (selectedRegion !== "All") {
          filtered = filtered.filter((c) => c.region === selectedRegion);
        }
        setCityResults(filtered);
      }
    });
    return () => {
      active = false;
    };
  }, [debounced, selectedRegion]);

  function handleToggleSave(cityId) {
    const next = tripsApi.toggleSaveDestination(cityId);
    setSavedCities(next);
    stamp(next.includes(cityId) ? "Saved to profile" : "Removed bookmark");
  }

  // Filter activities
  const activityResults = ACTIVITIES_CATALOG.filter((act) => {
    const matchesQuery =
      act.name.toLowerCase().includes(debounced.toLowerCase()) ||
      act.cityName.toLowerCase().includes(debounced.toLowerCase()) ||
      act.category.toLowerCase().includes(debounced.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || act.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesQuery && matchesCategory;
  });

  async function handleConfirmAddToTrip() {
    if (!selectedTripId || !addToTripTarget) return;
    setAddingToTrip(true);

    try {
      const trip = await tripsApi.getTrip(selectedTripId);
      if (addToTripTarget.type === "activity") {
        const act = addToTripTarget.item;
        const days = trip.days.map((d, i) =>
          i === selectedDayIdx
            ? {
                ...d,
                activities: [
                  ...d.activities,
                  {
                    id: "act-" + Date.now(),
                    name: act.name,
                    category: act.category,
                    cost: Number(act.cost) || 0,
                    notes: `${act.duration || ""} · Added from explorer`,
                  },
                ],
              }
            : d
        );
        await tripsApi.updateTrip(selectedTripId, { days });
        stamp(`Added to Day ${selectedDayIdx + 1}!`);
      } else {
        // Adding city to trip
        const city = addToTripTarget.item;
        if (!trip.cities.includes(city.id)) {
          const cities = [...trip.cities, city.id];
          await tripsApi.updateTrip(selectedTripId, { cities });
          stamp(`Added ${city.name} to trip destinations!`);
        } else {
          stamp(`${city.name} is already in this trip`);
        }
      }
      setAddToTripTarget(null);
    } catch (err) {
      console.error(err);
    } finally {
      setAddingToTrip(false);
    }
  }

  return (
    <div>
      <NavBar />
      <section className="shell container city-search">
        <div className="city-search__head">
          <div>
            <p className="eyebrow on-orange">Global Directory</p>
            <h1 className="h-display h1" style={{ margin: "0.25rem 0 0.5rem" }}>
              DISCOVER &amp; EXPLORE
            </h1>
            <p className="body-text grey-text">
              Search world destinations, curated experiences, and top-rated regional sights to add directly to your itineraries.
            </p>
          </div>

          <div className="city-search__mode-toggle">
            <button
              className={`city-mode-btn ${mode === "cities" ? "is-active" : ""}`}
              onClick={() => setMode("cities")}
            >
              🌍 Destinations ({CITIES.length})
            </button>
            <button
              className={`city-mode-btn ${mode === "activities" ? "is-active" : ""}`}
              onClick={() => setMode("activities")}
            >
              🎟️ Activities &amp; Sights ({ACTIVITIES_CATALOG.length})
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="city-search__search-bar">
          <Field
            label={mode === "cities" ? "Search cities or countries" : "Search activities, food, tours, or cities"}
            placeholder={mode === "cities" ? "e.g. Lisbon, Japan, Iceland…" : "e.g. Fushimi Inari, Wine Tasting, Tacos…"}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="city-search__filters">
          {mode === "cities" ? (
            <div className="city-filter-group">
              <span className="eyebrow">Filter by Region:</span>
              <div className="city-pill-list">
                {REGIONS.map((r) => (
                  <button
                    key={r}
                    onClick={() => setSelectedRegion(r)}
                    className={`city-pill ${selectedRegion === r ? "is-active" : ""}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="city-filter-group">
              <span className="eyebrow">Category:</span>
              <div className="city-pill-list">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`city-pill ${selectedCategory === cat ? "is-active" : ""}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mode 1: Cities Grid */}
        {mode === "cities" && (
          <div className="city-search__results">
            {cityResults === null && <BoardingBar label="Searching catalog" />}

            {cityResults !== null && cityResults.length === 0 && (
              <EmptyState
                title="NO DESTINATIONS FOUND"
                body="Try a different spelling or select a different region filter."
              />
            )}

            {cityResults?.map((city) => {
              const isSaved = savedCities.includes(city.id);
              return (
                <div key={city.id} className="city-card ticket">
                  <div className="city-card__image">
                    <ImagePlaceholder label={city.name} />
                    <button
                      className={`city-bookmark-btn ${isSaved ? "is-saved" : ""}`}
                      onClick={() => handleToggleSave(city.id)}
                      title={isSaved ? "Saved in bookmarks" : "Save destination"}
                    >
                      {isSaved ? "★ Saved" : "☆ Save"}
                    </button>
                  </div>
                  <div className="city-card__body">
                    <div className="city-card__meta-top">
                      <span className="kicker grey-text">{city.country} · {city.region}</span>
                      <span className="numeral" style={{ color: "var(--orange)", fontWeight: 800 }}>
                        {city.popularity}% MATCH
                      </span>
                    </div>

                    <h3 className="h-display h3" style={{ fontSize: "1.5rem", margin: "0.25rem 0" }}>
                      {city.name}
                    </h3>
                    <p className="body-text grey-text" style={{ fontSize: "0.85rem", margin: "0 0 1rem", flex: 1 }}>
                      {city.description}
                    </p>

                    <div className="city-card__metrics">
                      <div>
                        <span className="eyebrow">Cost Index</span>
                        <span className="numeral">{city.costIndex}/100</span>
                      </div>
                      <div>
                        <span className="eyebrow">Est. Daily</span>
                        <span className="numeral" style={{ color: "var(--ink)" }}>~${city.avgDailyCost}/d</span>
                      </div>
                    </div>

                    <hr className="dashed-rule" style={{ margin: "1rem 0" }} />

                    <div className="city-card__actions">
                      <Button
                        as={Link}
                        to={`/trips/new?city=${city.id}`}
                        variant="orange"
                        style={{ fontSize: "0.82rem", padding: "8px 12px" }}
                      >
                        Plan New Trip
                      </Button>

                      {userTrips.length > 0 && (
                        <Button
                          variant="outline"
                          onClick={() => setAddToTripTarget({ type: "city", item: city })}
                          style={{ fontSize: "0.82rem", padding: "8px 12px" }}
                        >
                          + Add to Trip
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Mode 2: Activities Grid */}
        {mode === "activities" && (
          <div className="activity-search__results">
            {activityResults.length === 0 && (
              <EmptyState
                title="NO EXPERIENCES FOUND"
                body="Try searching for a different keyword or category."
              />
            )}

            {activityResults.map((act) => (
              <div key={act.id} className="activity-card ticket">
                <div className="activity-card__badge-row">
                  <span className="activity-cat-tag">{act.category}</span>
                  <span className="kicker grey-text">{act.cityName}</span>
                </div>

                <h3 className="h-display h3" style={{ fontSize: "1.25rem", margin: "0.5rem 0 0.25rem" }}>
                  {act.name}
                </h3>
                <p className="body-text grey-text" style={{ fontSize: "0.88rem", flex: 1, margin: "0 0 1rem" }}>
                  {act.description}
                </p>

                <div className="activity-card__footer">
                  <div className="activity-card__cost-duration">
                    <span className="numeral" style={{ fontSize: "1.2rem", color: "var(--orange)" }}>
                      {act.cost === 0 ? "FREE" : `$${act.cost}`}
                    </span>
                    <span className="kicker grey-text">⏱️ {act.duration}</span>
                  </div>

                  {userTrips.length > 0 && (
                    <Button
                      variant="black"
                      onClick={() => setAddToTripTarget({ type: "activity", item: act })}
                      style={{ fontSize: "0.82rem", padding: "6px 12px" }}
                    >
                      + Add to Day
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add to Trip Modal */}
        {addToTripTarget && (
          <div className="city-modal-backdrop" role="dialog" aria-modal="true">
            <div className="city-modal ticket">
              <p className="eyebrow on-orange">Assign to Itinerary</p>
              <h3 className="h-display h2" style={{ margin: "0.4rem 0 1rem" }}>
                ADD TO EXISTING TRIP
              </h3>
              <p className="body-text">
                Adding: <strong>{addToTripTarget.item.name}</strong>
              </p>

              <div className="city-modal-fields">
                <div className="gt-field">
                  <label className="gt-field__label">Select Trip</label>
                  <select
                    className="gt-field__input"
                    value={selectedTripId}
                    onChange={(e) => setSelectedTripId(e.target.value)}
                  >
                    {userTrips.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.startDate})
                      </option>
                    ))}
                  </select>
                </div>

                {addToTripTarget.type === "activity" && (
                  <div className="gt-field">
                    <label className="gt-field__label">Select Day</label>
                    <select
                      className="gt-field__input"
                      value={selectedDayIdx}
                      onChange={(e) => setSelectedDayIdx(Number(e.target.value))}
                    >
                      {userTrips
                        .find((t) => t.id === selectedTripId)
                        ?.days?.map((d, idx) => (
                          <option key={d.date} value={idx}>
                            Day {idx + 1} ({d.date} - {d.cityId})
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="city-modal-actions">
                <Button variant="outline" onClick={() => setAddToTripTarget(null)}>
                  Cancel
                </Button>
                <Button variant="orange" onClick={handleConfirmAddToTrip} loading={addingToTrip}>
                  Confirm Add
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
