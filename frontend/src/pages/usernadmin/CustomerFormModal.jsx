import { useEffect, useState } from "react";
import { User, Mail, Phone, X, Loader2, ShieldAlert, UserPlus, UserCheck } from "lucide-react";

const emptyForm = { firstName: "", lastName: "", email: "", phone: "" };

export default function CustomerFormModal({ isOpen, onClose, onSave, initialData }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        firstName: initialData.firstName || "",
        lastName: initialData.lastName || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const next = {};
    if (!form.firstName.trim()) next.firstName = "First name is required";
    if (!form.lastName.trim()) next.lastName = "Last name is required";
    if (!form.email.trim()) next.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSave(form);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 font-body text-content-primary">
      <div className="w-full max-w-md rounded-[2.5rem] border border-surface-800 bg-surface-900 p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6 border-b border-surface-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-800 bg-surface text-brand-500">
              {initialData ? <UserCheck size={20} /> : <UserPlus size={20} />}
            </div>
            <h2 className="font-display text-2xl font-normal text-content-primary">
              {initialData ? "Edit Customer" : "Add New Customer"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-surface-800 bg-surface text-content-secondary transition-all hover:bg-surface-800 hover:text-content-primary"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-content-secondary">
              First Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted" size={16} />
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="e.g. John"
                className="w-full rounded-2xl border border-surface-800 bg-surface py-3 pl-11 pr-4 text-sm text-content-primary outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
              />
            </div>
            {errors.firstName && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-400">
                <ShieldAlert size={13} />
                <span>{errors.firstName}</span>
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-content-secondary">
              Last Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted" size={16} />
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="e.g. Doe"
                className="w-full rounded-2xl border border-surface-800 bg-surface py-3 pl-11 pr-4 text-sm text-content-primary outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
              />
            </div>
            {errors.lastName && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-400">
                <ShieldAlert size={13} />
                <span>{errors.lastName}</span>
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-content-secondary">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted" size={16} />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="e.g. john.doe@example.com"
                className="w-full rounded-2xl border border-surface-800 bg-surface py-3 pl-11 pr-4 text-sm text-content-primary outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-400">
                <ShieldAlert size={13} />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-content-secondary">
              Phone
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted" size={16} />
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="e.g. +94 77 123 4567"
                className="w-full rounded-2xl border border-surface-800 bg-surface py-3 pl-11 pr-4 text-sm text-content-primary outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-surface-800 bg-surface px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-content-secondary transition-all hover:bg-surface-800 hover:text-content-primary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-full bg-brand-500 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-lg shadow-brand-500/20 transition-all hover:bg-brand-600 disabled:opacity-50"
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              <span>{submitting ? "Saving..." : initialData ? "Save Changes" : "Add Customer"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
