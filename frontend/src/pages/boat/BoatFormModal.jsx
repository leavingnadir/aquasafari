import { useEffect, useState } from "react";

const CONDITIONS = ["GOOD", "NEEDS_MAINTENANCE", "UNDER_REPAIR", "OUT_OF_SERVICE"];
const STATUSES = ["AVAILABLE", "ASSIGNED", "MAINTENANCE", "INACTIVE"];

const emptyForm = {
  boatId: "",
  name: "",
  boatType: "",
  passengerCapacity: "",
  engineType: "",
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
 * ADJUST THE URL BELOW once the usernadmin module confirms its real endpoint.
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-800">
            {isEditing ? "Edit boat details" : "Add a boat"}
          </h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[75vh] overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Boat ID" error={errors.boatId} span={2}>
              <input
                className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm font-mono focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
                value={form.boatId}
                disabled={isEditing}
                onChange={(e) => update("boatId", e.target.value)}
                placeholder="e.g. AS-B-014"
              />
              {isEditing && (
                <p className="mt-1 text-xs text-stone-500">
                  Boat ID can't be changed after creation.
                </p>
              )}
            </Field>

            <Field label="Boat name" error={errors.name} span={2}>
              <input
                className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="e.g. Ocean Explorer"
              />
            </Field>

            <Field label="Boat type">
              <input
                className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
                value={form.boatType}
                onChange={(e) => update("boatType", e.target.value)}
                placeholder="e.g. Speedboat"
              />
            </Field>

            <Field label="Engine type">
              <input
                className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
                value={form.engineType}
                onChange={(e) => update("engineType", e.target.value)}
                placeholder="e.g. Twin Outboard 250HP"
              />
            </Field>

            <Field label="Passenger capacity" error={errors.passengerCapacity}>
              <input
                type="number"
                min="1"
                className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
                value={form.passengerCapacity}
                onChange={(e) => update("passengerCapacity", e.target.value)}
              />
            </Field>

            <Field label="Condition">
              <select
                className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
                value={form.condition}
                onChange={(e) => update("condition", e.target.value)}
              >
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>
                    {c.replaceAll("_", " ").toLowerCase()}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Status">
              <select
                className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
                value={form.status}
                onChange={(e) => update("status", e.target.value)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.toLowerCase()}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Assigned boat operator" span={2}>
              {operators && operators.length > 0 ? (
                <select
                  className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
                  value={form.boatOperatorId}
                  onChange={(e) => update("boatOperatorId", e.target.value)}
                >
                  <option value="">Unassigned</option>
                  {operators.map((op) => (
                    <option key={op.id} value={op.id}>
                      {op.name ?? `Operator #${op.id}`}
                    </option>
                  ))}
                </select>
              ) : (
                <>
                  <input
                    type="number"
                    className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
                    value={form.boatOperatorId}
                    onChange={(e) => update("boatOperatorId", e.target.value)}
                    placeholder="Operator user ID (optional)"
                  />
                  <p className="mt-1 text-xs text-stone-500">
                    Operator directory not connected yet — enter the operator's user ID
                    manually until the User &amp; Admin module's endpoint is available.
                  </p>
                </>
              )}
            </Field>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-stone-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-stone-300 px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-teal-800 px-4 py-2 text-sm font-medium text-white hover:bg-teal-900 disabled:opacity-60"
            >
              {submitting ? "Saving…" : isEditing ? "Save changes" : "Add boat"}
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
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
