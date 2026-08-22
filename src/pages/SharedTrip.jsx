import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import * as tripsApi from "../api/tripsApi";
import { CITIES } from "../data/cities";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import { BoardingBar, ImagePlaceholder } from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { useStamp } from "../components/Stamp";
import "./ItineraryView.css";
import "./SharedTrip.css";

export default function SharedTrip() {
  const { shareId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const stamp = useStamp();
  const [trip, setTrip] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [copying, setCopying] = useState(false);

  useEffect(() => {
    tripsApi
      .getPublicTrip(shareId)
      .then(setTrip)
      .catch(() => setNotFound(true));
  }, [shareId]);

  if (notFound) {
    return (
      <div className="shell container" style={{ paddingTop: "4rem" }}>
        <EmptyState
          title="TRIP NOT AVAILABLE"
          body="This link may have been revoked, or the trip is private."
          action={
            <Button as={Link} to="/" variant="black">
              Go to GlobeTrotter
            </Button>
          }
        />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="shell container" style={{ paddingTop: "4rem" }}>
        <BoardingBar label="Loading shared trip" />
      </div>
    );
  }

  const total = trip.days.reduce(
    (sum, d) => sum + d.activities.reduce((s, a) => s + (Number(a.cost) || 0), 0),
    0
  );

  async function handleCopy() {
    setCopying(true);
    stamp("Copying trip…");
    if (!user) {
      sessionStorage.setItem("gt_pending_copy", shareId);
      navigate("/register");
      return;
    }
    const copy = await tripsApi.copyTrip(shareId, user.id);
    setCopying(false);
    navigate(`/trips/${copy.id}`);
  }

  return (
    <div>
      <header className="shared-trip__bar">
        <div className="shell container shared-trip__bar-inner">
          <Link to="/" className="gt-nav__mark">
            <span className="gt-nav__mark-box" />
            GLOBETROTTER
          </Link>
          <Button variant="orange" onClick={handleCopy} loading={copying}>
            Copy this trip
          </Button>
        </div>
      </header>

      <section className="itin-view__hero">
        <div className="shell container itin-view__hero-inner">
          <p className="kicker" style={{ color: "var(--paper)" }}>
            {trip.startDate} — {trip.endDate} · {trip.days.length} days
          </p>
          <h1 className="h-display h1" style={{ color: "var(--paper)" }}>
            {trip.name}
          </h1>
        </div>
      </section>

      <section className="shell container itin-view__body">
        {trip.days.map((day, i) => (
          <div key={day.date} className="itin-view__day">
            <div className="itin-view__day-marker">
              <span className="kicker grey-text">{formatDayMonth(day.date)}</span>
            </div>
            <div className="itin-view__day-content">
              {(i === 0 || trip.days[i - 1].cityId !== day.cityId) && (
                <div className="itin-view__city-header">
                  <h2 className="h-display h3 itin-view__city-badge">{cityName(day.cityId)}</h2>
                </div>
              )}
              <p className="itin-view__day-label h-display">Day {i + 1}</p>
              {day.activities.length === 0 ? (
                <p className="body-text grey-text">Nothing planned yet.</p>
              ) : (
                <ul className="itin-view__activities">
                  {day.activities.map((a) => (
                    <li key={a.id}>
                      <span>{a.name}</span>
                      <span className="numeral">${Number(a.cost).toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}

        <div className="itin-view__total">
          <span className="eyebrow">Total estimated cost</span>
          <span className="numeral" style={{ fontSize: "2rem" }}>
            ${total.toLocaleString()}
          </span>
        </div>

        <p className="kicker shared-trip__watermark">Read-only · shared by GlobeTrotter</p>
      </section>
    </div>
  );
}

function cityName(id) {
  return CITIES.find((c) => c.id === id)?.name || "Unassigned";
}

function formatDayMonth(date) {
  const [, month, day] = date.split("-");
  const monthName = new Date(2000, Number(month) - 1, 1).toLocaleString("en-US", {
    month: "short",
  });
  return `${day} ${monthName}`;
}
