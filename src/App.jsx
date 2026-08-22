import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { StampProvider } from "./components/Stamp";
import RequireAuth from "./components/RequireAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as tripsApi from "./api/tripsApi";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CitySearch from "./pages/CitySearch";
import CreateTrip from "./pages/CreateTrip";
import ItineraryBuilder from "./pages/ItineraryBuilder";
import ItineraryView from "./pages/ItineraryView";
import TripCalendar from "./pages/TripCalendar";
import MyTrips from "./pages/MyTrips";
import Budget from "./pages/Budget";
import Community from "./pages/Community";
import AdminAnalytics from "./pages/AdminAnalytics";
import Profile from "./pages/Profile";
import SharedTrip from "./pages/SharedTrip";

/** Completes a copy-trip handoff if the person registered from a shared link. */
function PendingCopyHandler() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const pending = sessionStorage.getItem("gt_pending_copy");
    if (pending && user) {
      sessionStorage.removeItem("gt_pending_copy");
      tripsApi.copyTrip(pending, user.id).then((copy) => {
        navigate(`/trips/${copy.id}`, { replace: true });
      });
    }
  }, [user, navigate]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <StampProvider>
          <PendingCopyHandler />
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/shared/:shareId" element={<SharedTrip />} />

            <Route element={<RequireAuth />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/cities" element={<CitySearch />} />
              <Route path="/trips" element={<MyTrips />} />
              <Route path="/trips/new" element={<CreateTrip />} />
              <Route path="/trips/:tripId" element={<ItineraryView />} />
              <Route path="/trips/:tripId/build" element={<ItineraryBuilder />} />
              <Route path="/trips/:tripId/calendar" element={<TripCalendar />} />
              <Route path="/trips/:tripId/budget" element={<Budget />} />
              <Route path="/community" element={<Community />} />
              <Route path="/admin" element={<AdminAnalytics />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </StampProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
