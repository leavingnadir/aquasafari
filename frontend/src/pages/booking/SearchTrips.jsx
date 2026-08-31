import { useState } from "react";
import { searchTrips, bookTrip } from "../../api/bookingApi";
import CustomerIdBar, { getStoredCustomerId } from "./CustomerIdBar";

const statusStyles = {
  ok: "text-teal-800",
  full: "text-rose-700",
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
    <div className="mx-auto max-w-4xl px-4 py-8">
      <header className="mb-6 border-b border-teal-900/10 pb-4">
        <h1 className="text-3xl font-semibold tracking-tight text-teal-950">
          Find a safari trip
        </h1>
        <p className="mt-1 text-teal-800/80">
          Search by route or date, then reserve seats — availability updates live.
        </p>
      </header>

      <div className="mb-6">
        <CustomerIdBar customerId={customerId} onChange={setCustomerId} />
      </div>

      <form
        onSubmit={runSearch}
        className="mb-8 flex flex-col gap-3 rounded-lg border border-teal-900/10 bg-white p-4 shadow-sm sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium text-teal-950">Route</label>
          <input
            value={route}
            onChange={(e) => setRoute(e.target.value)}
            placeholder="e.g. Mangrove Lagoon"
            className="w-full rounded-md border border-teal-900/20 px-3 py-2 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/30"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-teal-950">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-md border border-teal-900/20 px-3 py-2 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/30"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-teal-800 px-5 py-2 font-medium text-white transition hover:bg-teal-900 disabled:opacity-60"
        >
          {loading ? "Searching…" : "Search trips"}
        </button>
      </form>

      {error && (
        <div className="mb-6 rounded-md border border-rose-300 bg-rose-50 px-4 py-3 text-rose-800">
          {error}
        </div>
      )}

      {confirmation && (
        <div className="mb-6 rounded-md border border-teal-300 bg-teal-50 px-4 py-3 text-teal-900">
          Reserved. Booking <span className="font-semibold">#{confirmation.bookingId}</span> is{" "}
          <span className="font-semibold">{confirmation.bookingStatus}</span> — complete payment
          before <span className="font-semibold">
            {new Date(confirmation.reservationExpiresAt).toLocaleTimeString()}
          </span>{" "}
          or the seats are released back to the pool.
        </div>
      )}

      {trips === null && !loading && (
        <p className="rounded-md border border-dashed border-teal-900/20 px-4 py-10 text-center text-teal-800/70">
          Search above to see available safari trips.
        </p>
      )}

      {trips?.length === 0 && (
        <p className="rounded-md border border-dashed border-teal-900/20 px-4 py-10 text-center text-teal-800/70">
          No trips match that search. Try a different route or date.
        </p>
      )}

      <ul className="space-y-3">
        {trips?.map((trip) => {
          const isFull = trip.seatsAvailable <= 0;
          const passengerCount = passengerCounts[trip.tripId] ?? 1;
          const total = (trip.pricePerSeat * passengerCount).toFixed(2);

          return (
            <li
              key={trip.tripId}
              className="rounded-lg border border-teal-900/10 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-teal-950">{trip.route}</h2>
                  <p className="text-sm text-teal-800/80">
                    {trip.tripDate} · {trip.departureTime} · {trip.durationMinutes} min
                  </p>
                  <p className={`mt-1 text-sm font-medium ${isFull ? statusStyles.full : statusStyles.ok}`}>
                    {isFull ? "Fully booked" : `${trip.seatsAvailable} of ${trip.boatCapacity} seats available`}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-teal-900">Passengers</label>
                    <input
                      type="number"
                      min={1}
                      max={Math.max(trip.seatsAvailable, 1)}
                      value={passengerCount}
                      disabled={isFull}
                      onChange={(e) =>
                        setPassengerCounts((prev) => ({ ...prev, [trip.tripId]: e.target.value }))
                      }
                      className="w-16 rounded-md border border-teal-900/20 px-2 py-1 text-right disabled:bg-teal-900/5"
                    />
                  </div>
                  <p className="text-sm text-teal-800/80">
                    Est. total: <span className="font-semibold text-teal-950">Rs {total}</span>
                  </p>
                  <button
                    onClick={() => handleBook(trip)}
                    disabled={isFull || bookingTripId === trip.tripId}
                    className="rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {bookingTripId === trip.tripId ? "Reserving…" : "Reserve seats"}
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
