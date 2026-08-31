import React, { useEffect, useMemo, useState } from "react";
import { boatApi } from "../../api/boatApi";
import BoatTable from "./BoatTable";
import BoatFormModal from "./BoatFormModal";
import { Anchor, Search, Plus, AlertCircle, ShieldAlert, CheckCircle2 } from "lucide-react";

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
    <div className="min-h-screen bg-surface font-body text-content-primary pt-20 md:pt-24 pb-16">
      
      {/* Header Section */}
      <header className="border-b border-surface-800 bg-surface-900/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-surface-800 bg-surface px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-brand-500 shadow-sm">
            <Anchor size={12} />
            AquaSafari · Fleet
          </div>
          <h1 className="font-display text-4xl font-normal tracking-tight text-content-primary">
            Boat Management
          </h1>
          <p className="mt-1.5 text-sm text-content-secondary max-w-xl">
            Register boats, keep their status current, and assign operators before trip scheduling.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        
        {/* Banner Alert */}
        {banner && (
          <div
            className={`mb-6 flex items-center gap-3 rounded-2xl border px-5 py-4 text-sm backdrop-blur-md ${
              banner.type === "success"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                : "border-rose-500/30 bg-rose-500/10 text-rose-300"
            }`}
          >
            {banner.type === "success" ? (
              <CheckCircle2 size={20} className="shrink-0 text-emerald-400" />
            ) : (
              <ShieldAlert size={20} className="shrink-0 text-rose-400" />
            )}
            <span>{banner.message}</span>
          </div>
        )}

        {/* Search, Filter & Add Action Bar */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
            
            {/* Search Input */}
            <div className="relative w-full max-w-sm">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-content-muted">
                <Search size={16} />
              </span>
              <input
                type="text"
                placeholder="Search by Boat ID, name, or type"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-surface-800 bg-surface-900 py-2.5 pl-10 pr-4 text-sm text-content-primary outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
              />
            </div>

            {/* Checkbox Filter */}
            <label className="flex items-center gap-2.5 text-sm text-content-secondary cursor-pointer select-none">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
                className="h-4 w-4 rounded border-surface-800 bg-surface-900 text-brand-500 focus:ring-brand-500/20 accent-[#F05C35]"
              />
              <span>Available only</span>
            </label>
          </div>

          <button
            onClick={openAddForm}
            className="flex items-center justify-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-lg shadow-brand-500/20 transition-all hover:bg-brand-600"
          >
            <Plus size={15} />
            <span>Add boat</span>
          </button>
        </div>

        {/* Loading / Error States */}
        {loading && (
          <div className="p-16 text-center text-sm text-content-secondary">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent mb-3" />
            <p>Loading fleet…</p>
          </div>
        )}

        {!loading && loadError && (
          <div className="flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 text-sm text-rose-300">
            <ShieldAlert size={20} className="shrink-0 text-rose-400" />
            <span>Couldn't load the fleet: {loadError}</span>
          </div>
        )}

        {!loading && !loadError && (
          <BoatTable boats={filteredBoats} onEdit={openEditForm} onDelete={setPendingDelete} />
        )}
      </main>

      {/* Form Modal */}
      {showForm && (
        <BoatFormModal
          boat={editingBoat}
          onClose={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
        />
      )}

      {/* Delete Confirmation Modal */}
      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-[2.5rem] border border-surface-800 bg-surface-900 p-8 shadow-2xl text-center">
            
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-400">
              <AlertCircle size={24} />
            </div>

            <h2 className="font-display text-2xl font-normal text-content-primary">Delete this boat?</h2>
            
            <p className="mt-2 text-xs leading-relaxed text-content-secondary">
              <span className="font-medium text-content-primary">{pendingDelete.name}</span> (<span className="font-mono">{pendingDelete.boatId}</span>)
              will be removed from the fleet and won't be available for trip scheduling.
            </p>

            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                onClick={() => setPendingDelete(null)}
                className="rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-content-secondary transition hover:bg-surface-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-full bg-rose-600 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-all hover:bg-rose-700 shadow-lg shadow-rose-600/20"
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
