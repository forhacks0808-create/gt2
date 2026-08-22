/**
 * TODO (production): replace every function in this file with real calls to
 * your JWT backend, e.g.:
 *
 *   POST /api/auth/register   { name, email, password } -> { token, user }
 *   POST /api/auth/login      { email, password }        -> { token, user }
 *   GET  /api/users/me        (Authorization: Bearer <token>) -> user
 *   PATCH /api/users/me       { ...fields }               -> user
 *
 * The shapes returned below already match that contract so swapping the
 * implementation is a drop-in change — nothing in AuthContext.jsx or any
 * page needs to change.
 *
 * Storage note: this demo persists to localStorage because it has no real
 * backend to talk to. That's fine here (this is a real standalone app the
 * user runs on their own machine, not a Claude.ai artifact) — but it means
 * "users" are local to whoever's browser is running the app. Swap for real
 * HTTP calls before deploying multi-user.
 */

import { clearToken, getToken, request, setToken } from "./apiClient";

export async function register({ name, email, password }) {
  const result = await request("/api/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) });
  setToken(result.token);
  return result;
}

export async function login({ email, password }) {
  const result = await request("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
  setToken(result.token);
  return result;
}

export async function getSession() {
  if (!getToken()) return null;
  try { return await request("/api/users/me"); }
  catch { clearToken(); return null; }
}

export async function updateProfile(userId, patch) {
  return request("/api/users/me", { method: "PATCH", body: JSON.stringify(patch) });
}

export function logoutSession() {
  clearToken();
}
