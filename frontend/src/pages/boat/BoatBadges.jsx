const STATUS_STYLES = {
  AVAILABLE: "bg-emerald-100 text-emerald-800 border-emerald-300",
  ASSIGNED: "bg-sky-100 text-sky-800 border-sky-300",
  MAINTENANCE: "bg-amber-100 text-amber-800 border-amber-300",
  INACTIVE: "bg-stone-200 text-stone-600 border-stone-300",
};

const CONDITION_STYLES = {
  GOOD: "bg-emerald-50 text-emerald-700 border-emerald-200",
  NEEDS_MAINTENANCE: "bg-amber-50 text-amber-700 border-amber-200",
  UNDER_REPAIR: "bg-orange-50 text-orange-700 border-orange-200",
  OUT_OF_SERVICE: "bg-red-50 text-red-700 border-red-200",
};

const LABELS = {
  AVAILABLE: "Available",
  ASSIGNED: "Assigned",
  MAINTENANCE: "Maintenance",
  INACTIVE: "Inactive",
  GOOD: "Good",
  NEEDS_MAINTENANCE: "Needs maintenance",
  UNDER_REPAIR: "Under repair",
  OUT_OF_SERVICE: "Out of service",
};

export function StatusBadge({ value }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
        STATUS_STYLES[value] ?? "bg-stone-100 text-stone-600 border-stone-300"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {LABELS[value] ?? value}
    </span>
  );
}

export function ConditionBadge({ value }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${
        CONDITION_STYLES[value] ?? "bg-stone-100 text-stone-600 border-stone-300"
      }`}
    >
      {LABELS[value] ?? value}
    </span>
  );
}
