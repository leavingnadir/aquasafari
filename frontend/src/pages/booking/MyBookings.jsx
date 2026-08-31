import { useEffect, useState } from "react";
import { getBookingsForCustomer, cancelBooking } from "../../api/bookingApi";
import CustomerIdBar, { getStoredCustomerId } from "./CustomerIdBar";

const statusBadge = {
  PENDING: "bg-amber-100 text-amber-800 border-amber-300",
  CONFIRMED: "bg-teal-100 text-teal-800 border-teal-300",
  CANCELLED: "bg-stone-100 text-stone-600 border-stone-300",
  EXPIRED: "bg-rose-100 text-rose-700 border-rose-300",
};

export default function MyBookings() {
  const [customerId, setCustomerId] = useState(getStoredCustomerId());
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  const load = async (id) => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const data = await getBookingsForCustomer(id);
      setBookings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(customerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancel = async (bookingId) => {
    setCancellingId(bookingId);
    setError("");
    try {
      await cancelBooking(bookingId, Number(customerId));
      await load(customerId);
    } catch (err) {
      setError(err.message);
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-6 border-b border-teal-900/10 pb-4">
        <h1 className="text-3xl font-semibold tracking-tight text-teal-950">My bookings</h1>
        <p className="mt-1 text-teal-800/80">View your reservations and cancel if plans change.</p>
      </header>

      <div className="mb-6">
        <CustomerIdBar
          customerId={customerId}
          onChange={(id) => {
            setCustomerId(id);
            load(id);
          }}
        />
      </div>

      {error && (
        <div className="mb-6 rounded-md border border-rose-300 bg-rose-50 px-4 py-3 text-rose-800">
          {error}
        </div>
      )}

      {loading && <p className="text-teal-800/70">Loading your bookings…</p>}

      {!loading && bookings.length === 0 && (
        <p className="rounded-md border border-dashed border-teal-900/20 px-4 py-10 text-center text-teal-800/70">
          No bookings yet. Head to Search Trips to reserve your first safari.
        </p>
      )}

      <ul className="space-y-3">
        {bookings.map((booking) => (
          <li
            key={booking.bookingId}
            className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-teal-900/10 bg-white p-4 shadow-sm"
          >
            <div>
              <p className="font-semibold text-teal-950">Booking #{booking.bookingId}</p>
              <p className="text-sm text-teal-800/80">
                Trip #{booking.tripId} · {booking.passengerCount} passenger(s) · booked{" "}
                {booking.bookingDate}
              </p>
              {booking.bookingStatus === "PENDING" && booking.reservationExpiresAt && (
                <p className="text-sm text-amber-700">
                  Reservation holds until{" "}
                  {new Date(booking.reservationExpiresAt).toLocaleTimeString()}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`rounded-full border px-3 py-1 text-xs font-medium ${statusBadge[booking.bookingStatus]}`}
              >
                {booking.bookingStatus}
              </span>
              {(booking.bookingStatus === "PENDING" || booking.bookingStatus === "CONFIRMED") && (
                <button
                  onClick={() => handleCancel(booking.bookingId)}
                  disabled={cancellingId === booking.bookingId}
                  className="rounded-md border border-rose-300 px-3 py-1.5 text-sm font-medium text-rose-700 transition hover:bg-rose-50 disabled:opacity-50"
                >
                  {cancellingId === booking.bookingId ? "Cancelling…" : "Cancel"}
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
