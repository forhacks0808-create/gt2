import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import Field from "../components/Field";
import "./AuthSplit.css";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  function validate() {
    const next = {};
    if (form.name.trim().length < 2) next.name = "Enter your full name.";
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
      await register(form);
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
          PACK LIGHT.
          <br />
          DREAM BIG.
        </p>
        <p className="body-text" style={{ color: "#d8d6d0", maxWidth: 380 }}>
          One place to plan cities, days, and budget — then hand your friends
          a single link instead of a spreadsheet.
        </p>
      </div>

      <div className="auth-split__form-panel">
        <Link to="/" className="gt-nav__mark" style={{ marginBottom: "3rem" }}>
          <span className="gt-nav__mark-box" />
          GLOBETROTTER
        </Link>

        <p className="eyebrow">Get started</p>
        <h1 className="h-display h2" style={{ margin: "0.4rem 0 2rem" }}>
          Create account
        </h1>

        {apiError && <div className="auth-split__banner">{apiError}</div>}

        <form onSubmit={handleSubmit} className="auth-split__form" noValidate>
          <Field
            label="Full name"
            value={form.name}
            error={errors.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            autoComplete="name"
          />
          <Field
            label="Email"
            type="email"
            value={form.email}
            error={errors.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            autoComplete="email"
          />
          <Field
            label="Password"
            type="password"
            value={form.password}
            error={errors.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            autoComplete="new-password"
          />
          <Button type="submit" variant="orange" loading={loading} className="auth-split__submit">
            Create account
          </Button>
        </form>

        <p className="body-text auth-split__switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
