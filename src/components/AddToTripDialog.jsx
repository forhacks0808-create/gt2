import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as tripsApi from "../api/tripsApi";
import { useAuth } from "../context/AuthContext";
import { cityName } from "../data/cities";
import Button from "./Button";
import { BoardingBar } from "./Loader";
import "./AddToTripDialog.css";

/**
 * Shared "add to trip" picker used by both City Search and Activity Search.
 *
 * mode="city"     — appends a new stop (city + day) to the chosen trip
 * mode="activity" — appends the activity to a chosen day of the chosen trip
 */
export default function AddToTripDialog({ mode, payload, onClose, onDone }) {
  const { user } = useAuth();
  const [trips, setTrips] = useState(null);
  const [tripId, setTripId] = useState("");
  const [dayIndex, setDayIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    tripsApi.listTrips(user.id).then((list) => {
      setTrips(list);
      if (list.length) setTripId(list[0].id);
    });
  }, [user.id]);

  const selectedTrip = trips?.find((t) => t.id === tripId);

  useEffect(() => {
    setDayIndex(0);
  }, [tripId]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selectedTrip) return;
    setSaving(true);
    setError("");
    try {
      if (mode === "city") {
        await tripsApi.addStop(tripId, payload.id);
        onDone?.(`${payload.name} added to ${selectedTrip.name}`);
      } else {
        const day = selectedTrip.days[dayIndex];
        if (!day) throw new Error("Pick a day for this activity.");
        const days = selectedTrip.days.map((d, i) =>
          i === dayIndex
            ? {
                ...d,
                activities: [
                  ...d.activities,
                  {
                    id: crypto.randomUUID(),
                    name: payload.name,
                    cost: Number(payload.cost) || 0,
                    duration: payload.duration || null,
                    category: payload.category || "other",
                    startTime: "",
                    notes: "",
                  },
                ],
              }
            : d
        );
        await tripsApi.updateTrip(tripId, { days });
        onDone?.(`${payload.name} added to day ${dayIndex + 1}`);
      }
      onClose();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <div
      className="atd__backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={mode === "city" ? "Add city to trip" : "Add activity to trip"}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="atd__panel">
        <p className="eyebrow">{mode === "city" ? "Add stop" : "Add activity"}</p>
        <h2 className="h-display h3 atd__title">{payload.name}</h2>
        {mode === "activity" && (
          <p className="kicker grey-text">
            {cityName(payload.cityId)} · ${Number(payload.cost).toLocaleString()}
          </p>
        )}

        {trips === null && <BoardingBar label="Loading your trips" />}

        {trips?.length === 0 && (
          <div className="atd__empty">
            <p className="body-text">You don&apos;t have a trip yet. Create one first.</p>
            <Button as={Link} to="/trips/new" variant="orange">
              Create a trip
            </Button>
          </div>
        )}

        {trips && trips.length > 0 && (
          <form onSubmit={handleSubmit} className="atd__form">
            <div className="gt-field">
              <label className="gt-field__label" htmlFor="atd-trip">
                Trip
              </label>
              <select
                id="atd-trip"
                className="atd__select"
                value={tripId}
                onChange={(e) => setTripId(e.target.value)}
              >
                {trips.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {mode === "activity" && selectedTrip && (
              <div className="gt-field">
                <label className="gt-field__label" htmlFor="atd-day">
                  Day
                </label>
                <select
                  id="atd-day"
                  className="atd__select"
                  value={dayIndex}
                  onChange={(e) => setDayIndex(Number(e.target.value))}
                >
                  {selectedTrip.days.map((d, i) => (
                    <option key={d.date} value={i}>
                      Day {i + 1} — {d.date} · {cityName(d.cityId)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {mode === "city" && (
              <p className="body-text grey-text atd__note">
                This adds {payload.name} as a new stop with its own day at the end of the trip.
              </p>
            )}

            {error && <p className="gt-field__error">{error}</p>}

            <div className="atd__actions">
              <Button type="button" variant="outline" onClick={onClose} magnetic={false}>
                Cancel
              </Button>
              <Button type="submit" variant="orange" loading={saving} magnetic={false}>
                Add to trip
              </Button>
            </div>
          </form>
        )}

        {trips?.length === 0 && (
          <div className="atd__actions">
            <Button type="button" variant="outline" onClick={onClose} magnetic={false}>
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
