import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as tripsApi from "../api/tripsApi";
import { CITIES } from "../data/cities";
import { useAuth } from "../context/AuthContext";
import NavBar from "../components/NavBar";
import Button from "../components/Button";
import { ImagePlaceholder, BoardingBar } from "../components/Loader";
import { useStamp } from "../components/Stamp";
import "./Community.css";

const VIBE_FILTERS = [
  { id: "all", label: "All Itineraries" },
  { id: "cultural", label: "Cultural & Wine" },
  { id: "food", label: "Food & Culinary" },
  { id: "adventure", label: "Adventure & Nature" },
  { id: "temples", label: "Temples & History" },
];

export default function Community() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const stamp = useStamp();

  const [trips, setTrips] = useState(null);
  const [selectedVibe, setSelectedVibe] = useState("all");
  const [copyingId, setCopyingId] = useState(null);
  const [likedIds, setLikedIds] = useState([]);

  useEffect(() => {
    tripsApi.listCommunityTrips(selectedVibe).then(setTrips);
  }, [selectedVibe]);

  async function handleLike(tripId, e) {
    e.preventDefault();
    e.stopPropagation();
    if (likedIds.includes(tripId)) return;

    await tripsApi.likeCommunityTrip(tripId);
    setLikedIds((prev) => [...prev, tripId]);
    setTrips((prev) =>
      prev.map((t) => (t.id === tripId ? { ...t, likes: (t.likes || 0) + 1 } : t))
    );
    stamp("Upvoted!");
  }

  async function handleCopyTrip(trip, e) {
    e.preventDefault();
    e.stopPropagation();
    setCopyingId(trip.id);
    stamp("Copying itinerary…");

    if (!user) {
      sessionStorage.setItem("gt_pending_copy", trip.shareId);
      navigate("/register");
      return;
    }

    const copied = await tripsApi.copyTrip(trip.shareId, user.id);
    setCopyingId(null);
    stamp("Added to your trips!");
    navigate(`/trips/${copied.id}`);
  }

  return (
    <div>
      <NavBar />
      <section className="shell container community-page">
        <div className="community-header">
          <p className="eyebrow on-orange">GlobeTrotter Community Hub</p>
          <h1 className="h-display h1" style={{ margin: "0.4rem 0 1rem" }}>
            DISCOVER PUBLIC TRIPS
          </h1>
          <p className="body-text" style={{ maxWidth: 620 }}>
            Explore curated journeys, real day-by-day travel plans, and crowd-sourced itineraries created by travelers worldwide. Copy any trip to customize your own adventure.
          </p>
        </div>

        {/* Vibe Filter Pills */}
        <div className="community-filters">
          {VIBE_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedVibe(f.id)}
              className={`community-filter-pill ${selectedVibe === f.id ? "is-active" : ""}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {trips === null && <BoardingBar label="Loading community journeys" />}

        {trips !== null && trips.length === 0 && (
          <div className="community-empty ticket">
            <h3 className="h-display h3">No public trips in this category yet</h3>
            <p className="body-text grey-text">Share your own itinerary to feature it here!</p>
          </div>
        )}

        <div className="community-grid">
          {trips?.map((trip) => {
            const cityName = CITIES.find((c) => c.id === trip.coverCityId)?.name || trip.cities?.[0] || "World";
            const totalActivities = trip.days.reduce((acc, d) => acc + (d.activities?.length || 0), 0);
            const totalCost = trip.days.reduce(
              (acc, d) => acc + d.activities.reduce((s, a) => s + (Number(a.cost) || 0), 0),
              0
            );
            const isLiked = likedIds.includes(trip.id);

            return (
              <div key={trip.id} className="community-card ticket">
                <div className="community-card__image-wrap">
                  <ImagePlaceholder label={cityName} />
                  {trip.vibe && <span className="community-vibe-tag">{trip.vibe}</span>}
                </div>

                <div className="community-card__content">
                  <div className="community-card__meta-top">
                    <span className="kicker grey-text">By {trip.ownerName || "Traveler"}</span>
                    <button
                      className={`community-like-btn ${isLiked ? "is-liked" : ""}`}
                      onClick={(e) => handleLike(trip.id, e)}
                      title="Upvote trip"
                    >
                      ❤️ <span className="numeral">{trip.likes || 0}</span>
                    </button>
                  </div>

                  <h3 className="h-display h3" style={{ fontSize: "1.35rem", margin: "0.4rem 0" }}>
                    {trip.name}
                  </h3>

                  <p className="body-text grey-text community-card__desc">
                    {trip.description || `${trip.days.length} days exploring ${trip.cities.join(", ")}.`}
                  </p>

                  <div className="community-card__stats">
                    <div>
                      <span className="eyebrow">Duration</span>
                      <span className="numeral">{trip.days.length} DAYS</span>
                    </div>
                    <div>
                      <span className="eyebrow">Activities</span>
                      <span className="numeral">{totalActivities} PLANNED</span>
                    </div>
                    <div>
                      <span className="eyebrow">Est. Cost</span>
                      <span className="numeral" style={{ color: "var(--orange)" }}>${totalCost.toLocaleString()}</span>
                    </div>
                  </div>

                  <hr className="hairline" style={{ margin: "1rem 0" }} />

                  <div className="community-card__actions">
                    <Link to={`/shared/${trip.shareId}`} className="community-view-link">
                      View Itinerary →
                    </Link>
                    <Button
                      variant="orange"
                      onClick={(e) => handleCopyTrip(trip, e)}
                      loading={copyingId === trip.id}
                      style={{ fontSize: "0.85rem", padding: "8px 14px" }}
                    >
                      + Copy Trip
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
