import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import Field from "../components/Field";
import { FlightPath } from "../components/Loader";
import "./AuthSplit.css";

const STATS = [
  "14,200 TRIPS PLANNED THIS WEEK",
  "312 CITIES IN THE CATALOG",
  "9 AVG DAYS PER ITINERARY",
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [statIdx, setStatIdx] = useState(0);
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  useState(() => {
    const t = setInterval(() => setStatIdx((i) => (i + 1) % STATS.length), 3200);
    return () => clearInterval(t);
  });

  function validate() {
    const next = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (form.password.length < 6) next.password = "Password must be at least 6 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;
    setLoading(true);
    try {
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDemoLogin() {
    setApiError("");
    setLoading(true);
    try {
      await login({ email: "demo@globetrotter.app", password: "demo1234" });
      navigate("/dashboard");
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-split">
      <div className="auth-split__brand">
        <p className="h-display h1" style={{ color: "var(--paper)" }}>
          WHERE TO
          <br />
          NEXT?
        </p>
        <FlightPath />
        <p className="kicker auth-split__stat" style={{ color: "var(--paper)" }} key={statIdx}>
          {STATS[statIdx]}
        </p>
      </div>

      <div className="auth-split__form-panel">
        <Link to="/" className="gt-nav__mark" style={{ marginBottom: "3rem" }}>
          <span className="gt-nav__mark-box" />
          GLOBETROTTER
        </Link>

        <p className="eyebrow">Welcome back</p>
        <h1 className="h-display h2" style={{ margin: "0.4rem 0 2rem" }}>
          Log in
        </h1>

        {apiError && <div className="auth-split__banner">{apiError}</div>}

        <form onSubmit={handleSubmit} className="auth-split__form" noValidate>
          <Field
            label="Email"
            type="email"
            placeholder="demo@globetrotter.app"
            value={form.email || ""}
            error={errors.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            autoComplete="email"
          />
          <Field
            label="Password"
            type={showPw ? "text" : "password"}
            placeholder="••••••••"
            value={form.password || ""}
            error={errors.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            autoComplete="current-password"
            rightSlot={
              <button
                type="button"
                className="gt-field__icon-btn"
                onClick={() => setShowPw((s) => !s)}
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? "HIDE" : "SHOW"}
              </button>
            }
          />
          <div className="auth-split__forgot">
            <Button as="a" href="#" variant="ghost" magnetic={false}>
              Forgot password?
            </Button>
          </div>
          <Button type="submit" variant="black" loading={loading} className="auth-split__submit">
            Enter
          </Button>

          <Button
            type="button"
            variant="orange"
            onClick={handleDemoLogin}
            loading={loading}
            style={{ marginTop: "0.75rem", width: "100%" }}
          >
            ⚡ Quick Demo Login
          </Button>
        </form>

        <p className="body-text auth-split__switch">
          New to GlobeTrotter? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
