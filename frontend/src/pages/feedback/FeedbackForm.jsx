import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";

const MAX_COMMENT = 500;

/**
 * The review form, opened as a dialog from both "Write a review" and "Edit review".
 * onSave receives { rating, comment } and may throw an ApiError, which is shown inline
 * (this is where the content check in step 4 of the use case surfaces to the customer).
 */
export default function FeedbackForm({ open, trip, initialValues, onSave, onClose, mode = "create" }) {
  const [rating, setRating] = useState(initialValues?.rating ?? 0);
  const [comment, setComment] = useState(initialValues?.comment ?? "");
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setRating(initialValues?.rating ?? 0);
    setComment(initialValues?.comment ?? "");
    setError(null);
    dialogRef.current?.focus();
  }, [open, initialValues]);

  useEffect(() => {
    if (!open) return undefined;
    const onEscape = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [open, onClose]);

  if (!open) return null;

  const handleSave = async () => {
    if (!rating) {
      setError({ message: "Choose a rating from 1 to 5 stars" });
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave({ rating, comment: comment.trim() });
    } catch (apiError) {
      setError(apiError);
    } finally {
      setSaving(false);
    }
  };

  const remaining = MAX_COMMENT - comment.length;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-4">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-dialog-title"
        tabIndex={-1}
        className="w-full max-w-lg rounded-t-2xl bg-white shadow-xl outline-none sm:rounded-2xl"
      >
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 id="review-dialog-title" className="text-lg font-semibold tracking-tight text-slate-900">
            {mode === "edit" ? "Edit your review" : "How was the trip?"}
          </h2>
          {trip?.route && (
            <p className="mt-1 text-sm text-slate-500">
              {trip.route}
              {trip.tripDate ? ` · sailed ${formatDate(trip.tripDate)}` : ""}
            </p>
          )}
        </div>

        <div className="space-y-6 px-6 py-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Your rating</label>
            <StarRating value={rating} onChange={setRating} size="lg" showValue />
          </div>

          <div>
            <label htmlFor="review-comment" className="mb-2 block text-sm font-medium text-slate-700">
              Your review <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <textarea
              id="review-comment"
              rows={5}
              maxLength={MAX_COMMENT}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="What stood out — the route, the guide, the boat?"
              className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
            />
            <p className={`mt-1 text-xs ${remaining < 50 ? "text-amber-600" : "text-slate-400"}`}>
              {remaining} characters left
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              <p>{error.message}</p>
              {error.flaggedWords?.length > 0 && (
                <p className="mt-1 text-red-700">
                  Flagged: {error.flaggedWords.join(", ")}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-teal-800 px-5 py-2 text-sm font-medium text-white hover:bg-teal-900 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
          >
            {saving ? "Saving…" : mode === "edit" ? "Save changes" : "Publish review"}
          </button>
        </div>
      </div>
    </div>
  );
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
