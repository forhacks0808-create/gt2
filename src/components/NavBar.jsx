import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./NavBar.css";

const LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/trips", label: "My Trips" },
  { to: "/cities", label: "Explore" },
  { to: "/community", label: "Community" },
  { to: "/admin", label: "Analytics" },
  { to: "/profile", label: "Profile" },
];

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="gt-nav">
      <div className="shell gt-nav__inner">
        <NavLink to="/dashboard" className="gt-nav__mark">
          <span className="gt-nav__mark-box" />
          GLOBETROTTER
        </NavLink>
        <nav className="gt-nav__links">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => `gt-nav__link ${isActive ? "is-active" : ""}`}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="gt-nav__user">
          <NavLink to="/profile" className="gt-nav__avatar-badge" title="Go to Profile">
            {user?.name?.[0]?.toUpperCase() || "T"}
          </NavLink>
          <button
            className="gt-nav__logout"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
