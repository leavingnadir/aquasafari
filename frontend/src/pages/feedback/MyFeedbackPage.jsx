import { useCallback, useEffect, useState } from "react";
import feedbackApi from "../../api/feedbackApi";
import { getCurrentUser } from "./currentUser";
import FeedbackCard from "./components/FeedbackCard";
import FeedbackForm from "./components/FeedbackForm";

/** The customer's own reviews: view, edit and delete (update + delete of the CRUD set). */
export default function MyFeedbackPage() {
  const user = getCurrentUser();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setReviews(await feedbackApi.byCustomer(user.userId));
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }, [user.userId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleUpdate = async ({ rating, comment }) => {
    await feedbackApi.update(editing.feedbackId, { customerId: user.userId, rating, comment });
    setEditing(null);
    setNotice("Review updated.");
    await load();
  };

  const handleDelete = async (review) => {
    const confirmed = window.confirm(
      `Remove your review of ${review.route}? This cannot be undone.`
    );
    if (!confirmed) return;
    try {
      await feedbackApi.remove(review.feedbackId, user.userId);
      setNotice("Review removed.");
      await load();
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  const average =
    reviews.length === 0
      ? null
      : (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Your reviews</h1>
          <p className="mt-1 text-sm text-slate-600">
            Everything you have published, newest first.
          </p>
        </div>
        {average && (
          <p className="text-sm text-slate-500">
            {reviews.length} {reviews.length === 1 ? "review" : "reviews"} · you rate trips {average} on average
          </p>
        )}
      </header>

      {notice && (
        <div role="status" className="mb-6 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-900">
          {notice}
        </div>
      )}

      {loading && <p className="text-sm text-slate-500">Loading your reviews…</p>}

      {error && !loading && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
      )}

      {!loading && reviews.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center">
          <p className="text-sm text-slate-600">You haven't reviewed a trip yet.</p>
          <a
            href="/feedback/submit"
            className="mt-3 inline-block rounded-lg bg-teal-800 px-4 py-2 text-sm font-medium text-white hover:bg-teal-900"
          >
            Review a trip
          </a>
        </div>
      )}

      <div className="space-y-3">
        {reviews.map((review) => (
          <FeedbackCard
            key={review.feedbackId}
            feedback={review}
            showCustomer={false}
            onEdit={setEditing}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <FeedbackForm
        open={Boolean(editing)}
        mode="edit"
        trip={editing}
        initialValues={editing ? { rating: editing.rating, comment: editing.comment ?? "" } : undefined}
        onSave={handleUpdate}
        onClose={() => setEditing(null)}
      />
    </main>
  );
}
