const BASE_URL = "http://localhost:8080/api/payments";

async function handleResponse(res) {
  let body = null;
  try {
    body = await res.json();
  } catch (_) {
    // no JSON body (e.g. 204 No Content)
  }
  if (!res.ok) {
    const message = body?.reason || body?.error || `Request failed (${res.status})`;
    const error = new Error(message);
    error.status = res.status;
    error.body = body;
    throw error;
  }
  return body;
}

export async function processPayment(payload) {
  const res = await fetch(`${BASE_URL}/process`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function getPaymentHistory() {
  const res = await fetch(`${BASE_URL}/history`);
  return handleResponse(res);
}

export async function getPaymentsByBooking(bookingId) {
  const res = await fetch(`${BASE_URL}/booking/${bookingId}`);
  return handleResponse(res);
}

export async function getPaymentById(paymentId) {
  const res = await fetch(`${BASE_URL}/${paymentId}`);
  return handleResponse(res);
}

export async function updatePayment(paymentId, payload) {
  const res = await fetch(`${BASE_URL}/${paymentId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function deletePaymentRecord(paymentId) {
  const res = await fetch(`${BASE_URL}/${paymentId}`, { method: "DELETE" });
  return handleResponse(res);
}
