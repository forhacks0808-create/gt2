import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import * as tripsApi from "../api/tripsApi";
import { CITIES } from "../data/cities";
import NavBar from "../components/NavBar";
import Button from "../components/Button";
import Field from "../components/Field";
import { BoardingBar } from "../components/Loader";
import { useStamp } from "../components/Stamp";
import "./Budget.css";

const CATEGORY_KEYS = [
  { key: "transport", label: "Transport & Transit", icon: "🚆", color: "#3b82f6" },
  { key: "stay", label: "Lodging & Stays", icon: "🏨", color: "#8b5cf6" },
  { key: "meals", label: "Dining & Food", icon: "🍷", color: "#f59e0b" },
  { key: "activities", label: "Activities & Tours", icon: "🎟️", color: "var(--orange)" },
  { key: "misc", label: "Emergency & Misc", icon: "💼", color: "#6b7280" },
];

export default function Budget() {
  const { tripId } = useParams();
  const stamp = useStamp();
  const [trip, setTrip] = useState(null);
  const [targetBudget, setTargetBudget] = useState(800);
  const [categoryCosts, setCategoryCosts] = useState({
    transport: 120,
    stay: 280,
    meals: 160,
    activities: 122,
    misc: 40,
  });
  const [isEditingBudget, setIsEditingBudget] = useState(false);

  useEffect(() => {
    tripsApi.getTrip(tripId).then((t) => {
      setTrip(t);
      if (t.budgetBreakdown) {
        setCategoryCosts({
          transport: t.budgetBreakdown.transport || 100,
          stay: t.budgetBreakdown.stay || 250,
          meals: t.budgetBreakdown.meals || 150,
          activities: t.budgetBreakdown.activities || 80,
          misc: t.budgetBreakdown.misc || 40,
        });
        if (t.budgetBreakdown.targetBudget) {
          setTargetBudget(t.budgetBreakdown.targetBudget);
        }
      }
    });
  }, [tripId]);

  if (!trip) {
    return (
      <div>
        <NavBar />
        <div className="shell container" style={{ paddingTop: "3rem" }}>
          <BoardingBar label="Loading budget intelligence" />
        </div>
      </div>
    );
  }

  // Calculate day totals from activities
  const dayTotals = trip.days.map((d) => ({
    ...d,
    total: d.activities.reduce((s, a) => s + (Number(a.cost) || 0), 0),
  }));

  const totalActivitiesCost = dayTotals.reduce((s, d) => s + d.total, 0);

  // Total calculated budget
  const grandTotal =
    categoryCosts.transport +
    categoryCosts.stay +
    categoryCosts.meals +
    totalActivitiesCost +
    categoryCosts.misc;

  const totalDays = trip.days.length || 1;
  const avgCostPerDay = Math.round(grandTotal / totalDays);
  const dailyTargetBudget = Math.round(targetBudget / totalDays);

  const isOverBudget = grandTotal > targetBudget;
  const budgetDifference = Math.abs(grandTotal - targetBudget);

  const byCity = {};
  dayTotals.forEach((d) => {
    byCity[d.cityId] = (byCity[d.cityId] || 0) + d.total;
  });
  const cityRows = Object.entries(byCity).sort((a, b) => b[1] - a[1]);
  const maxCity = Math.max(1, ...cityRows.map(([, v]) => v));

  async function handleSaveCategoryBudget() {
    const updatedBreakdown = {
      ...categoryCosts,
      activities: totalActivitiesCost,
      targetBudget: Number(targetBudget),
    };
    await tripsApi.updateTrip(tripId, { budgetBreakdown: updatedBreakdown });
    setIsEditingBudget(false);
    stamp("Budget updated!");
  }

  return (
    <div>
      <NavBar />
      <section className="shell container budget-page">
        {/* Header */}
        <div className="budget-header">
          <div>
            <p className="kicker">
              {trip.name} · {trip.startDate} — {trip.endDate} ({totalDays} Days)
            </p>
            <h1 className="h-display h1">BUDGET &amp; SPEND REPORT</h1>
          </div>

          <div className="budget-header__actions">
            <Button as={Link} to={`/trips/${tripId}`} variant="outline">
              Itinerary View
            </Button>
            <Button as={Link} to={`/trips/${tripId}/calendar`} variant="black">
              📅 Calendar
            </Button>
          </div>
        </div>

        {/* Overbudget or Underbudget Alert Banner */}
        {isOverBudget ? (
          <div className="budget-alert budget-alert--warning ticket">
            <span className="budget-alert__icon">⚠️</span>
            <div>
              <p className="h-display h3" style={{ fontSize: "1.1rem", color: "#991b1b" }}>
                OVER ESTIMATED BUDGET BY ${budgetDifference.toLocaleString()}
              </p>
              <p className="body-text" style={{ fontSize: "0.88rem", margin: "2px 0 0" }}>
                Total estimated expenses (${grandTotal.toLocaleString()}) exceed your target budget limit (${targetBudget.toLocaleString()}). Consider adjusting daily activity costs or hotel allowances.
              </p>
            </div>
          </div>
        ) : (
          <div className="budget-alert budget-alert--success ticket">
            <span className="budget-alert__icon">✓</span>
            <div>
              <p className="h-display h3" style={{ fontSize: "1.1rem", color: "#166534" }}>
                WITHIN TARGET BUDGET (${budgetDifference.toLocaleString()} REMAINING)
              </p>
              <p className="body-text" style={{ fontSize: "0.88rem", margin: "2px 0 0" }}>
                Your journey is well planned and leaves a healthy financial cushion of ~${Math.round(budgetDifference / totalDays)}/day.
              </p>
            </div>
          </div>
        )}

        {/* Top Summary Metrics */}
        <div className="budget-kpi-grid">
          <div className="budget-kpi-card ticket">
            <span className="eyebrow">Estimated Total Spend</span>
            <h2 className="h-display h2 numeral" style={{ color: "var(--orange)" }}>
              ${grandTotal.toLocaleString()}
            </h2>
            <span className="kicker grey-text">Calculated across 5 categories</span>
          </div>

          <div className="budget-kpi-card ticket">
            <span className="eyebrow">Target Budget</span>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
              <h2 className="h-display h2 numeral">${targetBudget.toLocaleString()}</h2>
              <button
                className="budget-edit-btn"
                onClick={() => setIsEditingBudget((s) => !s)}
              >
                {isEditingBudget ? "Close" : "Edit"}
              </button>
            </div>
            <span className="kicker grey-text">Target: ~${dailyTargetBudget}/day</span>
          </div>

          <div className="budget-kpi-card ticket">
            <span className="eyebrow">Average Spend / Day</span>
            <h2 className="h-display h2 numeral">${avgCostPerDay.toLocaleString()}</h2>
            <span className="kicker grey-text">Across {totalDays} journey days</span>
          </div>
        </div>

        {/* Edit Category Budget Modal / Panel */}
        {isEditingBudget && (
          <div className="budget-edit-panel ticket">
            <p className="eyebrow on-orange">Budget Planner</p>
            <h3 className="h-display h3" style={{ margin: "0.25rem 0 1.25rem" }}>
              ADJUST CATEGORY ALLOCATIONS
            </h3>

            <div className="budget-edit-grid">
              <Field
                label="Target Budget Limit (USD)"
                type="number"
                value={targetBudget}
                onChange={(e) => setTargetBudget(Number(e.target.value))}
              />
              <Field
                label="Transport / Flights / Trains (USD)"
                type="number"
                value={categoryCosts.transport}
                onChange={(e) => setCategoryCosts({ ...categoryCosts, transport: Number(e.target.value) })}
              />
              <Field
                label="Lodging & Hotels (USD)"
                type="number"
                value={categoryCosts.stay}
                onChange={(e) => setCategoryCosts({ ...categoryCosts, stay: Number(e.target.value) })}
              />
              <Field
                label="Dining & Meals (USD)"
                type="number"
                value={categoryCosts.meals}
                onChange={(e) => setCategoryCosts({ ...categoryCosts, meals: Number(e.target.value) })}
              />
              <Field
                label="Emergency & Misc (USD)"
                type="number"
                value={categoryCosts.misc}
                onChange={(e) => setCategoryCosts({ ...categoryCosts, misc: Number(e.target.value) })}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
              <Button variant="outline" onClick={() => setIsEditingBudget(false)}>
                Cancel
              </Button>
              <Button variant="orange" onClick={handleSaveCategoryBudget}>
                Save Changes
              </Button>
            </div>
          </div>
        )}

        {/* Category Breakdown Bars */}
        <div className="budget-grid-split">
          <div className="budget-card ticket">
            <p className="eyebrow">Category Distribution</p>
            <h3 className="h-display h3" style={{ margin: "0.25rem 0 1.5rem" }}>
              EXPENSES BY CATEGORY
            </h3>

            <div className="budget-cat-list">
              {CATEGORY_KEYS.map((cat) => {
                const cost = cat.key === "activities" ? totalActivitiesCost : categoryCosts[cat.key] || 0;
                const pct = grandTotal > 0 ? Math.round((cost / grandTotal) * 100) : 0;

                return (
                  <div key={cat.key} className="budget-cat-row">
                    <div className="budget-cat-info">
                      <span>
                        {cat.icon} <strong>{cat.label}</strong>
                      </span>
                      <span className="numeral">
                        ${cost.toLocaleString()} ({pct}%)
                      </span>
                    </div>
                    <div className="budget-bar-track">
                      <div
                        className="budget-bar-fill"
                        style={{ width: `${pct}%`, background: cat.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Spend by City */}
          <div className="budget-card ticket">
            <p className="eyebrow">Destination Spend</p>
            <h3 className="h-display h3" style={{ margin: "0.25rem 0 1.5rem" }}>
              ACTIVITIES BY CITY
            </h3>

            <div className="budget-cat-list">
              {cityRows.map(([cityId, total]) => (
                <div key={cityId} className="budget-cat-row">
                  <div className="budget-cat-info">
                    <span style={{ fontWeight: 800 }}>{cityName(cityId)}</span>
                    <span className="numeral">${total.toLocaleString()}</span>
                  </div>
                  <div className="budget-bar-track">
                    <div
                      className="budget-bar-fill"
                      style={{ width: `${(total / maxCity) * 100}%`, background: "var(--ink)" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Day-by-day spend table with daily overbudget alert tags */}
        <div className="budget-card ticket" style={{ marginTop: "2rem" }}>
          <p className="eyebrow">Daily Schedule Spend</p>
          <h3 className="h-display h3" style={{ margin: "0.25rem 0 1.5rem" }}>
            DAY-BY-DAY COST LOG
          </h3>

          <table className="budget-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Date</th>
                <th>Destination</th>
                <th>Activities Planned</th>
                <th>Activity Cost</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {dayTotals.map((d, i) => {
                const isDayHeavy = d.total > dailyTargetBudget * 0.8;
                return (
                  <tr key={d.date}>
                    <td className="numeral">{String(i + 1).padStart(2, "0")}</td>
                    <td className="kicker grey-text">{d.date}</td>
                    <td style={{ fontWeight: 700 }}>{cityName(d.cityId)}</td>
                    <td className="grey-text">{d.activities.length} activities</td>
                    <td className="numeral" style={{ fontWeight: 800 }}>
                      ${d.total.toLocaleString()}
                    </td>
                    <td>
                      {isDayHeavy ? (
                        <span className="budget-tag--heavy">High Spend</span>
                      ) : (
                        <span className="budget-tag--normal">On Track</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function cityName(id) {
  return CITIES.find((c) => c.id === id)?.name || "Unassigned";
}
