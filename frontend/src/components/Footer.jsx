import React from "react";
import { Link } from "react-router-dom";
import { Compass, Globe, Mail, MessageCircle, ArrowRight } from "lucide-react";

const QUICK_LINKS = [
  { to: "/", label: "Home" },
  { to: "/destinations", label: "Destinations" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
];

const SUPPORT_LINKS = [
  { to: "/help", label: "Help Center" },
  { to: "/terms", label: "Terms & Conditions" },
  { to: "/privacy", label: "Privacy Policy" },
  { to: "/cancellation", label: "Cancellation Policy" },
];

export default function Footer() {
  return (
    <footer className="relative bg-surface border-t border-surface-800/60 pt-20 text-content-secondary font-body">
      <div className="container-page">
        
        {/* Newsletter Band - Floating card with subtle brand glow */}
        <div className="relative mb-20 overflow-hidden rounded-[2.5rem] border border-surface-800 bg-surface-900 p-8 sm:p-12 shadow-2xl">
          {/* Decorative background blur gradient */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <span className="mb-3 inline-block rounded-full bg-surface-800 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-500">
                Newsletter
              </span>
              <h3 className="font-display text-3xl font-normal tracking-tight text-content-primary sm:text-4xl">
                Stay Updated!
              </h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-content-secondary">
                Subscribe for new route announcements, seasonal availability, and boarding tips — 
                sent a couple of times a month, never more.
              </p>
            </div>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex w-full max-w-md items-center gap-2 rounded-full border border-surface-800 bg-surface p-2 shadow-inner transition-all focus-within:border-brand-500/50"
            >
              <input
                type="email"
                required
                placeholder="Write your email here..."
                className="w-full bg-transparent px-4 text-sm text-content-primary placeholder:text-content-muted focus:outline-none"
              />
              <button
                type="submit"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white transition-all hover:bg-brand-600 active:scale-95 shadow-md shadow-brand-500/20"
                aria-label="Subscribe"
              >
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-2 gap-10 pb-16 sm:grid-cols-4">
          
          {/* Brand Info */}
          <div className="col-span-2 sm:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 text-content-primary group">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 shadow-md shadow-brand-500/20">
                <Compass size={16} className="text-white" />
              </span>
              <span className="font-display text-base tracking-tight">AquaSafari</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-content-secondary">
              Book safaris, safely and easily. Your journey to the open ocean starts here.
            </p>
          </div>

          <FooterCol title="Quick Links" links={QUICK_LINKS} />
          <FooterCol title="Support & Legal" links={SUPPORT_LINKS} />

          {/* Socials */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-content-muted">
              Find Us Here
            </p>
            <div className="flex gap-3">
              {[Globe, Mail, MessageCircle].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-surface-800 bg-surface-900 text-content-secondary transition-all hover:border-brand-500/50 hover:bg-surface-800 hover:text-content-primary"
                  aria-label="Social link"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-surface-800 py-8 text-center text-xs text-content-muted">
          © {new Date().getFullYear()} AquaSafari. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <p className="mb-4 text-xs font-bold uppercase tracking-wider text-content-muted">
        {title}
      </p>
      <ul className="space-y-3 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            <Link 
              to={l.to} 
              className="text-content-secondary transition-colors duration-200 hover:text-content-primary"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}