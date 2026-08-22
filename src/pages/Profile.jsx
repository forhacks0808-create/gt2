import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import NavBar from "../components/NavBar";
import Field from "../components/Field";
import Button from "../components/Button";
import "./Profile.css";

const TABS = ["Profile", "Preferences", "Privacy"];

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [tab, setTab] = useState("Profile");
  const [form, setForm] = useState({ name: user.name, email: user.email });
  const [prefs, setPrefs] = useState({
    language: user.language || "English",
    unit: user.unit || "metric",
  });
  const [visibility, setVisibility] = useState(user.defaultVisibility || "private");
  const [status, setStatus] = useState("");

  async function saveField(patch, label) {
    setStatus("Saving…");
    await updateProfile(patch);
    setStatus(`${label} saved`);
    setTimeout(() => setStatus(""), 1800);
  }

  return (
    <div>
      <NavBar />
      <section className="shell container profile">
        <h1 className="h-display h2" style={{ marginBottom: "2rem" }}>
          Settings
        </h1>

        <div className="profile__layout">
          <nav className="profile__nav">
            {TABS.map((t) => (
              <button
                key={t}
                className={`profile__nav-item ${tab === t ? "is-active" : ""}`}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </nav>

          <div className="profile__content">
            {status && <p className="kicker profile__status">{status}</p>}

            {tab === "Profile" && (
              <div className="profile__fields">
                <div className="profile__avatar">
                  <span className="h-display">{user.name[0]}</span>
                </div>
                <Field
                  label="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  onBlur={() => saveField({ name: form.name }, "Name")}
                />
                <Field label="Email" value={form.email} readOnly />
              </div>
            )}

            {tab === "Preferences" && (
              <div className="profile__fields">
                <div className="gt-field">
                  <label className="gt-field__label">Units</label>
                  <div className="profile__segmented">
                    {["metric", "imperial"].map((u) => (
                      <button
                        key={u}
                        className={prefs.unit === u ? "is-active" : ""}
                        onClick={() => {
                          setPrefs({ ...prefs, unit: u });
                          saveField({ unit: u }, "Units");
                        }}
                      >
                        {u === "metric" ? "Metric" : "Imperial"}
                      </button>
                    ))}
                  </div>
                </div>
                <Field
                  label="Language"
                  value={prefs.language}
                  onChange={(e) => setPrefs({ ...prefs, language: e.target.value })}
                  onBlur={() => saveField({ language: prefs.language }, "Language")}
                />
              </div>
            )}

            {tab === "Privacy" && (
              <div className="profile__fields">
                <div className="gt-field">
                  <label className="gt-field__label">Default trip visibility</label>
                  <div className="profile__segmented">
                    {["private", "public"].map((v) => (
                      <button
                        key={v}
                        className={visibility === v ? "is-active" : ""}
                        onClick={() => {
                          setVisibility(v);
                          saveField({ defaultVisibility: v }, "Visibility");
                        }}
                      >
                        {v === "private" ? "Private" : "Public link"}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="body-text grey-text">
                  New trips will use this setting until you share one individually.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
