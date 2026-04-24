"use client";

import { useRouter } from "next/navigation";

const roleBadge = {
  organization: { label: "Organization", color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
  admin: { label: "Admin", color: "bg-sky-50 text-sky-600 border-sky-100" },
  member: { label: "Member", color: "bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100" },
};

export default function Sidebar({ user }) {
  const router = useRouter();
  const badge = roleBadge[user.role];

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen fixed left-0 top-0 z-20">
      {/* App Logo & Name */}
      <div className="px-6 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0 bg-slate-50 border border-slate-100 shadow-sm p-1.5">
            <img src="/logo.png" alt="NexusFlow" className="w-full h-full object-contain" />
          </div>
          <span className="text-slate-900 font-bold text-xl tracking-tight">NexusFlow</span>
        </div>

        {/* Account Details - Below Name */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-slate-900 font-bold text-sm truncate">{user.name}</p>
              <div className={`text-[10px] px-2 py-0.5 rounded-full border inline-flex mt-0.5 font-bold uppercase tracking-wider ${badge.color}`}>
                {badge.label}
              </div>
            </div>
          </div>
          <p className="text-slate-500 text-[11px] font-medium truncate">{user.email}</p>
        </div>
      </div>

      {/* Nav items moved to TopBar, so this area is empty or for future use */}
      <div className="flex-1 px-4">
        {/* Placeholder for sidebar-specific content */}
      </div>

      {/* Logout at bottom */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all text-sm font-bold"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Logout Session
        </button>
      </div>
    </aside>
  );
}
