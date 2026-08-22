import { clearToken, getToken, setToken } from "./apiClient";

const USER_KEY = "gt_user";
const USERS_LIST_KEY = "gt_registered_users";

const DEFAULT_USER = {
  id: "user-demo-1",
  name: "Demo Traveler",
  email: "demo@globetrotter.app",
  city: "Lisbon",
  language: "English",
  unit: "metric",
  currency: "USD",
  defaultVisibility: "private",
  avatar: null,
  savedCities: ["kyoto", "reykjavik"],
  role: "admin",
};

/** Shape used for every newly created account. */
function blankProfile({ id, name, email }) {
  return {
    id,
    name,
    email,
    city: "",
    language: "English",
    unit: "metric",
    currency: "USD",
    defaultVisibility: "private",
    avatar: null,
    savedCities: [],
    role: "traveler",
  };
}

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

function simulateDelay(ms = 200) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function register({ name, email, password }) {
  await simulateDelay(250);
  const normalizedEmail = (email || "").toLowerCase().trim();
  const users = getStoredUsers();

  let existing = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    // If user already exists in demo storage, update the name and log them in
    existing.name = name || existing.name;
    saveStoredUsers(users);
  } else {
    existing = blankProfile({
      id: "user-" + Date.now(),
      name: name || "Traveler",
      email: normalizedEmail,
    });
    users.push(existing);
    saveStoredUsers(users);
  }

  const token = "mock-jwt-token-" + Date.now();
  setToken(token);
  localStorage.setItem(USER_KEY, JSON.stringify(existing));
  return { token, user: existing };
}

export async function login({ email, password }) {
  await simulateDelay(200);
  const normalizedEmail = (email || "").toLowerCase().trim();
  const users = getStoredUsers();

  let user = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (!user) {
    // For convenience in mock mode, create the user on login if not found
    const namePart = normalizedEmail.split("@")[0];
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    user = blankProfile({
      id: "user-" + Date.now(),
      name: formattedName || "Demo Traveler",
      email: normalizedEmail,
    });
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

/**
 * Toggles a city in the user's saved-destinations list.
 * Returns the updated user so callers can sync context in one round trip.
 */
export async function toggleSavedCity(cityId) {
  await simulateDelay(120);
  const user = await getSession();
  if (!user) throw new Error("Not signed in");
  const saved = user.savedCities || [];
  const next = saved.includes(cityId)
    ? saved.filter((c) => c !== cityId)
    : [...saved, cityId];
  return updateProfile(user.id, { savedCities: next });
}

/**
 * Password reset request.
 * TODO (production): POST /auth/forgot-password so the backend can mint a
 * single-use token and send the email. Never reveal whether an address exists.
 */
export async function requestPasswordReset(email) {
  await simulateDelay(600);
  const normalizedEmail = (email || "").toLowerCase().trim();
  if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
    throw new Error("Enter a valid email address.");
  }
  return {
    message:
      "If an account exists for that address, a reset link is on its way. Check your inbox and spam folder.",
  };
}

/**
 * Changes the password for the signed-in user.
 * TODO (production): POST /auth/change-password — the current password must be
 * verified server-side against the stored hash, never in the client.
 */
export async function changePassword({ currentPassword, newPassword }) {
  await simulateDelay(400);
  if (!currentPassword) throw new Error("Enter your current password.");
  if ((newPassword || "").length < 6) {
    throw new Error("New password must be at least 6 characters.");
  }
  if (currentPassword === newPassword) {
    throw new Error("Choose a password you haven't used before.");
  }
  return { message: "Password updated." };
}

/** Permanently removes the account and clears the session. */
export async function deleteAccount() {
  await simulateDelay(400);
  const user = await getSession();
  if (user) {
    const remaining = getStoredUsers().filter((u) => u.id !== user.id);
    saveStoredUsers(remaining);
  }
  logoutSession();
  return true;
}

export function logoutSession() {
  clearToken();
  localStorage.removeItem(USER_KEY);
}
