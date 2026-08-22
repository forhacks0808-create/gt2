import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import * as tripsApi from "../api/tripsApi";
import { CITIES } from "../data/cities";
import NavBar from "../components/NavBar";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import { BoardingBar, ImagePlaceholder } from "../components/Loader";
import { useStamp } from "../components/Stamp";
import "./MyTrips.css";

const STATUS_TABS = [
  { id: "all", label: "All Expeditions" },
  { id: "ongoing", label: "Ongoing" },
  { id: "upcoming", label: "Upcoming" },
  { id: "completed", label: "Completed" },
];

export default function MyTrips() {
  const { user } = useAuth();
  const stamp = useStamp();
  const [trips, setTrips] = useState(null);
  const [tab, setTab] = useState("all");
  const [confirmId, setConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    tripsApi.listTrips(user?.id).then(setTrips);
  }, [user?.id]);

  async function handleDelete() {
    setDeleting(true);
    await tripsApi.deleteTrip(confirmId);
    setTrips((prev) => prev.filter((t) => t.id !== confirmId));
    setDeleting(false);
    setConfirmId(null);
    stamp("Trip deleted");
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const categorizedTrips = trips?.filter((trip) => {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    if (tab === "ongoing") return now >= start && now <= end;
    if (tab === "upcoming") return now < start;
    if (tab === "completed") return now > end;
    return true;
  });

  return (
    <div>
      <NavBar />
      <section className="shell container my-trips">
        <div className="my-trips__head">
          <div>
            <p className="eyebrow on-orange">Travel Logbook</p>
            <h1 className="h-display h1">MY TRIPS</h1>
          </div>
          <Button as={Link} to="/trips/new" variant="orange">
            + Plan New Trip
          </Button>
        </div>

        {/* Categorization Tabs: All / Ongoing / Upcoming / Completed */}
        <div className="my-trips__tabs">
          {STATUS_TABS.map((t) => (
            <button
              key={t.id}
              className={`my-trips__tab-btn ${tab === t.id ? "is-active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
              {trips && (
                <span className="my-trips__tab-count">
                  {
                    trips.filter((trip) => {
                      const start = new Date(trip.startDate);
                      const end = new Date(trip.endDate);
                      if (t.id === "ongoing") return now >= start && now <= end;
                      if (t.id === "upcoming") return now < start;
                      if (t.id === "completed") return now > end;
                      return true;
                    }).length
                  }
                </span>
              )}
            </button>
          ))}
        </div>

        {trips === null && <BoardingBar label="Loading your travel logbook" />}

        {trips !== null && categorizedTrips.length === 0 && (
          <EmptyState
            title="NO TRIPS IN THIS SECTION"
            body="You have no recorded trips in this category yet. Start drafting a new itinerary."
            action={
              <Button as={Link} to="/trips/new" variant="black">
                Create an itinerary
              </Button>
            }
          />
        )}

        <div className="my-trips__grid">
          {categorizedTrips?.map((trip, i) => {
            const start = new Date(trip.startDate);
            const end = new Date(trip.endDate);
            let status = "UPCOMING";
            let statusClass = "badge-upcoming";
            if (now >= start && now <= end) {
              status = "ONGOING";
              statusClass = "badge-ongoing";
            } else if (now > end) {
              status = "COMPLETED";
              statusClass = "badge-completed";
            }

            const coverCity = CITIES.find((c) => c.id === trip.coverCityId)?.name || trip.cities?.[0] || "Trip";
            const totalCost = trip.days.reduce(
              (acc, d) => acc + d.activities.reduce((s, a) => s + (Number(a.cost) || 0), 0),
              0
            );
            const totalActivities = trip.days.reduce((acc, d) => acc + (d.activities?.length || 0), 0);

            return (
              <div key={trip.id} className="trip-card ticket">
                <div className="trip-card__image-col">
                  <ImagePlaceholder label={coverCity} />
                  <span className={`trip-card__status ${statusClass}`}>{status}</span>
                </div>

                <div className="trip-card__body-col">
                  <div className="trip-card__meta-row">
                    <span className="numeral my-trips__index">{String(i + 1).padStart(2, "0")}</span>
                    <span className="kicker grey-text">
                      {trip.startDate} — {trip.endDate} · {trip.days.length} DAYS
                    </span>
                  </div>

                  <h3 className="h-display h2" style={{ fontSize: "1.6rem", margin: "0.25rem 0 0.5rem" }}>
                    {trip.name}
                  </h3>

                  <p className="body-text grey-text" style={{ fontSize: "0.9rem", margin: "0 0 1rem" }}>
                    {trip.cities.map((c) => CITIES.find((ci) => ci.id === c)?.name || c).join(" → ")}
                  </p>

                  <div className="trip-card__stats-row">
                    <div>
                      <span className="eyebrow">Activities</span>
                      <span className="numeral">{totalActivities} PLANNED</span>
                    </div>
                    <div>
                      <span className="eyebrow">Estimated Spend</span>
                      <span className="numeral" style={{ color: "var(--orange)" }}>
                        ${totalCost.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <hr className="dashed-rule" style={{ margin: "1rem 0" }} />

                  <div className="trip-card__actions-row">
                    <div className="trip-card__nav-links">
                      <Link to={`/trips/${trip.id}`} className="trip-card__link">
                        Itinerary
                      </Link>
                      <Link to={`/trips/${trip.id}/calendar`} className="trip-card__link">
                        📅 Calendar
                      </Link>
                      <Link to={`/trips/${trip.id}/budget`} className="trip-card__link">
                        💰 Budget
                      </Link>
                      <Link to={`/trips/${trip.id}/build`} className="trip-card__link">
                        ✏️ Edit
                      </Link>
                    </div>

                    <button
                      className="my-trips__delete-btn"
                      onClick={() => setConfirmId(trip.id)}
                      aria-label={`Delete ${trip.name}`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      {confirmId && (
        <div className="my-trips__modal-backdrop" role="dialog" aria-modal="true">
          <div className="my-trips__modal ticket">
            <p className="h-display h3">DELETE EXPEDITION?</p>
            <p className="body-text">
              <strong>{trips.find((t) => t.id === confirmId)?.name}</strong> and all associated day itineraries and budget estimates will be permanently removed.
            </p>
            <div className="my-trips__modal-actions">
              <Button variant="outline" onClick={() => setConfirmId(null)}>
                Cancel
              </Button>
              <Button variant="orange" onClick={handleDelete} loading={deleting}>
                Confirm Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
