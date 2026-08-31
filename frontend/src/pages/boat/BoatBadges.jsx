import React from "react";

const STATUS_STYLES = {
  AVAILABLE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  ASSIGNED: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  MAINTENANCE: "bg-brand-500/10 text-brand-400 border-brand-500/20",
  INACTIVE: "bg-slate-400/10 text-slate-400 border-slate-400/20",
};

const CONDITION_STYLES = {
  GOOD: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  NEEDS_MAINTENANCE: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  UNDER_REPAIR: "bg-brand-500/10 text-brand-400 border-brand-500/20",
  OUT_OF_SERVICE: "bg-rose-500/10 text-rose-400 border-rose-500/20",
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
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${
        STATUS_STYLES[value] ?? "bg-surface-800 text-content-secondary border-surface-700"
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
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${
        CONDITION_STYLES[value] ?? "bg-surface-800 text-content-secondary border-surface-700"
      }`}
    >
      {LABELS[value] ?? value}
    </span>
  );
}
