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

export default function TripList() {
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
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Trip schedule</h1>
            <p className="mt-1 max-w-prose text-sm text-slate-600">
              Set up safari departures, allocate a boat and crew, and keep the public listing accurate.
            </p>
          </div>
          <Link
            to="/trips/new"
            className="rounded-md bg-teal-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
          >
            Schedule a trip
          </Link>
        </header>

        {banner && (
          <div
            role="status"
            className={`mt-6 rounded-md border px-4 py-3 text-sm ${
              banner.tone === "ok"
                ? "border-teal-200 bg-teal-50 text-teal-900"
                : "border-rose-200 bg-rose-50 text-rose-900"
            }`}
          >
            <p className="font-medium">{banner.text}</p>
            {banner.details?.length > 0 && (
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {banner.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <label className="sr-only" htmlFor="trip-search">
            Search trips
          </label>
          <input
            id="trip-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by route or trip number"
            className="w-72 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
          />
          <div className="flex gap-1 rounded-md bg-white p-1 ring-1 ring-slate-200">
            {[
              ["UPCOMING", "Upcoming"],
              ["PAST", "Past"],
              ["ALL", "All"],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setRange(key)}
                className={`rounded px-3 py-1.5 text-sm transition ${
                  range === key ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white">
          {loading ? (
            <p className="px-6 py-12 text-center text-sm text-slate-500">Loading trips…</p>
          ) : visible.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <p className="text-base font-medium text-slate-900">No trips here yet</p>
              <p className="mt-1 text-sm text-slate-600">
                Schedule a departure to make it bookable for customers.
              </p>
              <Link
                to="/trips/new"
                className="mt-4 inline-block rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
              >
                Schedule a trip
              </Link>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-xs font-semibold text-slate-600">
                <tr>
                  <th className="px-4 py-3">Trip</th>
                  <th className="px-4 py-3">Departure</th>
                  <th className="px-4 py-3">Boat</th>
                  <th className="px-4 py-3">Crew</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visible.map((trip) => (
                  <tr key={trip.tripId} className="align-top hover:bg-slate-50/70">
                    <td className="px-4 py-4">
                      <p className="font-medium text-slate-900">{trip.route}</p>
                      <p className="text-xs text-slate-500">Trip #{trip.tripId}</p>
                    </td>
                    <td className="px-4 py-4 text-slate-700">
                      <p>{trip.tripDate}</p>
                      <p className="text-xs text-slate-500">
                        {formatTime(trip.departureTime)} · {trip.duration}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-slate-700">{nameFor(resources.boats, trip.boatId)}</td>
                    <td className="px-4 py-4 text-xs text-slate-600">
                      <p>Skipper: {nameFor(resources.operators, trip.operatorId)}</p>
                      <p>Guide: {nameFor(resources.guides, trip.guideId)}</p>
                    </td>
                    <td className="px-4 py-4 text-slate-700">{formatPrice(trip.price)}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap justify-end gap-2 text-xs font-medium">
                        <button
                          onClick={() => navigate(`/trips/${trip.tripId}/edit`)}
                          className="rounded border border-slate-300 px-2.5 py-1.5 text-slate-800 hover:bg-slate-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => navigate(`/trips/${trip.tripId}/assign`)}
                          className="rounded border border-slate-300 px-2.5 py-1.5 text-slate-800 hover:bg-slate-100"
                        >
                          Assign boat
                        </button>
                        <button
                          onClick={() => handleDelete(trip)}
                          className="rounded border border-rose-300 px-2.5 py-1.5 text-rose-700 hover:bg-rose-50"
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
