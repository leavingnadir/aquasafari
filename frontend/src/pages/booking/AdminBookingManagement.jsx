import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarCheck,
  CheckCircle2,
  Loader2,
  Search,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import {
  cancelBookingForAdmin,
  confirmBookingForAdmin,
  getAllBookingsForAdmin,
} from "../../api/bookingApi";
import { useAuth } from "../../context/AuthContext.jsx";
import usePageTitle from "../../hooks/usePageTitle";

const STATUS_BADGE = {
  PENDING: "border-amber-500/20 bg-amber-500/10 text-amber-400",
  CONFIRMED: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  CANCELLED: "border-slate-400/20 bg-slate-400/10 text-slate-400",
  EXPIRED: "border-rose-500/20 bg-rose-500/10 text-rose-400",
};

export default function AdminBookingManagement() {
  usePageTitle("Booking Management");

  const { auth } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [processing, setProcessing] = useState({});

  useEffect(() => {
    let active = true;
    getAllBookingsForAdmin(auth.token)
      .then((data) => {
        if (active) setBookings(data);
      })
      .catch((err) => {
        if (active) setError(err.message || "Could not load booking records.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [auth.token]);

  const visibleBookings = useMemo(() => {
    const term = search.trim().toLowerCase();
    return bookings.filter((booking) => {
      const matchesStatus =
        statusFilter === "ALL" || booking.bookingStatus === statusFilter;
      const matchesSearch =
        !term ||
        [booking.bookingId, booking.customerId, booking.tripId]
          .some((value) => String(value).toLowerCase().includes(term));
      return matchesStatus && matchesSearch;
    });
  }, [bookings, search, statusFilter]);

  async function updateBooking(bookingId, action) {
    setProcessing((current) => ({ ...current, [bookingId]: action }));
    setError("");
    try {
      const updated =
        action === "confirm"
          ? await confirmBookingForAdmin(auth.token, bookingId)
          : await cancelBookingForAdmin(auth.token, bookingId);
      setBookings((current) =>
        current.map((booking) =>
          booking.bookingId === updated.bookingId ? updated : booking
        )
      );
    } catch (err) {
      setError(err.message || `Could not ${action} booking #${bookingId}.`);
    } finally {
      setProcessing((current) => {
        const next = { ...current };
        delete next[bookingId];
        return next;
      });
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-12 pt-28 font-body text-content-primary sm:px-6">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-5 border-b border-surface-800 pb-6">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-500">
            <ShieldCheck size={16} />
            <span>Admin only</span>
          </div>
          <h1 className="font-display text-3xl font-normal tracking-tight">
            Booking Management
          </h1>
          <p className="mt-2 text-sm text-content-secondary">
            View and manage reservations across all customers.
          </p>
        </div>
        <Link
          to="/admin"
          className="rounded-full border border-surface-800 bg-surface-900 px-5 py-2.5 text-xs font-semibold text-content-secondary transition hover:border-brand-500/50 hover:text-content-primary"
        >
          Back to dashboard
        </Link>
      </header>

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-5 py-4 text-rose-400">
          <ShieldAlert size={18} className="shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      <section className="mb-5 flex flex-col gap-3 rounded-3xl border border-surface-800 bg-surface-900 p-4 sm:flex-row">
        <label className="relative flex-1">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search booking, customer, or trip ID"
            className="w-full rounded-2xl border border-surface-800 bg-surface px-11 py-3 text-sm text-content-primary outline-none transition placeholder:text-content-muted focus:border-brand-500"
          />
        </label>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label="Filter bookings by status"
          className="rounded-2xl border border-surface-800 bg-surface px-4 py-3 text-sm text-content-primary outline-none focus:border-brand-500"
        >
          <option value="ALL">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="EXPIRED">Expired</option>
        </select>
      </section>

      <div className="overflow-hidden rounded-[2rem] border border-surface-800 bg-surface-900 shadow-xl">
        {loading ? (
          <div className="flex items-center justify-center gap-2 px-6 py-16 text-content-secondary">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">Loading all bookings…</span>
          </div>
        ) : visibleBookings.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <CalendarCheck size={24} className="mx-auto mb-3 text-content-muted" />
            <p className="text-sm font-medium text-content-primary">
              {bookings.length === 0
                ? "No bookings found."
                : "No bookings match your search."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-surface-800">
            {visibleBookings.map((booking) => {
              const activeAction = processing[booking.bookingId];
              return (
                <article
                  key={booking.bookingId}
                  className="flex flex-col justify-between gap-5 p-5 transition-colors hover:bg-surface-800/30 sm:flex-row sm:items-center sm:px-6"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="font-display text-lg text-content-primary">
                        Booking #{booking.bookingId}
                      </h2>
                      <span
                        className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                          STATUS_BADGE[booking.bookingStatus] ??
                          "border-surface-700 bg-surface-800 text-content-secondary"
                        }`}
                      >
                        {booking.bookingStatus}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-content-secondary">
                      <span>Customer #{booking.customerId}</span>
                      <span>Trip #{booking.tripId}</span>
                      <span>{booking.passengerCount} passenger(s)</span>
                      <span>Booked {booking.bookingDate}</span>
                    </div>
                    {booking.bookingStatus === "PENDING" &&
                      booking.reservationExpiresAt && (
                        <p className="mt-2 text-xs text-amber-400">
                          Reservation expires{" "}
                          {new Date(booking.reservationExpiresAt).toLocaleString()}
                        </p>
                      )}
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {booking.bookingStatus === "PENDING" && (
                      <button
                        type="button"
                        onClick={() => updateBooking(booking.bookingId, "confirm")}
                        disabled={Boolean(activeAction)}
                        className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-500/20 disabled:opacity-50"
                      >
                        {activeAction === "confirm" ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <CheckCircle2 size={14} />
                        )}
                        Confirm
                      </button>
                    )}
                    {["PENDING", "CONFIRMED"].includes(booking.bookingStatus) && (
                      <button
                        type="button"
                        onClick={() => updateBooking(booking.bookingId, "cancel")}
                        disabled={Boolean(activeAction)}
                        className="flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-400 transition hover:bg-rose-500/20 disabled:opacity-50"
                      >
                        {activeAction === "cancel" ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <XCircle size={14} />
                        )}
                        Cancel
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
