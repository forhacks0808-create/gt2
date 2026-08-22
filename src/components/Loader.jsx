import "./Loader.css";

/** Horizontal boarding-progress bar — used wherever the spec forbids a spinner. */
export function BoardingBar({ label = "Loading" }) {
  return (
    <div className="gt-boarding" role="status" aria-label={label}>
      <div className="gt-boarding__track">
        <div className="gt-boarding__fill" />
      </div>
      <span className="kicker">{label}</span>
    </div>
  );
}

/** Self-drawing dashed flight-path line, used as brand-moment loading state. */
export function FlightPath({ width = 220 }) {
  return (
    <svg
      className="gt-flightpath"
      width={width}
      height="24"
      viewBox={`0 0 ${width} 24`}
      fill="none"
      aria-hidden="true"
    >
      <path
        d={`M2 12 Q ${width / 2} -8, ${width - 2} 12`}
        stroke="var(--orange)"
        strokeWidth="2"
        strokeDasharray="6 6"
        className="gt-flightpath__stroke"
      />
      <circle cx="2" cy="12" r="3" fill="var(--ink)" />
      <circle cx={width - 2} cy="12" r="3" fill="var(--ink)" />
    </svg>
  );
}

export function ImagePlaceholder({ label }) {
  return (
    <div className="gt-image-placeholder">
      {label && <span className="kicker" style={{ color: "var(--paper)" }}>{label}</span>}
    </div>
  );
}
