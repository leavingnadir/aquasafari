/**
 * Feedback Management API client.
 *
 * Plain fetch, no axios, so this module adds nothing to package.json that the other
 * five modules have to merge. Set VITE_API_BASE_URL in frontend/.env to point at a
 * different backend; it falls back to the shared localhost:8080.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
const FEEDBACK_URL = `${BASE_URL}/api/feedback`;

/** Error carrying the backend's message plus per-field messages when validation failed. */
export class ApiError extends Error {
  constructor(message, { status, fieldErrors, flaggedWords } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors ?? {};
    this.flaggedWords = flaggedWords ?? [];
  }
}

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${FEEDBACK_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new ApiError("Can't reach the server. Check that the backend is running on port 8080.");
  }

  if (response.status === 204) return null;

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(body?.message ?? "Something went wrong. Try again.", {
      status: response.status,
      fieldErrors: body?.fieldErrors,
      flaggedWords: body?.flaggedWords,
    });
  }
  return body;
}

function query(params) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") search.append(key, value);
  });
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export const feedbackApi = {
  /** Completed trip history, each row flagged reviewable or not. */
  reviewableTrips: (customerId) => request(`/reviewable/${customerId}`),

  submit: ({ bookingId, customerId, rating, comment }) =>
    request("", {
      method: "POST",
      body: JSON.stringify({ bookingId, customerId, rating, comment }),
    }),

  update: (feedbackId, { customerId, rating, comment }) =>
    request(`/${feedbackId}`, {
      method: "PUT",
      body: JSON.stringify({ customerId, rating, comment }),
    }),

  /** Pass customerId to delete your own review; omit it for an administrator delete. */
  remove: (feedbackId, customerId) =>
    request(`/${feedbackId}${query({ customerId })}`, { method: "DELETE" }),

  getOne: (feedbackId) => request(`/${feedbackId}`),

  byCustomer: (customerId) => request(`/customer/${customerId}`),

  byTrip: (tripId) => request(`/trip/${tripId}`),

  tripSummary: (tripId) => request(`/trip/${tripId}/summary`),

  /** Admin list. All filters optional: { tripId, customerId, minRating, search }. */
  search: (filters = {}) => request(query(filters)),
};

export default feedbackApi;
