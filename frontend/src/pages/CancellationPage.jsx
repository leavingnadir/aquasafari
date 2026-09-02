import { CalendarX } from "lucide-react";

export default function CancellationPage() {
  return (
    <div className="min-h-screen bg-surface-955 text-content-primary pt-28 pb-20 px-4 font-body">
      <div className="max-w-4xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-400 mb-4 border border-brand-500/20">
            <CalendarX size={14} />
            Policy Guide
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Cancellation & Refund Policy
          </h1>
          <p className="text-content-secondary text-base">
            Understand our guidelines for modifying, canceling, or rescheduling your booked aquatic safari tours.
          </p>
        </div>

        <div className="rounded-[2.5rem] border border-surface-800 bg-surface-900 p-8 md:p-12 shadow-xl space-y-8">
          <section className="space-y-3">
            <h2 className="font-display text-2xl font-semibold text-content-primary">1. Standard Cancellation Window</h2>
            <p className="text-sm leading-relaxed text-content-secondary">
              You are eligible for a free cancellation and full refund up to **48 hours** before your scheduled trip departure time. Cancellations made inside the 48-hour window may be subject to a late cancellation fee.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl font-semibold text-content-primary">2. Weather & Safety Rescheduling</h2>
            <p className="text-sm leading-relaxed text-content-secondary">
              Marine safety is paramount. If trips are canceled or interrupted by AquaSafari due to unsafe weather conditions, rough seas, or government restrictions, you will be offered an immediate choice of a full refund or free rescheduling to an alternative date.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl font-semibold text-content-primary">3. No-Shows</h2>
            <p className="text-sm leading-relaxed text-content-secondary">
              Failure to arrive at the designated departure point by the scheduled boarding time is classified as a no-show. No-shows are ineligible for refunds or rescheduling credits.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}