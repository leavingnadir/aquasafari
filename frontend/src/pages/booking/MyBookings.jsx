import { useEffect, useState } from "react";
import { getBookingsForCustomer, cancelBooking } from "../../api/bookingApi";
import CustomerIdBar, { getStoredCustomerId } from "./CustomerIdBar";
import { CalendarCheck, ShieldAlert, Loader2, Calendar, Users, XCircle } from "lucide-react";

const statusBadge = {
  PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  CONFIRMED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  CANCELLED: "bg-slate-400/10 text-slate-400 border-slate-400/20",
  EXPIRED: "bg-rose-500/10 text-rose-400 border-rose-500/20",
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
    <div className="mx-auto max-w-3xl px-4 pt-24 pb-12 font-body text-content-primary">
      <header className="mb-8 border-b border-surface-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-800 bg-surface text-brand-500">
            <CalendarCheck size={20} />
          </div>
          <h1 className="font-display text-3xl font-normal tracking-tight text-content-primary">
            My bookings
          </h1>
        </div>
        <p className="mt-2 text-sm text-content-secondary">
          View your reservations and cancel if plans change.
        </p>
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
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-5 py-4 text-rose-400">
          <ShieldAlert size={18} className="shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-2 py-12 text-content-secondary">
          <Loader2 size={18} className="animate-spin" />
          <span className="text-sm">Loading your bookings…</span>
        </div>
      )}

      {!loading && bookings.length === 0 && (
        <div className="rounded-[2.5rem] border border-dashed border-surface-800 bg-surface-900 px-6 py-16 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-surface-800 bg-surface text-content-muted">
            <Calendar size={20} />
          </div>
          <p className="text-sm font-medium text-content-primary">No bookings yet.</p>
          <p className="mt-1 text-xs text-content-secondary">Head to Search Trips to reserve your first safari.</p>
        </div>
      )}

      <ul className="space-y-4">
        {bookings.map((booking) => (
          <li
            key={booking.bookingId}
            className="flex flex-wrap items-center justify-between gap-6 rounded-[2.5rem] border border-surface-800 bg-surface-900 p-6 shadow-xl transition-colors hover:border-surface-700"
          >
            <div>
              <p className="font-display text-lg font-normal text-content-primary">
                Booking #{booking.bookingId}
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-content-secondary">
                <span>Trip #{booking.tripId}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Users size={12} />
                  <span>{booking.passengerCount} passenger(s)</span>
                </span>
                <span>·</span>
                <span>booked {booking.bookingDate}</span>
              </div>
              {booking.bookingStatus === "PENDING" && booking.reservationExpiresAt && (
                <p className="mt-2 text-xs font-medium text-amber-400">
                  Reservation holds until{" "}
                  {new Date(booking.reservationExpiresAt).toLocaleTimeString()}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4">
              <span
                className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${
                  statusBadge[booking.bookingStatus] ?? "bg-surface-800 text-content-secondary border-surface-700"
                }`}
              >
                {booking.bookingStatus}
              </span>
              {(booking.bookingStatus === "PENDING" || booking.bookingStatus === "CONFIRMED") && (
                <button
                  onClick={() => handleCancel(booking.bookingId)}
                  disabled={cancellingId === booking.bookingId}
                  className="flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-rose-400 transition-all hover:bg-rose-500/20 disabled:opacity-50"
                >
                  {cancellingId === booking.bookingId && <Loader2 size={13} className="animate-spin" />}
                  <XCircle size={13} />
                  <span>{cancellingId === booking.bookingId ? "Cancelling…" : "Cancel"}</span>
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
