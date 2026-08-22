import { useState } from "react";
import { CITIES } from "../data/cities";
import "./CalendarView.css";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const WEEK_DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default function CalendarView({ trip, onAddActivity, onRemoveActivity }) {
  const [viewMode, setViewMode] = useState("calendar"); // "calendar" | "timeline"
  const [selectedDate, setSelectedDate] = useState(trip?.days?.[0]?.date || null);

  const start = trip ? new Date(trip.startDate) : new Date();
  const [currentMonth, setCurrentMonth] = useState(start.getMonth());
  const [currentYear, setCurrentYear] = useState(start.getFullYear());

  if (!trip) return null;

  // Build days in month
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const calendarCells = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push({ empty: true, key: `empty-${i}` });
  }

  for (let d = 1; d <= totalDaysInMonth; d++) {
    const monthStr = String(currentMonth + 1).padStart(2, "0");
    const dayStr = String(d).padStart(2, "0");
    const dateKey = `${currentYear}-${monthStr}-${dayStr}`;

    const tripDay = trip.days.find((day) => day.date === dateKey);
    calendarCells.push({
      empty: false,
      dayNum: d,
      dateKey,
      tripDay,
      isStart: trip.startDate === dateKey,
      isEnd: trip.endDate === dateKey,
    });
  }

  function handlePrevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  }

  function handleNextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  }

  const selectedDayData = trip.days.find((d) => d.date === selectedDate);
  const selectedCityName = CITIES.find((c) => c.id === selectedDayData?.cityId)?.name || selectedDayData?.cityId || "Travel Day";

  return (
    <div className="cal-view-wrap">
      <div className="cal-view-toolbar">
        <div className="cal-view-mode-toggle">
          <button
            className={`cal-mode-btn ${viewMode === "calendar" ? "is-active" : ""}`}
            onClick={() => setViewMode("calendar")}
          >
            📅 Month Grid
          </button>
          <button
            className={`cal-mode-btn ${viewMode === "timeline" ? "is-active" : ""}`}
            onClick={() => setViewMode("timeline")}
          >
            ⏱️ Vertical Timeline
          </button>
        </div>

        {viewMode === "calendar" && (
          <div className="cal-nav-controls">
            <button className="cal-arrow-btn" onClick={handlePrevMonth} aria-label="Previous Month">
              ←
            </button>
            <span className="h-display" style={{ fontSize: "1.1rem" }}>
              {MONTH_NAMES[currentMonth]} {currentYear}
            </span>
            <button className="cal-arrow-btn" onClick={handleNextMonth} aria-label="Next Month">
              →
            </button>
          </div>
        )}
      </div>

      {viewMode === "calendar" ? (
        <div className="cal-grid-layout">
          {/* Calendar Grid */}
          <div className="cal-matrix-card ticket">
            <div className="cal-weekdays">
              {WEEK_DAYS.map((wd) => (
                <div key={wd} className="cal-weekday-label">
                  {wd}
                </div>
              ))}
            </div>

            <div className="cal-days-grid">
              {calendarCells.map((cell) => {
                if (cell.empty) {
                  return <div key={cell.key} className="cal-cell cal-cell--empty" />;
                }

                const isSelected = selectedDate === cell.dateKey;
                const hasTrip = Boolean(cell.tripDay);

                return (
                  <div
                    key={cell.dateKey}
                    onClick={() => hasTrip && setSelectedDate(cell.dateKey)}
                    className={`cal-cell ${hasTrip ? "cal-cell--trip" : ""} ${
                      isSelected ? "cal-cell--selected" : ""
                    } ${cell.isStart ? "cal-cell--start" : ""} ${
                      cell.isEnd ? "cal-cell--end" : ""
                    }`}
                  >
                    <span className="cal-day-number">{cell.dayNum}</span>
                    {hasTrip && (
                      <div className="cal-day-chip">
                        <span className="cal-city-tag">
                          {CITIES.find((c) => c.id === cell.tripDay.cityId)?.name?.slice(0, 4) || "Day"}
                        </span>
                        {cell.tripDay.activities?.length > 0 && (
                          <span className="cal-act-dot-count">
                            {cell.tripDay.activities.length} act
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Day Sidebar */}
          <div className="cal-day-detail-panel ticket">
            {selectedDayData ? (
              <div>
                <div className="cal-detail-head">
                  <div>
                    <p className="kicker">Day Overview</p>
                    <h3 className="h-display h3">{selectedCityName}</h3>
                    <p className="kicker grey-text">{selectedDate}</p>
                  </div>
                </div>

                <hr className="hairline" style={{ margin: "1rem 0" }} />

                <div className="cal-activities-list">
                  <p className="eyebrow">Planned Schedule</p>
                  {selectedDayData.activities?.length === 0 ? (
                    <p className="body-text grey-text" style={{ fontSize: "0.9rem" }}>
                      No activities planned for this day yet.
                    </p>
                  ) : (
                    selectedDayData.activities.map((act) => (
                      <div key={act.id} className="cal-act-item">
                        <div className="cal-act-time-badge">{act.time || "09:00"}</div>
                        <div className="cal-act-info">
                          <span className="cal-act-name">{act.name}</span>
                          <div className="cal-act-sub">
                            {act.category && <span className="cal-category-pill">{act.category}</span>}
                            <span className="numeral">${act.cost}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="cal-empty-select">
                <p className="h-display" style={{ fontSize: "1.1rem" }}>
                  Select a highlighted day
                </p>
                <p className="body-text grey-text" style={{ fontSize: "0.85rem" }}>
                  Click on any active trip date on the calendar to view its schedule and stops.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Vertical Timeline View */
        <div className="cal-timeline-layout">
          {trip.days.map((d, index) => {
            const city = CITIES.find((c) => c.id === d.cityId);
            const dayCost = d.activities.reduce((s, a) => s + (Number(a.cost) || 0), 0);

            return (
              <div key={d.date} className="cal-timeline-node">
                <div className="cal-timeline-rail">
                  <div className="cal-timeline-dot">{index + 1}</div>
                  {index < trip.days.length - 1 && <div className="cal-timeline-line" />}
                </div>

                <div className="cal-timeline-content ticket">
                  <div className="cal-timeline-header">
                    <div>
                      <span className="kicker grey-text">{d.date}</span>
                      <h3 className="h-display h3">{city?.name || d.cityId || "Day " + (index + 1)}</h3>
                    </div>
                    <div className="cal-timeline-spend">
                      <span className="kicker">Estimated Spend</span>
                      <span className="numeral" style={{ fontSize: "1.2rem", color: "var(--orange)" }}>
                        ${dayCost.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="cal-timeline-acts">
                    {d.activities?.map((a) => (
                      <div key={a.id} className="cal-timeline-act-card">
                        <span className="cal-act-time-badge">{a.time || "Scheduled"}</span>
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: 0, fontWeight: 700 }}>{a.name}</p>
                          {a.notes && <p className="grey-text" style={{ margin: "2px 0 0", fontSize: "0.85rem" }}>{a.notes}</p>}
                        </div>
                        <span className="numeral">${a.cost}</span>
                      </div>
                    ))}
                    {d.activities.length === 0 && (
                      <p className="grey-text" style={{ fontSize: "0.88rem", margin: 0 }}>
                        Free exploration / travel day
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
