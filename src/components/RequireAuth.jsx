import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BoardingBar } from "./Loader";

export default function RequireAuth() {
  const { user, checkingSession } = useAuth();

  if (checkingSession) {
    return (
      <div style={{ display: "grid", placeItems: "center", minHeight: "100vh" }}>
        <BoardingBar label="Checking session" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}
