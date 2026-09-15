import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAvailableTrips,
  getResources,
  formatTime,
  formatPrice,
  nameFor,
} from "../../services/tripService";

/**
 * Customer listing (use case step 6). "Book this trip" hands the trip id to the
 * Booking module, so keep /bookings/new in sync with that teammate's route.
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
    <div className="min-h-screen bg-white px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">Upcoming safaris</h1>
        <p className="mt-2 max-w-prose text-slate-600">
          Every departure below has a boat, a skipper and a guide ready. Pick a date and reserve your seats.
        </p>

        <div className="mt-8 flex flex-wrap items-end gap-3 border-y border-slate-200 py-4">
          <div>
            <label className="block text-sm font-medium text-slate-800" htmlFor="route">
              Route
            </label>
            <input
              id="route"
              value={filters.route}
              onChange={(e) => setFilters({ ...filters, route: e.target.value })}
              placeholder="Mangrove, lagoon, whale…"
              className="mt-1 w-64 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-800" htmlFor="date">
              Date
            </label>
            <input
              id="date"
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="mt-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>
          <button
            onClick={() => load()}
            className="rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            Find trips
          </button>
          <button
            onClick={() => {
              setFilters({ route: "", date: "" });
              load({ route: "", date: "" });
            }}
            className="rounded-md px-3 py-2.5 text-sm text-slate-600 hover:text-slate-900"
          >
            Clear
          </button>
        </div>

        {error && <p className="mt-6 text-sm text-rose-700">{error}</p>}

        {loading ? (
          <p className="mt-10 text-sm text-slate-500">Loading departures…</p>
        ) : trips.length === 0 ? (
          <div className="mt-16 text-center">
            <p className="text-lg font-medium text-slate-900">Nothing scheduled for that search</p>
            <p className="mt-1 text-sm text-slate-600">Try another date or clear the filters.</p>
          </div>
        ) : (
          <ul className="mt-8 divide-y divide-slate-200">
            {trips.map((trip) => (
              <li key={trip.tripId} className="flex flex-wrap items-center justify-between gap-4 py-6">
                <div>
                  <h2 className="text-xl font-medium text-slate-900">{trip.route}</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {trip.tripDate} · departs {formatTime(trip.departureTime)} · {trip.duration} on the water
                  </p>
                  {boats.length > 0 && (
                    <p className="mt-1 text-sm text-slate-500">{nameFor(boats, trip.boatId)}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-semibold text-slate-900">{formatPrice(trip.price)}</p>
                  <p className="text-xs text-slate-500">per seat</p>
                  <button
                    onClick={() => navigate(`/bookings/new?tripId=${trip.tripId}`)}
                    className="mt-3 rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
                  >
                    Book this trip
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
