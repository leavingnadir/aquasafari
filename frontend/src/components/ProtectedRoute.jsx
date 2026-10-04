import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { normalizeRole, useAuth } from "../context/AuthContext.jsx";

/**
 * Wrap any route that needs a logged-in user:
 *
 *   <Route path="/admin/staff" element={
 *     <ProtectedRoute roles={["ADMIN"]}><StaffManagement /></ProtectedRoute>
 *   } />
 *
 * Omit `roles` to just require "logged in, any role".
 */
export default function ProtectedRoute({ children, roles }) {
  const { auth, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // avoid flashing a redirect while localStorage is read

  if (!isAuthenticated || !auth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles) {
    const normalizedRole = normalizeRole(auth.role);
    const allowedRoles = roles.map((role) => normalizeRole(role));

    if (!allowedRoles.includes(normalizedRole)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
