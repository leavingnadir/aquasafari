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
 * Book Trip.
 * @param {{customerId: number, tripId: number, passengerCount: number}} payload
 */
export async function bookTrip(payload) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
}

export async function cancelBooking(bookingId, customerId) {
  const params = new URLSearchParams({ customerId });
  const response = await fetch(`${BASE_URL}/${bookingId}/cancel?${params.toString()}`, {
    method: "PUT",
  });
  return handleResponse(response);
}

export async function getBookingsForCustomer(customerId) {
  const response = await fetch(`${BASE_URL}/customer/${customerId}`);
  return handleResponse(response);
}

export async function getBooking(bookingId) {
  const response = await fetch(`${BASE_URL}/${bookingId}`);
  return handleResponse(response);
}
