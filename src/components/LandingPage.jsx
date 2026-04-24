"use client";

import { useState } from "react";
import LoginModal from "./auth/LoginModal";
import RegisterModal from "./auth/RegisterModal";

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [registerRole, setRegisterRole] = useState("member");

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-x-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-indigo-100 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -left-40 w-[400px] h-[400px] bg-sky-100 rounded-full blur-[100px]" />
      </div>

      {/* Navbar with Dropdown Logic */}
      <nav className="relative z-50 flex items-center justify-between px-6 md:px-12 py-6 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm flex items-center justify-center bg-white border border-slate-200 p-1.5">
            <img src="/logo.png" alt="NexusFlow Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-slate-900 font-bold text-2xl tracking-tight">
            NexusFlow
          </span>
        </div>

        <div className="flex items-center gap-6 relative">
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#roles" className="hover:text-indigo-600 transition-colors">Roles</a>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setShowLogin(!showLogin); setShowRegister(false); }}
              className={`px-5 py-2 transition-all text-sm font-bold rounded-lg ${showLogin ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"}`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setRegisterRole("member");
                setShowRegister(!showRegister);
                setShowLogin(false);
              }}
              className="btn-primary text-sm px-6 py-2.5"
            >
              Get Started
            </button>
          </div>

          {/* Sign In Dropdown */}
          {showLogin && (
            <div className="absolute top-full right-0 mt-4 w-96 z-50 bg-white border border-slate-200 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
              <LoginModal
                isDropdown={true}
                onClose={() => setShowLogin(false)}
                onSwitchToRegister={() => {
                  setShowLogin(false);
                  setShowRegister(true);
                  setRegisterRole("member");
                }}
              />
            </div>
          )}

          {/* Register Dropdown */}
          {showRegister && (
            <div className="absolute top-full right-0 mt-4 w-[450px] z-50 bg-white border border-slate-200 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in-95 duration-200 overflow-hidden max-h-[85vh] overflow-y-auto">
              <RegisterModal
                isDropdown={true}
                initialRole={registerRole}
                onClose={() => setShowRegister(false)}
                onSwitchToLogin={() => {
                  setShowRegister(false);
                  setShowLogin(true);
                }}
              />
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-24 pb-32">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-tight mb-8 tracking-tighter">
            Build Your Enterprise
            <br />
            With <span className="gradient-text">Absolute Flow</span>
          </h1>
          <p className="text-slate-500 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-12 font-medium">
            The multi-tenant infrastructure designed for modern organizations.
            Isolate data, orchestrate tasks, and sync your entire team globally.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 w-full sm:w-auto">
            <button
              onClick={() => {
                setRegisterRole("organization");
                setShowRegister(true);
                setShowLogin(false);
              }}
              className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-xl hover:shadow-2xl hover:-translate-y-1 transition-all w-full sm:w-auto"
            >
              Launch Organization
            </button>
            <button
              onClick={() => { setShowLogin(true); setShowRegister(false); }}
              className="px-10 py-5 bg-white border-2 border-slate-200 text-slate-900 rounded-2xl font-black text-xl hover:bg-slate-50 transition-all w-full sm:w-auto"
            >
              Access Platform
            </button>
          </div>

          {/* Role Grid */}
          <div id="roles" className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                role: "organization",
                title: "Organization",
                desc: "Enterprise-grade command center for tenant isolation and member management.",
                icon: "🏢"
              },
              {
                role: "admin",
                title: "Administrator",
                desc: "Strategic operational layer for task delegation and team optimization.",
                icon: "🛡️"
              },
              {
                role: "member",
                title: "Member",
                desc: "Focused workspace for daily execution and feedback communication.",
                icon: "👤"
              }
            ].map((item) => (
              <button
                key={item.role}
                onClick={() => {
                  setRegisterRole(item.role);
                  setShowRegister(true);
                  setShowLogin(false);
                }}
                className="bg-white border border-slate-200 p-8 rounded-[32px] text-left hover:border-indigo-500 hover:shadow-2xl hover:-translate-y-2 transition-all group"
              >
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">{item.icon}</div>
                <h3 className="text-2xl font-black text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-500 text-base leading-relaxed mb-6 font-medium">
                  {item.desc}
                </p>
                <div className="text-indigo-600 font-black text-sm tracking-widest uppercase">Select →</div>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-16 border-t border-slate-200 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center p-1.5">
              <img src="/logo.png" alt="NexusFlow" className="w-full h-full object-contain" />
            </div>
            <span className="font-black text-slate-400 tracking-tighter">NEXUSFLOW © 2026</span>
          </div>
          <div className="flex items-center gap-12 text-sm font-black text-slate-400">
            <a href="#" className="hover:text-indigo-600 transition-colors uppercase tracking-widest">Privacy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors uppercase tracking-widest">Security</a>
            <a href="#" className="hover:text-indigo-600 transition-colors uppercase tracking-widest">Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
