import React, { useEffect, useState } from "react";
import { getPaymentHistory, updatePayment, deletePaymentRecord } from "../../api/paymentApi";
import { ShieldCheck, Edit3, Trash2, AlertCircle, ShieldAlert, X, Check } from "lucide-react";
import usePageTitle from "../../hooks/usePageTitle";

const METHODS = ["CARD", "BANK_TRANSFER", "MOBILE_WALLET"];
const STATUSES = ["PENDING", "PAID", "DECLINED", "REFUNDED"];

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

/**
 * Accountant/Admin view for correcting (Update) and removing (Delete)
 * payment records - completes the CRUD set alongside Create (checkout) and
 * Read (history).
 */
export default function PaymentRecords() {
  usePageTitle("Payments Records");

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null); // full payment object
  const [editForm, setEditForm] = useState({ amount: "", paymentMethod: "", paymentStatus: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError("");
    try {
      setPayments(await getPaymentHistory());
    } catch (err) {
      setError(err.message || "Could not load payment records.");
    } finally {
      setLoading(false);
    }
  }

  function openEdit(payment) {
    setEditingPayment(payment);
    setEditForm({
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      paymentStatus: payment.paymentStatus,
    });
  }

  async function saveEdit() {
    if (!editingPayment) return;
    setSaving(true);
    setError("");
    try {
      const updated = await updatePayment(editingPayment.paymentId, {
        amount: Number(editForm.amount),
        paymentMethod: editForm.paymentMethod,
        paymentStatus: editForm.paymentStatus,
      });
      setPayments((prev) =>
        prev.map((p) => (p.paymentId === updated.paymentId ? updated : p))
      );
      setEditingPayment(null);
    } catch (err) {
      setError(err.message || "Could not update payment record.");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!pendingDeleteId) return;
    setDeleting(true);
    try {
      await deletePaymentRecord(pendingDeleteId);
      setPayments((prev) => prev.filter((p) => p.paymentId !== pendingDeleteId));
      setPendingDeleteId(null);
    } catch (err) {
      setError(err.message || "Could not delete payment record.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface pt-40 px-4 py-16 text-content-primary font-body">
      <div className="mx-auto max-w-4xl">
        
        {/* Header section */}
        <div className="mb-8">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-surface-800 bg-surface-900 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-brand-500 shadow-sm">
            <ShieldCheck size={12} />
            Accounts Office
          </div>
          <h1 className="font-display text-4xl font-normal tracking-tight text-content-primary">
            Manage Payment Records
          </h1>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300 backdrop-blur-md">
            <ShieldAlert size={20} className="shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <div className="overflow-hidden rounded-[2.5rem] border border-surface-800 bg-surface-900 shadow-2xl">
          {loading && (
            <div className="p-12 text-center text-sm text-content-secondary">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent mb-3" />
              <p>Loading records…</p>
            </div>
          )}

          {!loading && payments.length === 0 && (
            <div className="p-16 text-center text-sm text-content-secondary">
              <p>No payment records found in the system.</p>
            </div>
          )}

          {!loading && payments.length > 0 && (
            <div className="divide-y divide-surface-800">
              {payments.map((p) => {
                const statusStyle = STATUS_CONFIG[p.paymentStatus] || { dot: "bg-slate-400", text: "text-slate-400", bg: "" };
                return (
                  <div
                    key={p.paymentId}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 transition-colors hover:bg-surface-800/40"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-semibold text-content-primary">
                          #{p.paymentId}
                        </span>
                        <span className="text-xs text-content-muted">·</span>
                        <span className="text-xs text-content-secondary font-medium">
                          Booking #{p.bookingId}
                        </span>
                      </div>
                      
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium border ${statusStyle.bg}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
                          <span className={statusStyle.text}>{p.paymentStatus}</span>
                        </span>
                        <span className="text-xs text-content-muted">•</span>
                        <span className="text-xs text-content-secondary">
                          {(p.paymentMethod || "—").replace("_", " ")}
                        </span>
                        <span className="text-xs text-content-muted">•</span>
                        <span className="text-xs text-content-muted font-mono">
                          {p.transactionReference || "no ref."}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 justify-between sm:justify-end">
                      <span className="font-display text-lg font-normal text-content-primary">
                        {formatCurrency(p.amount)}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="flex items-center gap-1.5 rounded-xl border border-surface-800 bg-surface px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-content-primary transition-all hover:border-brand-500/50 hover:bg-surface-800"
                        >
                          <Edit3 size={13} className="text-brand-500" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setPendingDeleteId(p.paymentId)}
                          className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-rose-300 transition-all hover:bg-rose-500/20"
                        >
                          <Trash2 size={13} className="text-rose-400" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Edit Payment Modal */}
      {editingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-[2.5rem] border border-surface-800 bg-surface-900 p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-500/10 blur-2xl pointer-events-none" />

            <h2 className="font-display text-2xl font-normal text-content-primary">
              Update payment #{editingPayment.paymentId}
            </h2>
            <p className="mt-1 text-xs text-content-secondary">Associated with Booking #{editingPayment.bookingId}</p>

            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-content-secondary">
                  Amount (LKR)
                </span>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={editForm.amount}
                  onChange={(e) => setEditForm((f) => ({ ...f, amount: e.target.value }))}
                  className="input-field"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-content-secondary">
                  Method
                </span>
                <select
                  value={editForm.paymentMethod}
                  onChange={(e) => setEditForm((f) => ({ ...f, paymentMethod: e.target.value }))}
                  className="input-field"
                >
                  {METHODS.map((m) => (
                    <option key={m} value={m} className="bg-surface-900 text-content-primary">
                      {m.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-content-secondary">
                  Status
                </span>
                <select
                  value={editForm.paymentStatus}
                  onChange={(e) => setEditForm((f) => ({ ...f, paymentStatus: e.target.value }))}
                  className="input-field"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s} className="bg-surface-900 text-content-primary">
                      {s}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-8 flex items-center justify-end gap-3">
              <button
                onClick={() => setEditingPayment(null)}
                className="rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-content-secondary transition hover:bg-surface-800"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={saving}
                className="flex items-center gap-2 rounded-full bg-brand-500 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-all hover:bg-brand-600 disabled:opacity-60 shadow-lg shadow-brand-500/20"
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {pendingDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-[2.5rem] border border-surface-800 bg-surface-900 p-8 shadow-2xl text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-400">
              <AlertCircle size={24} />
            </div>
            
            <h2 className="font-display text-2xl font-normal text-content-primary">Delete record?</h2>
            <p className="mt-2 text-xs leading-relaxed text-content-secondary">
              This will permanently remove payment <span className="font-mono text-content-primary">#{pendingDeleteId}</span> from the system. This action cannot be undone.
            </p>
            
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                onClick={() => setPendingDeleteId(null)}
                className="rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-content-secondary transition hover:bg-surface-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="rounded-full bg-rose-600 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-all hover:bg-rose-700 disabled:opacity-60 shadow-lg shadow-rose-600/20"
              >
                {deleting ? "Deleting…" : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles matching theme inputs */}
      <style>{`
        .input-field {
          width: 100%;
          border-radius: 1rem;
          border: 1px solid var(--surface-800, #27272a);
          background-color: var(--surface, #121214);
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          color: var(--content-primary, #ffffff);
          outline: none;
          transition: all 0.2s ease;
        }
        .input-field:focus {
          border-color: #F05C35;
          box-shadow: 0 0 0 3px rgba(240, 92, 53, 0.15);
        }
      `}</style>
    </div>
  );
}
