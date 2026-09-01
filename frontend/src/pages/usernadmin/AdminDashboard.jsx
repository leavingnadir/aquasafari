import React from "react";
import { Link } from "react-router-dom";
import { Users, UserCheck, Ship, CreditCard, ArrowRight, ShieldCheck, FileText, ExternalLink } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const ADMIN_SECTIONS = [
  {
    title: "Staff Management",
    description: "Manage admin, tour guides, and boat operator accounts and permissions.",
    icon: Users,
    to: "/admin/staff",
    badge: "Staff",
    color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  },
  {
    title: "Customer Management",
    description: "View registered customer profiles, activity, and account status.",
    icon: UserCheck,
    to: "/admin/customers",
    badge: "Users",
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    title: "Boat Management",
    description: "Add, update capacities, modify details, or manage your fleet.",
    icon: Ship,
    to: "/boat/manage",
    badge: "Fleet",
    color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  },
  {
    title: "Payment Records",
    description: "Track all transaction logs, financial records, and booking revenues.",
    icon: CreditCard,
    to: "/payment/records",
    badge: "Finance",
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
  {
    title: "Payment History",
    description: "Review comprehensive historical invoice logs and payment statuses.",
    icon: FileText,
    to: "/payment/history",
    badge: "Reports",
    color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  },
];

export default function AdminDashboard() {
  const { user } = useAuth();

  const displayName = user?.firstName || user?.email?.split("@")[0] || "Administrator";

  return (
    <div className="min-h-[85vh] bg-surface pt-32 pb-16 px-4 sm:px-6 lg:px-8 font-body text-content-primary">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-surface-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
                <ShieldCheck size={18} />
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-400">Admin Control Center</span>
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-content-primary">
              Welcome back, {displayName}
            </h1>
            <p className="mt-1 text-sm text-content-secondary">
              Select a management module below to open it in a new browser tab.
            </p>
          </div>
        </div>

        {/* Grid of Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ADMIN_SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <Link
                key={section.to}
                to={section.to}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col justify-between rounded-[2rem] border border-surface-800 bg-surface-900 p-8 shadow-xl transition-all duration-300 hover:border-brand-500/50 hover:bg-surface-800/80 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${section.color}`}>
                      <Icon size={22} />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-surface border border-surface-800 text-content-secondary">
                      {section.badge}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-semibold text-content-primary group-hover:text-brand-400 transition-colors">
                    {section.title}
                  </h3>
                  <p className="mt-2 text-sm text-content-secondary leading-relaxed">
                    {section.description}
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-500 group-hover:text-brand-400">
                  <span>Open in new tab</span>
                  <ExternalLink size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
}
