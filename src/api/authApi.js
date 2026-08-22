import { clearToken, getToken, setToken } from "./apiClient";

const USER_KEY = "gt_user";
const USERS_LIST_KEY = "gt_registered_users";

const DEFAULT_USER = {
  id: "user-demo-1",
  name: "Demo Traveler",
  email: "demo@globetrotter.app",
  phone: "+1 (555) 382-9901",
  city: "San Francisco",
  country: "United States",
  bio: "Architectural explorer & culinary backpacker. Always planning the next rail journey.",
  avatar: "avatar-1",
  language: "English",
  unit: "metric",
  currency: "USD",
  defaultVisibility: "private",
};

function getStoredUsers() {
  try {
    const raw = localStorage.getItem(USERS_LIST_KEY);
    return raw ? JSON.parse(raw) : [DEFAULT_USER];
  } catch {
    return [DEFAULT_USER];
  }
}

function saveStoredUsers(users) {
  try {
    localStorage.setItem(USERS_LIST_KEY, JSON.stringify(users));
  } catch (err) {
    console.error("Failed to save users", err);
  }
}

function simulateDelay(ms = 150) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function register({ name, email, password }) {
  await simulateDelay(200);
  const normalizedEmail = (email || "").toLowerCase().trim();
  const users = getStoredUsers();

  let existing = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    existing.name = name || existing.name;
    saveStoredUsers(users);
  } else {
    existing = {
      id: "user-" + Date.now(),
      name: name || "Traveler",
      email: normalizedEmail,
      phone: "",
      city: "",
      country: "",
      bio: "GlobeTrotter nomad.",
      avatar: "avatar-1",
      language: "English",
      unit: "metric",
      currency: "USD",
      defaultVisibility: "private",
    };
    users.push(existing);
    saveStoredUsers(users);
  }

  const token = "mock-jwt-token-" + Date.now();
  setToken(token);
  localStorage.setItem(USER_KEY, JSON.stringify(existing));
  return { token, user: existing };
}

export async function login({ email, password }) {
  await simulateDelay(150);
  const normalizedEmail = (email || "").toLowerCase().trim();
  const users = getStoredUsers();

  let user = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (!user) {
    const namePart = normalizedEmail.split("@")[0];
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    user = {
      id: "user-" + Date.now(),
      name: formattedName || "Demo Traveler",
      email: normalizedEmail,
      phone: "+1 (555) 019-2831",
      city: "New York",
      country: "United States",
      bio: "Passionate wanderer & photographer.",
      avatar: "avatar-1",
      language: "English",
      unit: "metric",
      currency: "USD",
      defaultVisibility: "private",
    };
    users.push(user);
    saveStoredUsers(users);
  }

  const token = "mock-jwt-token-" + Date.now();
  setToken(token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return { token, user };
}

export async function getSession() {
  if (!getToken()) return null;
  await simulateDelay(100);
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_USER;
  } catch {
    return DEFAULT_USER;
  }
}

export async function updateProfile(userId, patch) {
  await simulateDelay(150);
  let user = await getSession();
  user = { ...user, ...patch };
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  const users = getStoredUsers();
  const idx = users.findIndex((u) => u.id === user.id || u.email === user.email);
  if (idx >= 0) {
    users[idx] = user;
    saveStoredUsers(users);
  }
  return user;
}

export function logoutSession() {
  clearToken();
  localStorage.removeItem(USER_KEY);
}

export function deleteAccount() {
  clearToken();
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem("gt_trips_data");
  localStorage.removeItem("gt_saved_destinations");
}
