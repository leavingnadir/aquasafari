import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getTrips,
  getResources,
  deleteTrip,
  formatTime,
  formatPrice,
  nameFor,
  isUpcoming,
} from "../../services/tripService";
import {
  Compass,
  Search,
  Plus,
  Loader2,
  ShieldAlert,
  CheckCircle2,
  Anchor,
  Users,
  Calendar,
  DollarSign,
} from "lucide-react";
import usePageTitle from "../../hooks/usePageTitle";

export default function TripList() {
  usePageTitle("Trip Management");

  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [resources, setResources] = useState({ boats: [], operators: [], guides: [] });
  const [range, setRange] = useState("UPCOMING");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [tripRows, lookups] = await Promise.all([getTrips(), getResources()]);
      setTrips(tripRows);
      setResources(lookups);
    } catch (err) {
      setBanner({ tone: "error", text: err.message, details: err.conflicts });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return trips.filter((t) => {
      const matchesRange =
        range === "ALL" ||
        (range === "UPCOMING" && isUpcoming(t.tripDate)) ||
        (range === "PAST" && !isUpcoming(t.tripDate));
      const matchesTerm =
        !term || t.route.toLowerCase().includes(term) || String(t.tripId).includes(term);
      return matchesRange && matchesTerm;
    });
  }, [trips, range, search]);

  const handleDelete = async (trip) => {
    const ok = window.confirm(`Delete trip #${trip.tripId} (${trip.route})? This cannot be undone.`);
    if (!ok) return;

    setBanner(null);
    try {
      await deleteTrip(trip.tripId);
      setBanner({ tone: "ok", text: `Trip #${trip.tripId} deleted` });
      await load();
    } catch (err) {
      setBanner({ tone: "error", text: err.message, details: err.conflicts });
    }
  };

  return (
    <div className="min-h-screen px-4 pt-24 pb-16 font-body text-content-primary">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-surface-800 pb-6">
          <div>
            <h1 className="font-display text-3xl font-normal tracking-tight text-content-primary">
              Trip schedule
            </h1>
            <p className="mt-1 max-w-prose text-sm text-content-secondary">
              Set up safari departures, allocate a boat and crew, and keep the public listing accurate.
            </p>
          </div>
          <Link
            to="/trips/new"
            className="flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-lg shadow-brand-500/20 transition-all hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <Plus size={16} />
            <span>Schedule a trip</span>
          </Link>
        </header>

        {banner && (
          <div
            role="status"
            className={`mt-6 flex items-center gap-3 rounded-2xl border px-5 py-4 ${
              banner.tone === "ok"
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                : "border-rose-500/20 bg-rose-500/10 text-rose-400"
            }`}
          >
            {banner.tone === "ok" ? <CheckCircle2 size={18} className="shrink-0" /> : <ShieldAlert size={18} className="shrink-0" />}
            <div>
              <p className="text-sm font-medium">{banner.text}</p>
              {banner.details?.length > 0 && (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
                  {banner.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[260px] max-w-md">
            <label className="sr-only" htmlFor="trip-search">
              Search trips
            </label>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted" size={16} />
            <input
              id="trip-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by route or trip number"
              className="w-full rounded-2xl border border-surface-800 bg-surface py-3 pl-11 pr-4 text-sm text-content-primary outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
            />
          </div>
          <div className="flex gap-1 rounded-full border border-surface-800 bg-surface p-1.5">
            {[
              ["UPCOMING", "Upcoming"],
              ["PAST", "Past"],
              ["ALL", "All"],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setRange(key)}
                className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                  range === key
                    ? "bg-brand-500 text-white shadow-md shadow-brand-500/20"
                    : "text-content-secondary hover:text-content-primary"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 overflow-x-auto rounded-[2.5rem] border border-surface-800 bg-surface-900 shadow-2xl">
          {loading ? (
            <div className="flex min-h-[40vh] items-center justify-center gap-2 px-6 py-12 text-content-secondary">
              <Loader2 size={20} className="animate-spin text-brand-500" />
              <span className="text-sm">Loading trips…</span>
            </div>
          ) : visible.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-surface-800 bg-surface text-content-muted">
                <Compass size={28} />
              </div>
              <p className="mt-4 font-display text-xl text-content-primary">No trips here yet</p>
              <p className="mt-1 text-sm text-content-secondary">
                Schedule a departure to make it bookable for customers.
              </p>
              <Link
                to="/trips/new"
                className="mt-6 rounded-full border border-surface-800 bg-surface px-6 py-3 text-xs font-semibold uppercase tracking-wider text-content-primary transition-all hover:bg-surface-800"
              >
                Schedule a trip
              </Link>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-surface-800 text-[11px] font-bold uppercase tracking-wider text-content-secondary">
                <tr>
                  <th className="px-6 py-4">Trip</th>
                  <th className="px-6 py-4">Departure</th>
                  <th className="px-6 py-4">Boat</th>
                  <th className="px-6 py-4">Crew</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-800">
                {visible.map((trip) => (
                  <tr key={trip.tripId} className="align-top transition-colors hover:bg-surface/50">
                    <td className="px-6 py-5">
                      <p className="font-display text-base font-normal text-content-primary">{trip.route}</p>
                      <p className="text-xs text-content-muted font-mono">Trip #{trip.tripId}</p>
                    </td>
                    <td className="px-6 py-5 text-content-secondary">
                      <p className="flex items-center gap-1.5 text-xs font-medium">
                        <Calendar size={13} className="text-brand-500" /> {trip.tripDate}
                      </p>
                      <p className="mt-1 text-xs text-content-muted font-mono">
                        {formatTime(trip.departureTime)} · {trip.duration}
                      </p>
                    </td>
                    <td className="px-6 py-5 text-content-secondary">
                      <span className="inline-flex items-center gap-1.5 text-xs">
                        <Anchor size={13} className="text-brand-500" />
                        {nameFor(resources.boats, trip.boatId)}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-xs text-content-secondary space-y-1">
                      <p className="flex items-center gap-1.5">
                        <Users size={13} className="text-brand-500" /> Skipper: {nameFor(resources.operators, trip.operatorId)}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Users size={13} className="text-brand-500" /> Guide: {nameFor(resources.guides, trip.guideId)}
                      </p>
                    </td>
                    <td className="px-6 py-5 text-content-primary">
                      <p className="font-display text-base font-normal">{formatPrice(trip.price)}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap justify-end gap-2 text-xs font-semibold uppercase tracking-wider">
                        <button
                          onClick={() => navigate(`/trips/${trip.tripId}/edit`)}
                          className="rounded-full border border-surface-800 bg-surface px-4 py-2 text-content-secondary transition-all hover:bg-surface-800 hover:text-content-primary"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => navigate(`/trips/${trip.tripId}/assign`)}
                          className="rounded-full border border-surface-800 bg-surface px-4 py-2 text-content-secondary transition-all hover:bg-surface-800 hover:text-content-primary"
                        >
                          Assign boat
                        </button>
                        <button
                          onClick={() => handleDelete(trip)}
                          className="rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-rose-400 transition-all hover:bg-rose-500/20"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
