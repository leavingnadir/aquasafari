import { useEffect, useState } from "react";
import CustomerTable from "./CustomerTable";
import CustomerFormModal from "./CustomerFormModal";
import {
  getAllCustomers,
  searchCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
} from "../../services/customerService";
import { Users, UserPlus, Search, Loader2, ShieldAlert } from "lucide-react";
import usePageTitle from "../../hooks/usePageTitle";

export default function CustomerManagement() {
  usePageTitle("Customer Management");

  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const loadCustomers = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllCustomers();
      setCustomers(data);
    } catch (err) {
      console.error("FULL API ERROR:", err);
      const serverMessage = err?.response?.data?.message || err?.message || "Is the backend running on :8080?";
      setError(`Failed to load customers: ${serverMessage}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = searchTerm.trim()
        ? await searchCustomers(searchTerm.trim())
        : await getAllCustomers();
      setCustomers(data);
    } catch (err) {
      console.error("SEARCH ERROR:", err);
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

  const openEditModal = (customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleSave = async (form) => {
    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer.userId, form);
      } else {
        await addCustomer(form);
      }
      setIsModalOpen(false);
      setEditingCustomer(null);
      await loadCustomers();
    } catch (err) {
      console.error("SAVE ERROR:", err);
      const message =
        err?.response?.data?.message || "Could not save customer. Please check the details.";
      setError(message);
    }
  };

  const handleDelete = async (customer) => {
    const confirmed = window.confirm(
      `Delete ${customer.firstName} ${customer.lastName}? This cannot be undone.`
    );
    if (!confirmed) return;
    try {
      await deleteCustomer(customer.userId);
      await loadCustomers();
    } catch (err) {
      console.error("DELETE ERROR:", err);
      setError("Failed to delete customer.");
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 pt-24 pb-12 font-body text-content-primary">
      <div className="mb-8 flex flex-col justify-between gap-6 border-b border-surface-800 pb-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-800 bg-surface text-brand-500">
              <Users size={20} />
            </div>
            <h1 className="font-display text-3xl font-normal tracking-tight text-content-primary">
              User Management
            </h1>
          </div>
          <p className="mt-2 text-sm text-content-secondary">
            Manage registered customer accounts and profiles.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-lg shadow-brand-500/20 transition-all hover:bg-brand-600"
        >
          <UserPlus size={16} />
          <span>Add New Customer</span>
        </button>
      </div>

      <form
        onSubmit={handleSearchSubmit}
        className="mb-8 flex flex-col gap-4 rounded-[2.5rem] border border-surface-800 bg-surface-900 p-6 shadow-xl sm:flex-row sm:items-center"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted" size={16} />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full rounded-2xl border border-surface-800 bg-surface py-3 pl-11 pr-4 text-sm text-content-primary outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-full bg-surface border border-surface-800 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-content-primary transition-all hover:bg-surface-800"
          >
            Search
          </button>
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                loadCustomers();
              }}
              className="rounded-full px-5 py-3 text-xs font-semibold uppercase tracking-wider text-content-secondary transition-all hover:text-content-primary"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-5 py-4 text-rose-400">
          <ShieldAlert size={18} className="shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-content-secondary">
          <Loader2 size={18} className="animate-spin" />
          <span className="text-sm">Loading customers...</span>
        </div>
      ) : (
        <CustomerTable customers={customers} onEdit={openEditModal} onDelete={handleDelete} />
      )}

      <CustomerFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingCustomer}
      />
    </div>
  );
}
