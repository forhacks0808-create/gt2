import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import * as tripsApi from "../api/tripsApi";
import { getSuggestedActivities } from "../api/citiesApi";
import { CITIES } from "../data/cities";
import NavBar from "../components/NavBar";
import Button from "../components/Button";
import Field from "../components/Field";
import { BoardingBar } from "../components/Loader";
import { useStamp } from "../components/Stamp";
import "./ItineraryBuilder.css";

export default function ItineraryBuilder() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const stamp = useStamp();
  const [trip, setTrip] = useState(null);
  const [activeDay, setActiveDay] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [newActivity, setNewActivity] = useState({ name: "", cost: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    tripsApi.getTrip(tripId).then(setTrip);
  }, [tripId]);

  useEffect(() => {
    if (!trip) return;
    const cityId = trip.days[activeDay]?.cityId;
    if (cityId) getSuggestedActivities(cityId).then(setSuggestions);
  }, [trip, activeDay]);

  if (!trip) {
    return (
      <div>
        <NavBar />
        <div className="shell container" style={{ paddingTop: "3rem" }}>
          <BoardingBar label="Loading trip" />
        </div>
      </div>
    );
  }

  const day = trip.days[activeDay];
  const dayTotal = day.activities.reduce((sum, a) => sum + (Number(a.cost) || 0), 0);

  async function persist(days) {
    setSaving(true);
    const updated = await tripsApi.updateTrip(tripId, { days });
    setTrip(updated);
    setSaving(false);
  }

  function addActivity(name, cost = 0) {
    if (!name.trim()) return;
    const days = trip.days.map((d, i) =>
      i === activeDay
        ? { ...d, activities: [...d.activities, { id: crypto.randomUUID(), name, cost: Number(cost) || 0 }] }
        : d
    );
    persist(days);
    setNewActivity({ name: "", cost: "" });
  }

  function removeActivity(activityId) {
    const days = trip.days.map((d, i) =>
      i === activeDay ? { ...d, activities: d.activities.filter((a) => a.id !== activityId) } : d
    );
    persist(days);
  }

  function setDayCity(cityId) {
    const days = trip.days.map((d, i) => (i === activeDay ? { ...d, cityId } : d));
    persist(days);
  }

  return (
    <div>
      <NavBar />
      <section className="shell container itin-builder">
        <div className="itin-builder__head">
          <div>
            <p className="kicker">{trip.startDate} — {trip.endDate}</p>
            <h1 className="h-display h2">{trip.name}</h1>
          </div>
          <Button as={Link} to={`/trips/${tripId}`} variant="outline">
            View itinerary
          </Button>
        </div>

        <div className="itin-builder__days">
          {trip.days.map((d, i) => (
            <button
              key={d.date}
              className={`itin-builder__day-tab ${i === activeDay ? "is-active" : ""}`}
              onClick={() => setActiveDay(i)}
            >
              <span className="numeral">{String(i + 1).padStart(2, "0")}</span>
              <span className="kicker">{d.date.slice(5)}</span>
            </button>
          ))}
        </div>

        <div className="itin-builder__body">
          <div className="itin-builder__day-city">
            <p className="eyebrow">City for this day</p>
            <div className="create-trip__cities">
              {trip.cities.map((cid) => {
                const c = CITIES.find((c) => c.id === cid);
                return (
                  <button
                    key={cid}
                    type="button"
                    onClick={() => setDayCity(cid)}
                    className={`create-trip__city-chip ${day.cityId === cid ? "is-active" : ""}`}
                  >
                    {c?.name}
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="dashed-rule" style={{ margin: "1.5rem 0" }} />

          <ul className="itin-builder__list">
            {day.activities.map((a) => (
              <li key={a.id} className="itin-builder__item">
                <span>{a.name}</span>
                <span className="numeral">${Number(a.cost).toLocaleString()}</span>
                <button
                  className="itin-builder__remove"
                  onClick={() => removeActivity(a.id)}
                  aria-label={`Remove ${a.name}`}
                >
                  ×
                </button>
              </li>
            ))}
            {day.activities.length === 0 && (
              <p className="body-text grey-text">No activities added for this day yet.</p>
            )}
          </ul>

          <div className="itin-builder__add">
            <Field
              label="Activity"
              placeholder="e.g. Fushimi Inari at dawn"
              value={newActivity.name}
              onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
            />
            <Field
              label="Cost (USD)"
              type="number"
              min="0"
              value={newActivity.cost}
              onChange={(e) => setNewActivity({ ...newActivity, cost: e.target.value })}
            />
            <Button
              variant="black"
              onClick={() => addActivity(newActivity.name, newActivity.cost)}
              loading={saving}
            >
              Add
            </Button>
          </div>

          {suggestions.length > 0 && (
            <div className="itin-builder__suggestions">
              <p className="kicker">Suggested nearby</p>
              <div className="create-trip__cities">
                {suggestions.map((s) => (
                  <button key={s} className="create-trip__city-chip" onClick={() => addActivity(s)}>
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="itin-builder__total">
            <span className="kicker">Day total</span>
            <span className="numeral">${dayTotal.toLocaleString()}</span>
          </div>
        </div>

        <Button
          variant="orange"
          onClick={() => {
            stamp("Trip saved");
            navigate(`/trips/${tripId}`);
          }}
          style={{ marginTop: "2rem" }}
        >
          Done — view full trip
        </Button>
      </section>
    </div>
  );
}
