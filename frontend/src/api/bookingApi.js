// API client for the Booking Management module.
// Talks to the Spring Boot backend at localhost:8080 (see BookingController).

const BASE_URL = "http://localhost:8080/api/bookings";

async function handleResponse(response) {
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      message = body.error || body.message || message;
    } catch {
      // response had no JSON body; keep the default message
    }
    throw new Error(message);
  }
  if (response.status === 204) return null;
  return response.json();
}

/**
 * Search Trips. Both params are optional.
 * @param {{route?: string, date?: string}} filters date as YYYY-MM-DD
 */
export async function searchTrips({ route, date } = {}) {
  const params = new URLSearchParams();
  if (route) params.set("route", route);
  if (date) params.set("date", date);

  const response = await fetch(`${BASE_URL}/trips/search?${params.toString()}`);
  return handleResponse(response);
}

export async function getTripAvailability(tripId) {
  const response = await fetch(`${BASE_URL}/trips/${tripId}`);
  return handleResponse(response);
}

/**
 * Book Trip. The authenticated account is assigned as the booking owner.
 * @param {string} token
 * @param {{tripId: number, passengerCount: number}} payload
 */
export async function bookTrip(token, payload) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
}

export async function confirmMyBooking(token, bookingId) {
  const response = await fetch(`${BASE_URL}/mine/${bookingId}/confirm`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
}

export async function cancelMyBooking(token, bookingId) {
  const response = await fetch(`${BASE_URL}/mine/${bookingId}/cancel`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
}

export async function getMyBookings(token) {
  const response = await fetch(`${BASE_URL}/mine`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
}

const ADMIN_BOOKINGS_URL = "http://localhost:8080/api/admin/bookings";

function adminAuthHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getAllBookingsForAdmin(token) {
  const response = await fetch(ADMIN_BOOKINGS_URL, {
    headers: adminAuthHeaders(token),
  });
  return handleResponse(response);
}

export async function confirmBookingForAdmin(token, bookingId) {
  const response = await fetch(`${ADMIN_BOOKINGS_URL}/${bookingId}/confirm`, {
    method: "POST",
    headers: adminAuthHeaders(token),
  });
  return handleResponse(response);
}

export async function cancelBookingForAdmin(token, bookingId) {
  const response = await fetch(`${ADMIN_BOOKINGS_URL}/${bookingId}/cancel`, {
    method: "PUT",
    headers: adminAuthHeaders(token),
  });
  return handleResponse(response);
}