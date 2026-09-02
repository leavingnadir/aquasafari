import React, { useEffect, useState } from "react";
import { X, Anchor, ShieldAlert, Loader2 } from "lucide-react";

const CONDITIONS = ["GOOD", "NEEDS_MAINTENANCE", "UNDER_REPAIR", "OUT_OF_SERVICE"];
const STATUSES = ["AVAILABLE", "ASSIGNED", "MAINTENANCE", "INACTIVE"];

const emptyForm = {
  boatId: "",
  name: "",
  boatType: "",
  passengerCapacity: "",
  engineType: "",
  imageUrl: "",
  condition: "GOOD",
  status: "AVAILABLE",
  boatOperatorId: "",
};

/**
 * Add / Edit Boat form, rendered as a modal.
 *
 * Operator assignment: this tries to fetch active boat operators from the usernadmin
 * module's endpoint (GET /api/users/boat-operators) so the admin can pick from a dropdown,
 * per the use case's "Admin assigns an active Boat Operator to the boat" step. If that
 * endpoint isn't available yet (teammate's module still in progress), it falls back to a
 * plain numeric "Operator ID" field so this page still works standalone.
 */
export default function BoatFormModal({ boat, onClose, onSubmit }) {
  const isEditing = Boolean(boat);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [operators, setOperators] = useState(null); // null = not loaded / unavailable

  useEffect(() => {
    if (boat) {
      setForm({
        boatId: boat.boatId ?? "",
        name: boat.name ?? "",
        boatType: boat.boatType ?? "",
        passengerCapacity: boat.passengerCapacity ?? "",
        engineType: boat.engineType ?? "",
        imageUrl: boat.imageUrl ?? "",
        condition: boat.condition ?? "GOOD",
        status: boat.status ?? "AVAILABLE",
        boatOperatorId: boat.boatOperatorId ?? "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [boat]);

  useEffect(() => {
    fetch("http://localhost:8080/api/users/boat-operators")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setOperators(Array.isArray(data) ? data : []))
      .catch(() => setOperators(null)); // endpoint not ready yet — use manual ID input
  }, []);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate() {
    const next = {};
    if (!form.boatId.trim()) next.boatId = "Boat ID is required";
    if (!form.name.trim()) next.name = "Boat name is required";
    if (!form.passengerCapacity || Number(form.passengerCapacity) < 1) {
      next.passengerCapacity = "Enter a capacity of at least 1";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        passengerCapacity: Number(form.passengerCapacity),
        boatOperatorId: form.boatOperatorId ? Number(form.boatOperatorId) : null,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-[2.5rem] border border-surface-800 bg-surface-900 shadow-2xl font-body text-content-primary overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-surface-800 bg-surface/50 px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-800 bg-surface text-brand-500">
              <Anchor size={18} />
            </div>
            <h2 className="font-display text-xl font-normal text-content-primary">
              {isEditing ? "Edit boat details" : "Add a boat"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-content-secondary transition hover:bg-surface-800 hover:text-content-primary"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto px-8 py-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            
            <Field label="Boat ID" error={errors.boatId} span={2}>
              <input
                className="w-full rounded-2xl border border-surface-800 bg-surface px-4 py-3 text-sm font-mono text-content-primary outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 disabled:opacity-50"
                value={form.boatId}
                disabled={isEditing}
                onChange={(e) => update("boatId", e.target.value)}
                placeholder="e.g. AS-B-014"
              />
              {isEditing && (
                <p className="mt-1.5 text-xs text-content-muted">
                  Boat ID can't be changed after creation.
                </p>
              )}
            </Field>

            <Field label="Boat name" error={errors.name} span={2}>
              <input
                className="w-full rounded-2xl border border-surface-800 bg-surface px-4 py-3 text-sm text-content-primary outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="e.g. Ocean Explorer"
              />
            </Field>

            <Field label="Boat type">
              <input
                className="w-full rounded-2xl border border-surface-800 bg-surface px-4 py-3 text-sm text-content-primary outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                value={form.boatType}
                onChange={(e) => update("boatType", e.target.value)}
                placeholder="e.g. Speedboat"
              />
            </Field>

            <Field label="Engine type">
              <input
                className="w-full rounded-2xl border border-surface-800 bg-surface px-4 py-3 text-sm text-content-primary outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                value={form.engineType}
                onChange={(e) => update("engineType", e.target.value)}
                placeholder="e.g. Twin Outboard 250HP"
              />
            </Field>

            <Field label="Boat Image URL" span={2}>
              <input
                type="text"
                className="w-full rounded-2xl border border-surface-800 bg-surface px-4 py-3 text-sm text-content-primary outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                value={form.imageUrl}
                onChange={(e) => update("imageUrl", e.target.value)}
                placeholder="https://images.unsplash.com/..."
              />
            </Field>

            <Field label="Passenger capacity" error={errors.passengerCapacity}>
              <input
                type="number"
                min="1"
                className="w-full rounded-2xl border border-surface-800 bg-surface px-4 py-3 text-sm text-content-primary outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                value={form.passengerCapacity}
                onChange={(e) => update("passengerCapacity", e.target.value)}
              />
            </Field>

            <Field label="Condition">
              <select
                className="w-full rounded-2xl border border-surface-800 bg-surface px-4 py-3 text-sm text-content-primary outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                value={form.condition}
                onChange={(e) => update("condition", e.target.value)}
              >
                {CONDITIONS.map((c) => (
                  <option key={c} value={c} className="bg-surface-900 text-content-primary">
                    {c.replaceAll("_", " ").toLowerCase()}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Status" span={2}>
              <select
                className="w-full rounded-2xl border border-surface-800 bg-surface px-4 py-3 text-sm text-content-primary outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                value={form.status}
                onChange={(e) => update("status", e.target.value)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s} className="bg-surface-900 text-content-primary">
                    {s.toLowerCase()}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Assigned boat operator" span={2}>
              {operators && operators.length > 0 ? (
                <select
                  className="w-full rounded-2xl border border-surface-800 bg-surface px-4 py-3 text-sm text-content-primary outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                  value={form.boatOperatorId}
                  onChange={(e) => update("boatOperatorId", e.target.value)}
                >
                  <option value="" className="bg-surface-900 text-content-primary">Unassigned</option>
                  {operators.map((op) => (
                    <option key={op.id} value={op.id} className="bg-surface-900 text-content-primary">
                      {op.name ?? `Operator #${op.id}`}
                    </option>
                  ))}
                </select>
              ) : (
                <>
                  <input
                    type="number"
                    className="w-full rounded-2xl border border-surface-800 bg-surface px-4 py-3 text-sm text-content-primary outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                    value={form.boatOperatorId}
                    onChange={(e) => update("boatOperatorId", e.target.value)}
                    placeholder="Operator user ID (optional)"
                  />
                  <p className="mt-1.5 text-xs text-content-muted">
                    Operator directory not connected yet — enter the operator's user ID manually until the User &amp; Admin module's endpoint is available.
                  </p>
                </>
              )}
            </Field>
          </div>

          {/* Modal Footer */}
          <div className="mt-8 flex items-center justify-end gap-3 border-t border-surface-800 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-content-secondary transition hover:bg-surface-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-full bg-brand-500 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-lg shadow-brand-500/20 transition-all hover:bg-brand-600 disabled:opacity-60"
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              <span>{submitting ? "Saving…" : isEditing ? "Save changes" : "Add boat"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, error, span = 1, children }) {
  return (
    <div className={span === 2 ? "col-span-2" : "col-span-1"}>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-content-secondary">{label}</label>
      {children}
      {error && (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-400">
          <ShieldAlert size={12} className="shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
