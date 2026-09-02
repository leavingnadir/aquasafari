import React, { useEffect, useState } from "react";
import { UserPlus, Pencil, Trash2, ShieldCheck, X, Loader2, ShieldAlert } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { getAllStaff, createStaff, updateStaff, deleteStaff } from "../../api/staffApi.js";
import usePageTitle from "../../hooks/usePageTitle";

const ROLES = ["ADMIN", "BOAT_OPERATOR", "TOUR_GUIDE", "ACCOUNTANT"];

const ROLE_LABEL = {
  ADMIN: "Administrator",
  BOAT_OPERATOR: "Boat Operator",
  TOUR_GUIDE: "Tour Guide",
  ACCOUNTANT: "Accountant",
};

const ROLE_BADGE = {
  ADMIN: "bg-brand-500/10 text-brand-400 border-brand-500/20",
  BOAT_OPERATOR: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  TOUR_GUIDE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  ACCOUNTANT: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const emptyForm = {
  email: "",
  phone: "",
  password: "",
  firstName: "",
  lastName: "",
  role: "BOAT_OPERATOR",
};

/**
 * Admin-only screen covering the four staff roles the use case diagram
 * shows under "User & Admin Management" that CustomerManagement.jsx
 * doesn't handle: Administrator, Boat Operator, Tour Guide, Accountant.
 */
export default function StaffManagement() {
  usePageTitle("Staff Management");

  const { auth } = useAuth();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null); // null = creating
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError("");
    try {
      setStaff(await getAllStaff(auth.token));
    } catch (err) {
      setError(err.message || "Could not load staff accounts.");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(member) {
    setEditingId(member.userId);
    setForm({
      email: member.email,
      phone: member.phone || "",
      password: "",
      firstName: member.firstName,
      lastName: member.lastName,
      role: member.role,
    });
    setShowForm(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editingId) {
        const updated = await updateStaff(auth.token, editingId, form);
        setStaff((prev) => prev.map((s) => (s.userId === updated.userId ? updated : s)));
      } else {
        const created = await createStaff(auth.token, form);
        setStaff((prev) => [created, ...prev]);
      }
      setShowForm(false);
    } catch (err) {
      setError(err.message || "Could not save this staff account.");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!pendingDeleteId) return;
    setDeleting(true);
    try {
      await deleteStaff(auth.token, pendingDeleteId);
      setStaff((prev) => prev.filter((s) => s.userId !== pendingDeleteId));
      setPendingDeleteId(null);
    } catch (err) {
      setError(err.message || "Could not delete this staff account.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 pt-24 pb-12 font-body text-content-primary">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-6 border-b border-surface-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-500 mb-2">
            <ShieldCheck size={16} /> <span>Admin Only</span>
          </div>
          <h1 className="font-display text-3xl font-normal tracking-tight text-content-primary">
            Staff Management
          </h1>
          <p className="mt-2 text-sm text-content-secondary">
            Manage Administrator, Boat Operator, Tour Guide and Accountant accounts.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-lg shadow-brand-500/25 transition-all hover:bg-brand-600"
        >
          <UserPlus size={16} /> Add staff member
        </button>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-5 py-4 text-rose-400">
          <ShieldAlert size={18} className="shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      <div className="overflow-hidden rounded-[2.5rem] border border-surface-800 bg-surface-900 shadow-xl">
        {loading && (
          <div className="flex items-center justify-center gap-2 py-16 text-content-secondary">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">Loading staff accounts…</span>
          </div>
        )}
        {!loading && staff.length === 0 && (
          <div className="px-6 py-16 text-center text-content-secondary">
            <p className="text-sm">No staff accounts yet.</p>
          </div>
        )}

        {!loading &&
          staff.map((member) => (
            <div
              key={member.userId}
              className="flex items-center justify-between gap-6 border-b border-surface-800 px-6 py-5 last:border-0 transition-colors hover:bg-surface/30"
            >
              <div>
                <div className="flex items-center gap-3">
                  <p className="font-display text-lg font-normal text-content-primary">
                    {member.firstName} {member.lastName}
                  </p>
                  <span
                    className={`rounded-full border px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      ROLE_BADGE[member.role]
                    }`}
                  >
                    {ROLE_LABEL[member.role]}
                  </span>
                </div>
                <p className="mt-1 text-xs text-content-secondary font-mono">
                  {member.email} {member.phone && `· ${member.phone}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEdit(member)}
                  className="flex items-center gap-1.5 rounded-full border border-surface-800 bg-surface px-4 py-2 text-xs font-semibold uppercase tracking-wider text-content-primary transition-all hover:bg-surface-800 hover:border-surface-700"
                  aria-label="Edit"
                >
                  <Pencil size={13} className="text-brand-500" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setPendingDeleteId(member.userId)}
                  className="flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-rose-400 transition-all hover:bg-rose-500/20"
                  aria-label="Delete"
                >
                  <Trash2 size={13} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Create / edit modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <form
            onSubmit={handleSave}
            className="w-full max-w-md space-y-4 rounded-[2.5rem] border border-surface-800 bg-surface-900 p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-surface-800 pb-4">
              <h2 className="font-display text-xl font-normal text-content-primary">
                {editingId ? "Edit staff member" : "Add staff member"}
              </h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-surface-800 bg-surface text-content-secondary transition-all hover:bg-surface-800 hover:text-content-primary"
              >
                <X size={16} />
              </button>
            </div>

            <FormField label="Role">
              <select
                value={form.role}
                disabled={!!editingId}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                className="w-full rounded-2xl border border-surface-800 bg-surface px-4 py-3 text-sm text-content-primary outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 disabled:opacity-50"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r} className="bg-surface-900 text-content-primary">
                    {ROLE_LABEL[r]}
                  </option>
                ))}
              </select>
              {editingId && (
                <p className="mt-1.5 text-[11px] text-content-muted">
                  Role can't be changed after creation — delete and recreate instead.
                </p>
              )}
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="First name">
                <input
                  required
                  value={form.firstName}
                  onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                  className="w-full rounded-2xl border border-surface-800 bg-surface px-4 py-3 text-sm text-content-primary outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                />
              </FormField>
              <FormField label="Last name">
                <input
                  required
                  value={form.lastName}
                  onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                  className="w-full rounded-2xl border border-surface-800 bg-surface px-4 py-3 text-sm text-content-primary outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                />
              </FormField>
            </div>

            <FormField label="Email">
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full rounded-2xl border border-surface-800 bg-surface px-4 py-3 text-sm text-content-primary outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
              />
            </FormField>

            <FormField label="Phone">
              <input
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="w-full rounded-2xl border border-surface-800 bg-surface px-4 py-3 text-sm text-content-primary outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
              />
            </FormField>

            <FormField label={editingId ? "New password (optional)" : "Password"}>
              <input
                required={!editingId}
                type="password"
                minLength={8}
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="w-full rounded-2xl border border-surface-800 bg-surface px-4 py-3 text-sm text-content-primary outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                placeholder={editingId ? "Leave blank to keep current password" : "At least 8 characters"}
              />
            </FormField>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-full border border-surface-800 bg-surface px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-content-secondary transition-all hover:bg-surface-800 hover:text-content-primary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-full bg-brand-500 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-lg shadow-brand-500/20 transition-all hover:bg-brand-600 disabled:opacity-50"
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                <span>{saving ? "Saving…" : "Save"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete confirmation */}
      {pendingDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-[2.5rem] border border-surface-800 bg-surface-900 p-8 shadow-2xl">
            <h2 className="font-display text-xl font-normal text-content-primary">Delete this account?</h2>
            <p className="mt-2 text-sm text-content-secondary">
              This permanently removes the staff account. This cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setPendingDeleteId(null)}
                className="rounded-full border border-surface-800 bg-surface px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-content-secondary transition-all hover:bg-surface-800 hover:text-content-primary"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex items-center gap-2 rounded-full bg-rose-500 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-lg shadow-rose-500/20 transition-all hover:bg-rose-600 disabled:opacity-50"
              >
                {deleting && <Loader2 size={14} className="animate-spin" />}
                <span>{deleting ? "Deleting…" : "Delete"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-content-secondary">
        {label}
      </span>
      {children}
    </label>
  );
}
