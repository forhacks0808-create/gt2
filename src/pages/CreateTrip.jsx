import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const stamp = useStamp();
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCities, setSelectedCities] = useState([]);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

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
    if (selectedCities.length === 0) next.cities = "Add at least one city.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const trip = await tripsApi.createTrip(user.id, {
        name,
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
        <p className="kicker">Trip application form — 001</p>
        <h1 className="h-display h2" style={{ margin: "0.5rem 0 2rem" }}>
          Create Trip
        </h1>

        <form onSubmit={handleSubmit} className="create-trip__form" noValidate>
          <Field
            label="Trip name"
            placeholder="e.g. Portugal in the shoulder season"
            value={name}
            error={errors.name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="create-trip__dates">
            <Field
              label="Start date"
              type="date"
              value={startDate}
              error={errors.startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Field
              label="End date"
              type="date"
              value={endDate}
              error={errors.endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {nights !== null && (
            <p className="numeral create-trip__nights">
              {nights} {nights === 1 ? "NIGHT" : "NIGHTS"}
            </p>
          )}

          <div>
            <p className="eyebrow">Cities</p>
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
                    {city.name}
                  </button>
                );
              })}
            </div>
          </div>

          <Button type="submit" variant="orange" loading={saving} style={{ alignSelf: "flex-start" }}>
            Save &amp; build itinerary
          </Button>
        </form>
      </section>
    </div>
  );
}
