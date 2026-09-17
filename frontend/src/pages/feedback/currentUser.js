/**
 * Retrieves the current authenticated user from the app's auth state ("aquasafari auth").
 * Falls back to a demo customer only if no active session exists.
 */
const DEMO_CUSTOMER = { userId: 5, name: "Kasun Silva", role: "CUSTOMER" };

export function getCurrentUser() {
  try {
    const authStorage = JSON.parse(localStorage.getItem("aquasafari auth"));
    if (authStorage?.user) {
      const u = authStorage.user;
      return {
        userId: u.id || u.userId || DEMO_CUSTOMER.userId,
        name: u.firstName ? `${u.firstName} ${u.lastName || ''}`.trim() : (u.name || u.email?.split("@")[0] || DEMO_CUSTOMER.name),
        role: u.role || u.authorities?.[0] || DEMO_CUSTOMER.role,
      };
    }
    const stored = JSON.parse(localStorage.getItem("aquasafari_user"));
    if (stored?.userId) return stored;
  } catch {
    // Fall back to demo user if parsing fails
  }
  return DEMO_CUSTOMER;
}

export const isAdministrator = (user) => 
  user?.role === "ADMIN" || user?.role === "ADMINISTRATOR" || user?.role === "ROLE_ADMIN";