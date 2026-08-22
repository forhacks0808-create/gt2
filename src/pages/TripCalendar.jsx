import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import * as tripsApi from "../api/tripsApi";
import NavBar from "../components/NavBar";
import Button from "../components/Button";
import CalendarView from "../components/CalendarView";
import { BoardingBar } from "../components/Loader";
import "./TripCalendar.css";

export default function TripCalendar() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    tripsApi.getTrip(tripId).then(setTrip);
  }, [tripId]);

  if (!trip) {
    return (
      <div>
        <NavBar />
        <div className="shell container" style={{ paddingTop: "3rem" }}>
          <BoardingBar label="Loading itinerary calendar" />
        </div>
      </div>
    );
  }

  const totalActivities = trip.days.reduce((acc, d) => acc + (d.activities?.length || 0), 0);
  const totalCost = trip.days.reduce(
    (acc, d) => acc + d.activities.reduce((s, a) => s + (Number(a.cost) || 0), 0),
    0
  );

  return (
    <div>
      <NavBar />
      <section className="shell container trip-cal-page">
        <div className="trip-cal-header">
          <div>
            <p className="kicker">
              {trip.startDate} — {trip.endDate} · {trip.days.length} Days
            </p>
            <h1 className="h-display h2">{trip.name} · Calendar &amp; Timeline</h1>
            <p className="body-text grey-text" style={{ marginTop: "0.25rem" }}>
              {trip.cities.length} {trip.cities.length === 1 ? "City" : "Cities"} · {totalActivities} Activities · Estimated ${totalCost.toLocaleString()}
            </p>
          </div>

          <div className="trip-cal-actions">
            <Button as={Link} to={`/trips/${tripId}`} variant="outline">
              List View
            </Button>
            <Button as={Link} to={`/trips/${tripId}/build`} variant="black">
              Edit Stops
            </Button>
            <Button as={Link} to={`/trips/${tripId}/budget`} variant="orange">
              Budget Breakdown
            </Button>
          </div>
        </div>

        <CalendarView trip={trip} />
      </section>
    </div>
  );
}
