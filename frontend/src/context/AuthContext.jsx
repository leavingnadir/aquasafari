import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const STORAGE_KEY = "aquasafari_auth";

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null); // { token, userId, email, firstName, lastName, role }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setAuth(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  function setSession(authResponse) {
    setAuth(authResponse);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authResponse));
  }

  function logout() {
    setAuth(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  // Convenience helpers for your components
  const isAuthenticated = !!auth?.token;
  const user = auth; // maps directly to your user details object

  return (
    <AuthContext.Provider value={{ auth, user, isAuthenticated, loading, setSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside an AuthProvider");
  return ctx;
}
