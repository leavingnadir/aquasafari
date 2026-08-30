import React from "react";
import { Link } from "react-router-dom";
import { Compass, ArrowLeft } from "lucide-react";

export default function ComingSoon({ title = "This page" }) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center font-body bg-surface text-content-primary">
      
      {/* Glowing Compass Icon Badge */}
      <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-surface-800 bg-surface-900 text-brand-500 shadow-xl shadow-brand-500/10">
        <Compass size={28} />
      </span>

      {/* Eyebrow Label */}
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-surface-800 bg-surface-900 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-content-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse"></span>
        Under Construction
      </div>

      {/* Dynamic Title */}
      <h1 className="font-display text-3xl font-normal tracking-tight text-content-primary sm:text-4xl">
        {title} is on its way
      </h1>

      {/* Description */}
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-content-secondary">
        This part of AquaSafari is currently being built by our development fleet. Check back soon!
      </p>

      {/* Return Action Button */}
      <Link
        to="/"
        className="mt-8 flex items-center gap-2 rounded-full bg-brand-500 px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-600 active:scale-95 shadow-lg shadow-brand-500/20"
      >
        <ArrowLeft size={16} />
        Back to home
      </Link>

    </div>
  );
}
