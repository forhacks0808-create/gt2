import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CITIES } from "../data/cities";
import * as tripsApi from "../api/tripsApi";
import NavBar from "../components/NavBar";
import Field from "../components/Field";
import Button from "../components/Button";
import { useStamp } from "../components/Stamp";
import "./CreateTrip.css";

export default function CreateTrip() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const stamp = useStamp();

  const preselectedCity = searchParams.get("city");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCities, setSelectedCities] = useState(preselectedCity ? [preselectedCity] : []);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (preselectedCity && !name) {
      const cityObj = CITIES.find((c) => c.id === preselectedCity);
      if (cityObj) {
        setName(`${cityObj.name} Explorer`);
        setDescription(`A personalized exploration of ${cityObj.name}, ${cityObj.country}.`);
      }
    }
  }, [preselectedCity, name]);

  const nights =
    startDate && endDate
      ? Math.max(0, Math.round((new Date(endDate) - new Date(startDate)) / 86400000))
      : null;

  function toggleCity(id) {
    setSelectedCities((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  function validate() {
    const next = {};
    if (name.trim().length < 2) next.name = "Give your trip a name.";
    if (!startDate) next.startDate = "Pick a start date.";
    if (!endDate) next.endDate = "Pick an end date.";
    if (startDate && endDate && new Date(endDate) < new Date(startDate))
      next.endDate = "End date can't be before the start date.";
    if (selectedCities.length === 0) next.cities = "Add at least one destination city.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const trip = await tripsApi.createTrip(user?.id, {
        name,
        description,
        startDate,
        endDate,
        cities: selectedCities,
        coverCityId: selectedCities[0],
      });
      stamp("Trip saved");
      navigate(`/trips/${trip.id}/build`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <NavBar />
      <section className="shell container create-trip">
        <p className="eyebrow on-orange">Trip Application Form — 001</p>
        <h1 className="h-display h2" style={{ margin: "0.4rem 0 2rem" }}>
          CREATE NEW TRIP
        </h1>

        <form onSubmit={handleSubmit} className="create-trip__form" noValidate>
          <Field
            label="Trip Name"
            placeholder="e.g. Portugal in the shoulder season"
            value={name}
            error={errors.name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="gt-field">
            <label className="gt-field__label">Description &amp; Vibe (Optional)</label>
            <input
              className="gt-field__input"
              placeholder="e.g. Culinary tour, historic walking sights, and coastal relaxation"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="create-trip__dates">
            <Field
              label="Start Date"
              type="date"
              value={startDate}
              error={errors.startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Field
              label="End Date"
              type="date"
              value={endDate}
              error={errors.endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {nights !== null && (
            <p className="numeral create-trip__nights">
              {nights} {nights === 1 ? "NIGHT" : "NIGHTS"} JOURNEY
            </p>
          )}

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.5rem" }}>
              <p className="eyebrow">Select Destination Stops</p>
              <span className="kicker grey-text">{selectedCities.length} Selected</span>
            </div>
            {errors.cities && <p className="gt-field__error">{errors.cities}</p>}
            <div className="create-trip__cities">
              {CITIES.map((city) => {
                const active = selectedCities.includes(city.id);
                return (
                  <button
                    type="button"
                    key={city.id}
                    onClick={() => toggleCity(city.id)}
                    className={`create-trip__city-chip ${active ? "is-active" : ""}`}
                  >
                    {active ? "✓ " : "+ "}
                    {city.name} ({city.country})
                  </button>
                );
              })}
            </div>
          </div>

          <Button type="submit" variant="orange" loading={saving} style={{ alignSelf: "flex-start", marginTop: "1rem" }}>
            Save &amp; Build Itinerary →
          </Button>
        </form>
      </section>
    </div>
  );
}
