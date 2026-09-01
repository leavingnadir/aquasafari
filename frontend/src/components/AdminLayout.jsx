import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Users, Ship, CalendarCheck, CreditCard, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const ADMIN_LINKS = [
  { to: "/admin/staff", label: "Manage Staff & Users", icon: Users },
  { to: "/admin/boats", label: "Manage Boats", icon: Ship },
  { to: "/admin/bookings", label: "Manage Bookings", icon: CalendarCheck },
  { to: "/admin/payments", label: "Payment History", icon: CreditCard },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col md:flex-row font-body text-content-primary pt-20">
      
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-surface-900 border-r border-surface-800 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 px-3 mb-8">
            <LayoutDashboard className="text-brand-500" size={24} />
            <span className="font-display font-bold text-lg tracking-tight">Admin Portal</span>
          </div>

          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-content-muted mb-3">Management</p>
          <nav className="space-y-1">
            {ADMIN_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20 font-semibold"
                        : "text-content-secondary hover:bg-surface-800 hover:text-content-primary"
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Admin profile & logout footer inside sidebar */}
        <div className="mt-8 pt-4 border-t border-surface-800 flex items-center justify-between">
          <div className="truncate pr-2">
            <p className="text-xs text-content-muted">Logged in as</p>
            <p className="text-sm font-semibold text-brand-400 truncate">{user?.firstName || user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-content-secondary hover:text-rose-400 hover:bg-surface-800 rounded-lg transition"
            title="Log out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main Content Area where nested Admin routes render */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <Outlet />
      </main>

    </div>
  );
}
