import { createContext, useContext, useEffect, useState } from "react";
import * as authApi from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    authApi
      .getSession()
      .then(setUser)
      .finally(() => setCheckingSession(false));
  }, []);

  async function login(credentials) {
    const { user: u } = await authApi.login(credentials);
    setUser(u);
    return u;
  }

  async function register(details) {
    const { user: u } = await authApi.register(details);
    setUser(u);
    return u;
  }

  function logout() {
    authApi.logoutSession();
    setUser(null);
  }

  async function updateProfile(patch) {
    const updated = await authApi.updateProfile(user.id, patch);
    setUser(updated);
    return updated;
  }

  async function toggleSavedCity(cityId) {
    const updated = await authApi.toggleSavedCity(cityId);
    setUser(updated);
    return updated;
  }

  async function deleteAccount() {
    await authApi.deleteAccount();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        checkingSession,
        login,
        register,
        logout,
        updateProfile,
        toggleSavedCity,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
