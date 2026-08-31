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

export default function CustomerManagement() {
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
      setError("Failed to load customers. Is the backend running on :8080?");
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
      setError("Failed to delete customer.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
            <p className="text-sm text-slate-500">Manage registered customer accounts</p>
          </div>
          <button
            onClick={openAddModal}
            className="rounded-md bg-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-cyan-700"
          >
            + Add New Customer
          </button>
        </div>

        <form onSubmit={handleSearchSubmit} className="mb-4 flex gap-2">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full max-w-sm rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
          <button
            type="submit"
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
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
              className="rounded-md px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100"
            >
              Clear
            </button>
          )}
        </form>

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="p-10 text-center text-slate-500">Loading customers...</div>
        ) : (
          <CustomerTable customers={customers} onEdit={openEditModal} onDelete={handleDelete} />
        )}
      </div>

      <CustomerFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingCustomer}
      />
    </div>
  );
}
