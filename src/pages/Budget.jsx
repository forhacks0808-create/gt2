import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import * as tripsApi from "../api/tripsApi";
import { CITIES } from "../data/cities";
import NavBar from "../components/NavBar";
import Button from "../components/Button";
import { BoardingBar } from "../components/Loader";
import "./Budget.css";

export default function Budget() {
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
          <BoardingBar label="Loading budget" />
        </div>
      </div>
    );
  }

  const dayTotals = trip.days.map((d) => ({
    ...d,
    total: d.activities.reduce((s, a) => s + (Number(a.cost) || 0), 0),
  }));
  const grandTotal = dayTotals.reduce((s, d) => s + d.total, 0);
  const maxDay = Math.max(1, ...dayTotals.map((d) => d.total));

  const byCity = {};
  dayTotals.forEach((d) => {
    byCity[d.cityId] = (byCity[d.cityId] || 0) + d.total;
  });
  const cityRows = Object.entries(byCity).sort((a, b) => b[1] - a[1]);
  const maxCity = Math.max(1, ...cityRows.map(([, v]) => v));

  return (
    <div>
      <NavBar />
      <section className="shell container budget">
        <p className="kicker">{trip.name} · Budget Report</p>
        <h1 className="h-display h1">${grandTotal.toLocaleString()}</h1>

        <div className="budget__section">
          <p className="eyebrow">By city</p>
          <div className="budget__bars">
            {cityRows.map(([cityId, total]) => (
              <div key={cityId} className="budget__bar-row">
                <span className="kicker budget__bar-label">{cityName(cityId)}</span>
                <div className="budget__bar-track">
                  <div
                    className="budget__bar-fill"
                    style={{ width: `${(total / maxCity) * 100}%` }}
                  />
                </div>
                <span className="numeral">${total.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="budget__section">
          <p className="eyebrow">By day</p>
          <table className="budget__table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Date</th>
                <th>City</th>
                <th>Spend</th>
              </tr>
            </thead>
            <tbody>
              {dayTotals.map((d, i) => (
                <tr key={d.date}>
                  <td className="numeral">{String(i + 1).padStart(2, "0")}</td>
                  <td className="kicker grey-text">{d.date}</td>
                  <td>{cityName(d.cityId)}</td>
                  <td className="numeral">
                    <span
                      className="budget__inline-bar"
                      style={{ width: `${(d.total / maxDay) * 60}px` }}
                    />
                    ${d.total.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Button as={Link} to={`/trips/${tripId}`} variant="outline" style={{ marginTop: "2rem" }}>
          Back to itinerary
        </Button>
      </section>
    </div>
  );
}

function cityName(id) {
  return CITIES.find((c) => c.id === id)?.name || "Unassigned";
}
