import { ShieldCheck } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-surface-955 text-content-primary pt-28 pb-20 px-4 font-body">
      <div className="max-w-4xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-400 mb-4 border border-brand-500/20">
            <ShieldCheck size={14} />
            Data Protection
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-content-secondary text-base">
            At AquaSafari, we respect your privacy and are committed to protecting your personal data.
          </p>
        </div>

        <div className="rounded-[2.5rem] border border-surface-800 bg-surface-900 p-8 md:p-12 shadow-xl space-y-8">
          <section className="space-y-3">
            <h2 className="font-display text-2xl font-semibold text-content-primary">1. Information We Collect</h2>
            <p className="text-sm leading-relaxed text-content-secondary">
              When you book a trip, register an account, or contact support, we may collect personal information including your name, email address, phone number, and payment details necessary to fulfill your safari reservation.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl font-semibold text-content-primary">2. How We Use Your Data</h2>
            <p className="text-sm leading-relaxed text-content-secondary">
              Your data is used strictly to process bookings, communicate schedule updates or weather alerts, manage accounts, and improve our overall user experience and customer support.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl font-semibold text-content-primary">3. Data Security</h2>
            <p className="text-sm leading-relaxed text-content-secondary">
              We implement industry-standard administrative, technical, and physical security measures to safeguard your personal details against unauthorized access, disclosure, or misuse.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl font-semibold text-content-primary">4. Contact Regarding Privacy</h2>
            <p className="text-sm leading-relaxed text-content-secondary">
              If you have any questions or concerns regarding our privacy practices or wish to review your stored account details, please reach out via our Help Center.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}