import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getTrip,
  createTrip,
  updateTrip,
  checkConflicts,
  getResources,
} from "../../services/tripService";

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

  const field =
    "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600";
  const label = "block text-sm font-medium text-slate-800";

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <button
          onClick={() => navigate("/trips")}
          className="text-sm text-slate-600 underline-offset-4 hover:underline"
        >
          Back to trip schedule
        </button>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
          {isEdit ? `Edit trip #${id}` : "Schedule a trip"}
        </h1>
        <p className="mt-1 max-w-prose text-sm text-slate-600">
          Set the route and departure, then allocate a boat and crew. The slot is checked for clashes before
          anything is saved.
        </p>

        {conflicts.length > 0 && (
          <div className="mt-6 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
            <p className="font-medium">This slot is already taken</p>
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
        {notice && (
          <p className="mt-6 rounded-md border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-900">
            {notice}
          </p>
        )}

        <div className="mt-6 space-y-8 rounded-lg border border-slate-200 bg-white p-6">
          <section className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={label} htmlFor="route">
                Route
              </label>
              <input
                id="route"
                value={form.route}
                onChange={set("route")}
                placeholder="Mangrove River Safari"
                className={field}
              />
            </div>
            <div>
              <label className={label} htmlFor="tripDate">
                Date
              </label>
              <input id="tripDate" type="date" value={form.tripDate} onChange={set("tripDate")} className={field} />
            </div>
            <div>
              <label className={label} htmlFor="departureTime">
                Start time
              </label>
              <input
                id="departureTime"
                type="time"
                value={form.departureTime}
                onChange={set("departureTime")}
                className={field}
              />
            </div>
            <div>
              <label className={label} htmlFor="duration">
                Duration
              </label>
              <input
                id="duration"
                list="duration-presets"
                value={form.duration}
                onChange={set("duration")}
                placeholder="3 Hours"
                className={field}
              />
              <datalist id="duration-presets">
                {DURATION_PRESETS.map((d) => (
                  <option key={d} value={d} />
                ))}
              </datalist>
              <p className="mt-1 text-xs text-slate-500">
                Written as hours or minutes. It is read back as a length when checking for clashes.
              </p>
            </div>
            <div>
              <label className={label} htmlFor="price">
                Price per seat (LKR)
              </label>
              <input
                id="price"
                type="number"
                min="1"
                step="50"
                value={form.price}
                onChange={set("price")}
                className={field}
              />
            </div>
          </section>

          <section className="border-t border-slate-200 pt-6">
            <h2 className="text-base font-semibold text-slate-900">Boat and crew</h2>
            <p className="mt-1 text-sm text-slate-600">
              Every trip needs all three before it can be saved.
            </p>
            <div className="mt-4 grid gap-5 sm:grid-cols-3">
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
            </div>
          </section>

          <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-6">
            <button
              onClick={save}
              disabled={saving}
              className="rounded-md bg-teal-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-800 disabled:opacity-60"
            >
              {saving ? "Saving…" : isEdit ? "Save changes" : "Create trip"}
            </button>
            <button
              onClick={verify}
              className="rounded-md border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
              Check availability
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
