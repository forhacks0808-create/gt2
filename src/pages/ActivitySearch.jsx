import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import Field from "../components/Field";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import { BoardingBar } from "../components/Loader";
import AddToTripDialog from "../components/AddToTripDialog";
import { useStamp } from "../components/Stamp";
import { searchActivities } from "../api/citiesApi";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { CATEGORIES, CITIES, categoryLabel, cityName, formatDuration } from "../data/cities";
import "./ActivitySearch.css";

const COST_BANDS = [
  { id: "any", label: "Any price", max: undefined },
  { id: "free", label: "Free", max: 0 },
  { id: "under25", label: "Under $25", max: 25 },
  { id: "under50", label: "Under $50", max: 50 },
  { id: "under100", label: "Under $100", max: 100 },
];

const DURATION_BANDS = [
  { id: "any", label: "Any length", max: undefined },
  { id: "short", label: "Under 2h", max: 120 },
  { id: "half", label: "Half day", max: 300 },
  { id: "full", label: "Full day", max: 600 },
];

export default function ActivitySearch() {
  const [params, setParams] = useSearchParams();
  const stamp = useStamp();

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 300);
  const [cityId, setCityId] = useState(params.get("city") || "all");
  const [category, setCategory] = useState("all");
  const [costBand, setCostBand] = useState("any");
  const [durationBand, setDurationBand] = useState("any");
  const [sort, setSort] = useState("rating");
  const [results, setResults] = useState(null);
  const [adding, setAdding] = useState(null);

  // Keep the city in the URL so a filtered search is shareable / bookmarkable.
  useEffect(() => {
    const next = new URLSearchParams(params);
    if (cityId === "all") next.delete("city");
    else next.set("city", cityId);
    setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityId]);

  const maxCost = COST_BANDS.find((b) => b.id === costBand)?.max;
  const maxDuration = DURATION_BANDS.find((b) => b.id === durationBand)?.max;

  useEffect(() => {
    let active = true;
    setResults(null);
    searchActivities({ query: debouncedQuery, cityId, category, maxCost, maxDuration, sort }).then(
      (r) => {
        if (active) setResults(r);
      }
    );
    return () => {
      active = false;
    };
  }, [debouncedQuery, cityId, category, maxCost, maxDuration, sort]);

  const activeFilterCount = useMemo(
    () =>
      [cityId !== "all", category !== "all", costBand !== "any", durationBand !== "any"].filter(
        Boolean
      ).length,
    [cityId, category, costBand, durationBand]
  );

  function resetFilters() {
    setQuery("");
    setCityId("all");
    setCategory("all");
    setCostBand("any");
    setDurationBand("any");
    setSort("rating");
  }

  return (
    <div>
      <NavBar />
      <section className="shell container act-search">
        <p className="eyebrow">Fill the days</p>
        <h1 className="h-display h2 act-search__title">Activity Search</h1>
        <p className="body-text grey-text act-search__lede">
          Browse experiences across every city in the catalog, then drop them straight into a day of
          your itinerary.
        </p>

        <div className="act-search__controls">
          <Field
            label="Search activities"
            placeholder="Try “market”, “temple”, or “wine”"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <div className="act-search__selects">
            <div className="gt-field">
              <label className="gt-field__label" htmlFor="act-city">
                City
              </label>
              <select
                id="act-city"
                className="act-search__select"
                value={cityId}
                onChange={(e) => setCityId(e.target.value)}
              >
                <option value="all">All cities</option>
                {CITIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}, {c.country}
                  </option>
                ))}
              </select>
            </div>

            <div className="gt-field">
              <label className="gt-field__label" htmlFor="act-cost">
                Price
              </label>
              <select
                id="act-cost"
                className="act-search__select"
                value={costBand}
                onChange={(e) => setCostBand(e.target.value)}
              >
                {COST_BANDS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="gt-field">
              <label className="gt-field__label" htmlFor="act-duration">
                Duration
              </label>
              <select
                id="act-duration"
                className="act-search__select"
                value={durationBand}
                onChange={(e) => setDurationBand(e.target.value)}
              >
                {DURATION_BANDS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="gt-field">
              <label className="gt-field__label" htmlFor="act-sort">
                Sort
              </label>
              <select
                id="act-sort"
                className="act-search__select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="rating">Top rated</option>
                <option value="cost-asc">Cheapest first</option>
                <option value="cost-desc">Priciest first</option>
                <option value="duration">Shortest first</option>
                <option value="name">A–Z</option>
              </select>
            </div>
          </div>

          <div className="act-search__categories">
            <button
              type="button"
              className={`act-search__chip ${category === "all" ? "is-active" : ""}`}
              onClick={() => setCategory("all")}
            >
              All types
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`act-search__chip ${category === c.id ? "is-active" : ""}`}
                onClick={() => setCategory(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="act-search__meta">
          <p className="kicker">
            {results === null
              ? "Searching…"
              : `${results.length} ${results.length === 1 ? "activity" : "activities"}`}
            {activeFilterCount > 0 && ` · ${activeFilterCount} filter${activeFilterCount > 1 ? "s" : ""}`}
          </p>
          {activeFilterCount > 0 && (
            <button type="button" className="act-search__reset" onClick={resetFilters}>
              Clear filters
            </button>
          )}
        </div>

        {results === null && <BoardingBar label="Searching activities" />}

        {results !== null && results.length === 0 && (
          <EmptyState
            title="NOTHING MATCHES"
            body="Loosen a filter — try a wider price band or a different city."
            action={
              <Button variant="black" onClick={resetFilters}>
                Clear all filters
              </Button>
            }
          />
        )}

        <div className="act-search__grid">
          {results?.map((activity) => (
            <article key={activity.id} className="act-card">
              <div className="act-card__head">
                <span className="act-card__category">{categoryLabel(activity.category)}</span>
                <span className="numeral act-card__rating">{activity.rating.toFixed(1)}</span>
              </div>
              <h3 className="act-card__name">{activity.name}</h3>
              <p className="kicker grey-text">{cityName(activity.cityId)}</p>
              <p className="body-text act-card__desc">{activity.description}</p>
              <div className="act-card__footer">
                <div className="act-card__stats">
                  <span className="numeral act-card__cost">
                    {activity.cost === 0 ? "Free" : `$${activity.cost.toLocaleString()}`}
                  </span>
                  <span className="kicker grey-text">{formatDuration(activity.duration)}</span>
                </div>
                <Button
                  variant="outline"
                  magnetic={false}
                  className="act-card__add"
                  onClick={() => setAdding(activity)}
                >
                  + Add
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {adding && (
        <AddToTripDialog
          mode="activity"
          payload={adding}
          onClose={() => setAdding(null)}
          onDone={(msg) => stamp(msg)}
        />
      )}
    </div>
  );
}
