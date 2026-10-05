import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  UserCheck,
  Ship,
  CreditCard,
  Compass,
  ShieldCheck,
  FileText,
  ExternalLink,
  MessageSquare,
  Clock,
  RefreshCw,
  CalendarCheck,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext.jsx";
import usePageTitle from "../../hooks/usePageTitle";
import DashboardOverview from "./DashboardOverview";

const ADMIN_SECTIONS = [
  {
    title: "Booking Management",
    description:
      "Review every customer reservation and manage booking confirmations or cancellations.",
    icon: CalendarCheck,
    to: "/admin/bookings",
    badge: "Bookings",
    color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  },
  {
    title: "Staff Management",
    description:
      "Manage admin, tour guides, and boat operator accounts and permissions.",
    icon: Users,
    to: "/admin/staff",
    badge: "Staff",
    color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  },
  {
    title: "Customer Management",
    description:
      "View registered customer profiles, activity, and account status.",
    icon: UserCheck,
    to: "/admin/customers",
    badge: "Users",
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    title: "Boat Management",
    description:
      "Add, update capacities, modify details, or manage your fleet.",
    icon: Ship,
    to: "/boat/manage",
    badge: "Fleet",
    color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  },
  {
    title: "Trip Management",
    description:
      "Schedule new safari departures, assign boats, skippers, and tour guides.",
    icon: Compass,
    to: "/trips",
    badge: "Operations",
    color: "text-brand-400 bg-brand-500/10 border-brand-500/20",
  },
  {
    title: "Feedback Management",
    description:
      "Review and manage user ratings, comments, and system feedback.",
    icon: MessageSquare,
    to: "/admin/feedback",
    badge: "Support",
    color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  },
  {
    title: "Payment Records",
    description:
      "Track all transaction logs, financial records, and booking revenues.",
    icon: CreditCard,
    to: "/payment/records",
    badge: "Finance",
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
  {
    title: "Payment History",
    description:
      "Review comprehensive historical invoice logs and payment statuses.",
    icon: FileText,
    to: "/payment/history",
    badge: "Reports",
    color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  },
];

export default function AdminDashboard() {
  usePageTitle("Admin Dashboard");

  const { user } = useAuth();

  const displayName =
    user?.firstName ||
    user?.email?.split("@")[0] ||
    "Administrator";

  // Dashboard refresh state
  const [refreshKey, setRefreshKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const handleRefresh = () => {
    setRefreshing(true);

    // Force DashboardOverview to reload
    setRefreshKey((prev) => prev + 1);

    // Update timestamp
    setLastUpdated(new Date());

    // Stop refresh animation
    setTimeout(() => {
      setRefreshing(false);
    }, 700);
  };

  const formattedTime = lastUpdated.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-[85vh] bg-surface px-4 pt-32 pb-16 font-body text-content-primary sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* ============================================================
            HEADER SECTION
            ============================================================ */}
        <div className="mb-8 flex flex-col gap-5 border-b border-surface-800 pb-6 md:flex-row md:items-center md:justify-between">

          {/* LEFT SIDE */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-brand-500/20 bg-brand-500/10 text-brand-400">
                <ShieldCheck size={18} />
              </span>

              <span className="text-xs font-bold uppercase tracking-widest text-brand-400">
                Admin Control Center
              </span>
            </div>

            <h1 className="font-display text-3xl font-bold tracking-tight text-content-primary">
              Welcome back, {displayName}
            </h1>

            <p className="mt-1 text-sm text-content-secondary">
              Select a management module below to open it in a new browser tab.
            </p>
          </div>

          {/* RIGHT SIDE - UPDATED + REFRESH */}
          <div className="flex shrink-0 items-center gap-2">

            {/* Updated Time */}
            <div className="flex items-center gap-2 rounded-full border border-surface-800 bg-surface-900 px-4 py-2.5">
              <Clock
                size={13}
                className="text-content-muted"
              />

              <span className="text-[10px] font-medium text-content-muted">
                Updated {formattedTime}
              </span>
            </div>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 rounded-full border border-surface-800 bg-surface-900 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-content-secondary transition-all duration-200 hover:border-surface-700 hover:bg-surface-800 hover:text-content-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={13}
                className={refreshing ? "animate-spin" : ""}
              />

              <span>
                {refreshing ? "Refreshing" : "Refresh"}
              </span>
            </button>

          </div>
        </div>

        {/* ============================================================
            DASHBOARD OVERVIEW
            ============================================================ */}
        <DashboardOverview key={refreshKey} />

        {/* ============================================================
            ADMIN MANAGEMENT SECTIONS
            ============================================================ */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ADMIN_SECTIONS.map((section) => {
            const Icon = section.icon;

            return (
              <Link
                key={section.to}
                to={section.to}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col justify-between rounded-[2rem] border border-surface-800 bg-surface-900 p-8 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/50 hover:bg-surface-800/80"
              >
                <div>
                  {/* Icon + Badge */}
                  <div className="mb-6 flex items-center justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${section.color}`}
                    >
                      <Icon size={22} />
                    </div>

                    <span className="rounded-full border border-surface-800 bg-surface px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-content-secondary">
                      {section.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-xl font-semibold text-content-primary transition-colors group-hover:text-brand-400">
                    {section.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 text-sm leading-relaxed text-content-secondary">
                    {section.description}
                  </p>
                </div>

                {/* Open button */}
                <div className="mt-8 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-500 group-hover:text-brand-400">
                  <span>Open in new tab</span>

                  <ExternalLink
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}