import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Compass, Mail, Lock, Loader2, ShieldAlert } from "lucide-react";
import { login } from "../../api/authApi.js";
import { useAuth } from "../../context/AuthContext.jsx";

// Where each role lands after logging in.
const ROLE_HOME = {
  ADMIN: "/admin/staff",
  ACCOUNTANT: "/payment/history",
  BOAT_OPERATOR: "/boat/manage",
  TOUR_GUIDE: "/trip",
  CUSTOMER: "/",
};

export default function Login() {
  const { setSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const response = await login(form.email, form.password);
      setSession(response);

      const redirectTo = location.state?.from?.pathname || ROLE_HOME[response.role] || "/";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || "Could not log in. Check your email and password.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-16 font-body text-content-primary">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-surface-800 bg-surface-900 text-brand-500 shadow-xl">
            <Compass size={28} />
          </div>
          <h1 className="mt-6 font-display text-3xl font-normal tracking-tight text-content-primary">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-content-secondary">
            Log in as Customer, Admin, Accountant, Tour Guide or Boat Operator.
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-5 py-4 text-rose-400 shadow-lg">
            <ShieldAlert size={18} className="shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-[2.5rem] border border-surface-800 bg-surface-900 p-8 shadow-2xl"
        >
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-content-secondary">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted" size={16} />
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="you@aquasafari.lk"
                className="w-full rounded-2xl border border-surface-800 bg-surface py-3 pl-11 pr-4 text-sm text-content-primary outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-content-secondary">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted" size={16} />
              <input
                required
                type="password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-surface-800 bg-surface py-3 pl-11 pr-4 text-sm text-content-primary outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 py-3.5 text-xs font-semibold uppercase tracking-wider text-white shadow-lg shadow-brand-500/20 transition-all hover:bg-brand-600 disabled:opacity-50"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            <span>{submitting ? "Logging in…" : "Log in"}</span>
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-content-secondary">
          New here?{" "}
          <Link
            to="/register"
            className="font-semibold text-brand-500 transition-colors hover:text-brand-400 hover:underline"
          >
            Create a customer account
          </Link>
        </p>
      </div>
    </div>
  );
}
