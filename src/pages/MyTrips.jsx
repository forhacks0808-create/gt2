import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import * as tripsApi from "../api/tripsApi";
import { CITIES } from "../data/cities";
import NavBar from "../components/NavBar";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import { BoardingBar } from "../components/Loader";
import { useStamp } from "../components/Stamp";
import "./MyTrips.css";

export default function MyTrips() {
  const { user } = useAuth();
  const stamp = useStamp();
  const [trips, setTrips] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    tripsApi.listTrips(user.id).then(setTrips);
  }, [user.id]);

  async function handleDelete() {
    setDeleting(true);
    await tripsApi.deleteTrip(confirmId);
    setTrips((prev) => prev.filter((t) => t.id !== confirmId));
    setDeleting(false);
    setConfirmId(null);
    stamp("Trip deleted");
  }

  return (
    <div>
      <NavBar />
      <section className="shell container my-trips">
        <div className="my-trips__head">
          <h1 className="h-display h2">My Trips</h1>
          <Button as={Link} to="/trips/new" variant="orange">
            + New Trip
          </Button>
        </div>

        {trips === null && <BoardingBar label="Loading your trips" />}

        {trips !== null && trips.length === 0 && (
          <EmptyState
            title="NO TRIPS YET"
            body="Every itinerary starts with a first city. Yours is one form away."
            action={
              <Button as={Link} to="/trips/new" variant="black">
                Plan your first trip
              </Button>
            }
          />
        )}

        <div className="my-trips__list">
          {trips?.map((trip, i) => (
            <div key={trip.id} className="my-trips__row">
              <span className="numeral my-trips__index">{String(i + 1).padStart(2, "0")}</span>
              <Link to={`/trips/${trip.id}`} className="my-trips__row-main">
                <span className="my-trips__name">{trip.name}</span>
                <span className="kicker grey-text">
                  {trip.startDate} — {trip.endDate} ·{" "}
                  {trip.cities.map((c) => CITIES.find((ci) => ci.id === c)?.name).join(", ")}
                </span>
              </Link>
              <button
                className="my-trips__delete"
                onClick={() => setConfirmId(trip.id)}
                aria-label={`Delete ${trip.name}`}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>

      {confirmId && (
        <div className="my-trips__modal-backdrop" role="dialog" aria-modal="true">
          <div className="my-trips__modal">
            <p className="h-display h3">ARE YOU SURE?</p>
            <p className="body-text">
              {trips.find((t) => t.id === confirmId)?.name} and its full itinerary will be
              permanently deleted. This can't be undone.
            </p>
            <div className="my-trips__modal-actions">
              <Button variant="outline" onClick={() => setConfirmId(null)}>
                Cancel
              </Button>
              <Button variant="orange" onClick={handleDelete} loading={deleting}>
                Delete trip
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
