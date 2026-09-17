import { useEffect, useState } from "react";
import feedbackApi from "../../../api/feedbackApi";
import StarRating from "../../StarRating";
import FeedbackCard from "../../components/FeedbackCard";

/**
 * Step 6 of the use case: the aggregated rating published on a trip details page.
 *
 * For the Trip module teammate — drop this straight into the trip details view:
 *   import TripRatingSummary from "../feedback/components/TripRatingSummary";
 *   <TripRatingSummary tripId={trip.tripId} />
 * Pass withReviews={false} for just the score, no review list.
 */
export default function TripRatingSummary({ tripId, withReviews = true }) {
  const [summary, setSummary] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [summaryData, reviewData] = await Promise.all([
          feedbackApi.tripSummary(tripId),
          withReviews ? feedbackApi.byTrip(tripId) : Promise.resolve([]),
        ]);
        if (cancelled) return;
        setSummary(summaryData);
        setReviews(reviewData);
      } catch (apiError) {
        if (!cancelled) setError(apiError.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (tripId) load();
    return () => {
      cancelled = true;
    };
  }, [tripId, withReviews]);

  if (loading) return <p className="text-sm text-slate-500">Loading ratings…</p>;
  if (error) return <p className="text-sm text-red-700">{error}</p>;
  if (!summary) return null;

  const total = summary.totalReviews;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="shrink-0">
          <p className="text-6xl font-semibold leading-none tracking-tight text-teal-900">
            {total === 0 ? "—" : summary.averageRating.toFixed(1)}
          </p>
          <div className="mt-2">
            <StarRating value={Math.round(summary.averageRating)} readOnly size="sm" />
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {total === 0 ? "No reviews yet" : `${total} ${total === 1 ? "review" : "reviews"}`}
          </p>
        </div>

        <div className="w-full space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = summary.distribution?.[star] ?? 0;
            const percent = total === 0 ? 0 : Math.round((count / total) * 100);
            return (
              <div key={star} className="flex items-center gap-3 text-xs text-slate-500">
                <span className="w-3 tabular-nums">{star}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-amber-500" style={{ width: `${percent}%` }} />
                </div>
                <span className="w-8 text-right tabular-nums">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {withReviews && reviews.length > 0 && (
        <div className="mt-6 space-y-3 border-t border-slate-100 pt-6">
          {reviews.map((review) => (
            <FeedbackCard key={review.feedbackId} feedback={review} />
          ))}
        </div>
      )}

      {withReviews && total === 0 && (
        <p className="mt-6 border-t border-slate-100 pt-6 text-sm text-slate-500">
          Be the first to review this trip once you have sailed it.
        </p>
      )}
    </section>
  );
}
