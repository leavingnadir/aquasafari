import { useState } from "react";
import { searchTrips, bookTrip } from "../../api/bookingApi";
import CustomerIdBar, { getStoredCustomerId } from "./CustomerIdBar";
import { Search, Calendar, Compass, ShieldAlert, CheckCircle2, Loader2, Users } from "lucide-react";

const statusStyles = {
  ok: "text-emerald-400",
  full: "text-rose-400",
};

export default function SearchTrips() {
  const [customerId, setCustomerId] = useState(getStoredCustomerId());
  const [route, setRoute] = useState("");
  const [date, setDate] = useState("");
  const [trips, setTrips] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // passenger count entered per-trip, keyed by tripId
  const [passengerCounts, setPassengerCounts] = useState({});
  const [bookingTripId, setBookingTripId] = useState(null);
  const [confirmation, setConfirmation] = useState(null);

  const runSearch = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError("");
    setConfirmation(null);
    try {
      const results = await searchTrips({ route, date });
      setTrips(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (trip) => {
    if (!customerId) {
      setError("Set a customer ID above before booking.");
      return;
    }
    const count = Number(passengerCounts[trip.tripId] || 1);
    if (count < 1 || count > trip.seatsAvailable) {
      setError(`Passenger count must be between 1 and ${trip.seatsAvailable}.`);
      return;
    }

    setBookingTripId(trip.tripId);
    setError("");
    try {
      const booking = await bookTrip({
        customerId: Number(customerId),
        tripId: trip.tripId,
        passengerCount: count,
      });
      setConfirmation(booking);
      runSearch(); // refresh availability now that seats are held
    } catch (err) {
      setError(err.message);
    } finally {
      setBookingTripId(null);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 pt-24 pb-12 font-body text-content-primary">
      <header className="mb-8 border-b border-surface-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-800 bg-surface text-brand-500">
            <Compass size={20} />
          </div>
          <h1 className="font-display text-3xl font-normal tracking-tight text-content-primary">
            Find a safari trip
          </h1>
        </div>
        <p className="mt-2 text-sm text-content-secondary">
          Search by route or date, then reserve seats — availability updates live.
        </p>
      </header>

      <div className="mb-6">
        <CustomerIdBar customerId={customerId} onChange={setCustomerId} />
      </div>

      <form
        onSubmit={runSearch}
        className="mb-8 flex flex-col gap-4 rounded-[2.5rem] border border-surface-800 bg-surface-900 p-6 shadow-xl sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-content-secondary">Route</label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted" size={16} />
            <input
              value={route}
              onChange={(e) => setRoute(e.target.value)}
              placeholder="e.g. Mangrove Lagoon"
              className="w-full rounded-2xl border border-surface-800 bg-surface py-3 pl-11 pr-4 text-sm text-content-primary outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-content-secondary">Date</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted" size={16} />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-2xl border border-surface-800 bg-surface py-3 pl-11 pr-4 text-sm text-content-primary outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-lg shadow-brand-500/20 transition-all hover:bg-brand-600 disabled:opacity-60"
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          <span>{loading ? "Searching…" : "Search trips"}</span>
        </button>
      </form>

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-5 py-4 text-rose-400">
          <ShieldAlert size={18} className="shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {confirmation && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 text-emerald-300">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-400" />
          <div className="text-sm">
            Reserved. Booking <span className="font-semibold text-content-primary">#{confirmation.bookingId}</span> is{" "}
            <span className="font-semibold text-content-primary">{confirmation.bookingStatus}</span> — complete payment
            before{" "}
            <span className="font-semibold text-content-primary">
              {new Date(confirmation.reservationExpiresAt).toLocaleTimeString()}
            </span>{" "}
            or the seats are released back to the pool.
          </div>
        </div>
      )}

      {trips === null && !loading && (
        <div className="rounded-[2.5rem] border border-dashed border-surface-800 bg-surface-900 px-6 py-16 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-surface-800 bg-surface text-content-muted">
            <Search size={20} />
          </div>
          <p className="text-sm font-medium text-content-primary">Search above to see available safari trips.</p>
        </div>
      )}

      {trips?.length === 0 && (
        <div className="rounded-[2.5rem] border border-dashed border-surface-800 bg-surface-900 px-6 py-16 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-surface-800 bg-surface text-content-muted">
            <Compass size={20} />
          </div>
          <p className="text-sm font-medium text-content-primary">No trips match that search.</p>
          <p className="mt-1 text-xs text-content-secondary">Try a different route or date.</p>
        </div>
      )}

      <ul className="space-y-4">
        {trips?.map((trip) => {
          const isFull = trip.seatsAvailable <= 0;
          const passengerCount = passengerCounts[trip.tripId] ?? 1;
          const total = (trip.pricePerSeat * passengerCount).toFixed(2);

          return (
            <li
              key={trip.tripId}
              className="rounded-[2.5rem] border border-surface-800 bg-surface-900 p-6 shadow-xl transition-colors hover:border-surface-700"
            >
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div>
                  <h2 className="font-display text-xl font-normal text-content-primary">{trip.route}</h2>
                  <p className="mt-1 text-xs text-content-secondary">
                    {trip.tripDate} · {trip.departureTime} · {trip.durationMinutes} min
                  </p>
                  <p className={`mt-2 text-xs font-semibold uppercase tracking-wider ${isFull ? statusStyles.full : statusStyles.ok}`}>
                    {isFull ? "Fully booked" : `${trip.seatsAvailable} of ${trip.boatCapacity} seats available`}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-content-secondary">
                      <Users size={14} />
                      <span>Passengers</span>
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={Math.max(trip.seatsAvailable, 1)}
                      value={passengerCount}
                      disabled={isFull}
                      onChange={(e) =>
                        setPassengerCounts((prev) => ({ ...prev, [trip.tripId]: e.target.value }))
                      }
                      className="w-16 rounded-xl border border-surface-800 bg-surface px-3 py-1.5 text-right text-sm font-mono text-content-primary outline-none focus:border-brand-500 disabled:opacity-40"
                    />
                  </div>
                  <p className="text-xs text-content-secondary">
                    Est. total: <span className="font-mono font-semibold text-content-primary">Rs {total}</span>
                  </p>
                  <button
                    onClick={() => handleBook(trip)}
                    disabled={isFull || bookingTripId === trip.tripId}
                    className="flex items-center gap-2 rounded-full bg-brand-500 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-lg shadow-brand-500/20 transition-all hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {bookingTripId === trip.tripId && <Loader2 size={14} className="animate-spin" />}
                    <span>{bookingTripId === trip.tripId ? "Reserving…" : "Reserve seats"}</span>
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
