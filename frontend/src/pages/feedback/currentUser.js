/**
 * Retrieves the current authenticated user from the app's auth state.
 */
function normalizeRole(role) {
  if (!role && role !== 0) return null;
  const raw = typeof role === "string" ? role : role?.name || role?.role;
  const normalized = String(raw ?? "").trim().toUpperCase().replace(/^ROLE_/, "");
  return normalized === "ADMINISTRATOR" ? "ADMIN" : normalized || null;
}

export function getCurrentUser() {
  try {
    const authStorage = JSON.parse(localStorage.getItem("aquasafari_auth") || "null");
    if (!authStorage?.token) return null;

    const u = authStorage.user ?? authStorage;
    const userId = u.id ?? u.userId;
    if (userId == null) return null;
    return {
      userId,
      name: u.firstName ? `${u.firstName} ${u.lastName || ''}`.trim() : (u.name || u.email?.split("@")[0] || "Customer"),
      role: normalizeRole(u.role || u.authorities?.[0]),
    };
  } catch {
    return null;
  }
}

export const isAdministrator = (user) => normalizeRole(user?.role) === "ADMIN";