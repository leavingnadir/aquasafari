import StarRating from "./StarRating";

/**
 * One published review. Edit and remove render only when the caller passes a handler,
 * so the same card serves the customer's own list, a trip page, and the admin table.
 */
export default function FeedbackCard({ feedback, onEdit, onDelete, showCustomer = true }) {
  return (
    <article className="rounded-xl border border-content-muted/20 bg-surface p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <StarRating value={feedback.rating} readOnly size="sm" />
          <p className="mt-2 text-sm font-medium text-content-primary">
            {showCustomer ? feedback.customerName : feedback.route}
          </p>
          <p className="text-xs text-content-muted">
            {showCustomer && feedback.route ? `${feedback.route} · ` : ""}
            {feedback.tripDate ? formatDate(feedback.tripDate) : `Booking #${feedback.bookingId}`}
          </p>
        </div>

        {(onEdit || onDelete) && (
          <div className="flex gap-2">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(feedback)}
                className="rounded-lg border border-content-muted/30 px-3 py-1.5 text-xs font-medium text-content-primary hover:bg-content-muted/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F05C35]"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(feedback)}
                className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              >
                Remove
              </button>
            )}
          </div>
        )}
      </div>

      {feedback.comment ? (
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-content-primary">{feedback.comment}</p>
      ) : (
        <p className="mt-3 text-sm italic text-content-muted">Rating only, no written review.</p>
      )}
    </article>
  );
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}