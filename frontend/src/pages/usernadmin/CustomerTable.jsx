import { Users, Edit3, Trash2 } from "lucide-react";

export default function CustomerTable({ customers, onEdit, onDelete }) {
  if (!customers || customers.length === 0) {
    return (
      <div className="rounded-[2.5rem] border border-dashed border-surface-800 bg-surface-900 px-6 py-16 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-surface-800 bg-surface text-content-muted">
          <Users size={20} />
        </div>
        <p className="text-sm font-medium text-content-primary">No customers found.</p>
        <p className="mt-1 text-xs text-content-secondary">Try adding a new customer or adjusting your search.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-[2.5rem] border border-surface-800 bg-surface-900 shadow-xl">
      <table className="min-w-full divide-y divide-surface-800 text-sm">
        <thead className="bg-surface/50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-content-secondary">Name</th>
            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-content-secondary">Email</th>
            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-content-secondary">Phone</th>
            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-content-secondary">Registered</th>
            <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-content-secondary">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-800">
          {customers.map((c) => (
            <tr key={c.userId} className="transition-colors hover:bg-surface/30">
              <td className="px-6 py-4 font-medium text-content-primary">
                {c.firstName} {c.lastName}
              </td>
              <td className="px-6 py-4 text-content-secondary">{c.email}</td>
              <td className="px-6 py-4 text-content-secondary font-mono text-xs">{c.phone || "—"}</td>
              <td className="px-6 py-4 text-content-secondary text-xs">
                {c.registrationDate
                  ? new Date(c.registrationDate).toLocaleDateString()
                  : "—"}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(c)}
                    className="flex items-center gap-1.5 rounded-full border border-surface-800 bg-surface px-4 py-2 text-xs font-semibold uppercase tracking-wider text-content-primary transition-all hover:bg-surface-800 hover:border-surface-700"
                  >
                    <Edit3 size={13} className="text-brand-500" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => onDelete(c)}
                    className="flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-rose-400 transition-all hover:bg-rose-500/20"
                  >
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
