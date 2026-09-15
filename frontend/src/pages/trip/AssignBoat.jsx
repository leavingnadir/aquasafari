import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getTrip,
  getResources,
  assignResources,
  formatTime,
  formatPrice,
} from "../../services/tripService";
import { Anchor, Users, UserCheck, ArrowLeft, Loader2, ShieldAlert } from "lucide-react";

export default function AssignBoat() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [resources, setResources] = useState({ boats: [], operators: [], guides: [] });
  const [form, setForm] = useState({ boatId: "", operatorId: "", guideId: "" });
  const [conflicts, setConflicts] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

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
      .catch((err) => setError(err.message))
      .finally(() => setLoadingData(false));
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

  if (loadingData) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center gap-2 px-4 pt-24 font-body text-content-secondary">
        <Loader2 size={20} className="animate-spin text-brand-500" />
        <span className="text-sm">Loading trip and resources…</span>
      </div>
    );
  }

  if (error && !trip) {
    return (
      <div className="mx-auto max-w-2xl px-4 pt-24 pb-12 font-body">
        <div className="flex items-center gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-5 py-4 text-rose-400">
          <ShieldAlert size={18} className="shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pt-24 pb-12 font-body text-content-primary">
      <button
        onClick={() => navigate("/trips")}
        className="group mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-content-secondary transition-colors hover:text-brand-500"
      >
        <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />
        <span>Back to trip schedule</span>
      </button>

      <h1 className="font-display text-3xl font-normal tracking-tight text-content-primary">
        Assign boat and crew
      </h1>

      {trip && (
        <div className="mt-6 rounded-[2rem] border border-surface-800 bg-surface-900 p-6 shadow-xl">
          <p className="font-display text-xl font-normal text-content-primary">{trip.route}</p>
          <p className="mt-2 text-xs text-content-secondary font-mono">
            {trip.tripDate} · departs {formatTime(trip.departureTime)} · {trip.duration} ·{" "}
            {formatPrice(trip.price)} per seat
          </p>
        </div>
      )}

      {conflicts.length > 0 && (
        <div className="mt-6 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-5 text-rose-400">
          <p className="text-xs font-bold uppercase tracking-wider">These resources are already committed</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {conflicts.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      )}

      {error && conflicts.length === 0 && (
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-5 py-4 text-rose-400">
          <ShieldAlert size={18} className="shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      <div className="mt-6 space-y-5 rounded-[2.5rem] border border-surface-800 bg-surface-900 p-8 shadow-2xl">
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-content-secondary" htmlFor="boatId">
            <Anchor size={14} className="text-brand-500" /> Boat
          </label>
          <select id="boatId" value={form.boatId} onChange={set("boatId")} className={selectStyle}>
            <option value="" className="bg-surface-900 text-content-muted">Choose a boat</option>
            {resources.boats.map((b) => (
              <option key={b.id} value={b.id} className="bg-surface-900 text-content-primary">
                {b.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-content-secondary" htmlFor="operatorId">
            <Users size={14} className="text-brand-500" /> Boat operator
          </label>
          <select id="operatorId" value={form.operatorId} onChange={set("operatorId")} className={selectStyle}>
            <option value="" className="bg-surface-900 text-content-muted">Choose a skipper</option>
            {resources.operators.map((o) => (
              <option key={o.id} value={o.id} className="bg-surface-900 text-content-primary">
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-content-secondary" htmlFor="guideId">
            <UserCheck size={14} className="text-brand-500" /> Tour guide
          </label>
          <select id="guideId" value={form.guideId} onChange={set("guideId")} className={selectStyle}>
            <option value="" className="bg-surface-900 text-content-muted">Choose a guide</option>
            {resources.guides.map((g) => (
              <option key={g.id} value={g.id} className="bg-surface-900 text-content-primary">
                {g.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-surface-800 pt-6">
          <button
            onClick={() => navigate("/trips")}
            className="rounded-full border border-surface-800 bg-surface px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-content-secondary transition-all hover:bg-surface-800 hover:text-content-primary"
          >
            Discard
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 rounded-full bg-brand-500 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-lg shadow-brand-500/20 transition-all hover:bg-brand-600 disabled:opacity-50"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            <span>{saving ? "Assigning…" : "Assign to trip"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const selectStyle =
  "w-full rounded-2xl border border-surface-800 bg-surface px-4 py-3 text-sm text-content-primary outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15";