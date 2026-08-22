import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import Field from "../components/Field";
import EmptyState from "../components/EmptyState";
import { ImagePlaceholder, BoardingBar } from "../components/Loader";
import { searchCities } from "../api/citiesApi";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import "./CitySearch.css";

export default function CitySearch() {
  const [query, setQuery] = useState("");
  const debounced = useDebouncedValue(query, 300);
  const [results, setResults] = useState(null);

  useEffect(() => {
    let active = true;
    setResults(null);
    searchCities(debounced).then((r) => {
      if (active) setResults(r);
    });
    return () => {
      active = false;
    };
  }, [debounced]);

  return (
    <div>
      <NavBar />
      <section className="shell container city-search">
        <p className="eyebrow">Find your next stop</p>
        <h1 className="h-display h2" style={{ margin: "0.5rem 0 2rem" }}>
          City Search
        </h1>

        <Field
          label="Search cities or countries"
          placeholder="Try “Lisbon” or “Japan”"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="city-search__results">
          {results === null && <BoardingBar label="Searching cities" />}

          {results !== null && results.length === 0 && (
            <EmptyState
              title="NO CITIES FOUND"
              body="Try a different spelling, or search by country instead."
            />
          )}

          {results?.map((city) => (
            <div key={city.id} className="city-card ticket">
              <div className="city-card__image">
                <ImagePlaceholder label={city.name} />
              </div>
              <div className="city-card__body">
                <h3 className="h-display h3" style={{ fontSize: "1.4rem" }}>
                  {city.name}
                </h3>
                <p className="kicker grey-text">{city.country}</p>
                <div className="city-card__meta">
                  <span className="city-card__badge">COST {city.costIndex}</span>
                  <span className="kicker grey-text">{city.popularity}% traveler match</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
