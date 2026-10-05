import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock,
  Compass,
  CreditCard,
  Gauge,
  Layers3,
  Loader2,
  RefreshCw,
  ShieldAlert,
  Ship,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Wallet,
  Wrench,
  XCircle,
} from "lucide-react";

import usePageTitle from "../../hooks/usePageTitle";
import { getTrips } from "../../services/tripService";

/* ============================================================================
 * API
 * ========================================================================== */

const API_ROOT = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

function authHeaders() {
  let token = null;

  try {
    token = JSON.parse(localStorage.getItem("aquasafari_auth"))?.token;
  } catch {
    token = localStorage.getItem("token");
  }

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function fetchJson(path) {
  const res = await fetch(`${API_ROOT}${path}`, {
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error(`${path} failed (status ${res.status})`);
  }

  return res.json();
}

const getPayments = () => fetchJson("/api/payments/history");
const getBookings = () => fetchJson("/api/bookings");
const getBoats = () => fetchJson("/api/boats");
const getFeedback = () => fetchJson("/api/feedback");

/* ============================================================================
 * HELPERS
 * ========================================================================== */

const todayStr = () => new Date().toISOString().slice(0, 10);

const formatMoney = (value) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));

function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function formatCompactNumber(value) {
  const n = Number(value || 0);

  if (n >= 1000000) {
    return `${(n / 1000000).toFixed(1)}M`;
  }

  if (n >= 1000) {
    return `${(n / 1000).toFixed(1)}K`;
  }

  return String(n);
}

function formatDate(dateString) {
  if (!dateString) return "—";

  const d = new Date(dateString);

  if (Number.isNaN(d.getTime())) {
    return String(dateString);
  }

  return d.toLocaleDateString("en-LK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function shortDate(dateString) {
  if (!dateString) return "—";

  const d = new Date(dateString);

  if (Number.isNaN(d.getTime())) {
    return String(dateString).slice(5);
  }

  return d.toLocaleDateString("en-LK", {
    day: "2-digit",
    month: "short",
  });
}

function getBookingStatus(booking) {
  return String(
    booking?.status ??
      booking?.bookingStatus ??
      booking?.state ??
      "UNKNOWN"
  ).toUpperCase();
}

function getBoatName(boat) {
  return (
    boat?.boatName ??
    boat?.name ??
    boat?.boatType ??
    `Boat #${boat?.boatId ?? "—"}`
  );
}

function getBoatStatus(boat) {
  return String(
    boat?.status ?? boat?.boatStatus ?? "UNKNOWN"
  ).toUpperCase();
}

function getTripDate(trip) {
  return trip?.tripDate ?? trip?.date ?? "";
}

function getPaymentStatus(payment) {
  return String(payment?.paymentStatus ?? "UNKNOWN").toUpperCase();
}

function getRating(feedback) {
  return Number(feedback?.rating || 0);
}

/* ============================================================================
 * DESIGN TOKENS
 * ========================================================================== */

const BADGE_STYLES = {
  teal: "bg-emerald-500/10 text-emerald-400 border-emerald-500/10",
  blue: "bg-sky-500/10 text-sky-400 border-sky-500/10",
  gold: "bg-amber-500/10 text-amber-400 border-amber-500/10",
  rose: "bg-rose-500/10 text-rose-400 border-rose-500/10",
  purple: "bg-violet-500/10 text-violet-400 border-violet-500/10",
  orange: "bg-brand-500/10 text-brand-500 border-brand-500/10",
};

/* ============================================================================
 * SMALL COMPONENTS
 * ========================================================================== */

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  color = "purple",
  action,
}) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
            BADGE_STYLES[color]
          }`}
        >
          <Icon size={17} />
        </div>

        <div className="min-w-0">
          <h2 className="font-display text-base font-normal text-content-primary">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-0.5 truncate text-xs text-content-muted">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {action}
    </div>
  );
}

function Panel({ children, className = "" }) {
  return (
    <section
      className={`rounded-[2rem] border border-surface-800 bg-surface-900 p-5 shadow-xl ${className}`}
    >
      {children}
    </section>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color = "purple",
  trend,
  loading,
}) {
  const positive = trend >= 0;

  return (
    <div className="group relative overflow-hidden rounded-[2rem] border border-surface-800 bg-surface-900 p-5 shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-surface-700">
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-brand-500/5 blur-2xl transition-all duration-500 group-hover:bg-brand-500/10" />

      <div className="relative flex items-start justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${
            BADGE_STYLES[color]
          }`}
        >
          <Icon size={19} />
        </div>

        {typeof trend === "number" && !loading && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${
              positive
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-rose-500/10 text-rose-400"
            }`}
          >
            {positive ? (
              <ArrowUpRight size={11} />
            ) : (
              <ArrowDownRight size={11} />
            )}
            {Math.abs(trend)}%
          </span>
        )}
      </div>

      <p className="relative mt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-content-muted">
        {label}
      </p>

      {loading ? (
        <div className="mt-2 h-9 w-28 animate-pulse rounded-xl bg-surface-800" />
      ) : (
        <p className="relative mt-1 font-display text-3xl font-normal tracking-tight text-content-primary">
          {value}
        </p>
      )}

      {!loading && sub && (
        <p className="relative mt-1 text-xs text-content-muted">{sub}</p>
      )}
    </div>
  );
}

function StatusPill({ status }) {
  const normalized = String(status || "UNKNOWN").toUpperCase();

  const config = {
    PAID: {
      icon: CheckCircle2,
      className: "bg-emerald-500/10 text-emerald-400",
    },
    CONFIRMED: {
      icon: CheckCircle2,
      className: "bg-emerald-500/10 text-emerald-400",
    },
    COMPLETED: {
      icon: CheckCircle2,
      className: "bg-emerald-500/10 text-emerald-400",
    },
    PENDING: {
      icon: Clock,
      className: "bg-amber-500/10 text-amber-400",
    },
    CANCELLED: {
      icon: XCircle,
      className: "bg-rose-500/10 text-rose-400",
    },
    FAILED: {
      icon: XCircle,
      className: "bg-rose-500/10 text-rose-400",
    },
    MAINTENANCE: {
      icon: Wrench,
      className: "bg-brand-500/10 text-brand-500",
    },
    AVAILABLE: {
      icon: CheckCircle2,
      className: "bg-sky-500/10 text-sky-400",
    },
  };

  const current = config[normalized] ?? {
    icon: Activity,
    className: "bg-surface-800 text-content-secondary",
  };

  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${current.className}`}
    >
      <Icon size={11} />
      {normalized.replaceAll("_", " ")}
    </span>
  );
}

