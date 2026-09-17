import { useCallback, useEffect, useState } from "react";
import feedbackApi from "../../api/feedbackApi";
import StarRating from "./components/StarRating";

/**
 * Administrator view of every review (the secondary actor in the use case):
 * search, filter by rating, and remove anything that should not stay published.
 * Administrators cannot rewrite a customer's words — the backend refuses that.
 */
export default function ManageFeedbackPage() {
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState("");
  const [minRating, setMinRating] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setReviews(await feedbackApi.search({ search, minRating }));
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }, [search, minRating]);

  useEffect(() => {
    const timer = setTimeout(load, 250); // debounce so typing doesn't hammer the API
    return () => clearTimeout(timer);
  }, [load]);

  const handleDelete = async (review) => {
    const confirmed = window.confirm(
      `Remove ${review.customerName}'s review of ${review.route}? This cannot be undone.`
    );
    if (!confirmed) return;
    try {
      await feedbackApi.remove(review.feedbackId);
      setNotice(`Removed review #${review.feedbackId}.`);
      await load();
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  const average =
    reviews.length === 0
      ? "—"
      : (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Customer feedback</h1>
        <p className="mt-1 text-sm text-slate-600">
          {reviews.length} {reviews.length === 1 ? "review" : "reviews"} in view · average {average} stars
        </p>
      </header>

      <div className="mb-6 flex flex-wrap gap-3">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by customer, route or wording"
          className="min-w-[16rem] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
        />
        <select
          value={minRating}
          onChange={(event) => setMinRating(event.target.value)}
          aria-label="Minimum rating"
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
        >
          <option value="">All ratings</option>
          <option value="4">4 stars and up</option>
          <option value="3">3 stars and up</option>
          <option value="2">2 stars and up</option>
          <option value="1">1 star and up</option>
        </select>
      </div>

      {notice && (
        <div role="status" className="mb-6 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-900">
          {notice}
        </div>
      )}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">Customer</th>
              <th scope="col" className="px-4 py-3 font-medium">Trip</th>
              <th scope="col" className="px-4 py-3 font-medium">Rating</th>
              <th scope="col" className="px-4 py-3 font-medium">Review</th>
              <th scope="col" className="px-4 py-3 font-medium sr-only">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">Loading reviews…</td>
              </tr>
            )}

            {!loading && reviews.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  No reviews match this search.
                </td>
              </tr>
            )}

            {!loading &&
              reviews.map((review) => (
                <tr key={review.feedbackId} className="align-top">
                  <td className="px-4 py-4">
                    <p className="font-medium text-slate-900">{review.customerName}</p>
                    <p className="text-xs text-slate-500">Booking #{review.bookingId}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-slate-800">{review.route}</p>
                    <p className="text-xs text-slate-500">{formatDate(review.tripDate)}</p>
                  </td>
                  <td className="px-4 py-4">
                    <StarRating value={review.rating} readOnly size="sm" />
                  </td>
                  <td className="max-w-md px-4 py-4 text-slate-700">
                    {review.comment || <span className="italic text-slate-400">Rating only</span>}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(review)}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
