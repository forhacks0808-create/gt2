import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import * as tripsApi from "../api/tripsApi";
import { BoardingBar } from "../components/Loader";
import EmptyState from "../components/EmptyState";
import "./AdminAnalytics.css";

export default function AdminAnalytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    tripsApi.getAnalytics().then(setData);
  }, []);

  if (!data) {
    return (
      <div>
        <NavBar />
        <div className="shell container" style={{ paddingTop: "3rem" }}>
          <BoardingBar label="Querying database metrics" />
        </div>
      </div>
    );
  }

  const {
    totalTrips = 0,
    totalUsers = 0,
    totalActivities = 0,
    publicTripsCount = 0,
    avgDuration = 0,
    topCities = [],
    topActivities = [],
  } = data;

  return (
    <div>
      <NavBar />
      <section className="shell container admin-page">
        <div className="admin-head">
          <div>
            <p className="eyebrow on-orange">PostgreSQL Live Intelligence</p>
            <h1 className="h-display h1" style={{ margin: "0.4rem 0 0.5rem" }}>
              DATABASE METRICS
            </h1>
            <p className="body-text grey-text">
              Real-time platform statistics queried directly from your PostgreSQL relational database tables (`User`, `Trip`, `TripStop`, `Activity`, `Budget`).
            </p>
          </div>
        </div>

        {/* Dynamic KPI Cards */}
        <div className="admin-kpi-grid">
          <div className="admin-kpi-card ticket">
            <span className="eyebrow">Trips in Database</span>
            <h2 className="h-display h1 admin-kpi-value">{totalTrips}</h2>
            <span className="kicker grey-text">Live count (`Trip` table)</span>
          </div>

          <div className="admin-kpi-card ticket">
            <span className="eyebrow">Registered Users</span>
            <h2 className="h-display h1 admin-kpi-value">{totalUsers}</h2>
            <span className="kicker grey-text">Live count (`User` table)</span>
          </div>

          <div className="admin-kpi-card ticket">
            <span className="eyebrow">Avg. Itinerary Length</span>
            <h2 className="h-display h1 admin-kpi-value">{avgDuration}d</h2>
            <span className="kicker grey-text">Computed from real dates</span>
          </div>

          <div className="admin-kpi-card ticket">
            <span className="eyebrow">Public Community Trips</span>
            <h2 className="h-display h1 admin-kpi-value">{publicTripsCount}</h2>
            <span className="kicker" style={{ color: "var(--orange)" }}>
              {totalTrips > 0 ? Math.round((publicTripsCount / totalTrips) * 100) : 0}% of all trips
            </span>
          </div>
        </div>

        {/* Database Tables Analysis */}
        <div className="admin-tables-grid">
          {/* Top Destination Stops in DB */}
          <div className="admin-panel ticket">
            <div className="admin-panel__head">
              <h3 className="h-display h3">Top Destination Stops</h3>
              <span className="kicker grey-text">Queried from `TripStop` table</span>
            </div>

            {topCities.length === 0 ? (
              <div style={{ padding: "2rem 0", textAlign: "center" }}>
                <p className="kicker grey-text">No destination stops recorded in database yet.</p>
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Destination</th>
                    <th>Country</th>
                    <th>Times Planned</th>
                  </tr>
                </thead>
                <tbody>
                  {topCities.map((city) => (
                    <tr key={city.name}>
                      <td className="numeral">{city.rank}</td>
                      <td>
                        <span style={{ fontWeight: 800 }}>{city.name}</span>
                      </td>
                      <td><span className="admin-region-pill">{city.country}</span></td>
                      <td className="numeral" style={{ color: "var(--orange)", fontWeight: 800 }}>
                        {city.tripsCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Top Activities in DB */}
          <div className="admin-panel ticket">
            <div className="admin-panel__head">
              <h3 className="h-display h3">Most Added Activities</h3>
              <span className="kicker grey-text">Queried from `Activity` table ({totalActivities} Total)</span>
            </div>

            {topActivities.length === 0 ? (
              <div style={{ padding: "2rem 0", textAlign: "center" }}>
                <p className="kicker grey-text">No activities added to trips yet.</p>
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Activity Title</th>
                    <th>Category</th>
                    <th>Times Added</th>
                  </tr>
                </thead>
                <tbody>
                  {topActivities.map((act) => (
                    <tr key={act.name}>
                      <td className="numeral">{act.rank}</td>
                      <td>
                        <span style={{ fontWeight: 700 }}>{act.name}</span>
                      </td>
                      <td><span className="admin-cat-pill">{act.category}</span></td>
                      <td className="numeral" style={{ fontWeight: 800 }}>{act.plannedCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