/* ============================================================================
 * REVENUE CHART
 * ========================================================================== */

function RevenueChart({ data, loading }) {
  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <Panel className="lg:col-span-2">
      <SectionHeader
        icon={TrendingUp}
        color="gold"
        title="Revenue overview"
        subtitle="Paid transactions across the available payment history"
      />

      {loading ? (
        <div className="flex h-[250px] items-end gap-4 px-3 pb-5">
          {[50, 70, 35, 80, 60, 90, 55].map((height, index) => (
            <div
              key={index}
              className="flex-1 animate-pulse rounded-t-xl bg-surface-800"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      ) : (
        <>
          <div className="relative h-[250px]">
            <div className="absolute inset-0 flex flex-col justify-between">
              {[0, 1, 2, 3].map((line) => (
                <div
                  key={line}
                  className="border-t border-dashed border-surface-800"
                />
              ))}
            </div>

            <div className="absolute inset-x-0 bottom-0 top-3 flex items-end gap-2 px-1">
              {data.map((item) => {
                const height =
                  item.value === 0
                    ? 3
                    : Math.max((item.value / max) * 100, 7);

                return (
                  <div
                    key={item.label}
                    className="group relative flex h-full flex-1 items-end"
                  >
                    <div
                      className="w-full rounded-t-xl bg-brand-500/70 transition-all duration-300 group-hover:bg-brand-500"
                      style={{ height: `${height}%` }}
                    />

                    <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-surface-700 bg-surface px-2.5 py-1.5 text-[10px] opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
                      <span className="font-semibold text-content-primary">
                        {formatMoney(item.value)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-3 flex gap-2 px-1">
            {data.map((item) => (
              <span
                key={item.label}
                className="flex-1 text-center text-[10px] text-content-muted"
              >
                {item.label}
              </span>
            ))}
          </div>
        </>
      )}
    </Panel>
  );
}

/* ============================================================================
 * BOOKING ACTIVITY CHART
 * ========================================================================== */

function BookingActivity({ data, loading }) {
  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <Panel>
      <SectionHeader
        icon={BarChart3}
        color="blue"
        title="Booking activity"
        subtitle="Last 14 days"
      />

      {loading ? (
        <div className="flex h-[210px] items-end gap-1">
          {Array.from({ length: 14 }).map((_, index) => (
            <div
              key={index}
              className="flex-1 animate-pulse rounded-t-md bg-surface-800"
              style={{
                height: `${25 + ((index * 17) % 70)}%`,
              }}
            />
          ))}
        </div>
      ) : (
        <>
          <div className="flex h-[210px] items-end gap-1.5">
            {data.map((item) => {
              const height =
                item.value === 0
                  ? 3
                  : Math.max((item.value / max) * 100, 8);

              return (
                <div
                  key={item.date}
                  className="group relative flex h-full flex-1 items-end"
                >
                  <div
                    className="w-full rounded-t-md bg-sky-400/60 transition-all duration-300 group-hover:bg-sky-400"
                    style={{ height: `${height}%` }}
                  />

                  <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-lg border border-surface-700 bg-surface px-2 py-1 text-[10px] opacity-0 shadow-xl group-hover:opacity-100">
                    {item.value} booking{item.value === 1 ? "" : "s"}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex justify-between text-[9px] text-content-muted">
            <span>{shortDate(data[0]?.date)}</span>
            <span>{shortDate(data[Math.floor(data.length / 2)]?.date)}</span>
            <span>{shortDate(data[data.length - 1]?.date)}</span>
          </div>
        </>
      )}
    </Panel>
  );
}

/* ============================================================================
 * BOOKING STATUS
 * ========================================================================== */

function BookingStatusPanel({ statuses, total, loading }) {
  const entries = Object.entries(statuses);

  return (
    <Panel>
      <SectionHeader
        icon={Layers3}
        color="purple"
        title="Booking status"
        subtitle={`${total} total bookings`}
      />

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="animate-pulse">
              <div className="mb-2 h-3 w-24 rounded bg-surface-800" />
              <div className="h-2 rounded-full bg-surface-800" />
            </div>
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="flex h-[210px] items-center justify-center text-xs text-content-muted">
          No booking status data available.
        </div>
      ) : (
        <div className="space-y-4">
          {entries.slice(0, 6).map(([status, count]) => {
            const percentage = total
              ? Math.round((count / total) * 100)
              : 0;

            return (
              <div key={status}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-xs font-medium text-content-secondary">
                    {status.replaceAll("_", " ")}
                  </span>

                  <span className="text-xs font-semibold text-content-primary">
                    {count}
                  </span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-surface-800">
                  <div
                    className="h-full rounded-full bg-violet-400 transition-all duration-700"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <p className="mt-1 text-right text-[9px] text-content-muted">
                  {percentage}%
                </p>
              </div>
            );
          })}
        </div>
      )}
    </Panel>
  );
}

/* ============================================================================
 * UPCOMING TRIPS
 * ========================================================================== */

function UpcomingTrips({ trips, loading }) {
  return (
    <Panel>
      <SectionHeader
        icon={Compass}
        color="blue"
        title="Upcoming departures"
        subtitle="Next 7 days"
        action={
          <Link
            to="/trips"
            className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-brand-500 hover:text-brand-600"
          >
            View all
            <ChevronRight size={13} />
          </Link>
        }
      />

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-14 animate-pulse rounded-xl bg-surface-800"
            />
          ))}
        </div>
      ) : trips.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-surface-800 py-10 text-center">
          <Compass
            size={24}
            className="mx-auto text-content-muted"
          />
          <p className="mt-2 text-xs text-content-muted">
            No departures scheduled.
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {trips.slice(0, 5).map((trip) => (
            <div
              key={trip.tripId}
              className="group flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors hover:bg-surface"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">
                <Ship size={17} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-content-primary">
                  {trip.route ?? "Scheduled trip"}
                </p>

                <p className="mt-0.5 text-[10px] text-content-muted">
                  {formatDate(getTripDate(trip))}
                  {" · "}
                  {String(trip.departureTime ?? "").slice(0, 5)}
                </p>
              </div>

              <span className="font-mono text-[10px] text-content-muted">
                #{trip.tripId}
              </span>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

/* ============================================================================
 * PAYMENTS
 * ========================================================================== */

function PaymentPanel({ payments, loading }) {
  return (
    <Panel>
      <SectionHeader
        icon={CreditCard}
        color="rose"
        title="Payment verification"
        subtitle="Transactions requiring attention"
        action={
          <Link
            to="/payment/records"
            className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-brand-500 hover:text-brand-600"
          >
            View records
            <ChevronRight size={13} />
          </Link>
        }
      />

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-14 animate-pulse rounded-xl bg-surface-800"
            />
          ))}
        </div>
      ) : payments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-surface-800 py-10 text-center">
          <CheckCircle2
            size={24}
            className="mx-auto text-emerald-400"
          />
          <p className="mt-2 text-xs text-content-muted">
            Nothing is waiting for verification.
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {payments.slice(0, 5).map((payment) => (
            <div
              key={payment.paymentId}
              className="flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors hover:bg-surface"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
                <Wallet size={17} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-content-primary">
                  Booking #{payment.bookingId ?? "—"}
                </p>

                <p className="mt-0.5 text-[10px] text-content-muted">
                  {payment.paymentMethod ?? "Payment"}
                </p>
              </div>

              <div className="text-right">
                <p className="font-mono text-xs font-semibold text-content-primary">
                  {formatMoney(payment.amount)}
                </p>

                <StatusPill status={getPaymentStatus(payment)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

/* ============================================================================
 * FLEET HEALTH
 * ========================================================================== */

function FleetHealth({ boats, loading }) {
  const counts = useMemo(() => {
    return boats.reduce(
      (acc, boat) => {
        const status = getBoatStatus(boat);

        if (status === "MAINTENANCE") {
          acc.maintenance += 1;
        } else if (status === "AVAILABLE" || status === "ACTIVE") {
          acc.available += 1;
        } else {
          acc.other += 1;
        }

        return acc;
      },
      {
        available: 0,
        maintenance: 0,
        other: 0,
      }
    );
  }, [boats]);

  const total = boats.length || 1;

  return (
    <Panel>
      <SectionHeader
        icon={Gauge}
        color="orange"
        title="Fleet health"
        subtitle={`${boats.length} boats in system`}
      />

      {loading ? (
        <div className="animate-pulse">
          <div className="mx-auto h-32 w-32 rounded-full border-[14px] border-surface-800" />
        </div>
      ) : (
        <>
          <div className="flex items-center gap-6">
            <div className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full border-[14px] border-surface-800">
              <div
                className="absolute inset-[-14px] rounded-full border-[14px] border-transparent border-t-emerald-400 border-r-emerald-400"
                style={{
                  transform: `rotate(${45 + (counts.available / total) * 180}deg)`,
                }}
              />

              <div className="text-center">
                <p className="font-display text-3xl text-content-primary">
                  {boats.length}
                </p>
                <p className="text-[9px] uppercase tracking-wider text-content-muted">
                  fleet
                </p>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <span className="text-xs text-content-secondary">
                    Available
                  </span>
                </div>

                <span className="text-xs font-semibold text-content-primary">
                  {counts.available}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-brand-500" />
                  <span className="text-xs text-content-secondary">
                    Maintenance
                  </span>
                </div>

                <span className="text-xs font-semibold text-content-primary">
                  {counts.maintenance}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-surface-700" />
                  <span className="text-xs text-content-secondary">
                    Other
                  </span>
                </div>

                <span className="text-xs font-semibold text-content-primary">
                  {counts.other}
                </span>
              </div>
            </div>
          </div>

          {counts.maintenance > 0 && (
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-brand-500/10 bg-brand-500/5 p-3">
              <Wrench
                size={16}
                className="mt-0.5 shrink-0 text-brand-500"
              />

              <div>
                <p className="text-xs font-semibold text-content-primary">
                  Maintenance attention required
                </p>

                <p className="mt-0.5 text-[10px] leading-5 text-content-muted">
                  {counts.maintenance} boat
                  {counts.maintenance === 1 ? "" : "s"} currently marked
                  for maintenance.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </Panel>
  );
}

/* ============================================================================
 * RATING PANEL
 * ========================================================================== */

function RatingPanel({ feedback, average, loading }) {
  const distribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: feedback.filter((item) => getRating(item) === rating).length,
  }));

  const total = feedback.length || 1;

  return (
    <Panel>
      <SectionHeader
        icon={Star}
        color="purple"
        title="Customer satisfaction"
        subtitle="Feedback performance"
      />

      {loading ? (
        <div className="h-40 animate-pulse rounded-2xl bg-surface-800" />
      ) : (
        <div className="flex items-center gap-6">
          <div className="shrink-0 text-center">
            <div className="flex items-center justify-center gap-1">
              <Star
                size={22}
                className="fill-amber-400 text-amber-400"
              />

              <span className="font-display text-4xl text-content-primary">
                {average}
              </span>
            </div>

            <p className="mt-1 text-[10px] text-content-muted">
              out of 5
            </p>

            <p className="mt-3 text-[10px] text-content-secondary">
              {feedback.length} review
              {feedback.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="flex-1 space-y-2">
            {distribution.map((item) => {
              const percentage = Math.round(
                (item.count / total) * 100
              );

              return (
                <div
                  key={item.rating}
                  className="flex items-center gap-2"
                >
                  <span className="w-3 text-[10px] text-content-muted">
                    {item.rating}
                  </span>

                  <Star
                    size={10}
                    className="fill-amber-400 text-amber-400"
                  />

                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-800">
                    <div
                      className="h-full rounded-full bg-amber-400 transition-all duration-700"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <span className="w-7 text-right text-[9px] text-content-muted">
                    {item.count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Panel>
  );
}

/* ============================================================================
 * INSIGHTS
 * ========================================================================== */

function InsightsPanel({
  upcomingTrips,
  pendingPayments,
  boatsInMaintenance,
  avgRating,
  todaysBookings,
}) {
  const insights = [];

  if (pendingPayments.length > 0) {
    insights.push({
      icon: CreditCard,
      title: `${pendingPayments.length} payment${
        pendingPayments.length === 1 ? "" : "s"
      } need verification`,
      text: "Review pending transactions to keep booking records up to date.",
      color: "rose",
    });
  }

  if (boatsInMaintenance.length > 0) {
    insights.push({
      icon: Wrench,
      title: `${boatsInMaintenance.length} boat${
        boatsInMaintenance.length === 1 ? "" : "s"
      } in maintenance`,
      text: "Fleet availability may be reduced until maintenance is completed.",
      color: "orange",
    });
  }

  if (upcomingTrips.length > 0) {
    insights.push({
      icon: Compass,
      title: `${upcomingTrips.length} upcoming departure${
        upcomingTrips.length === 1 ? "" : "s"
      }`,
      text: "There are scheduled trips within the next seven days.",
      color: "blue",
    });
  }

  if (Number(avgRating) >= 4.5) {
    insights.push({
      icon: Star,
      title: "Customer satisfaction is strong",
      text: `The current average feedback rating is ${avgRating}/5.`,
      color: "purple",
    });
  }

  if (todaysBookings > 0) {
    insights.push({
      icon: CalendarCheck,
      title: `${todaysBookings} booking${
        todaysBookings === 1 ? "" : "s"
      } today`,
      text: "Keep an eye on today's departures and booking confirmations.",
      color: "teal",
    });
  }

  if (insights.length === 0) {
    insights.push({
      icon: Sparkles,
      title: "Dashboard is looking healthy",
      text: "No immediate operational warnings were detected.",
      color: "purple",
    });
  }

  return (
    <Panel className="overflow-hidden">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500">
          <Sparkles size={17} />
        </div>

        <div>
          <h2 className="font-display text-base text-content-primary">
            Operational insights
          </h2>

          <p className="text-xs text-content-muted">
            Automatically derived from current dashboard data
          </p>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {insights.slice(0, 6).map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={`${item.title}-${index}`}
              className="rounded-2xl border border-surface-800 bg-surface p-4 transition-colors hover:border-surface-700"
            >
              <div className="flex gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    BADGE_STYLES[item.color]
                  }`}
                >
                  <Icon size={15} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-content-primary">
                    {item.title}
                  </p>

                  <p className="mt-1 text-[10px] leading-5 text-content-muted">
                    {item.text}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

/* ============================================================================
 * QUICK ACTIONS
 * ========================================================================== */

function QuickActions() {
  const actions = [
    {
      label: "Manage bookings",
      href: "/bookings",
      icon: CalendarCheck,
      color: "teal",
    },
    {
      label: "Payment records",
      href: "/payment/records",
      icon: Wallet,
      color: "gold",
    },
    {
      label: "Manage boats",
      href: "/boats",
      icon: Ship,
      color: "orange",
    },
    {
      label: "View trips",
      href: "/trips",
      icon: Compass,
      color: "blue",
    },
  ];

  return (
    <Panel>
      <SectionHeader
        icon={Layers3}
        color="purple"
        title="Quick actions"
        subtitle="Jump directly to an admin module"
      />

      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.href}
              to={action.href}
              className="group rounded-2xl border border-surface-800 bg-surface p-3 transition-all hover:border-surface-700 hover:bg-surface-800"
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                  BADGE_STYLES[action.color]
                }`}
              >
                <Icon size={15} />
              </div>

              <p className="mt-3 text-[10px] font-semibold text-content-secondary transition-colors group-hover:text-content-primary">
                {action.label}
              </p>

              <ChevronRight
                size={13}
                className="mt-1 text-content-muted transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          );
        })}
      </div>
    </Panel>
  );
}

/* ============================================================================
 * MAIN DASHBOARD
 * ========================================================================== */

export default function DashboardOverview() {
  usePageTitle("Dashboard Overview");

  const [data, setData] = useState({
    trips: [],
    payments: [],
    bookings: [],
    boats: [],
    feedback: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    const results = await Promise.allSettled([
      getTrips(),
      getPayments(),
      getBookings(),
      getBoats(),
      getFeedback(),
    ]);

    const [
      trips,
      payments,
      bookings,
      boats,
      feedback,
    ] = results.map((result) =>
      result.status === "fulfilled" ? result.value : []
    );

    const failed = results.filter(
      (result) => result.status === "rejected"
    );

    if (failed.length > 0) {
      setError(
        `${failed.length} data source${
          failed.length === 1 ? "" : "s"
        } couldn't be loaded. Showing partial dashboard data.`
      );
    }

    setData({
      trips: Array.isArray(trips) ? trips : [],
      payments: Array.isArray(payments) ? payments : [],
      bookings: Array.isArray(bookings) ? bookings : [],
      boats: Array.isArray(boats) ? boats : [],
      feedback: Array.isArray(feedback) ? feedback : [],
    });

    setLastUpdated(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const {
    trips,
    payments,
    bookings,
    boats,
    feedback,
  } = data;

  /* --------------------------------------------------------------------------
   * DERIVED DATA
   * ------------------------------------------------------------------------ */

  const today = todayStr();
  const weekAhead = daysFromNow(7);
  const monthStart = today.slice(0, 7);

  const todaysBookings = bookings.filter(
    (booking) => booking.bookingDate === today
  ).length;

  const monthRevenue = payments
    .filter(
      (payment) =>
        getPaymentStatus(payment) === "PAID" &&
        String(payment.paymentDate ?? "").slice(0, 7) === monthStart
    )
    .reduce(
      (sum, payment) => sum + Number(payment.amount || 0),
      0
    );

  const pendingPayments = payments.filter(
    (payment) => getPaymentStatus(payment) === "PENDING"
  );

  const upcomingTrips = trips
    .filter((trip) => {
      const date = getTripDate(trip);

      return date >= today && date <= weekAhead;
    })
    .sort(
      (a, b) =>
        getTripDate(a).localeCompare(getTripDate(b)) ||
        String(a.departureTime ?? "").localeCompare(
          String(b.departureTime ?? "")
        )
    );

  const boatsInMaintenance = boats.filter(
    (boat) => getBoatStatus(boat) === "MAINTENANCE"
  );

  const avgRating =
    feedback.length > 0
      ? (
          feedback.reduce(
            (sum, item) => sum + getRating(item),
            0
          ) / feedback.length
        ).toFixed(1)
      : "—";

  /* --------------------------------------------------------------------------
   * BOOKING ACTIVITY — LAST 14 DAYS
   * ------------------------------------------------------------------------ */

  const bookingActivity = useMemo(() => {
    const output = [];

    for (let i = 13; i >= 0; i -= 1) {
      const d = new Date();
      d.setDate(d.getDate() - i);

      const date = d.toISOString().slice(0, 10);

      output.push({
        date,
        value: bookings.filter(
          (booking) => booking.bookingDate === date
        ).length,
      });
    }

    return output;
  }, [bookings]);

  /* --------------------------------------------------------------------------
   * REVENUE — LAST 7 MONTHS
   * ------------------------------------------------------------------------ */

  const revenueData = useMemo(() => {
    const output = [];

    for (let i = 6; i >= 0; i -= 1) {
      const date = new Date();

      date.setDate(1);
      date.setMonth(date.getMonth() - i);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");

      const key = `${year}-${month}`;

      const value = payments
        .filter(
          (payment) =>
            getPaymentStatus(payment) === "PAID" &&
            String(payment.paymentDate ?? "").slice(0, 7) ===
              key
        )
        .reduce(
          (sum, payment) =>
            sum + Number(payment.amount || 0),
          0
        );

      output.push({
        label: date.toLocaleDateString("en-LK", {
          month: "short",
        }),
        value,
      });
    }

    return output;
  }, [payments]);

  /* --------------------------------------------------------------------------
   * BOOKING STATUS
   * ------------------------------------------------------------------------ */

  const bookingStatuses = useMemo(() => {
    return bookings.reduce((acc, booking) => {
      const status = getBookingStatus(booking);

      acc[status] = (acc[status] || 0) + 1;

      return acc;
    }, {});
  }, [bookings]);

  /* --------------------------------------------------------------------------
   * PAYMENT TOTALS
   * ------------------------------------------------------------------------ */

  const paidRevenue = payments
    .filter((payment) => getPaymentStatus(payment) === "PAID")
    .reduce(
      (sum, payment) => sum + Number(payment.amount || 0),
      0
    );

  const pendingValue = pendingPayments.reduce(
    (sum, payment) => sum + Number(payment.amount || 0),
    0
  );

  /* --------------------------------------------------------------------------
   * UI
   * ------------------------------------------------------------------------ */

  return (
    <div className="min-h-screen px-4 pb-16 font-body text-content-primary">
      <div className="mx-auto max-w-[1400px]">

        {/* ================================================================
         * SECONDARY METRICS
         * ================================================================ */}

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-surface-800 bg-surface-900 px-5 py-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-content-muted">
                Total bookings
              </span>

              <Users size={15} className="text-content-muted" />
            </div>

            <p className="mt-2 font-display text-2xl text-content-primary">
              {loading ? "—" : formatCompactNumber(bookings.length)}
            </p>
          </div>

          <div className="rounded-2xl border border-surface-800 bg-surface-900 px-5 py-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-content-muted">
                Lifetime paid revenue
              </span>

              <Wallet size={15} className="text-content-muted" />
            </div>

            <p className="mt-2 font-display text-2xl text-content-primary">
              {loading ? "—" : formatMoney(paidRevenue)}
            </p>
          </div>

          <div className="rounded-2xl border border-surface-800 bg-surface-900 px-5 py-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-content-muted">
                Fleet availability
              </span>

              <Gauge size={15} className="text-content-muted" />
            </div>

            <p className="mt-2 font-display text-2xl text-content-primary">
              {loading || boats.length === 0
                ? "—"
                : `${Math.round(
                    ((boats.length -
                      boatsInMaintenance.length) /
                      boats.length) *
                      100
                  )}%`}
            </p>
          </div>
        </div>

        {/* ================================================================
         * ANALYTICS ROW
         * ================================================================ */}

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <RevenueChart
            data={revenueData}
            loading={loading}
          />

          <BookingActivity
            data={bookingActivity}
            loading={loading}
          />
        </div>

        {/* ================================================================
         * STATUS / FLEET / RATING
         * ================================================================ */}

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <BookingStatusPanel
            statuses={bookingStatuses}
            total={bookings.length}
            loading={loading}
          />

          <FleetHealth
            boats={boats}
            loading={loading}
          />

          <RatingPanel
            feedback={feedback}
            average={avgRating}
            loading={loading}
          />
        </div>

        {/* ================================================================
         * OPERATIONAL TABLES
         * ================================================================ */}

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <UpcomingTrips
            trips={upcomingTrips}
            loading={loading}
          />

          <PaymentPanel
            payments={pendingPayments}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}