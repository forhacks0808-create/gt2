import { clearToken, getToken, request, setToken } from "./apiClient";

export async function register({ name, email, password }) {
  const result = await request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
  setToken(result.token);
  return result;
}

export async function login({ email, password }) {
  const result = await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setToken(result.token);
  return result;
}

export async function getSession() {
  if (!getToken()) return null;
  try {
    return await request("/api/users/me");
  } catch {
    clearToken();
    return null;
  }
}

export async function updateProfile(userId, patch) {
  return request("/api/users/me", {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export function logoutSession() {
  clearToken();
}
