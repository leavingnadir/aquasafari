const BASE_URL = "http://localhost:8080/api/auth";

async function handleResponse(res) {
  let body = null;
  try {
    body = await res.json();
  } catch (_) {
    /* no JSON body */
  }
  if (!res.ok) {
    const message = body?.message || body?.error || `Request failed (${res.status})`;
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }
  return body;
}

export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
}

export async function register(payload) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}
