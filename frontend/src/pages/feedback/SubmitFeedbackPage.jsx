import { useCallback, useEffect, useState } from "react";
import feedbackApi from "../../api/feedbackApi";
import { getCurrentUser } from "./currentUser";
import FeedbackForm from "../../components/FeedbackForm";

/**
 * Main scenario steps 1-3: the customer opens their completed trip history, picks a
 * trip and writes a review. Trips that are not finished, not paid for, or already
 * reviewed come back from the API with reviewable = false and the reason attached
 * (extension 1a), so the button is disabled and explains itself.
 */
export default function SubmitFeedbackPage() {
  const user = getCurrentUser();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [confirmation, setConfirmation] = useState("");

  const loadTrips = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setTrips(await feedbackApi.reviewableTrips(user.userId));
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }, [user.userId]);

  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  const handleSave = async ({ rating, comment }) => {
    await feedbackApi.submit({
      bookingId: selected.bookingId,
      customerId: user.userId,
      rating,
      comment,
    });
    setSelected(null);
    setConfirmation("Review published. Thanks for sailing with us.");
    await loadTrips();
  };

  return (
    // Added pt-24 (or pt-28) to push the content down below the fixed navbar
    <main className="mx-auto max-w-3xl px-4 pt-28 pb-10">
      <header className="mb-8">
        <p className="eyebrow mb-2">Customer Portal</p>
        <h1 className="text-2xl font-bold tracking-tight text-content-primary">Your trips</h1>
        <p className="mt-1 max-w-prose text-sm text-content-muted">
          Review a safari once it has finished and the payment is verified.
        </p>
      </header>

      {confirmation && (
        <div
          role="status"
          className="mb-6 rounded-xl border border-brand-500/30 bg-brand-500/10 px-4 py-3 text-sm text-content-primary"
        >
          {confirmation}
        </div>
      )}

      {loading && <p className="text-sm text-content-muted">Loading your trips…</p>}

      {error && !loading && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600">
          <p>{error}</p>
          <button
            type="button"
            onClick={loadTrips}
            className="mt-2 font-medium underline underline-offset-2"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && trips.length === 0 && (
        <div className="rounded-2xl border border-dashed border-content-muted/30 p-10 text-center">
          <p className="text-sm text-content-muted">
            No trips here yet. Book a safari and it will show up once you have sailed it.
          </p>
        </div>
      )}

      <ul className="space-y-3">
        {trips.map((trip) => (
          <li
            key={trip.bookingId}
            className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-content-muted/20 bg-surface p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div>
              <p className="font-semibold text-content-primary">{trip.route}</p>
              <p className="mt-1 text-sm text-content-muted">
                {formatDate(trip.tripDate)}
                {trip.departureTime ? ` · ${trip.departureTime.slice(0, 5)}` : ""}
                {trip.duration ? ` · ${trip.duration}` : ""}
                {trip.passengerCount ? ` · ${trip.passengerCount} passengers` : ""}
              </p>
              {!trip.reviewable && (
                <p className="mt-2 inline-block rounded-full bg-content-muted/10 px-3 py-1 text-xs text-content-muted font-medium">
                  {trip.blockedReason}
                </p>
              )}
            </div>

            <button
              type="button"
              disabled={!trip.reviewable}
              onClick={() => setSelected(trip)}
              className="rounded-lg bg-[#F05C35] px-4 py-2 text-sm font-medium text-white hover:bg-[#d94d29] disabled:cursor-not-allowed disabled:bg-content-muted/20 disabled:text-content-muted transition-colors"
            >
              Write a review
            </button>
          </li>
        ))}
      </ul>

      <FeedbackForm
        open={Boolean(selected)}
        trip={selected}
        onSave={handleSave}
        onClose={() => setSelected(null)}
      />
    </main>
  );
}

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}