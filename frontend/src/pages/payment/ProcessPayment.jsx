import React, { useState } from "react";
import { processPayment } from "../../api/paymentApi";
import PaymentReceipt from "./PaymentReceipt";
import { CreditCard, ShieldCheck, Lock, ArrowRight, AlertCircle, RefreshCw } from "lucide-react";

const METHODS = [
  { value: "CARD", label: "Credit / Debit Card" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "MOBILE_WALLET", label: "Mobile Wallet" },
];

/**
 * Checkout page for use case "Process Online Payment".
 * In a real deployment, step 1 (redirect to secure gateway) would hand off to
 * the gateway's hosted page; here we render an in-app form that POSTs to
 * /api/payments/process and simulates that redirect for demo purposes.
 */
export default function ProcessPayment({ bookingId: initialBookingId, amount: initialAmount }) {
  const [form, setForm] = useState({
    bookingId: initialBookingId ?? "",
    amount: initialAmount ?? "",
    paymentMethod: "CARD",
    cardNumber: "",
    cardHolderName: "",
    expiryDate: "",
  });
  const [status, setStatus] = useState("idle"); // idle | submitting | success | declined | error
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");
    try {
      const response = await processPayment({
        bookingId: Number(form.bookingId),
        amount: Number(form.amount),
        paymentMethod: form.paymentMethod,
        cardNumber: form.cardNumber,
        cardHolderName: form.cardHolderName,
        expiryDate: form.expiryDate,
      });
      setResult(response);
      setStatus("success");
    } catch (err) {
      if (err.status === 402) {
        // Extension 3a: transaction declined by gateway
        setResult(err.body);
        setStatus("declined");
      } else {
        setErrorMessage(err.message || "Something went wrong. Please try again.");
        setStatus("error");
      }
    }
  }

  function retryWithNewMethod() {
    setStatus("idle");
    setResult(null);
  }

  if (status === "success" && result) {
    return (
      <div className="min-h-screen bg-surface px-4 py-20 text-content-primary">
        <PaymentReceipt payment={result} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pt-30 px-4 py-24 text-content-primary font-body">
      <div className="mx-auto w-full max-w-2xl">
        
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-surface-800 bg-surface-900 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-brand-500 shadow-sm">
            <Lock size={12} />
            Secure Gateway
          </div>
          <h1 className="font-display text-4xl font-normal tracking-tight text-content-primary sm:text-5xl">
            Complete your safari payment
          </h1>
          <p className="mt-2 text-sm text-content-secondary">
            Fast, encrypted processing for your upcoming aquatic adventure.
          </p>
        </div>

        {/* Declined Alert */}
        {status === "declined" && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300 backdrop-blur-md">
            <AlertCircle size={20} className="shrink-0 mt-0.5 text-rose-400" />
            <div className="flex-1">
              <p className="font-semibold text-rose-200">Transaction declined</p>
              <p className="mt-0.5 text-rose-300/90">
                {result?.reason || "Your payment could not be processed."} Please try a different payment method.
              </p>
              <button
                type="button"
                onClick={retryWithNewMethod}
                className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 px-3 py-1 text-xs font-semibold text-rose-200 transition-colors hover:bg-rose-500/30"
              >
                <RefreshCw size={12} />
                Try again with new method
              </button>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {status === "error" && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
            <AlertCircle size={20} className="shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
          className="relative overflow-hidden rounded-[2.5rem] border border-surface-800 bg-surface-900 p-8 sm:p-10 shadow-2xl"
        >
          {/* Subtle background glow */}
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            
            {/* Booking & Amount Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Booking Ref.">
                <input
                  required
                  type="number"
                  min="1"
                  value={form.bookingId}
                  onChange={(e) => update("bookingId", e.target.value)}
                  className="input-field"
                  placeholder="e.g. 1024"
                />
              </Field>
              <Field label="Amount (LKR)">
                <input
                  required
                  type="number"
                  min="1"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) => update("amount", e.target.value)}
                  className="input-field"
                  placeholder="e.g. 15000"
                />
              </Field>
            </div>

            {/* Payment Method Selector */}
            <Field label="Payment Method">
              <select
                value={form.paymentMethod}
                onChange={(e) => update("paymentMethod", e.target.value)}
                className="input-field"
              >
                {METHODS.map((m) => (
                  <option key={m.value} value={m.value} className="bg-surface-900 text-content-primary">
                    {m.label}
                  </option>
                ))}
              </select>
            </Field>

            {/* Conditional Card Details */}
            {form.paymentMethod === "CARD" && (
              <div className="space-y-5 rounded-2xl border border-surface-800 bg-surface p-6">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-500">
                  <CreditCard size={15} />
                  <span>Card Information</span>
                </div>

                <Field label="Card Holder Name">
                  <input
                    required
                    type="text"
                    value={form.cardHolderName}
                    onChange={(e) => update("cardHolderName", e.target.value)}
                    className="input-field"
                    placeholder="A. Perera"
                  />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Field label="Card Number" className="sm:col-span-2">
                    <input
                      required
                      type="text"
                      inputMode="numeric"
                      maxLength={19}
                      value={form.cardNumber}
                      onChange={(e) => update("cardNumber", e.target.value)}
                      className="input-field font-mono"
                      placeholder="4111 1111 1111 1111"
                    />
                  </Field>
                  <Field label="Expiry">
                    <input
                      required
                      type="text"
                      value={form.expiryDate}
                      onChange={(e) => update("expiryDate", e.target.value)}
                      className="input-field font-mono text-center"
                      placeholder="MM/YY"
                    />
                  </Field>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === "submitting"}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 py-4 text-sm font-semibold uppercase tracking-wider text-white transition-all hover:bg-brand-600 active:scale-98 disabled:opacity-60 shadow-lg shadow-brand-500/25"
            >
              {status === "submitting" ? (
                <span>Processing Secure Payment…</span>
              ) : (
                <>
                  <span>Pay & Confirm Booking</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            {/* Security Guarantee Note */}
            <div className="flex items-center justify-center gap-2 pt-2 text-center text-xs text-content-muted">
              <ShieldCheck size={14} className="text-brand-500" />
              <span>Payments are 256-bit SSL encrypted. Card info is never stored.</span>
            </div>

          </div>
        </form>
      </div>

      {/* Embedded CSS for custom styling inputs matching your theme */}
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
        .input-field::placeholder {
          color: var(--content-muted, #71717a);
        }
        .input-field:focus {
          border-color: #F05C35;
          box-shadow: 0 0 0 3px rgba(240, 92, 53, 0.15);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-content-secondary">
        {label}
      </span>
      {children}
    </label>
  );
}