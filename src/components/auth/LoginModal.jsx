"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginModal({ onClose, onSwitchToRegister, isDropdown = false }) {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid credentials");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const content = (
    <div className={`bg-white ${isDropdown ? "" : "rounded-2xl p-8 w-full max-w-md shadow-2xl relative"}`}>
      {!isDropdown && (
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      )}

      <div className={`text-center ${isDropdown ? "p-6 border-b border-slate-50 mb-6 bg-slate-50/50" : "mb-8"}`}>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Access NexusFlow</h2>
        <p className="text-slate-500 text-xs mt-1 font-bold">Synchronize your enterprise</p>
      </div>

      <form onSubmit={handleSubmit} className={`space-y-4 ${isDropdown ? "px-6 pb-6" : ""}`}>
        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Email</label>
          <input
            type="email"
            className="input-field"
            placeholder="you@enterprise.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Password</label>
          <input
            type="password"
            className="input-field"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-bold">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-4 text-sm font-black uppercase tracking-widest shadow-xl shadow-indigo-100"
        >
          {loading ? "Verifying..." : "Enter Workspace"}
        </button>

        <div className="pt-4 text-center">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-loose">
            Locked Out? <br />
            <button
              onClick={onSwitchToRegister}
              className="text-indigo-600 hover:underline"
            >
              Create a new organization
            </button>
          </p>
        </div>
      </form>
    </div>
  );

  if (isDropdown) return content;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>{content}</div>
    </div>
  );
}
