import { Shield, FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-surface-955 text-content-primary pt-28 pb-20 px-4 font-body">
      <div className="max-w-4xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-400 mb-4 border border-brand-500/20">
            <FileText size={14} />
            Legal Agreement
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Terms & Conditions
          </h1>
          <p className="text-content-secondary text-base">
            Please read these terms and conditions carefully before booking or participating in any AquaSafari tour or charter.
          </p>
        </div>

        <div className="rounded-[2.5rem] border border-surface-800 bg-surface-900 p-8 md:p-12 shadow-xl space-y-8">
          <section className="space-y-3">
            <h2 className="font-display text-2xl font-semibold text-content-primary">1. Acceptance of Terms</h2>
            <p className="text-sm leading-relaxed text-content-secondary">
              By accessing our website, registering an account, or booking a safari experience with AquaSafari, you agree to be bound by these Terms & Conditions. If you disagree with any part of these terms, you may not access our services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl font-semibold text-content-primary">2. Bookings & Payments</h2>
            <p className="text-sm leading-relaxed text-content-secondary">
              All bookings are subject to availability and confirmation. Full or partial payment via our supported payment gateways is required at the time of reservation to secure your charter slot. Prices are listed in local or standard currency and are subject to change without notice prior to booking confirmation.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl font-semibold text-content-primary">3. Passenger Conduct & Safety</h2>
            <p className="text-sm leading-relaxed text-content-secondary">
              Safety is our highest priority. Passengers must strictly follow all instructions provided by licensed skippers and crew members at all times. AquaSafari reserves the right to terminate any trip without refund if passenger behavior endangers the crew, vessel, or other guests.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl font-semibold text-content-primary">4. Liability Waiver</h2>
            <p className="text-sm leading-relaxed text-content-secondary">
              Water sports and marine excursions carry inherent risks. While we maintain rigorous safety standards and equipment inspections, AquaSafari is not liable for personal injury, loss, or damage to personal property incurred during tours, except where caused by proven gross negligence.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}