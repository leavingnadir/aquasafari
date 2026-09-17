import StarRating from "./StarRating";

/**
 * One published review. Edit and remove render only when the caller passes a handler,
 * so the same card serves the customer's own list, a trip page, and the admin table.
 */
export default function FeedbackCard({ feedback, onEdit, onDelete, showCustomer = true }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <StarRating value={feedback.rating} readOnly size="sm" />
          <p className="mt-2 text-sm font-medium text-slate-900">
            {showCustomer ? feedback.customerName : feedback.route}
          </p>
          <p className="text-xs text-slate-500">
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
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(feedback)}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              >
                Remove
              </button>
            )}
          </div>
        )}
      </div>

      {feedback.comment ? (
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-slate-700">{feedback.comment}</p>
      ) : (
        <p className="mt-3 text-sm italic text-slate-400">Rating only, no written review.</p>
      )}
    </article>
  );
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
