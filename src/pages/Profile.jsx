import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import * as tripsApi from "../api/tripsApi";
import { CITIES } from "../data/cities";
import NavBar from "../components/NavBar";
import Field from "../components/Field";
import Button from "../components/Button";
import { ImagePlaceholder } from "../components/Loader";
import { useStamp } from "../components/Stamp";
import "./Profile.css";

const TABS = ["Profile", "Saved Destinations", "Preferences", "Privacy"];

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const stamp = useStamp();

  const [tab, setTab] = useState("Profile");
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "+1 (555) 382-9901",
    city: user?.city || "San Francisco",
    country: user?.country || "United States",
    bio: user?.bio || "Architectural explorer & culinary backpacker. Always planning the next rail journey.",
  });

  const [prefs, setPrefs] = useState({
    language: user?.language || "English",
    unit: user?.unit || "metric",
    currency: user?.currency || "USD",
  });

  const [visibility, setVisibility] = useState(user?.defaultVisibility || "private");
  const [savedCityIds, setSavedCityIds] = useState([]);
  const [trips, setTrips] = useState([]);
  const [status, setStatus] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    tripsApi
      .getSavedDestinations()
      .then((d) => setSavedCityIds(Array.isArray(d) ? d : []))
      .catch(() => setSavedCityIds([]));

    if (user?.id) {
      tripsApi
        .listTrips(user.id)
        .then((t) => setTrips(Array.isArray(t) ? t : []))
        .catch(() => setTrips([]));
    }
  }, [user?.id]);

  async function saveField(patch, label) {
    setStatus("Saving…");
    await updateProfile(patch);
    setStatus(`${label} saved`);
    setTimeout(() => setStatus(""), 1800);
  }

  function handleRemoveSaved(cityId) {
    const next = tripsApi.toggleSaveDestination(cityId);
    setSavedCityIds(next);
    stamp("Removed from bookmarks");
  }

  function handleDeleteAccount() {
    logout();
    navigate("/login");
  }

  const savedCitiesList = CITIES.filter((c) => savedCityIds.includes(c.id));
  const totalTrips = trips.length;
  const totalCities = new Set(trips.flatMap((t) => t.cities)).size;
  const totalDays = trips.reduce((s, t) => s + (t.days?.length || 0), 0);

  return (
    <div>
      <NavBar />
      <section className="shell container profile">
        {/* Profile Header & Stats */}
        <div className="profile-header ticket">
          <div className="profile-header__left">
            <div className="profile-avatar-circle">
              <span className="h-display">{user?.name ? user.name[0].toUpperCase() : "T"}</span>
            </div>
            <div>
              <p className="eyebrow on-orange">Passport Holder</p>
              <h1 className="h-display h2" style={{ margin: "0.2rem 0" }}>
                {user?.name}
              </h1>
              <p className="kicker grey-text">
                {form.city ? `${form.city}, ${form.country}` : "Global Traveler"} · {user?.email}
              </p>
            </div>
          </div>

          <div className="profile-stats-grid">
            <div className="profile-stat-box">
              <span className="eyebrow">Expeditions</span>
              <span className="numeral h-display h3">{totalTrips}</span>
            </div>
            <div className="profile-stat-box">
              <span className="eyebrow">Cities Explored</span>
              <span className="numeral h-display h3">{totalCities}</span>
            </div>
            <div className="profile-stat-box">
              <span className="eyebrow">Days on Road</span>
              <span className="numeral h-display h3">{totalDays}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="profile__layout">
          <nav className="profile__nav">
            {TABS.map((t) => (
              <button
                key={t}
                className={`profile__nav-item ${tab === t ? "is-active" : ""}`}
                onClick={() => setTab(t)}
              >
                {t}
                {t === "Saved Destinations" && (
                  <span className="profile-tab-badge">{savedCityIds.length}</span>
                )}
              </button>
            ))}
          </nav>

          <div className="profile__content">
            {status && <p className="kicker profile__status">{status}</p>}

            {/* Tab 1: Profile Details */}
            {tab === "Profile" && (
              <div className="profile__fields">
                <h3 className="h-display h3">Personal Information</h3>
                <p className="body-text grey-text" style={{ margin: "0.25rem 0 1.5rem" }}>
                  Update your contact info and traveler bio. Changes auto-save on blur.
                </p>

                <div className="profile-form-grid">
                  <Field
                    label="Full Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    onBlur={() => saveField({ name: form.name }, "Name")}
                  />
                  <Field label="Email Address" value={form.email} readOnly />
                  <Field
                    label="Phone Number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    onBlur={() => saveField({ phone: form.phone }, "Phone")}
                  />
                  <Field
                    label="Current City"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    onBlur={() => saveField({ city: form.city }, "City")}
                  />
                  <Field
                    label="Country"
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    onBlur={() => saveField({ country: form.country }, "Country")}
                  />
                </div>

                <div className="gt-field" style={{ marginTop: "1rem" }}>
                  <label className="gt-field__label">Traveler Bio</label>
                  <textarea
                    className="gt-field__input"
                    rows={3}
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    onBlur={() => saveField({ bio: form.bio }, "Bio")}
                  />
                </div>
              </div>
            )}

            {/* Tab 2: Saved Destinations */}
            {tab === "Saved Destinations" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.5rem" }}>
                  <div>
                    <h3 className="h-display h3">Bookmarked Destinations</h3>
                    <p className="body-text grey-text">Cities saved for your upcoming journeys.</p>
                  </div>
                  <Button as={Link} to="/cities" variant="outline">
                    + Explore More
                  </Button>
                </div>

                {savedCitiesList.length === 0 ? (
                  <div className="profile-empty-saved ticket">
                    <p className="h-display" style={{ fontSize: "1.1rem" }}>No bookmarked destinations yet</p>
                    <p className="body-text grey-text">Explore the world catalog and bookmark cities you want to visit.</p>
                  </div>
                ) : (
                  <div className="profile-saved-grid">
                    {savedCitiesList.map((city) => (
                      <div key={city.id} className="profile-saved-card ticket">
                        <div className="profile-saved-img">
                          <ImagePlaceholder label={city.name} />
                        </div>
                        <div className="profile-saved-body">
                          <div>
                            <span className="kicker grey-text">{city.country} · {city.region}</span>
                            <h4 className="h-display h3" style={{ fontSize: "1.2rem", margin: "2px 0" }}>
                              {city.name}
                            </h4>
                          </div>
                          <div className="profile-saved-actions">
                            <Button
                              as={Link}
                              to={`/trips/new?city=${city.id}`}
                              variant="orange"
                              style={{ fontSize: "0.75rem", padding: "4px 8px" }}
                            >
                              Plan Trip
                            </Button>
                            <button
                              className="profile-remove-btn"
                              onClick={() => handleRemoveSaved(city.id)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Preferences */}
            {tab === "Preferences" && (
              <div className="profile__fields">
                <h3 className="h-display h3">App Preferences</h3>

                <div className="gt-field" style={{ marginTop: "1rem" }}>
                  <label className="gt-field__label">Measurement Units</label>
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
                        {u === "metric" ? "Metric (km, °C)" : "Imperial (miles, °F)"}
                      </button>
                    ))}
                  </div>
                </div>

                <Field
                  label="Preferred Language"
                  value={prefs.language}
                  onChange={(e) => setPrefs({ ...prefs, language: e.target.value })}
                  onBlur={() => saveField({ language: prefs.language }, "Language")}
                />

                <div className="gt-field">
                  <label className="gt-field__label">Default Currency</label>
                  <select
                    className="gt-field__input"
                    value={prefs.currency}
                    onChange={(e) => {
                      setPrefs({ ...prefs, currency: e.target.value });
                      saveField({ currency: e.target.value }, "Currency");
                    }}
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="JPY">JPY (¥)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Tab 4: Privacy & Danger Zone */}
            {tab === "Privacy" && (
              <div className="profile__fields">
                <h3 className="h-display h3">Privacy Settings</h3>

                <div className="gt-field" style={{ marginTop: "1rem" }}>
                  <label className="gt-field__label">Default Trip Visibility</label>
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
                        {v === "private" ? "Private (Only You)" : "Public (Shareable Link)"}
                      </button>
                    ))}
                  </div>
                  <p className="body-text grey-text" style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>
                    New trips will use this default until individual settings are toggled.
                  </p>
                </div>

                <hr className="hairline" style={{ margin: "2rem 0" }} />

                <div className="profile-danger-zone ticket">
                  <div>
                    <h4 className="h-display" style={{ color: "#991b1b", fontSize: "1.1rem" }}>
                      DANGER ZONE: DELETE ACCOUNT
                    </h4>
                    <p className="body-text" style={{ fontSize: "0.85rem", margin: "4px 0 0" }}>
                      Permanently wipe all your travel data, itineraries, custom stops, and preferences.
                    </p>
                  </div>
                  <Button variant="orange" onClick={() => setShowDeleteModal(true)}>
                    Delete Account
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="profile-modal-backdrop" role="dialog" aria-modal="true">
          <div className="profile-modal ticket">
            <p className="h-display h3" style={{ color: "#991b1b" }}>PERMANENT ACCOUNT DELETION</p>
            <p className="body-text">
              Are you sure you want to delete your GlobeTrotter account? All your planned trips, saved bookmarks, and custom notes will be erased.
            </p>
            <div className="profile-modal-actions">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button variant="orange" onClick={handleDeleteAccount}>
                Confirm Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
