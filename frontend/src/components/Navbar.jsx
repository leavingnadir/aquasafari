import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Compass, ArrowRight } from "lucide-react";

const LINKS = [
  { to: "/search", label: "Search Boats" },
  { to: "/destinations", label: "Destinations" },
  { to: "/how-it-works", label: "How It Works" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-40 bg-surface/60 backdrop-blur-md border-b border-surface-800/40">
      <div className="container-page flex h-20 items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 text-content-primary group">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 transition-transform duration-300 group-hover:scale-105 shadow-md shadow-brand-500/20">
            <Compass size={18} strokeWidth={2.4} className="text-white" />
          </span>
          <span className="font-display text-lg tracking-tight">AquaSafari</span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors duration-200 ${
                  isActive ? "text-brand-500 font-semibold" : "text-content-secondary hover:text-content-primary"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Log in Button */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/login"
            className="rounded-full border border-surface-800 bg-surface-900/80 px-6 py-2.5 text-sm font-semibold text-content-primary transition-all duration-300 hover:border-brand-500/50 hover:bg-surface-800 active:scale-95"
          >
            Log in
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="rounded-full border border-surface-800 bg-surface-900 p-2.5 text-content-primary md:hidden transition-colors hover:bg-surface-800"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {open && (
        <div className="container-page pb-6 md:hidden">
          <div className="rounded-[2rem] border border-surface-800 bg-surface-900/95 p-6 text-content-primary shadow-2xl backdrop-blur-xl">
            <nav className="flex flex-col gap-4">
              {LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="text-base font-medium text-content-secondary transition-colors hover:text-content-primary py-1"
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="my-2 h-[1px] w-full bg-surface-800" />
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-2xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition-transform active:scale-95 shadow-md shadow-brand-500/20"
              >
                Log in <ArrowRight size={15} />
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}