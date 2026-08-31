import { useState } from "react";

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
    <div className="flex items-center gap-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
      <span className="font-medium">Testing as customer ID:</span>
      <input
        className="w-20 rounded border border-amber-300 bg-white px-2 py-1"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="e.g. 1"
      />
      <button
        onClick={save}
        className="rounded bg-amber-600 px-3 py-1 font-medium text-white hover:bg-amber-700"
      >
        Set
      </button>
      <span className="text-amber-700">
        (stand-in until the login module provides a real session)
      </span>
    </div>
  );
}
