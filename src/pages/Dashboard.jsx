import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import * as tripsApi from "../api/tripsApi";
import { CITIES } from "../data/cities";
import NavBar from "../components/NavBar";
import Button from "../components/Button";
import { BoardingBar, ImagePlaceholder } from "../components/Loader";
import EmptyState from "../components/EmptyState";
import "./Dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();
  const [trips, setTrips] = useState(null);

  useEffect(() => {
    tripsApi.listTrips(user.id).then(setTrips);
  }, [user.id]);

  const now = new Date();
  const upcoming = trips?.filter((t) => new Date(t.endDate) >= now) ?? [];
  const nextTrip = upcoming[0];

  return (
    <div>
      <NavBar />
      <section className="shell dash-welcome">
        <div className="container">
          <p className="kicker">{formatToday()}</p>
          <h1 className="h-display h1">
            HI {user.name.split(" ")[0].toUpperCase()},<br />
            START PLANNING
          </h1>
          <div className="dash-actions">
            <Button as={Link} to="/trips/new" variant="orange">
              + New Trip
            </Button>
            <Button as={Link} to="/cities" variant="outline">
              Browse Cities
            </Button>
          </div>
        </div>
      </section>

      <hr className="hairline" />

      <section className="shell container dash-section">
        <div className="dash-section__head">
          <p className="eyebrow">Next up</p>
        </div>

        {trips === null && <BoardingBar label="Loading your trips" />}

        {trips !== null && !nextTrip && (
          <EmptyState
            title="NO TRIPS YET"
            body="Your next adventure starts with one city. Build an itinerary in a few minutes."
            action={
              <Button as={Link} to="/trips/new" variant="black">
                Plan your first trip
              </Button>
            }
          />
        )}

        {nextTrip && (
          <Link to={`/trips/${nextTrip.id}`} className="dash-highlight ticket">
            <div className="dash-highlight__image">
              <ImagePlaceholder label={cityName(nextTrip.coverCityId)} />
            </div>
            <div className="dash-highlight__body">
              <p className="kicker">
                {nextTrip.startDate} — {nextTrip.endDate}
              </p>
              <h2 className="h-display h3">{nextTrip.name}</h2>
              <p className="body-text grey-text">
                {nextTrip.cities?.length || 0} {nextTrip.cities?.length === 1 ? "city" : "cities"} ·{" "}
                {nextTrip.days?.length || 0} days
              </p>
            </div>
          </Link>
        )}
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
