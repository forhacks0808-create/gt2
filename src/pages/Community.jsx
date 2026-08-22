import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as tripsApi from "../api/tripsApi";
import { CITIES } from "../data/cities";
import { useAuth } from "../context/AuthContext";
import NavBar from "../components/NavBar";
import Button from "../components/Button";
import { ImagePlaceholder, BoardingBar } from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { useStamp } from "../components/Stamp";
import "./Community.css";

export default function Community() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const stamp = useStamp();

  const [trips, setTrips] = useState(null);
  const [copyingId, setCopyingId] = useState(null);
  const [unpublishingId, setUnpublishingId] = useState(null);

  async function loadCommunityTrips() {
    setTrips(null);
    const data = await tripsApi.listCommunityTrips();
    setTrips(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    loadCommunityTrips();
  }, []);

  async function handleToggleCommunity(tripId) {
    setUnpublishingId(tripId);
    try {
      await tripsApi.toggleCommunityPublish(tripId);
      stamp("Removed from Community Hub");
      await loadCommunityTrips();
    } catch (err) {
      console.error(err);
    } finally {
      setUnpublishingId(null);
    }
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

    try {
      const copied = await tripsApi.copyTrip(trip.shareId, user.id);
      stamp("Added to your trips!");
      navigate(`/trips/${copied.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setCopyingId(null);
    }
  }

  return (
    <div>
      <NavBar />
      <section className="shell container community-page">
        <div className="community-header">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <p className="eyebrow on-orange">Live Database Feed</p>
              <h1 className="h-display h1" style={{ margin: "0.4rem 0 0.5rem" }}>
                COMMUNITY EXPEDITIONS
              </h1>
              <p className="body-text grey-text" style={{ maxWidth: 620 }}>
                Real trips published by users to the GlobeTrotter database. Explore real itineraries, or publish your own journeys for other travelers to discover.
              </p>
            </div>
            <Button as={Link} to="/trips" variant="orange">
              Manage Your Trips →
            </Button>
          </div>
        </div>

        {trips === null && <BoardingBar label="Querying community trips from database" />}

        {trips !== null && trips.length === 0 && (
          <EmptyState
            title="NO COMMUNITY TRIPS PUBLISHED YET"
            body="No trips have been made public yet in the database. Go to 'My Trips' and click 'Publish to Community' on any itinerary to be the first!"
            action={
              <Button as={Link} to="/trips" variant="black">
                View My Trips to Publish
              </Button>
            }
          />
        )}

        <div className="community-grid">
          {trips?.map((trip) => {
            const cityName = CITIES.find((c) => c.id === trip.coverCityId)?.name || trip.cities?.[0] || "Destination";
            const totalActivities = trip.days.reduce((acc, d) => acc + (d.activities?.length || 0), 0);
            const totalCost = trip.days.reduce(
              (acc, d) => acc + d.activities.reduce((s, a) => s + (Number(a.cost) || 0), 0),
              0
            );
            const isOwner = user?.id && trip.ownerId === user.id;

            return (
              <div key={trip.id} className="community-card ticket">
                <div className="community-card__image-wrap">
                  <ImagePlaceholder label={cityName} />
                  <span className="community-vibe-tag">PUBLIC EXPEDITION</span>
                </div>

                <div className="community-card__content">
                  <div className="community-card__meta-top">
                    <span className="kicker grey-text">Published by {trip.ownerName || "Traveler"}</span>
                    {isOwner && (
                      <span className="kicker" style={{ color: "var(--orange)", fontWeight: 800 }}>
                        (YOUR TRIP)
                      </span>
                    )}
                  </div>

                  <h3 className="h-display h3" style={{ fontSize: "1.35rem", margin: "0.4rem 0" }}>
                    {trip.name}
                  </h3>

                  <p className="body-text grey-text community-card__desc">
                    {trip.description || `${trip.days.length} days traveling through ${trip.cities.join(", ")}.`}
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
                      <span className="numeral" style={{ color: "var(--orange)" }}>
                        ${totalCost.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <hr className="hairline" style={{ margin: "1rem 0" }} />

                  <div className="community-card__actions">
                    <Link to={`/shared/${trip.shareId}`} className="community-view-link">
                      View Itinerary →
                    </Link>

                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      {isOwner ? (
                        <Button
                          variant="outline"
                          onClick={() => handleToggleCommunity(trip.id)}
                          loading={unpublishingId === trip.id}
                          style={{ fontSize: "0.78rem", padding: "6px 10px" }}
                        >
                          🔒 Unpublish
                        </Button>
                      ) : (
                        <Button
                          variant="orange"
                          onClick={(e) => handleCopyTrip(trip, e)}
                          loading={copyingId === trip.id}
                          style={{ fontSize: "0.82rem", padding: "6px 12px" }}
                        >
                          + Copy Trip
                        </Button>
                      )}
                    </div>
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
