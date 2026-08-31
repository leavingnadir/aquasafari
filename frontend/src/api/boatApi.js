const BASE_URL = "http://localhost:8080/api/boats";

async function handleResponse(res) {
  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message =
      (data && (data.error || Object.values(data)[0])) ||
      `Request failed with status ${res.status}`;
    throw new Error(message);
  }
  return data;
}

export const boatApi = {
  getAll: () => fetch(BASE_URL).then(handleResponse),

  getAvailable: () => fetch(`${BASE_URL}/available`).then(handleResponse),

  getById: (id) => fetch(`${BASE_URL}/${id}`).then(handleResponse),

  create: (payload) =>
    fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(handleResponse),

  update: (id, payload) =>
    fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(handleResponse),

  remove: (id) =>
    fetch(`${BASE_URL}/${id}`, { method: "DELETE" }).then(handleResponse),
};
