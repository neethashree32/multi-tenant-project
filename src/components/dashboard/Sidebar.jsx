"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = {
  organization: [
    { href: "/dashboard", label: "Overview", icon: "📊" },
    { href: "/dashboard/tasks", label: "Tasks", icon: "✅" },
    { href: "/dashboard/events", label: "Events", icon: "📅" },
    { href: "/dashboard/members", label: "Members", icon: "👥" },
    { href: "/dashboard/complaints", label: "Complaints", icon: "⚠️" },
  ],
  admin: [
    { href: "/dashboard", label: "Overview", icon: "📊" },
    { href: "/dashboard/tasks", label: "Tasks", icon: "✅" },
    { href: "/dashboard/events", label: "Events", icon: "📅" },
    { href: "/dashboard/members", label: "Members", icon: "👥" },
    { href: "/dashboard/complaints", label: "Complaints", icon: "⚠️" },
  ],
  member: [
    { href: "/dashboard", label: "Overview", icon: "📊" },
    { href: "/dashboard/tasks", label: "My Tasks", icon: "✅" },
    { href: "/dashboard/events", label: "Events", icon: "📅" },
    { href: "/dashboard/complaints", label: "Complaints", icon: "⚠️" },
  ],
};

const roleBadge = {
  organization: { label: "Organization", color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
  admin: { label: "Admin", color: "bg-sky-50 text-sky-600 border-sky-100" },
  member: { label: "Member", color: "bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100" },
};

export default function Sidebar({ role }) {
  const pathname = usePathname();
  const items = navItems[role];
  const badge = roleBadge[role];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0 bg-slate-50 border border-slate-100 shadow-sm p-1.5">
            <img src="/logo.png" alt="NexusFlow Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="text-slate-900 font-bold text-lg leading-tight tracking-tight">NexusFlow</div>
            <div className={`text-[10px] px-2 py-0.5 rounded-full border inline-flex mt-0.5 font-bold uppercase tracking-wider ${badge.color}`}>
              {badge.label}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${isActive ? "active" : ""}`}
            >
              <span className="text-base leading-none">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-slate-100">
        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
          NexusFlow v1.0 • Stable Release
        </div>
      </div>
    </aside>
  );
}
