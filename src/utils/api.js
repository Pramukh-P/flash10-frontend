// flash10-frontend/src/utils/api.js
const BASE = import.meta.env.VITE_API_URL || "https://flash10-backend.onrender.com";

export function authHeader(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiFetch(path, options = {}, token = null) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeader(token),
      ...(options.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export const API_BASE = BASE;
