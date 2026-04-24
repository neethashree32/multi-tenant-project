"use client";

import { useState } from "react";
import LoginModal from "./auth/LoginModal";
import RegisterModal from "./auth/RegisterModal";
import ThemeToggle from "./ThemeToggle";

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [registerRole, setRegisterRole] = useState("member");

  const openRegister = (role) => {
    setRegisterRole(role);
    setShowRegister(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030712] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/3 -left-40 w-[400px] h-[400px] bg-cyan-600/15 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 right-1/4 w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #8b5cf6 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-6 md:px-12 py-6 backdrop-blur-md border-b border-white/5 bg-white/5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center bg-gradient-to-br from-violet-500 to-cyan-500 p-0.5">
            <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="NexusFlow Logo" className="w-full h-full object-cover scale-110" />
            </div>
          </div>
          <span className="text-slate-900 dark:text-white font-black text-2xl tracking-tighter">
            Nexus<span className="text-violet-500 text-cyan-400">Flow</span>
          </span>
        </div>
        <div className="flex items-center gap-6">
          <ThemeToggle />
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-400">
            <a href="#features" className="hover:text-violet-500 transition-colors">Features</a>
            <a href="#roles" className="hover:text-violet-500 transition-colors">Roles</a>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowLogin(true)}
              className="px-5 py-2 text-slate-700 dark:text-slate-300 hover:text-violet-500 dark:hover:text-violet-400 transition-all text-sm font-bold"
            >
              Sign In
            </button>
            <button
              onClick={() => openRegister("member")}
              className="btn-primary text-sm px-6 py-2.5"
            >
              Start Flowing
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-24 pb-32">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-5 py-2 text-violet-500 dark:text-violet-400 text-xs font-bold uppercase tracking-widest mb-8 animate-bounce-subtle">
            <span className="w-2 h-2 rounded-full bg-violet-500 animate-ping" />
            Next-Gen Multi-Tenant Infrastructure
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white leading-[1.1] mb-8 tracking-tight">
            Streamline Your Enterprise
            <br />
            With <span className="gradient-text italic">Precision</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg md:text-2xl max-w-3xl mx-auto leading-relaxed mb-12 font-medium">
            The orchestration platform built for scale. Manage tasks, events, and
            team hierarchies across isolated tenant environments with zero friction.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20 w-full">
            <button
              onClick={() => openRegister("organization")}
              className="w-full sm:w-auto px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_50px_rgba(255,255,255,0.1)] flex items-center justify-center gap-3"
            >
              Deploy Your Instance
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </button>
            <button
              onClick={() => setShowLogin(true)}
              className="w-full sm:w-auto px-10 py-4 glass-card font-bold text-lg hover:bg-violet-500/5 transition-all"
            >
              Access Dashboard
            </button>
          </div>

          {/* Role Grid */}
          <div id="roles" className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                role: "organization",
                title: "Organization",
                desc: "High-level administrative control over the entire tenant ecosystem, member lifecycle, and compliance logs.",
                gradient: "from-violet-500 to-indigo-600",
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                )
              },
              {
                role: "admin",
                title: "Administrator",
                desc: "Strategic operational management. Orchestrate tasks, assign resources, and coordinate organizational events.",
                gradient: "from-cyan-500 to-blue-600",
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                )
              },
              {
                role: "member",
                title: "Team Member",
                desc: "Execution-focused interface. Deep dive into assigned workflows, engage with events, and maintain clear communication.",
                gradient: "from-fuchsia-500 to-pink-600",
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                )
              }
            ].map((item) => (
              <button
                key={item.role}
                onClick={() => openRegister(item.role)}
                className="group relative glass-card p-8 text-left hover:-translate-y-2 transition-all duration-500"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">{item.icon}</svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                  {item.desc}
                </p>
                <div className="flex items-center gap-2 font-bold text-sm group-hover:text-violet-500 dark:group-hover:text-cyan-400 transition-colors">
                  Initial Setup
                  <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </div>
              </button>
            ))}
          </div>

          {/* Features Strip */}
          <div id="features" className="mt-32 w-full grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🛡️", label: "Tenant Isolation", desc: "Cryptographic data barriers" },
              { icon: "⚡", label: "JWT Auth", desc: "Stateless security layer" },
              { icon: "💎", label: "RBAC 2.0", desc: "Dynamic permission mapping" },
              { icon: "🕸️", label: "Nexus Core", desc: "Ultra-fast synchronization" },
            ].map((f) => (
              <div
                key={f.label}
                className="glass-card p-6 flex flex-col items-center hover:bg-white/10 transition-colors"
              >
                <div className="text-3xl mb-3 drop-shadow-xl">{f.icon}</div>
                <div className="font-bold text-base mb-1">{f.label}</div>
                <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer Decoration */}
      <div className="py-12 border-t border-white/5 bg-slate-900/50 backdrop-blur-xl relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center p-1">
              <img src="/logo.png" alt="NexusFlow" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-slate-700 dark:text-slate-300">NexusFlow © 2026</span>
          </div>
          <div className="flex items-center gap-8 text-sm font-bold text-slate-500">
            <a href="#" className="hover:text-violet-500 transition-colors">Privacy Infrastructure</a>
            <a href="#" className="hover:text-violet-500 transition-colors">Security Architecture</a>
            <a href="#" className="hover:text-violet-500 transition-colors">Documentation</a>
          </div>
        </div>
      </div>

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
