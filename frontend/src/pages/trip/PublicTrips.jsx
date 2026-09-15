import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAvailableTrips,
  getResources,
  formatTime,
  formatPrice,
  nameFor,
} from "../../services/tripService";
import { Search, Calendar, MapPin, Loader2, ShieldAlert, Compass } from "lucide-react";

/**
 * Customer listing (use case step 6). "Book this trip" hands the trip id to the
 * Booking module, directing them to the search/booking workflow.
 */
export default function PublicTrips() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [boats, setBoats] = useState([]);
  const [filters, setFilters] = useState({ route: "", date: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async (query = filters) => {
    setLoading(true);
    setError("");
    try {
      setTrips(await getAvailableTrips(query));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load({ route: "", date: "" });
    getResources()
      .then((r) => setBoats(r.boats))
      .catch(() => setBoats([]));
  }, []);

  return (
    <div className="min-h-screen px-4 pt-24 pb-16 font-body text-content-primary">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-display text-4xl font-normal tracking-tight text-content-primary">
          Upcoming safaris
        </h1>
        <p className="mt-2 max-w-prose text-sm text-content-secondary">
          Every departure below has a boat, a skipper and a guide ready. Pick a date and reserve your seats.
        </p>

        {/* Filters Section */}
        <div className="mt-8 flex flex-wrap items-end gap-3 rounded-[2.5rem] border border-surface-800 bg-surface-900 p-6 shadow-xl">
          <div className="flex-1 min-w-[220px]">
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-content-secondary" htmlFor="route">
              <MapPin size={14} className="text-brand-500" /> Route
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted" size={16} />
              <input
                id="route"
                value={filters.route}
                onChange={(e) => setFilters({ ...filters, route: e.target.value })}
                placeholder="Mangrove, lagoon, whale…"
                className="w-full rounded-2xl border border-surface-800 bg-surface py-3 pl-11 pr-4 text-sm text-content-primary outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-content-secondary" htmlFor="date">
              <Calendar size={14} className="text-brand-500" /> Date
            </label>
            <input
              id="date"
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="rounded-2xl border border-surface-800 bg-surface px-4 py-3 text-sm text-content-primary outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => load()}
              className="rounded-full bg-brand-500 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-lg shadow-brand-500/20 transition-all hover:bg-brand-600"
            >
              Find trips
            </button>
            <button
              onClick={() => {
                setFilters({ route: "", date: "" });
                load({ route: "", date: "" });
              }}
              className="rounded-full border border-surface-800 bg-surface px-5 py-3 text-xs font-semibold uppercase tracking-wider text-content-secondary transition-all hover:bg-surface-800 hover:text-content-primary"
            >
              Clear
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-5 py-4 text-rose-400">
            <ShieldAlert size={18} className="shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[40vh] items-center justify-center gap-2 text-content-secondary">
            <Loader2 size={20} className="animate-spin text-brand-500" />
            <span className="text-sm">Loading departures…</span>
          </div>
        ) : trips.length === 0 ? (
          <div className="mt-16 flex flex-col items-center justify-center rounded-[2.5rem] border border-surface-800 bg-surface-900 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-surface-800 bg-surface text-content-muted">
              <Compass size={28} />
            </div>
            <p className="mt-4 font-display text-xl text-content-primary">Nothing scheduled for that search</p>
            <p className="mt-1 text-sm text-content-secondary">Try another date or clear the filters.</p>
          </div>
        ) : (
          <ul className="mt-8 space-y-4">
            {trips.map((trip) => {
              // Unified pricing fallback check (handles both price and pricePerSeat naming)
              const displayPrice = trip.pricePerSeat ?? trip.price ?? 0;

              return (
                <li
                  key={trip.tripId}
                  className="flex flex-wrap items-center justify-between gap-6 rounded-[2rem] border border-surface-800 bg-surface-900 p-6 shadow-xl transition-all hover:border-surface-700"
                >
                  <div>
                    <h2 className="font-display text-2xl font-normal text-content-primary">{trip.route}</h2>
                    <p className="mt-1 text-xs text-content-secondary font-mono">
                      {trip.tripDate} · departs {formatTime(trip.departureTime)} · {trip.durationMinutes || trip.duration} min on the water
                    </p>
                    {boats.length > 0 && (
                      <p className="mt-1.5 text-xs font-medium text-brand-500">
                        Boat: {nameFor(boats, trip.boatId)}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-display text-2xl font-normal text-content-primary">{formatPrice(displayPrice)}</p>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-content-muted">per seat</p>
                    </div>
                    <button
                      onClick={() => navigate(`/search`)}
                      className="rounded-full bg-brand-500 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-lg shadow-brand-500/20 transition-all hover:bg-brand-600"
                    >
                      Book this trip
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}