import { useState } from "react";
import { UserCheck, ShieldAlert } from "lucide-react";

/**
 * Temporary stand-in for "the logged-in customer" until the User & Admin
 * module exposes a real session/auth context. Reads/writes a customerId
 * from localStorage so it persists across the booking pages.
 *
 * Once real auth exists, swap this out for whatever the usernadmin module
 * provides (e.g. a useAuth() hook) and delete this file.
 */
export function getStoredCustomerId() {
  return localStorage.getItem("aquasafari_customer_id") || "";
}

export default function CustomerIdBar({ customerId, onChange }) {
  const [draft, setDraft] = useState(customerId);

  const save = () => {
    localStorage.setItem("aquasafari_customer_id", draft);
    onChange(draft);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-[2.5rem] border border-surface-800 bg-surface-900 px-6 py-4 shadow-xl font-body text-content-primary">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-surface-800 bg-surface text-brand-500">
          <UserCheck size={16} />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-content-secondary">Testing as customer ID</span>
          <p className="text-xs text-content-muted">(stand-in until login module provides a session)</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          className="w-24 rounded-xl border border-surface-800 bg-surface px-3 py-1.5 text-center text-sm font-mono text-content-primary outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="e.g. 1"
        />
        <button
          onClick={save}
          className="rounded-full bg-brand-500 px-5 py-1.5 text-xs font-semibold uppercase tracking-wider text-white shadow-md shadow-brand-500/20 transition-all hover:bg-brand-600"
        >
          Set
        </button>
      </div>
    </div>
  );
}
