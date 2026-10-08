import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { formatPaymentError, processPayment } from "../../api/paymentApi";
import axiosClient from "../../api/axiosClient";
import PaymentReceipt from "./PaymentReceipt";
import { CreditCard, ShieldCheck, Lock, ArrowRight, AlertCircle, RefreshCw, Loader2 } from "lucide-react";
import usePageTitle from "../../hooks/usePageTitle";

const METHODS = [
  { value: "CREDIT_CARD", label: "Credit / Debit Card" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "MOBILE_WALLET", label: "Mobile Wallet" },
];

export default function ProcessPayment() {
  usePageTitle("Process Payment");
  const [searchParams] = useSearchParams();
  
  const urlBookingId = searchParams.get("bookingId") || "";

  const [form, setForm] = useState({
    bookingId: urlBookingId,
    amount: "Loading...", // Initial placeholder while fetching
    paymentMethod: "CREDIT_CARD",
    cardNumber: "",
    cardHolderName: "",
    expiryDate: "",
    cvv: "",
  });

  const [status, setStatus] = useState("idle"); // idle | loading | submitting | success | declined | error
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Lock the displayed total to the selected booking and its trip price.
  useEffect(() => {
    let cancelled = false;
    setForm((prev) => ({ ...prev, bookingId: urlBookingId, amount: "Loading..." }));
    setErrorMessage("");

    if (!urlBookingId) {
      setForm((prev) => ({ ...prev, amount: "Unavailable" }));
      setErrorMessage("A booking reference is required to load the payment total.");
      setStatus("error");
      return () => {
        cancelled = true;
      };
    }

    async function fetchBookingDetails() {
      try {
        const response = await axiosClient.get(`/bookings/${urlBookingId}`);
        const bookingData = response.data || {};
        const tripId = bookingData.tripId;
        const passengerCount = Number(bookingData.passengerCount);

        if (!tripId || !Number.isFinite(passengerCount) || passengerCount <= 0) {
          throw new Error("Booking or trip data is incomplete.");
        }

        let tripResponse;
        try {
          tripResponse = await axiosClient.get(`/bookings/trips/${tripId}`);
        } catch (bookingError) {
          tripResponse = await axiosClient.get(`/trips/${tripId}`);
        }

        const pricePerSeat = Number(tripResponse.data?.pricePerSeat ?? tripResponse.data?.pricePerSeatValue);
        if (!Number.isFinite(pricePerSeat) || pricePerSeat <= 0) {
          throw new Error("The trip price is unavailable.");
        }

        const exactAmount = pricePerSeat * passengerCount;
        if (!Number.isFinite(exactAmount) || exactAmount <= 0) {
          throw new Error("The total for this booking could not be calculated.");
        }

        if (!cancelled) {
          setForm((prev) => ({ ...prev, amount: exactAmount.toFixed(2) }));
          setStatus("idle");
        }
      } catch (err) {
        if (!cancelled) {
          const paymentError = formatPaymentError(err);
          setForm((prev) => ({ ...prev, amount: "Unavailable" }));
          setErrorMessage(paymentError.message || "Unable to load the booking total.");
          setStatus("error");
        }
      }
    }

    fetchBookingDetails();
    return () => {
      cancelled = true;
    };
  }, [urlBookingId]);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateCardNumber(value) {
    if (/[^0-9 ]/.test(value)) {
      setErrorMessage("Card number can contain digits and spaces only.");
      setStatus("error");
      return;
    }
    update("cardNumber", value);
    if (/^Card number/.test(errorMessage)) {
      setErrorMessage("");
      setStatus("idle");
    }
  }

  function updateCardHolderName(value) {
    if (/\d/.test(value)) {
      setErrorMessage("Card holder's name cannot contain numbers.");
      setStatus("error");
      return;
    }
    update("cardHolderName", value);
    if (/^Card holder/.test(errorMessage) || /^Enter the card holder/.test(errorMessage)) {
      setErrorMessage("");
      setStatus("idle");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage("");

    const bookingIdNum = Number(form.bookingId);
    if (!Number.isSafeInteger(bookingIdNum) || bookingIdNum <= 0) {
      setErrorMessage("A valid booking reference is required.");
      setStatus("error");
      return;
    }

    const amountNum = Number(form.amount);
    if (!Number.isFinite(amountNum) || amountNum <= 0) {
      setErrorMessage("Payment total is not available yet.");
      setStatus("error");
      return;
    }

    if (form.paymentMethod === "CREDIT_CARD") {
      const digits = form.cardNumber.replace(/\s/g, "");
      if (!/^\d{16}$/.test(digits)) {
        setErrorMessage("Card number must contain exactly 16 digits.");
        setStatus("error");
        return;
      }
      if (!/^[\p{L} .'-]{3,}$/u.test((form.cardHolderName || "").trim())) {
        setErrorMessage("Card holder's name must contain at least 3 letters and cannot contain numbers.");
        setStatus("error");
        return;
      }
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiryDate || "")) {
        setErrorMessage("Expiry must be MM/YY.");
        setStatus("error");
        return;
      }

      const [mm, yy] = form.expiryDate.split("/").map(Number);
      const expiryYear = 2000 + yy;
      const now = new Date();
      if (
        expiryYear < now.getFullYear() ||
        (expiryYear === now.getFullYear() && mm < now.getMonth() + 1)
      ) {
        setErrorMessage("Card has expired.");
        setStatus("error");
        return;
      }
    }

    setStatus("submitting");
    try {
      const response = await processPayment({
        bookingId: bookingIdNum,
        amount: amountNum,
        paymentMethod: form.paymentMethod,
        cardNumber: form.cardNumber,
        cardHolderName: form.cardHolderName,
        expiryDate: form.expiryDate,
      });
      setResult(response);
      setStatus("success");
    } catch (err) {
      if (err.status === 402) {
        setResult(err.body);
        setStatus("declined");
      } else {
        setErrorMessage(err.message || "Payment declined or invalid details entered. Please try again.");
        setStatus("error");
      }
    }
  }

  function retryWithNewMethod() {
    setStatus("idle");
    setResult(null);
    setErrorMessage("");
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
            Encrypted processing for your reserved aquatic adventure.
          </p>
        </div>

        {/* Declined Alert */}
        {status === "declined" && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300 backdrop-blur-md">
            <AlertCircle size={20} className="shrink-0 mt-0.5 text-rose-400" />
            <div className="flex-1">
              <p className="font-semibold text-rose-200">Transaction declined</p>
              <p className="mt-0.5 text-rose-300/90">
                {result?.reason || "Your payment could not be processed."} Please try a different payment method or correct your card info.
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
          noValidate
          className="relative overflow-hidden rounded-[2.5rem] border border-surface-800 bg-surface-900 p-8 sm:p-10 shadow-2xl"
        >
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Booking Ref. (Automated)">
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-400">
                    <Lock size={14} />
                  </span>
                  <input
                    readOnly
                    type="text"
                    value={form.bookingId}
                    className="input-field pl-10 cursor-not-allowed opacity-80 font-mono"
                    placeholder="No booking selected"
                  />
                </div>
              </Field>

              <Field label="Locked Total Amount (LKR)">
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-400">
                    <Lock size={14} />
                  </span>
                  <input
                    readOnly
                    type="text"
                    value={form.amount}
                    className="input-field pl-10 cursor-not-allowed opacity-80 font-mono font-semibold text-brand-400"
                  />
                </div>
              </Field>
            </div>

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

            {form.paymentMethod === "CREDIT_CARD" && (
              <div className="space-y-5 rounded-2xl border border-surface-800 bg-surface p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-500">
                    <CreditCard size={15} />
                    <span>Card Information</span>
                  </div>
                </div>

                <Field label="Card Holder Name">
                  <input
                    required
                    type="text"
                    value={form.cardHolderName}
                    onChange={(e) => updateCardHolderName(e.target.value)}
                    className="input-field"
                    placeholder="A. Perera"
                    autoComplete="cc-name"
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
                      onChange={(e) => updateCardNumber(e.target.value)}
                      className="input-field font-mono"
                      placeholder="4111 1111 1111 1111 (16 digits)"
                      autoComplete="cc-number"
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

            <button
              type="submit"
              disabled={status === "submitting" || !Number.isFinite(Number(form.amount)) || Number(form.amount) <= 0}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 py-4 text-sm font-semibold uppercase tracking-wider text-white transition-all hover:bg-brand-600 active:scale-98 disabled:opacity-60 shadow-lg shadow-brand-500/25"
            >
              {status === "submitting" ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Processing Secure Payment…</span>
                </>
              ) : (
                <>
                  <span>Pay & Confirm Booking</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 pt-2 text-center text-xs text-content-muted">
              <ShieldCheck size={14} className="text-brand-500" />
              <span>Payments are 256-bit SSL encrypted. Card info is never stored.</span>
            </div>

          </div>
        </form>
      </div>

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