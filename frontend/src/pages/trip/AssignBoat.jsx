import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getTrip,
  getResources,
  assignResources,
  formatTime,
  formatPrice,
} from "../../services/tripService";

export default function AssignBoat() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [resources, setResources] = useState({ boats: [], operators: [], guides: [] });
  const [form, setForm] = useState({ boatId: "", operatorId: "", guideId: "" });
  const [conflicts, setConflicts] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([getTrip(id), getResources()])
      .then(([t, lookups]) => {
        setTrip(t);
        setResources(lookups);
        setForm({
          boatId: t.boatId ?? "",
          operatorId: t.operatorId ?? "",
          guideId: t.guideId ?? "",
        });
      })
      .catch((err) => setError(err.message));
  }, [id]);

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setConflicts([]);
    setError("");
  };

  const save = async () => {
    setSaving(true);
    setError("");
    setConflicts([]);
    try {
      await assignResources(id, {
        boatId: form.boatId === "" ? null : Number(form.boatId),
        operatorId: form.operatorId === "" ? null : Number(form.operatorId),
        guideId: form.guideId === "" ? null : Number(form.guideId),
      });
      navigate("/trips");
    } catch (err) {
      if (err.status === 409) {
        setConflicts(err.conflicts);
        setError("Allocate a different boat or crew member for this slot.");
      } else {
        setError(err.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const field =
    "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600";
  const label = "block text-sm font-medium text-slate-800";

  if (error && !trip) {
    return <p className="p-10 text-sm text-rose-700">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <button
          onClick={() => navigate("/trips")}
          className="text-sm text-slate-600 underline-offset-4 hover:underline"
        >
          Back to trip schedule
        </button>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">Assign boat and crew</h1>

        {trip && (
          <div className="mt-4 rounded-lg border border-slate-200 bg-white px-5 py-4">
            <p className="text-base font-medium text-slate-900">{trip.route}</p>
            <p className="mt-1 text-sm text-slate-600">
              {trip.tripDate} · departs {formatTime(trip.departureTime)} · {trip.duration} ·{" "}
              {formatPrice(trip.price)} per seat
            </p>
          </div>
        )}

        {conflicts.length > 0 && (
          <div className="mt-6 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
            <p className="font-medium">These resources are already committed</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {conflicts.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        )}
        {error && conflicts.length === 0 && (
          <p className="mt-6 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
            {error}
          </p>
        )}

        <div className="mt-6 space-y-5 rounded-lg border border-slate-200 bg-white p-6">
          <div>
            <label className={label} htmlFor="boatId">
              Boat
            </label>
            <select id="boatId" value={form.boatId} onChange={set("boatId")} className={field}>
              <option value="">Choose a boat</option>
              {resources.boats.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="operatorId">
              Boat operator
            </label>
            <select id="operatorId" value={form.operatorId} onChange={set("operatorId")} className={field}>
              <option value="">Choose a skipper</option>
              {resources.operators.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="guideId">
              Tour guide
            </label>
            <select id="guideId" value={form.guideId} onChange={set("guideId")} className={field}>
              <option value="">Choose a guide</option>
              {resources.guides.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 border-t border-slate-200 pt-5">
            <button
              onClick={save}
              disabled={saving}
              className="rounded-md bg-teal-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-60"
            >
              {saving ? "Assigning…" : "Assign to trip"}
            </button>
            <button
              onClick={() => navigate("/trips")}
              className="rounded-md px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Discard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
