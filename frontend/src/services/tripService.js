// Trip Management - API calls (plain fetch, no axios dependency)
const API_ROOT = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
const BASE_URL = `${API_ROOT}/api/trips`;

async function request(path = "", options = {}) {
  // Extract token from the stored 'aquasafari_auth' JSON object
  let token = null;
  try {
    const authData = JSON.parse(localStorage.getItem("aquasafari_auth"));
    token = authData?.token;
  } catch (e) {
    // Fallback if it's stored differently
    token = localStorage.getItem("token");
  }

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
  });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const error = new Error(data?.message ?? "The server could not complete that request");
    error.status = res.status;
    error.conflicts = data?.conflicts ?? [];
    throw error;
  }
  return data;
}

/* ------------------------------- trips ------------------------------- */

export const getTrips = () => request();

export const getAvailableTrips = ({ route = "", date = "" } = {}) => {
  const params = new URLSearchParams();
  if (route) params.set("route", route);
  if (date) params.set("date", date);
  const query = params.toString();
  return request(`/available${query ? `?${query}` : ""}`);
};

export const getTrip = (id) => request(`/${id}`);

export const createTrip = (trip) => request("", { method: "POST", body: JSON.stringify(trip) });

export const updateTrip = (id, trip) => request(`/${id}`, { method: "PUT", body: JSON.stringify(trip) });

export const assignResources = (id, resources) =>
  request(`/${id}/assign`, { method: "PUT", body: JSON.stringify(resources) });

export const deleteTrip = (id) => request(`/${id}`, { method: "DELETE" });

export const checkConflicts = (trip, ignoreTripId) =>
  request(`/check-conflicts${ignoreTripId ? `?ignoreTripId=${ignoreTripId}` : ""}`, {
    method: "POST",
    body: JSON.stringify(trip),
  });

/* --------------------- boats, operators, guides --------------------- */

export const getBoats = () => request("/resources/boats");
export const getOperators = () => request("/resources/operators");
export const getGuides = () => request("/resources/guides");

/** Loads all three lists at once for the trip form and assign screen. */
export const getResources = async () => {
  const [boats, operators, guides] = await Promise.all([getBoats(), getOperators(), getGuides()]);
  return { boats, operators, guides };
};

/* ---------------------------- formatters ---------------------------- */

export const formatTime = (time) => (time ? String(time).slice(0, 5) : "--:--");

export const formatPrice = (value) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 2,
  }).format(Number(value ?? 0));

export const nameFor = (list, id) => list.find((item) => item.id === id)?.label ?? `#${id}`;

export const isUpcoming = (tripDate) => {
  const today = new Date().toISOString().slice(0, 10);
  return tripDate >= today;
};