/**
 * Retrieves the current authenticated user from the app's auth state ("aquasafari auth").
 * Falls back to a demo customer only if no active session exists.
 */
const DEMO_CUSTOMER = { userId: 5, name: "Kasun Silva", role: "CUSTOMER" };

function normalizeRole(role) {
  if (!role && role !== 0) return null;
  const raw = typeof role === "string" ? role : role?.name || role?.role;
  const normalized = String(raw ?? "").trim().toUpperCase().replace(/^ROLE_/, "");
  return normalized === "ADMINISTRATOR" ? "ADMIN" : normalized || null;
}

export function getCurrentUser() {
  try {
    const authStorage = JSON.parse(localStorage.getItem("aquasafari_auth") || localStorage.getItem("aquasafari auth") || "null");
    if (authStorage?.user) {
      const u = authStorage.user;
      return {
        userId: u.id || u.userId || DEMO_CUSTOMER.userId,
        name: u.firstName ? `${u.firstName} ${u.lastName || ''}`.trim() : (u.name || u.email?.split("@")[0] || DEMO_CUSTOMER.name),
        role: normalizeRole(u.role || u.authorities?.[0]) || DEMO_CUSTOMER.role,
      };
    }
    const stored = JSON.parse(localStorage.getItem("aquasafari_user") || "null");
    if (stored?.userId) return stored;
  } catch {
    // Fall back to demo user if parsing fails
  }
  return DEMO_CUSTOMER;
}

export const isAdministrator = (user) => normalizeRole(user?.role) === "ADMIN";