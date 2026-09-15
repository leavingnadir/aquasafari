import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getTrip,
  createTrip,
  updateTrip,
  checkConflicts,
  getResources,
} from "../../services/tripService";
import {
  Compass,
  Calendar,
  Clock,
  Timer,
  DollarSign,
  Anchor,
  Users,
  UserCheck,
  ArrowLeft,
  Loader2,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";

const EMPTY = {
  route: "",
  tripDate: "",
  departureTime: "",
  duration: "2 Hours",
  price: "",
  boatId: "",
  operatorId: "",
  guideId: "",
};

const DURATION_PRESETS = ["1 Hour", "90 Minutes", "2 Hours", "3 Hours", "4 Hours", "5 Hours"];

const toPayload = (form) => ({
  route: form.route.trim(),
  tripDate: form.tripDate,
  departureTime: form.departureTime.length === 5 ? `${form.departureTime}:00` : form.departureTime,
  duration: form.duration.trim(),
  price: form.price === "" ? null : Number(form.price),
  boatId: form.boatId === "" ? null : Number(form.boatId),
  operatorId: form.operatorId === "" ? null : Number(form.operatorId),
  guideId: form.guideId === "" ? null : Number(form.guideId),
});

export default function TripForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [resources, setResources] = useState({ boats: [], operators: [], guides: [] });
  const [conflicts, setConflicts] = useState([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getResources()
      .then(setResources)
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    getTrip(id)
      .then((t) =>
        setForm({
          route: t.route ?? "",
          tripDate: t.tripDate ?? "",
          departureTime: String(t.departureTime ?? "").slice(0, 5),
          duration: t.duration ?? "",
          price: t.price ?? "",
          boatId: t.boatId ?? "",
          operatorId: t.operatorId ?? "",
          guideId: t.guideId ?? "",
        })
      )
      .catch((err) => setError(err.message));
  }, [id, isEdit]);

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setConflicts([]);
    setNotice("");
    setError("");
  };

  const verify = async () => {
    setError("");
    setNotice("");
    try {
      const result = await checkConflicts(toPayload(form), isEdit ? Number(id) : undefined);
      setConflicts(result.conflicts);
      if (result.available) setNotice("Boat, skipper and guide are all free in this slot.");
    } catch (err) {
      setError(err.message);
    }
  };

  const save = async () => {
    setSaving(true);
    setError("");
    setNotice("");
    setConflicts([]);
    try {
      const payload = toPayload(form);
      if (isEdit) {
        await updateTrip(id, payload);
      } else {
        await createTrip(payload);
      }
      navigate("/trips");
    } catch (err) {
      if (err.status === 409) {
        setConflicts(err.conflicts);
        setError("Pick a different slot, or a different boat, skipper or guide.");
      } else {
        setError(err.message);
        setConflicts(err.conflicts ?? []);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen px-4 pt-24 pb-16 font-body text-content-primary">
      <div className="mx-auto max-w-3xl">
        <button
          onClick={() => navigate("/trips")}
          className="group mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-content-secondary transition-colors hover:text-brand-500"
        >
          <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />
          <span>Back to trip schedule</span>
        </button>

        <h1 className="font-display text-3xl font-normal tracking-tight text-content-primary">
          {isEdit ? `Edit trip #${id}` : "Schedule a trip"}
        </h1>
        <p className="mt-1 max-w-prose text-sm text-content-secondary">
          Set the route and departure, then allocate a boat and crew. The slot is checked for clashes before
          anything is saved.
        </p>

        {conflicts.length > 0 && (
          <div className="mt-6 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-5 text-rose-400">
            <p className="text-xs font-bold uppercase tracking-wider">This slot is already taken</p>
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

        {notice && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 text-emerald-400">
            <CheckCircle2 size={18} className="shrink-0" />
            <span className="text-sm font-medium">{notice}</span>
          </div>
        )}

        <div className="mt-6 space-y-8 rounded-[2.5rem] border border-surface-800 bg-surface-900 p-8 shadow-2xl">
          <section className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-content-secondary" htmlFor="route">
                <Compass size={14} className="text-brand-500" /> Route
              </label>
              <input
                id="route"
                value={form.route}
                onChange={set("route")}
                placeholder="Mangrove River Safari"
                className={inputStyle}
              />
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-content-secondary" htmlFor="tripDate">
                <Calendar size={14} className="text-brand-500" /> Date
              </label>
              <input id="tripDate" type="date" value={form.tripDate} onChange={set("tripDate")} className={inputStyle} />
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-content-secondary" htmlFor="departureTime">
                <Clock size={14} className="text-brand-500" /> Start time
              </label>
              <input
                id="departureTime"
                type="time"
                value={form.departureTime}
                onChange={set("departureTime")}
                className={inputStyle}
              />
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-content-secondary" htmlFor="duration">
                <Timer size={14} className="text-brand-500" /> Duration
              </label>
              <input
                id="duration"
                list="duration-presets"
                value={form.duration}
                onChange={set("duration")}
                placeholder="3 Hours"
                className={inputStyle}
              />
              <datalist id="duration-presets">
                {DURATION_PRESETS.map((d) => (
                  <option key={d} value={d} />
                ))}
              </datalist>
              <p className="mt-1 text-xs text-content-muted">
                Written as hours or minutes. It is read back as a length when checking for clashes.
              </p>
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-content-secondary" htmlFor="price">
                <DollarSign size={14} className="text-brand-500" /> Price per seat (LKR)
              </label>
              <input
                id="price"
                type="number"
                min="1"
                step="50"
                value={form.price}
                onChange={set("price")}
                className={inputStyle}
              />
            </div>
          </section>

          <section className="border-t border-surface-800 pt-6">
            <h2 className="font-display text-xl font-normal text-content-primary">Boat and crew</h2>
            <p className="mt-1 text-xs text-content-secondary">
              Every trip needs all three before it can be saved.
            </p>
            <div className="mt-4 grid gap-5 sm:grid-cols-3">
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
            </div>
          </section>

          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-surface-800 pt-6">
            <button
              onClick={() => navigate("/trips")}
              className="rounded-full border border-surface-800 bg-surface px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-content-secondary transition-all hover:bg-surface-800 hover:text-content-primary"
            >
              Discard
            </button>
            <button
              onClick={verify}
              className="rounded-full border border-surface-800 bg-surface px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-content-secondary transition-all hover:bg-surface-800 hover:text-content-primary"
            >
              Check availability
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="flex items-center gap-2 rounded-full bg-brand-500 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-lg shadow-brand-500/20 transition-all hover:bg-brand-600 disabled:opacity-50"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              <span>{saving ? "Saving…" : isEdit ? "Save changes" : "Create trip"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle =
  "w-full rounded-2xl border border-surface-800 bg-surface px-4 py-3 text-sm text-content-primary outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15";

const selectStyle =
  "w-full rounded-2xl border border-surface-800 bg-surface px-4 py-3 text-sm text-content-primary outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15";
