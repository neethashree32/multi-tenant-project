"use client";

import { useState } from "react";

export default function ComplaintModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    targetRole: "organization",
    isAnonymous: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit complaint");
      }

      onCreated();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-box animate-in fade-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 ">Submit a Complaint</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100  flex items-center justify-center text-slate-500 hover:text-slate-900   transition-all"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-500  text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Title</label>
            <input
              type="text"
              required
              className="input-field"
              placeholder="Brief summary..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              required
              rows={4}
              className="input-field"
              placeholder="Provide details..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div>
            <label className="label">Direct Complaint To:</label>
            <div className="grid grid-cols-2 gap-3 mt-1">
              <label
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  form.targetRole === "organization"
                    ? "border-indigo-500 bg-indigo-50  text-indigo-600 "
                    : "border-slate-200  bg-white  text-slate-600  hover:border-slate-300 "
                }`}
              >
                <input
                  type="radio"
                  name="targetRole"
                  value="organization"
                  checked={form.targetRole === "organization"}
                  onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
                  className="hidden"
                />
                Organization Level
              </label>
              <label
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  form.targetRole === "admin"
                    ? "border-sky-500 bg-sky-50  text-sky-600 "
                    : "border-slate-200  bg-white  text-slate-600  hover:border-slate-300 "
                }`}
              >
                <input
                  type="radio"
                  name="targetRole"
                  value="admin"
                  checked={form.targetRole === "admin"}
                  onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
                  className="hidden"
                />
                Admin Level
              </label>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-3 p-3 bg-slate-50  rounded-lg border border-slate-200 ">
            <input
              type="checkbox"
              id="anonymous"
              checked={form.isAnonymous}
              onChange={(e) => setForm({ ...form, isAnonymous: e.target.checked })}
              className="mt-1"
            />
            <label htmlFor="anonymous" className="text-sm text-slate-700  cursor-pointer">
              <span className="font-medium block text-slate-900  mb-0.5">Submit Anonymously</span>
              Your name and identity will be hidden from the organization and admins.
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Submitting..." : "Submit Complaint"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
