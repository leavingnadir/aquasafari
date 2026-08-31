const BASE_URL = "http://localhost:8080/api/admin/staff";

function authHeaders(token) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function handleResponse(res) {
  let body = null;
  try {
    body = await res.json();
  } catch (_) {
    /* no JSON body, e.g. 204 */
  }
  if (!res.ok) {
    const message = body?.message || body?.error || `Request failed (${res.status})`;
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }
  return body;
}

export async function getAllStaff(token) {
  const res = await fetch(BASE_URL, { headers: authHeaders(token) });
  return handleResponse(res);
}

export async function createStaff(token, payload) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function updateStaff(token, userId, payload) {
  const res = await fetch(`${BASE_URL}/${userId}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function deleteStaff(token, userId) {
  const res = await fetch(`${BASE_URL}/${userId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  return handleResponse(res);
}
