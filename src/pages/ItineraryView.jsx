import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import * as tripsApi from "../api/tripsApi";
import { CITIES } from "../data/cities";
import NavBar from "../components/NavBar";
import Button from "../components/Button";
import { BoardingBar, ImagePlaceholder } from "../components/Loader";
import { useStamp } from "../components/Stamp";
import "./ItineraryView.css";

export default function ItineraryView() {
  const { tripId } = useParams();
  const stamp = useStamp();
  const [trip, setTrip] = useState(null);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    tripsApi.getTrip(tripId).then(setTrip);
  }, [tripId]);

  if (!trip) {
    return (
      <div>
        <NavBar />
        <div className="shell container" style={{ paddingTop: "3rem" }}>
          <BoardingBar label="Loading itinerary" />
        </div>
      </div>
    );
  }

  const total = trip.days.reduce(
    (sum, d) => sum + d.activities.reduce((s, a) => s + (Number(a.cost) || 0), 0),
    0
  );

  async function handleShare() {
    setSharing(true);
    const updated = await tripsApi.shareTrip(tripId);
    setTrip(updated);
    const url = `${window.location.origin}/shared/${updated.shareId}`;
    await navigator.clipboard?.writeText(url).catch(() => {});
    stamp("Share link copied!");
    setSharing(false);
  }

  function handleShareWhatsApp() {
    const url = `${window.location.origin}/shared/${trip.shareId || trip.id}`;
    const text = `Check out my travel itinerary for ${trip.name} on GlobeTrotter: ${url}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  }

  function handleShareTwitter() {
    const url = `${window.location.origin}/shared/${trip.shareId || trip.id}`;
    const text = `Planning my upcoming journey: ${trip.name} with GlobeTrotter! ${url}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
  }

  return (
    <div>
      <NavBar />
      <section className="itin-view__hero">
        <div className="shell container itin-view__hero-inner">
          <p className="kicker" style={{ color: "var(--paper)" }}>
            {trip.startDate} — {trip.endDate} · {trip.days.length} days · {trip.cities.length}{" "}
            {trip.cities.length === 1 ? "city" : "cities"}
          </p>
          <h1 className="h-display h1" style={{ color: "var(--paper)" }}>
            {trip.name}
          </h1>

          <div className="itin-view__hero-actions">
            <Button variant="orange" onClick={handleShare} loading={sharing}>
              🔗 Copy Share Link
            </Button>
            <Button
              as={Link}
              to={`/trips/${tripId}/calendar`}
              variant="outline"
              magnetic={false}
              style={{ borderColor: "var(--paper)", color: "var(--paper)" }}
            >
              📅 Calendar &amp; Timeline
            </Button>
            <Button
              as={Link}
              to={`/trips/${tripId}/budget`}
              variant="outline"
              magnetic={false}
              style={{ borderColor: "var(--paper)", color: "var(--paper)" }}
            >
              💰 View Budget
            </Button>
            <Button
              as={Link}
              to={`/trips/${tripId}/build`}
              variant="outline"
              magnetic={false}
              style={{ borderColor: "var(--paper)", color: "var(--paper)" }}
            >
              ✏️ Edit Stops
            </Button>
          </div>
        </div>
      </section>

      <section className="shell container itin-view__body">
        {/* Social Share Bar */}
        <div className="itin-social-bar ticket">
          <span className="eyebrow">Share with travel companions:</span>
          <div className="itin-social-btns">
            <button className="itin-social-btn" onClick={handleShareWhatsApp}>
              💬 WhatsApp
            </button>
            <button className="itin-social-btn" onClick={handleShareTwitter}>
              🐦 Twitter / X
            </button>
            <button className="itin-social-btn" onClick={() => window.print()}>
              🖨️ Print / PDF
            </button>
          </div>
        </div>

        {/* Days List */}
        {trip.days.map((day, i) => (
          <div key={day.date} className="itin-view__day">
            <div className="itin-view__day-marker">
              <span className="numeral">{String(i + 1).padStart(2, "0")}</span>
              <span className="kicker grey-text">{day.date}</span>
            </div>
            <div className="itin-view__day-content">
              <div className="itin-view__city-header">
                <div className="itin-view__city-image">
                  <ImagePlaceholder label={cityName(day.cityId)} />
                </div>
                <div>
                  <h2 className="h-display h3">{cityName(day.cityId)}</h2>
                  <p className="kicker grey-text">Day {i + 1} of {trip.days.length}</p>
                </div>
              </div>
              {day.activities.length === 0 ? (
                <p className="body-text grey-text" style={{ padding: "1rem 0" }}>
                  Free exploration day. No activities assigned yet.
                </p>
              ) : (
                <ul className="itin-view__activities">
                  {day.activities.map((a) => (
                    <li key={a.id}>
                      <div>
                        <span style={{ fontWeight: 700 }}>{a.name}</span>
                        {a.notes && (
                          <p className="grey-text" style={{ fontSize: "0.82rem", margin: "2px 0 0" }}>
                            {a.notes}
                          </p>
                        )}
                      </div>
                      <span className="numeral">${Number(a.cost).toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}

        <div className="itin-view__total ticket">
          <div>
            <span className="eyebrow">Estimated Total Cost</span>
            <p className="kicker grey-text">Sum of all scheduled activities</p>
          </div>
          <span className="numeral" style={{ fontSize: "2.25rem", color: "var(--orange)" }}>
            ${total.toLocaleString()}
          </span>
        </div>
      </section>
    </div>
  );
}

function cityName(id) {
  return CITIES.find((c) => c.id === id)?.name || "Unassigned";
}
