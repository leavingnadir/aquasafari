import React from "react";
import { Receipt, CheckCircle2, AlertCircle } from "lucide-react";
import usePageTitle from "../../hooks/usePageTitle";

const STATUS_STYLES = {
  PAID: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  DECLINED: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
  PENDING: "bg-brand-500/10 text-brand-400 border border-brand-500/20",
  REFUNDED: "bg-slate-400/10 text-slate-400 border border-slate-400/20",
};

function formatCurrency(amount) {
  const value = Number(amount ?? 0);
  return new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(value);
}

function formatDate(dateString) {
  if (!dateString) return "—";
  const d = new Date(dateString);
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * A "boarding pass" style receipt for a boat safari payment - the signature
 * visual element of the Payment module: a dashed perforation divider between
 * the transaction stub and the tear-off confirmation counterfoil.
 */
export default function PaymentReceipt({ payment }) {
  usePageTitle("Payment Receipt");

  if (!payment) return null;

  const statusClass = STATUS_STYLES[payment.paymentStatus] || STATUS_STYLES.PENDING;

  return (
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-[2.5rem] border border-surface-800 bg-surface-900 shadow-2xl font-body text-content-primary relative">
      
      {/* Background Glow Accent */}
      <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />

      {/* Header stub */}
      <div className="bg-surface px-8 py-6 border-b border-surface-800">
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-1 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-brand-500">
              <Receipt size={12} />
              AquaSafari
            </div>
            <h2 className="font-display text-2xl font-normal tracking-tight text-content-primary">Payment Receipt</h2>
          </div>
          <span
            className={`rounded-full px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${statusClass}`}
          >
            {payment.paymentStatus}
          </span>
        </div>
      </div>

      {/* Perforation Divider */}
      <div className="relative flex items-center px-8 my-1">
        <div className="h-4 w-4 -translate-x-1/2 rounded-full bg-surface-900 border-r border-surface-800" style={{ marginLeft: "-2rem" }} />
        <div className="flex-1 border-t-2 border-dashed border-surface-800" />
        <div className="h-4 w-4 translate-x-1/2 rounded-full bg-surface-900 border-l border-surface-800" style={{ marginRight: "-2rem" }} />
      </div>

      {/* Details Grid */}
      <dl className="grid grid-cols-2 gap-x-6 gap-y-4 px-8 py-6 text-sm">
        <Detail label="Booking Ref." value={`#${payment.bookingId}`} mono />
        <Detail label="Payment ID" value={`#${payment.paymentId ?? "—"}`} mono />
        <Detail label="Amount" value={formatCurrency(payment.amount)} emphasize />
        <Detail label="Method" value={(payment.paymentMethod || "—").replace("_", " ")} />
        <Detail label="Date & Time" value={formatDate(payment.paymentDate)} span2 />
        <Detail
          label="Confirmation Code"
          value={payment.transactionReference || "—"}
          mono
          span2
        />
        {payment.paymentStatus === "DECLINED" && (
          <Detail label="Decline Reason" value={payment.declineReason || "—"} span2 warn />
        )}
      </dl>

      {/* Footer Note */}
      <div className="border-t border-surface-800 bg-surface/50 px-8 py-4 text-center text-xs text-content-secondary">
        Keep this receipt as proof of payment for your trip.
      </div>
    </div>
  );
}

function Detail({ label, value, mono, emphasize, span2, warn }) {
  return (
    <div className={span2 ? "col-span-2" : ""}>
      <dt className="text-[10px] font-bold uppercase tracking-wider text-content-muted">
        {label}
      </dt>
      <dd
        className={[
          "mt-1",
          mono ? "font-mono text-content-primary font-medium" : "",
          emphasize ? "font-display text-2xl font-normal text-brand-500" : "text-content-primary",
          warn ? "text-rose-400 font-medium" : "",
          !emphasize && !mono && !warn ? "text-content-secondary" : "",
        ].join(" ")}
      >
        {value}
      </dd>
    </div>
  );
}
