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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-sm p-0 sm:items-center sm:p-4">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-dialog-title"
        tabIndex={-1}
        className="w-full max-w-lg rounded-t-2xl border border-content-muted/20 bg-surface shadow-2xl outline-none sm:rounded-2xl"
      >
        <div className="border-b border-content-muted/20 px-6 py-5">
          <h2 id="review-dialog-title" className="text-lg font-semibold tracking-tight text-content-primary">
            {mode === "edit" ? "Edit your review" : "How was the trip?"}
          </h2>
          {trip?.route && (
            <p className="mt-1 text-sm text-content-muted">
              {trip.route}
              {trip.tripDate ? ` · sailed ${formatDate(trip.tripDate)}` : ""}
            </p>
          )}
        </div>

        <div className="space-y-6 px-6 py-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-content-primary">Your rating</label>
            <StarRating value={rating} onChange={setRating} size="lg" showValue />
          </div>

          <div>
            <label htmlFor="review-comment" className="mb-2 block text-sm font-medium text-content-primary">
              Your review <span className="font-normal text-content-muted">(optional)</span>
            </label>
            <textarea
              id="review-comment"
              rows={5}
              maxLength={MAX_COMMENT}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="What stood out — the route, the guide, the boat?"
              className="w-full resize-none rounded-xl border border-content-muted/30 bg-surface px-3 py-2 text-sm text-content-primary placeholder:text-content-muted focus:border-[#F05C35] focus:outline-none focus:ring-2 focus:ring-[#F05C35]/20"
            />
            <p className={`mt-1 text-xs ${remaining < 50 ? "text-amber-500" : "text-content-muted"}`}>
              {remaining} characters left
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600">
              <p>{error.message}</p>
              {error.flaggedWords?.length > 0 && (
                <p className="mt-1 text-red-600 font-medium">
                  Flagged: {error.flaggedWords.join(", ")}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-content-muted/20 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-content-muted hover:bg-content-muted/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-content-muted"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-[#F05C35] px-5 py-2 text-sm font-medium text-white hover:bg-[#d94d29] disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F05C35] focus-visible:ring-offset-2 transition-colors"
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