import React, { useEffect, useState } from "react";
import { getPaymentHistory } from "../../api/paymentApi";
import PaymentReceipt from "./PaymentReceipt";
import { FileText, ArrowUpDown, Filter, ShieldAlert, CheckCircle2 } from "lucide-react";

const STATUS_CONFIG = {
  PAID: { dot: "bg-emerald-500", text: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  DECLINED: { dot: "bg-rose-500", text: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
  PENDING: { dot: "bg-brand-500", text: "text-brand-400", bg: "bg-brand-500/10 border-brand-500/20" },
  REFUNDED: { dot: "bg-slate-400", text: "text-slate-400", bg: "bg-slate-400/10 border-slate-400/20" },
};

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(
    Number(amount ?? 0)
  );
}

function formatDate(dateString) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * "Ship's Log" style payment history - used by Accountant to generate
 * payment history and by Customer to view their past transactions.
 */
export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await getPaymentHistory();
      setPayments(data);
    } catch (err) {
      setError(err.message || "Could not load payment history.");
    } finally {
      setLoading(false);
    }
  }

  const filtered =
    filter === "ALL" ? payments : payments.filter((p) => p.paymentStatus === filter);

  const totalPaid = payments
    .filter((p) => p.paymentStatus === "PAID")
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  return (
    <div className="min-h-screen bg-surface pt-40 px-4 py-16 text-content-primary font-body">
      <div className="mx-auto max-w-5xl">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-surface-800 bg-surface-900 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-brand-500 shadow-sm">
              <FileText size={12} />
              Ship's Log
            </div>
            <h1 className="font-display text-4xl font-normal tracking-tight text-content-primary">
              Payment History
            </h1>
          </div>

          {/* Total Collected Metric Card */}
          <div className="rounded-2xl border border-surface-800 bg-surface-900 px-6 py-4 text-right shadow-xl">
            <p className="text-[10px] font-bold uppercase tracking-wider text-content-muted">
              Total Collected
            </p>
            <p className="font-display text-2xl font-normal text-brand-500 mt-0.5">
              {formatCurrency(totalPaid)}
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="mb-6 flex flex-wrap gap-2">
          {["ALL", "PAID", "DECLINED", "PENDING", "REFUNDED"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                filter === s
                  ? "bg-brand-500 text-white shadow-md shadow-brand-500/20"
                  : "border border-surface-800 bg-surface-900 text-content-secondary hover:border-surface-700 hover:text-content-primary"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Table / Content Container */}
        <div className="overflow-hidden rounded-[2.5rem] border border-surface-800 bg-surface-900 shadow-2xl">
          {loading && (
            <div className="p-12 text-center text-sm text-content-secondary">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent mb-3" />
              <p>Loading payment history…</p>
            </div>
          )}
          
          {error && (
            <div className="m-6 flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
              <ShieldAlert size={20} className="shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="p-16 text-center text-sm text-content-secondary">
              <p>No payments found for this filter configuration.</p>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-surface-800 text-[11px] font-bold uppercase tracking-wider text-content-muted">
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Payment ID</th>
                    <th className="px-6 py-4">Booking</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Method</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-800/60">
                  {filtered.map((p) => {
                    const statusStyle = STATUS_CONFIG[p.paymentStatus] || { dot: "bg-slate-400", text: "text-slate-400", bg: "" };
                    return (
                      <tr
                        key={p.paymentId}
                        onClick={() => setSelected(p)}
                        className="cursor-pointer transition-colors hover:bg-surface-800/50"
                      >
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium border ${statusStyle.bg}`}>
                            <span className={`h-2 w-2 rounded-full ${statusStyle.dot}`} />
                            <span className={statusStyle.text}>{p.paymentStatus}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-content-primary font-medium">#{p.paymentId}</td>
                        <td className="px-6 py-4 text-content-secondary">#{p.bookingId}</td>
                        <td className="px-6 py-4 text-content-secondary">{formatDate(p.paymentDate)}</td>
                        <td className="px-6 py-4 text-content-secondary">
                          {(p.paymentMethod || "—").replace("_", " ")}
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-content-primary">
                          {formatCurrency(p.amount)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Selected Payment Receipt Modal Overlay */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-md"
          onClick={() => setSelected(null)}
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="w-full max-w-lg rounded-[2.5rem] border border-surface-800 bg-surface-900 p-6 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <PaymentReceipt payment={selected} />
            <button
              onClick={() => setSelected(null)}
              className="mt-6 w-full rounded-full border border-surface-800 bg-surface py-3 text-xs font-semibold uppercase tracking-wider text-content-primary transition-all hover:bg-surface-800"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
