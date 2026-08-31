import { useEffect, useMemo, useState } from "react";
import { boatApi } from "../../api/boatApi";
import BoatTable from "./BoatTable";
import BoatFormModal from "./BoatFormModal";

/**
 * Fleet Management page — implements the Boat Management use case:
 * view existing boats with status indicators, add / edit / delete boats,
 * and filter down to available boats only.
 */
export default function BoatManagement() {
  const [boats, setBoats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [banner, setBanner] = useState(null); // { type: 'success' | 'error', message }

  const [search, setSearch] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);

  const [editingBoat, setEditingBoat] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    loadBoats();
  }, []);

  async function loadBoats() {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await boatApi.getAll();
      setBoats(data ?? []);
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function showBanner(type, message) {
    setBanner({ type, message });
    setTimeout(() => setBanner(null), 4000);
  }

  function openAddForm() {
    setEditingBoat(null);
    setShowForm(true);
  }

  function openEditForm(boat) {
    setEditingBoat(boat);
    setShowForm(true);
  }

  async function handleFormSubmit(payload) {
    try {
      if (editingBoat) {
        await boatApi.update(editingBoat.id, payload);
        showBanner("success", `Boat ${payload.boatId} updated.`);
      } else {
        await boatApi.create(payload);
        showBanner("success", `Boat ${payload.boatId} added to the fleet.`);
      }
      setShowForm(false);
      await loadBoats();
    } catch (err) {
      // Surfaces use-case extension 3a: duplicate Boat ID / registration
      showBanner("error", err.message);
      throw err; // keep the modal open so the admin can fix the field
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    try {
      await boatApi.remove(pendingDelete.id);
      showBanner("success", `Boat ${pendingDelete.boatId} removed.`);
      setPendingDelete(null);
      await loadBoats();
    } catch (err) {
      showBanner("error", err.message);
    }
  }

  const filteredBoats = useMemo(() => {
    return boats.filter((boat) => {
      if (availableOnly && boat.status !== "AVAILABLE") return false;
      if (!search.trim()) return true;
      const q = search.trim().toLowerCase();
      return (
        boat.boatId.toLowerCase().includes(q) ||
        boat.name.toLowerCase().includes(q) ||
        (boat.boatType ?? "").toLowerCase().includes(q)
      );
    });
  }, [boats, search, availableOnly]);

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-teal-900">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <p className="text-xs font-medium uppercase tracking-wide text-teal-300">
            AquaSafari · Fleet
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-white">Boat Management</h1>
          <p className="mt-1 text-sm text-teal-100">
            Register boats, keep their status current, and assign operators before trip
            scheduling.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {banner && (
          <div
            className={`mb-4 rounded-md border px-4 py-3 text-sm ${
              banner.type === "success"
                ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                : "border-red-300 bg-red-50 text-red-800"
            }`}
          >
            {banner.message}
          </div>
        )}

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="text"
              placeholder="Search by Boat ID, name, or type"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-sm rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
            />
            <label className="flex items-center gap-2 text-sm text-stone-600">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
                className="h-4 w-4 rounded border-stone-300 text-teal-800 focus:ring-teal-700"
              />
              Available only
            </label>
          </div>

          <button
            onClick={openAddForm}
            className="rounded-md bg-teal-800 px-4 py-2 text-sm font-medium text-white hover:bg-teal-900"
          >
            + Add boat
          </button>
        </div>

        {loading && <p className="text-sm text-stone-500">Loading fleet…</p>}

        {!loading && loadError && (
          <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
            Couldn't load the fleet: {loadError}
          </div>
        )}

        {!loading && !loadError && (
          <BoatTable boats={filteredBoats} onEdit={openEditForm} onDelete={setPendingDelete} />
        )}
      </main>

      {showForm && (
        <BoatFormModal
          boat={editingBoat}
          onClose={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
        />
      )}

      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-slate-800">Delete this boat?</h2>
            <p className="mt-2 text-sm text-stone-600">
              <span className="font-medium">{pendingDelete.name}</span> ({pendingDelete.boatId})
              will be removed from the fleet and won't be available for trip scheduling.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setPendingDelete(null)}
                className="rounded-md border border-stone-300 px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete boat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
