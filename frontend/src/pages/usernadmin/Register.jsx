import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Compass, Mail, Lock, User, Phone, Loader2, ShieldAlert } from "lucide-react";
import { register } from "../../api/authApi.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Register() {
  const { setSession } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const response = await register(form);
      setSession(response);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Could not create your account.");
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
            Create your account
          </h1>
          <p className="mt-2 text-sm text-content-secondary">
            Sign up to book and manage your boat safaris.
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
          className="space-y-4 rounded-[2.5rem] border border-surface-800 bg-surface-900 p-8 shadow-2xl"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-content-secondary">
                First name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-content-muted" size={15} />
                <input
                  required
                  value={form.firstName}
                  onChange={(e) => update("firstName", e.target.value)}
                  placeholder="Kasun"
                  className="w-full rounded-2xl border border-surface-800 bg-surface py-3 pl-10 pr-3 text-sm text-content-primary outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-content-secondary">
                Last name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-content-muted" size={15} />
                <input
                  required
                  value={form.lastName}
                  onChange={(e) => update("lastName", e.target.value)}
                  placeholder="Silva"
                  className="w-full rounded-2xl border border-surface-800 bg-surface py-3 pl-10 pr-3 text-sm text-content-primary outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                />
              </div>
            </div>
          </div>

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
                onChange={(e) => update("email", e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-surface-800 bg-surface py-3 pl-11 pr-4 text-sm text-content-primary outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-content-secondary">
              Phone
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted" size={16} />
              <input
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="07X XXX XXXX"
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
                minLength={8}
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                placeholder="At least 8 characters"
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
            <span>{submitting ? "Creating account…" : "Create account"}</span>
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-content-secondary">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-brand-500 transition-colors hover:text-brand-400 hover:underline"
          >
            Log in
          </Link>
        </p>

        <p className="mt-4 text-center text-xs text-content-muted leading-relaxed">
          Staff accounts (Admin, Accountant, Tour Guide, Boat Operator) are created by an
          administrator, not through this form.
        </p>
      </div>
    </div>
  );
}
