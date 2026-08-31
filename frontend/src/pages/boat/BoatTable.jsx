import { StatusBadge, ConditionBadge } from "./BoatBadges";

export default function BoatTable({ boats, onEdit, onDelete }) {
  if (boats.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
        <p className="text-sm font-medium text-slate-700">No boats in the fleet yet</p>
        <p className="mt-1 text-sm text-stone-500">
          Add your first boat to make it available for trip scheduling.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-stone-200 bg-white">
      <table className="min-w-full divide-y divide-stone-200 text-sm">
        <thead className="bg-stone-50">
          <tr>
            <Th>Boat ID</Th>
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
        <tbody className="divide-y divide-stone-100">
          {boats.map((boat) => (
            <tr key={boat.id} className="hover:bg-stone-50">
              <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-700">
                {boat.boatId}
              </td>
              <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-800">
                {boat.name}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-stone-600">
                {boat.boatType || "—"}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-stone-600">
                {boat.passengerCapacity}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-stone-600">
                {boat.engineType || "—"}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <ConditionBadge value={boat.condition} />
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <StatusBadge value={boat.status} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-stone-600">
                {boat.boatOperatorId ? `#${boat.boatOperatorId}` : "Unassigned"}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right">
                <button
                  onClick={() => onEdit(boat)}
                  className="mr-3 text-sm font-medium text-teal-800 hover:text-teal-900"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(boat)}
                  className="text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children, className = "" }) {
  return (
    <th
      className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500 ${className}`}
    >
      {children}
    </th>
  );
}
