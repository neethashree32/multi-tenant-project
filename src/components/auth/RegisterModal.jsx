"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterModal({ initialRole, onClose, onSwitchToLogin, isDropdown = false }) {
  const router = useRouter();
  const [role, setRole] = useState(initialRole);
  const [step, setStep] = useState(1);
  const [organizations, setOrganizations] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    organizationName: "",
    organizationId: "",
  });

  useEffect(() => {
    setRole(initialRole);
  }, [initialRole]);

  useEffect(() => {
    if (role !== "organization") {
      fetch("/api/organizations")
        .then((r) => r.json())
        .then((d) => setOrganizations(d.organizations || []))
        .catch(() => { });
    }
  }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role,
      };

      if (role === "organization") {
        payload.organizationName = form.organizationName;
      } else {
        if (form.organizationId) payload.organizationId = form.organizationId;
        else if (form.organizationName)
          payload.organizationName = form.organizationName;
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
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
    <div className={`bg-white ${isDropdown ? "p-6" : "rounded-2xl p-8 w-full max-w-md shadow-2xl relative"}`}>
      <div className="mb-6">
        <h3 className="text-xl font-black text-slate-900 tracking-tight">Join NexusFlow</h3>
        <p className="text-slate-500 text-xs font-bold mt-1 uppercase tracking-widest leading-relaxed">
          Step {step} of 2 / {role} Role
        </p>
      </div>

      {step === 1 ? (
        <div className="space-y-4">
          <input
            type="text"
            className="input-field"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="email"
            className="input-field"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            className="input-field"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <input
            type="password"
            className="input-field"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          />
          <button
            onClick={() => setStep(2)}
            className="btn-primary w-full py-4 font-black uppercase tracking-widest text-xs"
          >
            Next Step →
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {role === "organization" ? (
            <input
              type="text"
              className="input-field"
              placeholder="Organization Name"
              value={form.organizationName}
              onChange={(e) => setForm({ ...form, organizationName: e.target.value })}
              required
            />
          ) : (
            <select
              className="input-field"
              value={form.organizationId}
              onChange={(e) => setForm({ ...form, organizationId: e.target.value })}
            >
              <option value="">Select Organization</option>
              {organizations.map(org => <option key={org.id} value={org.id}>{org.name}</option>)}
            </select>
          )}
          {error && <p className="text-rose-600 text-[10px] font-black uppercase">{error}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="btn-secondary flex-1 py-4 text-xs font-black uppercase tracking-widest"
            >
              Back
            </button>
            <button
              type="submit"
              className="btn-primary flex-[2] py-4 text-xs font-black uppercase tracking-widest"
            >
              {loading ? "Processing..." : "Create Account"}
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 text-center">
        <button
          onClick={onSwitchToLogin}
          className="text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-indigo-600"
        >
          Already registered? Sign in
        </button>
      </div>
    </div>
  );

  if (isDropdown) return content;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>{content}</div>
    </div>
  );
}
