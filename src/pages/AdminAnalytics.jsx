import { useState } from "react";
import NavBar from "../components/NavBar";
import { CITIES } from "../data/cities";
import "./AdminAnalytics.css";

const MONTHLY_STATS = [
  { month: "Oct", trips: 420, users: 180 },
  { month: "Nov", trips: 560, users: 240 },
  { month: "Dec", trips: 890, users: 410 },
  { month: "Jan", trips: 720, users: 310 },
  { month: "Feb", trips: 980, users: 490 },
  { month: "Mar", trips: 1420, users: 680 },
];

const TOP_ACTIVITIES = [
  { rank: "01", name: "Fushimi Inari Torii Hike", city: "Kyoto", category: "Adventure", planned: 842, cost: "$0" },
  { rank: "02", name: "Tram 28 Scenic Loop", city: "Lisbon", category: "Sightseeing", planned: 760, cost: "$12" },
  { rank: "03", name: "Douro Valley Wine Tasting", city: "Porto", category: "Food & Wine", planned: 615, cost: "$30" },
  { rank: "04", name: "Blue Lagoon Geothermal Spa", city: "Reykjavík", category: "Sightseeing", planned: 580, cost: "$75" },
  { rank: "05", name: "Teotihuacán Pyramid Climb", city: "Mexico City", category: "Adventure", planned: 512, cost: "$85" },
];

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState("6m");
  const maxTrips = Math.max(...MONTHLY_STATS.map((m) => m.trips));

  return (
    <div>
      <NavBar />
      <section className="shell container admin-page">
        <div className="admin-head">
          <div>
            <p className="eyebrow on-orange">Platform Intelligence</p>
            <h1 className="h-display h1" style={{ margin: "0.4rem 0 0.5rem" }}>
              ANALYTICS &amp; METRICS
            </h1>
            <p className="body-text grey-text">
              Real-time platform adoption, itinerary creation velocity, destination popularity, and traveler trends.
            </p>
          </div>

          <div className="admin-time-pills">
            {["30d", "6m", "1y", "All"].map((r) => (
              <button
                key={r}
                className={`admin-time-pill ${timeRange === r ? "is-active" : ""}`}
                onClick={() => setTimeRange(r)}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="admin-kpi-grid">
          <div className="admin-kpi-card ticket">
            <span className="eyebrow">Total Trips Created</span>
            <h2 className="h-display h1 admin-kpi-value">14,280</h2>
            <span className="kicker" style={{ color: "#16a34a" }}>↑ +24.8% vs last month</span>
          </div>

          <div className="admin-kpi-card ticket">
            <span className="eyebrow">Active Travelers</span>
            <h2 className="h-display h1 admin-kpi-value">8,940</h2>
            <span className="kicker" style={{ color: "#16a34a" }}>↑ +18.2% new registrations</span>
          </div>

          <div className="admin-kpi-card ticket">
            <span className="eyebrow">Avg. Itinerary Length</span>
            <h2 className="h-display h1 admin-kpi-value">8.4d</h2>
            <span className="kicker grey-text">3.2 cities per journey</span>
          </div>

          <div className="admin-kpi-card ticket">
            <span className="eyebrow">Itinerary Shares &amp; Clones</span>
            <h2 className="h-display h1 admin-kpi-value">4,190</h2>
            <span className="kicker" style={{ color: "var(--orange)" }}>29.3% conversion rate</span>
          </div>
        </div>

        {/* Charts & Trends */}
        <div className="admin-charts-grid">
          {/* Bar Chart: Creation Velocity */}
          <div className="admin-panel ticket">
            <div className="admin-panel__head">
              <h3 className="h-display h3">Itinerary Creation Velocity</h3>
              <span className="kicker grey-text">Trips per month</span>
            </div>

            <div className="admin-bar-chart">
              {MONTHLY_STATS.map((item) => {
                const heightPct = (item.trips / maxTrips) * 100;
                return (
                  <div key={item.month} className="admin-bar-col">
                    <span className="numeral admin-bar-val">{item.trips}</span>
                    <div className="admin-bar-track">
                      <div className="admin-bar-fill" style={{ height: `${heightPct}%` }} />
                    </div>
                    <span className="kicker admin-bar-lbl">{item.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Seasonality & Regional Share */}
          <div className="admin-panel ticket">
            <div className="admin-panel__head">
              <h3 className="h-display h3">Seasonal Travel Distribution</h3>
              <span className="kicker grey-text">Trip departures</span>
            </div>

            <div className="admin-season-breakdown">
              {[
                { name: "Spring (Mar - May)", pct: 42, color: "var(--orange)" },
                { name: "Summer (Jun - Aug)", pct: 31, color: "var(--ink)" },
                { name: "Autumn (Sep - Nov)", pct: 18, color: "#6b6a66" },
                { name: "Winter (Dec - Feb)", pct: 9, color: "#d8d6d0" },
              ].map((s) => (
                <div key={s.name} className="admin-season-row">
                  <div className="admin-season-info">
                    <span style={{ fontWeight: 700 }}>{s.name}</span>
                    <span className="numeral">{s.pct}%</span>
                  </div>
                  <div className="admin-season-bar">
                    <div style={{ width: `${s.pct}%`, background: s.color, height: "100%" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tables: Top Cities & Activities */}
        <div className="admin-tables-grid">
          {/* Top Cities */}
          <div className="admin-panel ticket">
            <div className="admin-panel__head">
              <h3 className="h-display h3">Top Destination Catalog</h3>
              <span className="kicker grey-text">Ranked by traveler demand</span>
            </div>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Destination</th>
                  <th>Region</th>
                  <th>Cost Index</th>
                  <th>Match</th>
                </tr>
              </thead>
              <tbody>
                {CITIES.slice(0, 6).map((city, idx) => (
                  <tr key={city.id}>
                    <td className="numeral">{String(idx + 1).padStart(2, "0")}</td>
                    <td>
                      <span style={{ fontWeight: 800 }}>{city.name}</span>
                      <span className="grey-text" style={{ display: "block", fontSize: "0.8rem" }}>{city.country}</span>
                    </td>
                    <td><span className="admin-region-pill">{city.region}</span></td>
                    <td className="numeral">{city.costIndex}/100</td>
                    <td className="numeral" style={{ color: "var(--orange)" }}>{city.popularity}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Top Activities */}
          <div className="admin-panel ticket">
            <div className="admin-panel__head">
              <h3 className="h-display h3">Most Added Activities</h3>
              <span className="kicker grey-text">Top experiences</span>
            </div>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Activity</th>
                  <th>Category</th>
                  <th>Cost</th>
                  <th>Trips</th>
                </tr>
              </thead>
              <tbody>
                {TOP_ACTIVITIES.map((act) => (
                  <tr key={act.name}>
                    <td className="numeral">{act.rank}</td>
                    <td>
                      <span style={{ fontWeight: 700 }}>{act.name}</span>
                      <span className="grey-text" style={{ display: "block", fontSize: "0.8rem" }}>{act.city}</span>
                    </td>
                    <td><span className="admin-cat-pill">{act.category}</span></td>
                    <td className="numeral">{act.cost}</td>
                    <td className="numeral" style={{ fontWeight: 800 }}>{act.planned}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
