export default function CustomerTable({ customers, onEdit, onDelete }) {
  if (!customers || customers.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
        No customers found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-slate-600">Name</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600">Email</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600">Phone</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600">Registered</th>
            <th className="px-4 py-3 text-right font-semibold text-slate-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {customers.map((c) => (
            <tr key={c.userId} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-medium text-slate-800">
                {c.firstName} {c.lastName}
              </td>
              <td className="px-4 py-3 text-slate-600">{c.email}</td>
              <td className="px-4 py-3 text-slate-600">{c.phone || "-"}</td>
              <td className="px-4 py-3 text-slate-600">
                {c.registrationDate
                  ? new Date(c.registrationDate).toLocaleDateString()
                  : "-"}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onEdit(c)}
                  className="mr-2 rounded-md px-3 py-1.5 text-xs font-semibold text-cyan-700 hover:bg-cyan-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(c)}
                  className="rounded-md px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
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
