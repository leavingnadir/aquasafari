import React from "react";
import { StatusBadge, ConditionBadge } from "./BoatBadges";
import { Anchor, Edit2, Trash2 } from "lucide-react";

export default function BoatTable({ boats, onEdit, onDelete }) {
  if (boats.length === 0) {
    return (
      <div className="rounded-[2.5rem] border border-dashed border-surface-800 bg-surface-900 px-6 py-16 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-surface-800 bg-surface text-content-muted">
          <Anchor size={20} />
        </div>
        <p className="text-sm font-medium text-content-primary">No boats in the fleet yet</p>
        <p className="mt-1 text-xs text-content-secondary">
          Add your first boat to make it available for trip scheduling.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[2.5rem] border border-surface-800 bg-surface-900 shadow-xl">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-surface-800 text-sm text-content-primary">
          <thead className="bg-surface/50">
            <tr>
              <Th>Boat ID</Th>
              <Th>Image</Th>
              <Th>Name</Th>
              <Th>Type</Th>
              <Th>Capacity</Th>
              <Th>Engine</Th>
              <Th>Condition</Th>
              <Th>Status</Th>
              <Th>Operator</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-800/60">
            {boats.map((boat) => (
              <tr key={boat.id || boat.boatId} className="transition-colors hover:bg-surface-800/40">
                <td className="whitespace-nowrap px-6 py-4 font-mono text-xs text-content-secondary">
                  {boat.boatId}
                </td>
                <td className="px-4 py-3">
                  {boat.imageUrl ? (
                    <img 
                      src={boat.imageUrl} 
                      alt={boat.name} 
                      className="h-10 w-14 rounded-lg object-cover border border-surface-800"
                      onError={(e) => {
                        // Fallback if the URL fails to load
                        e.target.src = "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600";
                      }}
                    />
                  ) : (
                    <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-surface-800 text-[10px] text-content-muted">
                      No Image
                    </div>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4 font-display font-medium text-content-primary">
                  {boat.name}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-content-secondary">
                  {boat.boatType || "—"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-content-secondary">
                  {boat.passengerCapacity}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-content-secondary">
                  {boat.engineType || "—"}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <ConditionBadge value={boat.condition} />
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <StatusBadge value={boat.status} />
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-content-secondary">
                  {boat.boatOperatorId ? `#${boat.boatOperatorId}` : <span className="text-content-muted italic">Unassigned</span>}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(boat)}
                      className="inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-content-secondary transition hover:bg-surface-800 hover:text-content-primary"
                    >
                      <Edit2 size={13} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => onDelete(boat)}
                      className="inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-400 transition hover:bg-rose-500/10 hover:text-rose-300"
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
    </div>
  );
}

function Th({ children, className = "" }) {
  return (
    <th
      className={`px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-content-muted ${className}`}
    >
      {children}
    </th>
  );
}
