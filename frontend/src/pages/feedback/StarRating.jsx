import { useState } from "react";

/**
 * Star rating, used two ways:
 *   readOnly  -> shows a saved rating
 *   editable  -> the 1-5 input on the review form (click, or arrow keys once focused)
 */
export default function StarRating({
  value = 0,
  onChange,
  readOnly = false,
  size = "md",
  showValue = false,
}) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  const dimensions = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-9 w-9" }[size];

  const handleKeyDown = (event) => {
    if (readOnly) return;
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      onChange(Math.min(5, (value || 0) + 1));
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      onChange(Math.max(1, (value || 1) - 1));
    }
  };

  return (
    <div
      className="inline-flex items-center gap-1"
      role={readOnly ? "img" : "radiogroup"}
      aria-label={readOnly ? `Rated ${value} out of 5` : "Rating out of 5"}
      onKeyDown={handleKeyDown}
      tabIndex={readOnly ? -1 : 0}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= active;
        const Star = (
          <svg
            viewBox="0 0 24 24"
            className={`${dimensions} ${filled ? "text-amber-500" : "text-slate-300"} transition-colors`}
            fill={filled ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 3.5l2.6 5.6 6 .8-4.4 4.2 1.1 6.1L12 17.3l-5.3 2.9 1.1-6.1L3.4 9.9l6-.8L12 3.5z" />
          </svg>
        );

        if (readOnly) return <span key={star}>{Star}</span>;

        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} ${star === 1 ? "star" : "stars"}`}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
          >
            {Star}
          </button>
        );
      })}

      {showValue && value > 0 && (
        <span className="ml-2 text-sm font-medium text-slate-600">{value}/5</span>
      )}
    </div>
  );
}
