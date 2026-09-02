import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Compass, ArrowRight, LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const LINKS = [
  { to: "/search", label: "Search Boats" },
  { to: "/boats", label: "Our Fleet"},
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/login");
  };

  // Extracts display name (falls back to email or generic user text)
  const displayName = user?.firstName || user?.email?.split("@")[0] || "Account";

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

        {/* Desktop Auth Section */}
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm font-medium text-content-primary bg-surface-900/80 border border-surface-800 px-4 py-2 rounded-full shadow-inner">
                <User size={15} className="text-brand-500" />
                <span className="max-w-[120px] truncate">Hi, <strong className="text-brand-400 font-semibold">{displayName}</strong></span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-full border border-surface-800 bg-surface-900/80 px-4 py-2 text-sm font-semibold text-content-secondary transition-all duration-300 hover:border-rose-500/50 hover:text-rose-400 hover:bg-surface-800 active:scale-95"
                title="Log out"
              >
                <LogOut size={15} />
                <span>Log out</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-full border border-surface-800 bg-surface-900/80 px-6 py-2.5 text-sm font-semibold text-content-primary transition-all duration-300 hover:border-brand-500/50 hover:bg-surface-800 active:scale-95"
            >
              Log in
            </Link>
          )}
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
              
              {isAuthenticated ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-surface border border-surface-800 text-sm text-content-primary">
                    <User size={16} className="text-brand-500 shrink-0" />
                    <span className="truncate">Logged in as <strong className="text-brand-400">{displayName}</strong></span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-5 py-3 text-sm font-semibold text-rose-400 transition-transform active:scale-95"
                  >
                    <LogOut size={16} /> Log out
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition-transform active:scale-95 shadow-md shadow-brand-500/20"
                >
                  Log in <ArrowRight size={15} />
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}