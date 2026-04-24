"use client";

import { useState } from "react";
import LoginModal from "./auth/LoginModal";
import RegisterModal from "./auth/RegisterModal";

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [registerRole, setRegisterRole] = useState("member");

  const openRegister = (role) => {
    setRegisterRole(role);
    setShowRegister(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-indigo-100 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -left-40 w-[400px] h-[400px] bg-sky-100 rounded-full blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-6 md:px-12 py-6 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm flex items-center justify-center bg-white border border-slate-200 p-1.5">
            <img src="/logo.png" alt="NexusFlow Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-slate-900 font-bold text-2xl tracking-tight">
            NexusFlow
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#roles" className="hover:text-indigo-600 transition-colors">Roles</a>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowLogin(true)}
              className="px-5 py-2 text-slate-600 hover:text-slate-900 transition-all text-sm font-bold"
            >
              Sign In
            </button>
            <button
              onClick={() => openRegister("member")}
              className="btn-primary text-sm px-6 py-2.5"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-24 pb-32">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-5 py-2 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-8">
            Modern Multi-Tenant Infrastructure
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight mb-8 tracking-tight">
            The Operating System For
            <br />
            Your <span className="gradient-text italic">Organization</span>
          </h1>
          <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12">
            NexusFlow provides the foundation for isolated, secure, and role-based
            management across any number of tenant organizations.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 w-full sm:w-auto">
            <button
              onClick={() => openRegister("organization")}
              className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:-translate-y-0.5 transition-all w-full sm:w-auto"
            >
              Create Organization
            </button>
            <button
              onClick={() => setShowLogin(true)}
              className="px-8 py-4 bg-white border border-slate-200 text-slate-900 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all w-full sm:w-auto"
            >
              Access Dashboard
            </button>
          </div>

          {/* Role Grid */}
          <div id="roles" className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                role: "organization",
                title: "Organization",
                desc: "Full administrative control over members, tasks, and system-wide configurations.",
                icon: "🏢"
              },
              {
                role: "admin",
                title: "Administrator",
                desc: "Operational management within the organization. Oversee teams and projects.",
                icon: "🛡️"
              },
              {
                role: "member",
                title: "Member",
                desc: "Execution-focused workspace. Manage assigned tasks and participate in events.",
                icon: "👤"
              }
            ].map((item) => (
              <button
                key={item.role}
                onClick={() => openRegister(item.role)}
                className="bg-white border border-slate-200 p-8 rounded-2xl text-left hover:border-indigo-400 hover:shadow-lg transition-all"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">
                  {item.desc}
                </p>
                <div className="text-indigo-600 font-bold text-sm">Join now →</div>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="font-bold text-slate-900">NexusFlow © 2026</span>
          <div className="flex items-center gap-8 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-indigo-600">Privacy</a>
            <a href="#" className="hover:text-indigo-600">Terms</a>
            <a href="#" className="hover:text-indigo-600">Support</a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      )}
      {showRegister && (
        <RegisterModal
          initialRole={registerRole}
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      )}
    </div>
  );
}
